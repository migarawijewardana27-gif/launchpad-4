import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const DELEGATE_VPS = ['migara@aiesec.net', 'sanisthanimesh@aiesec.net'];
const OCP_EMAIL = 'thrinayaniselvanathan@aiesec.net';

export async function POST(request) {
  try {
    const data = await request.json();

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // 1. Generate unique ambassador code (e.g. LPA001, LPA002, ...)
    const { count, error: countError } = await supabaseAdmin
      .from('ambassadors')
      .select('*', { count: 'exact', head: true });

    if (countError) throw countError;

    const nextNumber = (count || 0) + 1;
    const ambassadorCode = `LPA${String(nextNumber).padStart(3, '0')}`;

    // 2. Insert into Supabase
    const { data: inserted, error: insertError } = await supabaseAdmin
      .from('ambassadors')
      .insert([{
        ambassador_code: ambassadorCode,
        full_name: data.fullName,
        email: data.email,
        whatsapp: data.whatsapp,
        current_status: data.currentStatus,
        organization: data.organization,
        is_aiesecer: data.isAiesecer,
        aiesec_entity: data.isAiesecer === 'Yes'
          ? (data.aiesecEntity === 'Other' ? data.otherEntity : data.aiesecEntity)
          : null,
      }])
      .select('id')
      .single();

    if (insertError) throw insertError;

    // 3. Send emails concurrently
    const [ambassadorEmail, adminEmail] = await Promise.allSettled([
      // Email to ambassador (CC Delegate VPs, BCC OCP)
      transporter.sendMail({
        from: `"LaunchPad 4.0" <${process.env.GMAIL_USER}>`,
        to: data.email,
        cc: DELEGATE_VPS,
        bcc: OCP_EMAIL,
        subject: `Welcome, ${data.fullName}! Your Ambassador Code is ${ambassadorCode} 🚀`,
        html: getAmbassadorConfirmationHtml(data, ambassadorCode),
      }),

      // Internal alert to OCP + Delegate VPs
      transporter.sendMail({
        from: `"LaunchPad System" <${process.env.GMAIL_USER}>`,
        to: [OCP_EMAIL, ...DELEGATE_VPS],
        subject: `[New Ambassador] ${data.fullName} — ${ambassadorCode}`,
        html: getAdminAlertHtml(data, ambassadorCode, count + 1),
      }),
    ]);

    if (ambassadorEmail.status === 'rejected') {
      console.error('Ambassador email error:', ambassadorEmail.reason);
    }
    if (adminEmail.status === 'rejected') {
      console.error('Admin alert email error:', adminEmail.reason);
    }

    return NextResponse.json({ success: true, ambassadorCode });
  } catch (error) {
    console.error('Ambassador Registration Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// =============================================================================
// EMAIL TEMPLATE 1: AMBASSADOR CONFIRMATION
// =============================================================================
function getAmbassadorConfirmationHtml(data, ambassadorCode) {
  const entityLine = data.isAiesecer === 'Yes'
    ? `<tr>
        <td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600; width: 42%; font-size: 13px;">AIESEC Entity</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; color: #1e293b; font-size: 13px;">${data.aiesecEntity === 'Other' ? data.otherEntity : data.aiesecEntity}</td>
       </tr>`
    : '';

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Ambassador Confirmation</title></head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f6; margin: 0; padding: 24px 12px; color: #1e293b;">
    <div style="max-width: 600px; background: #ffffff; margin: 0 auto; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">

      <!-- HEADER BANNER (deep crimson) -->
      <div style="background: linear-gradient(135deg, #6b0000 0%, #b91c1c 50%, #991b1b 100%); padding: 40px 32px; text-align: center; position: relative;">
        <div style="font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0.6); margin-bottom: 8px;">AIESEC in Sri Jayewardenepura</div>
        <div style="font-size: 32px; font-weight: 900; color: #ffffff; letter-spacing: 2px; font-family: Georgia, serif; margin-bottom: 4px;">LaunchPad 4.0</div>
        <div style="font-size: 13px; color: rgba(255,255,255,0.75); letter-spacing: 1px;">AMBASSADOR PROGRAM</div>

        <!-- Code Badge -->
        <div style="margin-top: 24px; display: inline-block;">
          <div style="background: rgba(255,255,255,0.1); border: 2px solid rgba(255,255,255,0.3); border-radius: 12px; padding: 16px 32px; display: inline-block;">
            <div style="font-size: 11px; color: rgba(255,255,255,0.6); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px;">Your Unique Code</div>
            <div style="font-size: 36px; font-weight: 900; color: #fca5a5; letter-spacing: 4px; font-family: 'Courier New', monospace;">${ambassadorCode}</div>
          </div>
        </div>
      </div>

      <!-- BODY -->
      <div style="padding: 36px 32px;">
        <h2 style="margin: 0 0 8px 0; font-size: 22px; font-weight: 700; color: #0f172a;">Welcome, ${data.fullName}! 🎉</h2>
        <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.7; color: #475569;">
          You are now an official <strong style="color: #b91c1c;">LaunchPad 4.0 Ambassador</strong>. 
          Share your unique code <strong style="color: #b91c1c; font-family: 'Courier New', monospace;">${ambassadorCode}</strong> with your network — every delegate who registers using your code counts towards your ranking!
        </p>

        <!-- What's Next -->
        <div style="background: #fdf2f2; border-left: 4px solid #b91c1c; padding: 20px 24px; border-radius: 8px; margin-bottom: 28px;">
          <div style="font-size: 12px; font-weight: 700; color: #b91c1c; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">What to do next</div>
          <div style="font-size: 14px; color: #334155; line-height: 2;">
            <span style="color: #b91c1c; font-weight: 700;">Step 1 —</span> Save this email — your code is <strong>${ambassadorCode}</strong><br>
            <span style="color: #b91c1c; font-weight: 700;">Step 2 —</span> Share your code across your university, school, and social networks<br>
            <span style="color: #b91c1c; font-weight: 700;">Step 3 —</span> Ask delegates to enter <strong>${ambassadorCode}</strong> in the Ambassador Code field when they register<br>
            <span style="color: #b91c1c; font-weight: 700;">Step 4 —</span> Track your position on the leaderboard — top ambassadors win exclusive rewards
          </div>
        </div>

        <!-- Perks Highlight -->
        <h3 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 700; color: #1e293b; text-transform: uppercase; letter-spacing: 1px;">Your Ambassador Benefits</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 28px;">
          <tr>
            <td style="padding: 10px 0; vertical-align: top; width: 32px;"><span style="background: #fef2f2; color: #b91c1c; padding: 4px 8px; border-radius: 6px; font-size: 16px;">📄</span></td>
            <td style="padding: 10px 0 10px 12px; border-bottom: 1px solid #f1f5f9;"><strong style="font-size: 13px; color: #0f172a;">Priority CV Screening</strong><br><span style="font-size: 12px; color: #64748b;">Get your resume in front of our corporate partners first.</span></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; vertical-align: top; width: 32px;"><span style="background: #fef2f2; color: #b91c1c; padding: 4px 8px; border-radius: 6px; font-size: 16px;">🤝</span></td>
            <td style="padding: 10px 0 10px 12px; border-bottom: 1px solid #f1f5f9;"><strong style="font-size: 13px; color: #0f172a;">High-Level Networking</strong><br><span style="font-size: 12px; color: #64748b;">Premium access to industry experts and corporate leaders.</span></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; vertical-align: top; width: 32px;"><span style="background: #fef2f2; color: #b91c1c; padding: 4px 8px; border-radius: 6px; font-size: 16px;">🏷️</span></td>
            <td style="padding: 10px 0 10px 12px; border-bottom: 1px solid #f1f5f9;"><strong style="font-size: 13px; color: #0f172a;">Official Ambassador Tag</strong><br><span style="font-size: 12px; color: #64748b;">Stand out on event day with your exclusive ambassador status.</span></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; vertical-align: top; width: 32px;"><span style="background: #fef2f2; color: #b91c1c; padding: 4px 8px; border-radius: 6px; font-size: 16px;">🏆</span></td>
            <td style="padding: 10px 0 10px 12px;"><strong style="font-size: 13px; color: #0f172a;">Performance Rewards</strong><br><span style="font-size: 12px; color: #64748b;">Exclusive prizes and public recognition for top performers.</span></td>
          </tr>
        </table>

        <!-- Submitted Details -->
        <h3 style="margin: 0 0 10px 0; font-size: 14px; font-weight: 700; color: #1e293b; text-transform: uppercase; letter-spacing: 1px;">Your Submitted Details</h3>
        <table style="width: 100%; border-collapse: collapse; background: #fafafa; border-radius: 8px; border: 1px solid #edf2f7; margin-bottom: 28px; font-size: 13px;">
          <tbody>
            <tr>
              <td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600; width: 42%;">Full Name</td>
              <td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; color: #1e293b;">${data.fullName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600;">WhatsApp</td>
              <td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; color: #1e293b;">+94${data.whatsapp}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600;">Current Status</td>
              <td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; color: #1e293b;">${data.currentStatus}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600;">Organization</td>
              <td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; color: #1e293b;">${data.organization}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600;">AIESECer</td>
              <td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; color: #1e293b;">${data.isAiesecer}</td>
            </tr>
            ${entityLine}
            <tr>
              <td style="padding: 10px 14px; color: #64748b; font-weight: 600;">Ambassador Code</td>
              <td style="padding: 10px 14px; color: #b91c1c; font-weight: 700; font-family: 'Courier New', monospace; font-size: 15px;">${ambassadorCode}</td>
            </tr>
          </tbody>
        </table>

        <!-- Footer -->
        <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center;">
          <p style="margin: 0 0 4px; font-size: 13px; font-weight: 700; color: #b91c1c;">LaunchPad 4.0 Organizing Committee</p>
          <p style="margin: 0; font-size: 12px; color: #94a3b8;">AIESEC in Sri Jayewardenepura · launchpad.aiesecusj.com</p>
        </div>
      </div>
    </div>
  </body>
  </html>`;
}

// =============================================================================
// EMAIL TEMPLATE 2: INTERNAL ADMIN ALERT
// =============================================================================
function getAdminAlertHtml(data, ambassadorCode, totalCount) {
  return `
  <!DOCTYPE html>
  <html>
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px 12px; color: #1e293b;">
    <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 10px; border: 1px solid #e2e8f0; padding: 28px;">
      
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
        <span style="background: #fef2f2; color: #b91c1c; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 1px;">New Ambassador</span>
      </div>

      <h2 style="margin: 0 0 4px 0; font-size: 22px; color: #0f172a;">${data.fullName}</h2>
      <p style="margin: 0 0 20px 0; color: #64748b; font-size: 14px;">${data.currentStatus} · ${data.organization}</p>

      <!-- Code + Count Banner -->
      <div style="background: #0f172a; color: #ffffff; padding: 20px 24px; border-radius: 8px; margin: 0 0 24px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #94a3b8; margin-bottom: 4px;">Assigned Code</div>
          <div style="font-size: 28px; font-weight: 900; color: #fca5a5; font-family: 'Courier New', monospace; letter-spacing: 4px;">${ambassadorCode}</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #94a3b8; margin-bottom: 4px;">Total Ambassadors</div>
          <div style="font-size: 36px; font-weight: 800; color: #38bdf8;">${totalCount}</div>
        </div>
      </div>

      <!-- Quick Details -->
      <h4 style="margin: 0 0 10px 0; font-size: 13px; text-transform: uppercase; color: #475569; letter-spacing: 1px;">Details</h4>
      <div style="background: #f8fafc; border-radius: 6px; padding: 16px; font-size: 13px; line-height: 2; border: 1px solid #e2e8f0;">
        <strong>WhatsApp:</strong> +94${data.whatsapp}<br>
        <strong>AIESECer:</strong> ${data.isAiesecer}${data.isAiesecer === 'Yes' ? ` (${data.aiesecEntity === 'Other' ? data.otherEntity : data.aiesecEntity})` : ''}<br>
        <strong>Ambassador Code:</strong> <span style="color: #b91c1c; font-family: 'Courier New', monospace; font-weight: 700;">${ambassadorCode}</span>
      </div>
    </div>
  </body>
  </html>`;
}
