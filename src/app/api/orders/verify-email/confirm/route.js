import { NextResponse } from 'next/server';
import { exchangeCode } from '../../../../../lib/email-verify.js';

// Step 2: swap the emailed code (plus the token from step 1) for a proof the order endpoint accepts.
export async function POST(request) {
  const secret = process.env.ORDERS_SHEET_SECRET;
  if (!secret) return NextResponse.json({ error: 'Email verification is not configured.' }, { status: 500 });

  const body = await request.json().catch(() => null);
  const proof = exchangeCode(secret, body?.email ?? '', body?.code ?? '', body?.token);
  if (!proof) return NextResponse.json({ error: 'That code is wrong or has expired.' }, { status: 400 });
  return NextResponse.json({ proof });
}
