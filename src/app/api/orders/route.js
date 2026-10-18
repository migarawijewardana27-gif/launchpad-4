import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { randomBytes, randomUUID } from 'node:crypto';
import { parseItems, itemsSummary, receivedEmail, MAX_RECEIPT_BYTES, RECEIPT_TYPES } from '../../../lib/orders.js';
import { sendOrderEmail } from '../../../lib/mailer.js';
import { checkProof } from '../../../lib/email-verify.js';
import { checkEmail, EMAIL_RE } from '../../../lib/email-check.js';

const BUCKET = 'receipts';
const SHEET_TIMEOUT_MS = 15_000;

// Appends the order to the Orders sheet via Apps Script
// (source: docs/apps-script/orders-sheet.gs). Returns an error message or null.
async function syncSheet(order, receiptUrl) {
  const url = process.env.ORDERS_SCRIPT_URL;
  const secret = process.env.ORDERS_SHEET_SECRET;
  if (!url || !secret) return 'ORDERS_SCRIPT_URL or ORDERS_SHEET_SECRET is not set';
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret,
        order: {
          orderCode: order.order_code,
          createdAt: order.created_at,
          fullName: order.full_name,
          email: order.email,
          phone: order.phone,
          items: itemsSummary(order.items),
          lines: order.items.map((i) => ({
            item: i.name,
            size: i.size,
            quantity: i.quantity,
            amount: i.unitPrice * i.quantity,
          })),
          total: order.total,
          receiptUrl,
        },
      }),
      signal: AbortSignal.timeout(SHEET_TIMEOUT_MS),
    });
    const body = await response.json().catch(() => null);
    if (!response.ok || body?.ok !== true) return `Apps Script error: ${body?.error ?? response.status}`;
    return null;
  } catch (error) {
    return `Could not reach Apps Script: ${error.message}`;
  }
}

export async function POST(request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  let form;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const fullName = String(form.get('fullName') ?? '').trim();
  const email = String(form.get('email') ?? '').trim();
  const phone = String(form.get('phone') ?? '').trim();
  const receipt = form.get('receipt');

  if (!fullName || !phone || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please fill in your name, a valid email and phone number.' }, { status: 400 });
  }

  const emailProblem = await checkEmail(email);
  if (emailProblem) {
    return NextResponse.json({ error: emailProblem }, { status: 400 });
  }
  if (!checkProof(process.env.ORDERS_SHEET_SECRET ?? '', email, form.get('emailProof'))) {
    return NextResponse.json({ error: 'Please verify your email address first.' }, { status: 400 });
  }

  let parsed;
  try {
    parsed = parseItems(form.get('items'));
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (!receipt || typeof receipt === 'string' || !RECEIPT_TYPES[receipt.type]) {
    return NextResponse.json({ error: 'Please upload your receipt as an image or PDF.' }, { status: 400 });
  }
  if (receipt.size > MAX_RECEIPT_BYTES) {
    return NextResponse.json({ error: 'Receipt is too large (max 4 MB).' }, { status: 400 });
  }

  try {
    const receiptPath = `${randomUUID()}.${RECEIPT_TYPES[receipt.type]}`;
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(receiptPath, await receipt.arrayBuffer(), { contentType: receipt.type });
    if (uploadError) throw uploadError;

    const receiptKey = randomBytes(24).toString('hex');
    const { data: order, error: insertError } = await supabase
      .from('shop_orders')
      .insert([{
        full_name: fullName,
        email,
        phone,
        items: parsed.items,
        total: parsed.total,
        receipt_path: receiptPath,
        receipt_key: receiptKey,
      }])
      .select('id, order_code, created_at, full_name, email, phone, items, total')
      .single();
    if (insertError) {
      await supabase.storage.from(BUCKET).remove([receiptPath]);
      throw insertError;
    }

    const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    const receiptUrl = `${origin}/api/receipts/${order.id}?key=${receiptKey}`;

    const [sheetResult, emailResult] = await Promise.allSettled([
      syncSheet(order, receiptUrl),
      sendOrderEmail(order.email, receivedEmail(order)),
    ]);
    if (sheetResult.status === 'rejected' || sheetResult.value) {
      console.error('Orders sheet sync failed:', sheetResult.reason ?? sheetResult.value);
    }
    if (emailResult.status === 'rejected') {
      console.error('Order received email failed:', emailResult.reason);
    }

    return NextResponse.json({ success: true, orderCode: order.order_code });
  } catch (error) {
    console.error('Order error:', error);
    return NextResponse.json({ error: 'Failed to submit order. Please try again.' }, { status: 500 });
  }
}
