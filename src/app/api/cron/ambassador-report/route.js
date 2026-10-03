import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import { buildAmbassadorReport } from '../../../../lib/ambassadorReport.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const OCP_EMAIL = 'thrinayaniselvanathan@aiesec.net';
const BCC_EMAIL = 'migara@aiesec.net';

// PostgREST caps each response (1000 rows by default), so page through.
const PAGE_SIZE = 1000;

async function selectAll(supabase, table, columns) {
  const rows = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await supabase
      .from(table)
      .select(columns)
      .order('id')
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw error;
    rows.push(...data);
    if (data.length < PAGE_SIZE) return rows;
  }
}

const SHEET_TIMEOUT_MS = 30_000;

// Overwrites the Ambassadors and Leaderboard tabs via the ambassador sheet's
// Apps Script web app (source: docs/apps-script/ambassador-sheet.gs).
// Returns null on success, or a short error message; never throws.
async function syncSheet(report) {
  const url = process.env.AMBASSADOR_SHEET_SCRIPT_URL;
  const secret = process.env.AMBASSADOR_SHEET_SECRET;
  if (!url || !secret) {
    return 'AMBASSADOR_SHEET_SCRIPT_URL or AMBASSADOR_SHEET_SECRET is not set';
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret,
        ambassadors: report.ambassadorRows,
        leaderboard: report.leaderboardRows,
      }),
      signal: AbortSignal.timeout(SHEET_TIMEOUT_MS),
    });
    if (!response.ok) return `Apps Script responded with HTTP ${response.status}`;

    const body = await response.json().catch(() => null);
    if (body?.ok !== true) return `Apps Script error: ${body?.error ?? 'unexpected response'}`;
    return null;
  } catch (error) {
    return `Could not reach Apps Script: ${error.message}`;
  }
}

