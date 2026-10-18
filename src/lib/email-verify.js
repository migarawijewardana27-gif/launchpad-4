import { createHmac, randomInt, timingSafeEqual } from 'node:crypto';
import { escapeHtml } from './orders.js';

export const CODE_TTL_MS = 10 * 60 * 1000;
export const PROOF_TTL_MS = 60 * 60 * 1000;

// Stateless email verification: the server never stores codes. A signed token binds
// (email, code, expiry); a correct code is exchanged for a signed proof that the
// order endpoint checks. Signed with ORDERS_SHEET_SECRET.
const sign = (secret, parts) => createHmac('sha256', secret).update(parts.join('|')).digest('hex');

const safeEqual = (a, b) => {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
};

const norm = (email) => String(email).trim().toLowerCase();

export const newCode = () => String(randomInt(0, 1_000_000)).padStart(6, '0');

export function issueCodeToken(secret, email, code, now = Date.now()) {
  const exp = now + CODE_TTL_MS;
  return `${exp}.${sign(secret, ['code', norm(email), code, exp])}`;
}

// Returns a proof string when the code matches, otherwise null.
export function exchangeCode(secret, email, code, token, now = Date.now()) {
  const [exp, mac] = String(token ?? '').split('.');
  if (!exp || !mac || Number(exp) < now) return null;
  if (!safeEqual(mac, sign(secret, ['code', norm(email), String(code).trim(), exp]))) return null;
  const proofExp = now + PROOF_TTL_MS;
  return `${proofExp}.${sign(secret, ['verified', norm(email), proofExp])}`;
}

export function checkProof(secret, email, proof, now = Date.now()) {
  const [exp, mac] = String(proof ?? '').split('.');
  if (!exp || !mac || Number(exp) < now) return false;
  return safeEqual(mac, sign(secret, ['verified', norm(email), exp]));
}

export const codeEmail = (code) => ({
  subject: `${code} is your LaunchPad 4.0 verification code`,
  html: `<div style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;text-align:center;color:#1e293b;">
    <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#8b151b;">LaunchPad 4.0</div>
    <h2 style="margin:8px 0 16px;">Verify your email</h2>
    <p style="margin:0 0 16px;">Enter this code at checkout to confirm your email address:</p>
    <div style="font-size:34px;font-weight:700;letter-spacing:8px;color:#8b151b;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;">${escapeHtml(code)}</div>
    <p style="margin:16px 0 0;color:#64748b;font-size:13px;">It expires in 10 minutes. If you didn't request it, ignore this email.</p>
  </div>`,
});
