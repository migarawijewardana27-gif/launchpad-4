import { NextResponse } from 'next/server';
import { checkEmail } from '../../../../lib/email-check.js';
import { codeEmail, issueCodeToken, newCode } from '../../../../lib/email-verify.js';
import { sendOrderEmailChecked, isRecipientRejected } from '../../../../lib/mailer.js';

// Step 1: email a 6-digit code to the address the buyer typed.
export async function POST(request) {
  const secret = process.env.ORDERS_SHEET_SECRET;
  if (!secret) return NextResponse.json({ error: 'Email verification is not configured.' }, { status: 500 });

  const body = await request.json().catch(() => null);
  const email = String(body?.email ?? '').trim();

  const problem = await checkEmail(email);
  if (problem) return NextResponse.json({ error: problem }, { status: 400 });

  const code = newCode();
  try {
    await sendOrderEmailChecked(email, codeEmail(code));
  } catch (error) {
    if (isRecipientRejected(error)) {
      return NextResponse.json({ error: "Couldn't send an email. Please re-enter your email address." }, { status: 400 });
    }
    console.error('Verification email failed:', error);
    return NextResponse.json({ error: "Couldn't send the verification email. Please try again." }, { status: 500 });
  }
  return NextResponse.json({ token: issueCodeToken(secret, email, code) });
}