// Called nightly by Vercel Cron (see vercel.json), which sends
// `Authorization: Bearer <CRON_SECRET>`.
export async function GET(request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let report;
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const [ambassadors, registrations] = await Promise.all([
      selectAll(
        supabaseAdmin,
        'ambassadors',
        'ambassador_code, full_name, email, whatsapp, current_status, organization, is_aiesecer, aiesec_entity, created_at'
      ),
      selectAll(supabaseAdmin, 'registrations', 'ambassador_code'),
    ]);

    report = buildAmbassadorReport({
      ambassadors,
      referralCodes: registrations.map((r) => r.ambassador_code),
      now: new Date(),
    });
  } catch (error) {
    console.error('Ambassador Report Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }

  if (!report.shouldSend) {
    return NextResponse.json({ message: 'report period ended' });
  }

  // A sheet failure must not stop the email; it's reported in it instead.
  const sheetError = await syncSheet(report);
  if (sheetError) console.error('Ambassador sheet sync error:', sheetError);

  try {
    await transporter.sendMail({
      from: `"LaunchPad System" <${process.env.GMAIL_USER}>`,
      to: OCP_EMAIL,
      bcc: BCC_EMAIL,
      subject: `[Ambassador Report] ${report.reportDate} · ${report.totalAmbassadors} ambassadors · ${report.totalReferrals} referrals`,
      html: getReportHtml(report, { sheetUrl: process.env.AMBASSADOR_SHEET_URL, sheetError }),
    });
  } catch (error) {
    console.error('Ambassador report email error:', error);
    return NextResponse.json({ error: 'Failed to send report email' }, { status: 500 });
  }

  return NextResponse.json({ success: true, sheetSynced: !sheetError });
}

const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// =============================================================================
// EMAIL TEMPLATE: NIGHTLY AMBASSADOR REPORT (styled like the internal admin alert)
// =============================================================================
function getReportHtml(report, { sheetUrl, sheetError }) {
  const stat = (label, value, color) => `
        <td style="padding: 0 8px; text-align: center; width: 33%;">
          <div style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #94a3b8; margin-bottom: 4px;">${label}</div>
          <div style="font-size: 32px; font-weight: 800; color: ${color};">${value}</div>
        </td>`;

  const rows = report.topAmbassadors.length
    ? report.topAmbassadors.map((a, i) => `
          <tr>
            <td style="padding: 8px 10px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 700;">${i + 1}</td>
            <td style="padding: 8px 10px; border-bottom: 1px solid #f1f5f9; color: #b91c1c; font-family: 'Courier New', monospace; font-weight: 700;">${escapeHtml(a.code)}</td>
            <td style="padding: 8px 10px; border-bottom: 1px solid #f1f5f9; color: #1e293b;">${escapeHtml(a.name)}</td>
            <td style="padding: 8px 10px; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-weight: 700; text-align: right;">${a.referrals}</td>
          </tr>`).join('')
    : `<tr><td colspan="4" style="padding: 12px; color: #64748b; text-align: center;">No ambassadors yet.</td></tr>`;

  return `
  <!DOCTYPE html>
  <html>
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px 12px; color: #1e293b;">
    <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 10px; border: 1px solid #e2e8f0; padding: 28px;">

      <div style="margin-bottom: 20px;">
        <span style="background: #fef2f2; color: #b91c1c; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 1px;">Ambassador Report</span>
      </div>

      <h2 style="margin: 0 0 4px 0; font-size: 22px; color: #0f172a;">Nightly Ambassador Summary</h2>
      <p style="margin: 0 0 20px 0; color: #64748b; font-size: 14px;">${escapeHtml(report.reportDate)}</p>
${sheetError ? `
      <div style="background: #fffbeb; border-left: 4px solid #d97706; color: #92400e; padding: 12px 16px; border-radius: 6px; margin: 0 0 20px; font-size: 13px;">
        <strong>Warning:</strong> the Google Sheet could not be updated tonight, so it may be out of date. (${escapeHtml(sheetError)})
      </div>` : ''}

      <!-- Headline totals -->
      <div style="background: #0f172a; color: #ffffff; padding: 20px 16px; border-radius: 8px; margin: 0 0 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            ${stat('Ambassadors', report.totalAmbassadors, '#38bdf8')}
            ${stat('New (24h)', report.newAmbassadors, '#fca5a5')}
            ${stat('Referrals', report.totalReferrals, '#4ade80')}
          </tr>
        </table>
      </div>

      <!-- Top 10 -->
      <h4 style="margin: 0 0 10px 0; font-size: 13px; text-transform: uppercase; color: #475569; letter-spacing: 1px;">Top ${report.topAmbassadors.length || ''} Ambassadors</h4>
      <table style="width: 100%; border-collapse: collapse; background: #f8fafc; border-radius: 6px; border: 1px solid #e2e8f0; font-size: 13px;">
        <thead>
          <tr>
            <th style="padding: 8px 10px; text-align: left; color: #475569; border-bottom: 1px solid #e2e8f0;">#</th>
            <th style="padding: 8px 10px; text-align: left; color: #475569; border-bottom: 1px solid #e2e8f0;">Code</th>
            <th style="padding: 8px 10px; text-align: left; color: #475569; border-bottom: 1px solid #e2e8f0;">Name</th>
            <th style="padding: 8px 10px; text-align: right; color: #475569; border-bottom: 1px solid #e2e8f0;">Referrals</th>
          </tr>
        </thead>
        <tbody>${rows}
        </tbody>
      </table>
${sheetUrl ? `
      <div style="margin-top: 24px; text-align: center;">
        <a href="${escapeHtml(sheetUrl)}" style="display: inline-block; background-color: #b91c1c; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 14px; font-weight: 600;">Open Sheet</a>
        <div style="margin-top: 8px; font-size: 12px; color: #64748b;">Full ambassador list and leaderboard</div>
      </div>` : ''}
    </div>
  </body>
  </html>`;
}
