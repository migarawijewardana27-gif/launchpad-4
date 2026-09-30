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
const CC_EMAILS = [
  'thrinayaniselvanathan@aiesec.net',
  'devmigalagedara@aiesec.net',
  'jayashnir@aiesec.net',
  'vihangiranaweera@aiesec.net',
  'pumuthunimaya@aiesec.net',
  'sidanganainimankada@aiesec.net',
  'sahanyaherath@aiesec.net'
];
const OCP_EMAIL = 'thrinayaniselvanathan@aiesec.net';
const BCC_EMAIL = 'migara@aiesec.net';

export async function POST(request) {
  try {
    const data = await request.json();

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const isT = (condition) => condition ? 'T' : 'F';
    const hasArrayItem = (arr, item) => Array.isArray(arr) && arr.includes(item);

    const flatData = {
      first_name: data.firstName || '',
      last_name: data.lastName || '',
      email: data.email || '',
      whatsapp: data.whatsapp || '',
      ambassador_code: data.ambassadorCode || '',
      is_aiesecer: data.isAiesecer === 'Yes' ? 'T' : 'F',
      current_status: data.currentStatus || '',

      university: data.university || '',
      academic_year: data.academicYear || '',
      school: data.school || '',
      planning_to_pursue: data.planningToPursue || '',
      grad_year: data.gradYear || '',
      currently_looking: data.currentlyLooking === 'Yes' ? 'T' : (data.currentlyLooking === 'No' ? 'F' : ''),
      job_role: data.jobRole || '',
      industry: data.industry || '',
      experience_years: data.experienceYears || '',
      highest_education: data.highestEducation || '',
      opportunity_looking_for: data.opportunityLookingFor || '',
      preferred_career_area: data.preferredCareerArea || '',

      bs_marketing: isT(hasArrayItem(data.businessSector, 'Marketing')),
      bs_hr: isT(hasArrayItem(data.businessSector, 'Human Resources')),
      bs_business_admin: isT(hasArrayItem(data.businessSector, 'Business Admin')),
      bs_finance: isT(hasArrayItem(data.businessSector, 'Finance')),
      bs_business_dev: isT(hasArrayItem(data.businessSector, 'Business Dev')),

      it_software_dev: isT(hasArrayItem(data.itSector, 'Software Dev')),
      it_data_science: isT(hasArrayItem(data.itSector, 'Data Science')),
      it_cybersecurity: isT(hasArrayItem(data.itSector, 'Cybersecurity')),
      it_ui_ux: isT(hasArrayItem(data.itSector, 'UI/UX')),

      gl_career_guidance: isT(hasArrayItem(data.gainingFromLaunchPad, 'Career Guidance')),
      gl_industry_insights: isT(hasArrayItem(data.gainingFromLaunchPad, 'Industry Insights')),
      gl_internships: isT(hasArrayItem(data.gainingFromLaunchPad, 'Internships')),
      gl_networking: isT(hasArrayItem(data.gainingFromLaunchPad, 'Networking')),
      gl_mentorship: isT(hasArrayItem(data.gainingFromLaunchPad, 'Mentorship')),
      gl_cv_dev: isT(hasArrayItem(data.gainingFromLaunchPad, 'CV Dev')),
      gl_interview_prep: isT(hasArrayItem(data.gainingFromLaunchPad, 'Interview Prep')),

      opp_local: isT(hasArrayItem(data.opportunityType, 'Local')),
      opp_international: isT(hasArrayItem(data.opportunityType, 'International')),

      partner_info: data.partnerInfo || '',
      availability: data.availability || '',
      cv_consideration: data.cvConsideration === 'Yes' ? 'T' : (data.cvConsideration === 'No' ? 'F' : ''),
      cv_url: data.cvUrl || ''
    };

    // 1. Insert registration document into Supabase
    const { data: insertedData, error: insertError } = await supabaseAdmin
      .from('registrations')
      .insert([flatData])
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

    // 3. Send Emails and Webhook Concurrently
    const [emailResult1, emailResult2, webhookResult] = await Promise.allSettled([
      // Email 1: Delegate Confirmation (CC Delegate VPs)
      transporter.sendMail({
        from: `"LaunchPad 4.0" <${process.env.GMAIL_USER}>`,
        to: data.email,
        cc: CC_EMAILS,
        bcc: BCC_EMAIL,
        subject: 'Registration Received - LaunchPad 4.0',
        html: getDelegateConfirmationHtml(data),
      }),

      // Email 2: Alert to OCP and Event Manager
      transporter.sendMail({
        from: `"LaunchPad System" <${process.env.GMAIL_USER}>`,
        to: OCP_EMAIL,
        bcc: BCC_EMAIL,
        subject: `[New Reg] ${data.firstName} ${data.lastName} (${data.currentStatus})`,
        html: getAdminAlertHtml(data, stats),
      }),
      
      // Webhook 3: Google Apps Script Sheet Integration
      process.env.GOOGLE_SCRIPT_URL ? fetch(process.env.GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(flatData)
      }) : Promise.resolve('No webhook URL')
    ]);

    if (emailResult1.status === 'rejected') {
      console.error('Nodemailer Error 1:', emailResult1.reason);
    }
    if (emailResult2.status === 'rejected') {
      console.error('Nodemailer Error 2:', emailResult2.reason);
    }
    if (webhookResult.status === 'rejected') {
      console.error('Webhook Error:', webhookResult.reason);
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
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f6; margin: 0; padding: 24px 12px; color: #1e293b;">
    <div style="max-width: 580px; background: #ffffff; margin: 0 auto; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
      <div style="background-color: #8b151b; line-height: 0; text-align: center;">
        <img 
          src="https://lh3.googleusercontent.com/d/1CJpoIIhuWK6NlxLU-BamlTRImDyTwrFQ" 
          alt="LaunchPad 4.0 - Registration Received" 
          style="width: 100%; max-width: 580px; height: auto; display: block; margin: 0 auto;"
        />
      </div>

      <div style="padding: 32px 28px;">
        <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 700; color: #8b151b;">Hello ${data.firstName},</h2>
        <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #475569;">
          We are thrilled to welcome you to <strong>LaunchPad 4.0</strong>! Thank you for taking the time to register. Your application has been successfully received, and we are excited to have you join us for an inspiring experience.
        </p>
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
