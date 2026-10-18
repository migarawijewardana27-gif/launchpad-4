import nodemailer from 'nodemailer';

const BCC_EMAIL = 'migara@aiesec.net';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export function sendOrderEmail(to, { subject, html }) {
  return transporter.sendMail({
    from: `"LaunchPad 4.0" <${process.env.GMAIL_USER}>`,
    to,
    bcc: BCC_EMAIL,
    subject,
    html,
  });
}
