import { resolveMx, resolve4, resolve6 } from 'node:dns/promises';

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const COMMON_TYPOS = {
  'gmial.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gmail.con': 'gmail.com',
  'gnail.com': 'gmail.com',
  'hotmial.com': 'hotmail.com',
  'hotmail.con': 'hotmail.com',
  'yaho.com': 'yahoo.com',
  'yahoo.con': 'yahoo.com',
  'outlok.com': 'outlook.com',
  'outlook.con': 'outlook.com',
};

const hasRecords = async (fn, domain) => {
  try {
    const r = await fn(domain);
    return r.length > 0;
  } catch (error) {
    // Only "no such domain / no records" is a definite no; other failures are treated as unknown.
    if (error.code === 'ENOTFOUND' || error.code === 'ENODATA') return false;
    throw error;
  }
};

// Checks that the address is well-formed and its domain can actually receive mail
// (MX record, or A/AAAA fallback per RFC 5321). Returns an error message or null.
// DNS outages fail open so a resolver hiccup never blocks a real order.
export async function checkEmail(email) {
  if (!EMAIL_RE.test(email)) return 'Please enter a valid email address.';
  const domain = email.split('@')[1].toLowerCase();

  const suggestion = COMMON_TYPOS[domain];
  if (suggestion) return `Did you mean ${email.split('@')[0]}@${suggestion}?`;

  try {
    const ok =
      (await hasRecords(resolveMx, domain)) ||
      (await hasRecords(resolve4, domain).catch(() => false)) ||
      (await hasRecords(resolve6, domain).catch(() => false));
    return ok ? null : `We couldn't find a mail server for "${domain}". Please check your email address.`;
  } catch {
    return null;
  }
}
