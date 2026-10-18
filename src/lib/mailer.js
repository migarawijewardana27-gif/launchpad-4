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

// True when the mail server definitively refused the recipient (bad mailbox/domain),
// as opposed to our own failures (auth, network, quota).
export function isRecipientRejected(error) {
  if (error?.rejected?.length) return true;
  const code = error?.responseCode;
  return code >= 550 && code <= 554 && error?.command === 'RCPT TO';
}

export async function sendOrderEmailChecked(to, message) {
  const info = await sendOrderEmail(to, message);
  if (info?.rejected?.length) {
    const error = new Error(`Recipient rejected: ${info.rejected.join(', ')}`);
    error.rejected = info.rejected;
    throw error;
  }
  return info;
}
