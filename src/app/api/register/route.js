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

// Replace with your actual email addresses
const DELEGATE_VPS = ['migara@aiesec.net', 'sanisthanimesh@aiesec.net'];
const OC_LEADS = ['thrinayaniselvanathan@aiesec.net'];

export async function POST(request) {
  try {
    const data = await request.json();

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // 1. Insert registration document into Supabase
    const { data: insertedData, error: insertError } = await supabaseAdmin
      .from('registrations')
      .insert([{ current_status: data.currentStatus, data: data }])
      .select('id')
      .single();

    if (insertError) {
      throw insertError;
    }

    // 2. Query Total and Category-Specific Counts in Parallel
    const getCount = async (status) => {
      let query = supabaseAdmin.from('registrations').select('*', { count: 'exact', head: true });
      if (status) query = query.eq('current_status', status);
      const { count } = await query;
      return count || 0;
    };

    const [
      total,
      undergraduate,
      schoolStudent,
      graduate,
      employed,
      seekingOpportunities,
      other,
    ] = await Promise.all([
      getCount(null),
      getCount('Undergraduate'),
      getCount('School Student'),
      getCount('Graduate'),
      getCount('Employed'),
      getCount('Currently Seeking Opportunities'),
      getCount('Other'),
    ]);

    const stats = {
      total,
      undergraduate,
      schoolStudent,
      graduate,
      employed,
      seekingOpportunities,
      other,
    };

    // 3. Send Both Emails Concurrently
    const [emailResult1, emailResult2] = await Promise.allSettled([
      // Email 1: Delegate Confirmation (CC Delegate VPs)
      transporter.sendMail({
        from: `"LaunchPad 4.0" <${process.env.GMAIL_USER}>`,
        to: data.email,
        cc: DELEGATE_VPS,
        bcc: 'migara@aiesec.net',
        subject: 'Registration Received - LaunchPad 4.0 🚀',
        html: getDelegateConfirmationHtml(data),
      }),

      // Email 2: Alert to OCP and Event Manager
      transporter.sendMail({
        from: `"LaunchPad System" <${process.env.GMAIL_USER}>`,
        to: OC_LEADS,
        bcc: 'migara@aiesec.net',
        subject: `[New Reg] ${data.firstName} ${data.lastName} (${data.currentStatus})`,
        html: getAdminAlertHtml(data, stats),
      }),
    ]);

    if (emailResult1.status === 'rejected') {
      console.error('Nodemailer Error 1:', emailResult1.reason);
    }
    if (emailResult2.status === 'rejected') {
      console.error('Nodemailer Error 2:', emailResult2.reason);
    }

    return NextResponse.json({ success: true, id: insertedData.id });
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// =========================================================================
// EMAIL TEMPLATE 1: DELEGATE CONFIRMATION (WITH DRIVE IMAGE)
// =========================================================================
function getDelegateConfirmationHtml(data) {
  const dynamicRows = [];

  if (data.currentStatus === 'Undergraduate') {
    if (data.university) dynamicRows.push({ label: 'University', value: data.university });
    if (data.academicYear) dynamicRows.push({ label: 'Academic Year', value: `${data.academicYear} Year` });
  } else if (data.currentStatus === 'School Student') {
    if (data.school) dynamicRows.push({ label: 'School / Institution', value: data.school });
    if (data.planningToPursue) dynamicRows.push({ label: 'Pursuing Next', value: data.planningToPursue });
  } else if (data.currentStatus === 'Graduate') {
    if (data.university) dynamicRows.push({ label: 'Graduated From', value: data.university });
    if (data.gradYear) dynamicRows.push({ label: 'Graduation Year', value: data.gradYear });
  } else if (data.currentStatus === 'Employed') {
    if (data.jobRole) dynamicRows.push({ label: 'Job Role', value: data.jobRole });
    if (data.industry) dynamicRows.push({ label: 'Industry', value: data.industry });
    if (data.experienceYears) dynamicRows.push({ label: 'Experience', value: data.experienceYears });
  }

  const dynamicTableRows = dynamicRows
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600; width: 40%; font-size: 13px;">${item.label}</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; color: #1e293b; font-size: 13px;">${item.value}</td>
      </tr>`
    )
    .join('');

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f6; margin: 0; padding: 24px 12px; color: #1e293b;">
    <div style="max-width: 580px; background: #ffffff; margin: 0 auto; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
      <div style="background-color: #8b151b; line-height: 0; text-align: center;">
        <img 
          src="https://lh3.googleusercontent.com/d/1x8NoGF8J1JYMPYnBUkcsYoqZK4C4ao2j" 
          alt="LaunchPad 4.0 - Registration Received" 
          style="width: 100%; max-width: 580px; height: auto; display: block; margin: 0 auto;"
        />
      </div>

      <div style="padding: 32px 28px;">
        <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 700; color: #8b151b;">Hello ${data.firstName},</h2>
        <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #475569;">
          Thank you for registering for <strong>LaunchPad 4.0</strong>! We have received your details. Please review your submission below:
        </p>

        <div style="background-color: #fdf2f2; border-left: 4px solid #8b151b; padding: 14px 18px; border-radius: 6px; margin-bottom: 24px;">
          <div style="font-size: 13px; font-weight: 700; color: #8b151b; text-transform: uppercase; margin-bottom: 4px;">Event Details</div>
          <div style="font-size: 13px; color: #334155; line-height: 1.5;">
            <strong>Date:</strong> 31st of October<br>
            <strong>Time:</strong> 8:30 AM Onwards<br>
            <strong>Venue:</strong> University of Sri Jayewardenepura
          </div>
        </div>

        <h3 style="margin: 0 0 10px 0; font-size: 14px; font-weight: 700; color: #1e293b; text-transform: uppercase;">Submitted Details</h3>
        <table style="width: 100%; border-collapse: collapse; background: #fafafa; border-radius: 8px; border: 1px solid #edf2f7; margin-bottom: 24px;">
          <tbody>
            <tr><td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600; width: 40%; font-size: 13px;">Full Name</td><td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; font-size: 13px;">${data.firstName} ${data.lastName}</td></tr>
            <tr><td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600; font-size: 13px;">Email Address</td><td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; font-size: 13px;">${data.email}</td></tr>
            <tr><td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600; font-size: 13px;">WhatsApp Number</td><td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; font-size: 13px;">${data.whatsapp}</td></tr>
            <tr><td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600; font-size: 13px;">Current Status</td><td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; font-size: 13px;">${data.currentStatus}</td></tr>
            ${dynamicTableRows}
            <tr><td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600; font-size: 13px;">Preferred Sector</td><td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; font-size: 13px;">${data.preferredCareerSector || 'Not specified'}</td></tr>
            <tr><td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600; font-size: 13px;">Opportunities Interested In</td><td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; font-size: 13px;">${data.opportunityType || 'Not specified'}</td></tr>
            <tr><td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600; font-size: 13px;">AIESEC Member</td><td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; font-size: 13px;">${data.isAiesecer}</td></tr>
            <tr><td style="padding: 10px 14px; color: #64748b; font-weight: 600; font-size: 13px;">Ambassador Code</td><td style="padding: 10px 14px; font-size: 13px;">${data.ambassadorCode || 'None'}</td></tr>
          </tbody>
        </table>

        <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; text-align: center;">
          <p style="margin: 0; font-size: 12px; font-weight: 600; color: #8b151b;">Organizing Committee | LaunchPad 4.0</p>
          <p style="margin: 4px 0 0 0; font-size: 11px; color: #94a3b8;">AIESEC in Sri Jayewardenepura</p>
        </div>
      </div>
    </div>
  </body>
  </html>`;
}

// =========================================================================
// EMAIL TEMPLATE 2: OCP & EVENT MANAGER ALERT (WITH CATEGORY STATS)
// =========================================================================
function getAdminAlertHtml(data, stats) {
  return `
  <!DOCTYPE html>
  <html>
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px 12px; color: #1e293b;">
    <div style="max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 10px; border: 1px solid #e2e8f0; padding: 28px;">
      <span style="background: #dcfce7; color: #166534; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase;">New Registration</span>
      <h2 style="margin: 16px 0 6px 0; font-size: 22px; color: #0f172a;">${data.firstName} ${data.lastName}</h2>
      <p style="margin: 0 0 20px 0; color: #64748b; font-size: 14px;">Registered Category: <strong>${data.currentStatus}</strong></p>

      <div style="background: #0f172a; color: #ffffff; padding: 20px 24px; border-radius: 8px; margin: 20px 0; text-align: center;">
        <div style="font-size: 12px; letter-spacing: 1px; text-transform: uppercase; color: #94a3b8;">Total Registrations to Date</div>
        <div style="font-size: 36px; font-weight: 800; color: #38bdf8; margin-top: 4px;">${stats.total}</div>
      </div>

      <h4 style="margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; color: #475569;">Registrations by Category</h4>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 28px; font-size: 13px; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden;">
        <thead style="background: #f8fafc;">
          <tr>
            <th style="text-align: left; padding: 10px 14px; color: #475569; font-weight: 600; border-bottom: 1px solid #e2e8f0;">Category</th>
            <th style="text-align: right; padding: 10px 14px; color: #475569; font-weight: 600; border-bottom: 1px solid #e2e8f0;">Count</th>
          </tr>
        </thead>
        <tbody>
          <tr><td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9;">Undergraduates</td><td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; text-align: right;"><strong>${stats.undergraduate}</strong></td></tr>
          <tr><td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9;">School Students</td><td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; text-align: right;"><strong>${stats.schoolStudent}</strong></td></tr>
          <tr><td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9;">Recent Graduates</td><td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; text-align: right;"><strong>${stats.graduate}</strong></td></tr>
          <tr><td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9;">Currently Employed</td><td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; text-align: right;"><strong>${stats.employed}</strong></td></tr>
          <tr><td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9;">Seeking Opportunities</td><td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; text-align: right;"><strong>${stats.seekingOpportunities}</strong></td></tr>
          <tr><td style="padding: 10px 14px;">Other</td><td style="padding: 10px 14px; text-align: right;"><strong>${stats.other}</strong></td></tr>
        </tbody>
      </table>

      <h4 style="margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; color: #475569;">Delegate Quick Details</h4>
      <div style="background: #f8fafc; border-radius: 6px; padding: 16px; font-size: 13px; line-height: 1.8; border: 1px solid #e2e8f0;">
        <strong>Email:</strong> ${data.email}<br>
        <strong>Phone:</strong> ${data.whatsapp}<br>
        <strong>Ambassador Code:</strong> ${data.ambassadorCode || 'None'}<br>
        <strong>AIESECer:</strong> ${data.isAiesecer}<br>
        <strong>Preferred Sector:</strong> ${data.preferredCareerSector || 'N/A'}<br>
        <strong>Interested In:</strong> ${data.opportunityType || 'N/A'}
      </div>
    </div>
  </body>
  </html>`;
}
