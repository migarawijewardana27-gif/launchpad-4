import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { timingSafeEqual } from 'node:crypto';
import { verifiedEmail } from '../../../../lib/orders.js';
import { sendOrderEmail } from '../../../../lib/mailer.js';

const CODE_RE = /^LPO\d{3,}$/;

const safeEqual = (a, b) => {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
};

// Called by the "Orders > Send confirmation emails" menu in the sheet
// (docs/apps-script/orders-sheet.gs) with { secret, orderCodes: ["LPO001", ...] }.
// Sends the "order verified" email once per order and replies with a per-code result.
export async function POST(request) {
  const body = await request.json().catch(() => null);
  const expected = process.env.ORDERS_SHEET_SECRET;
  if (!expected || !body || !safeEqual(body.secret ?? '', expected)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const codes = Array.isArray(body.orderCodes) ? body.orderCodes.filter((c) => CODE_RE.test(c)) : [];
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const results = [];
  for (const code of codes) {
    try {
      const { data: order, error } = await supabase
        .from('shop_orders')
        .select('id, order_code, full_name, email, items, total, email_sent_at')
        .eq('order_code', code)
        .maybeSingle();
      if (error) throw error;
      if (!order) {
        results.push({ orderCode: code, ok: false, error: 'not found' });
        continue;
      }
      if (order.email_sent_at) {
        results.push({ orderCode: code, ok: true, alreadySent: true, sentAt: order.email_sent_at });
        continue;
      }

      // Claim the order first so overlapping runs cannot send twice.
      const sentAt = new Date().toISOString();
      const { data: claimed, error: claimError } = await supabase
        .from('shop_orders')
        .update({ status: 'confirmed', email_sent_at: sentAt })
        .eq('id', order.id)
        .is('email_sent_at', null)
        .select('id');
      if (claimError) throw claimError;
      if (!claimed?.length) {
        results.push({ orderCode: code, ok: true, alreadySent: true, sentAt });
        continue;
      }

      try {
        await sendOrderEmail(order.email, verifiedEmail(order));
      } catch (mailError) {
        await supabase.from('shop_orders').update({ status: 'pending', email_sent_at: null }).eq('id', order.id);
        throw mailError;
      }
      results.push({ orderCode: code, ok: true, sentAt });
    } catch (error) {
      console.error(`Confirm ${code} failed:`, error);
      results.push({ orderCode: code, ok: false, error: error.message ?? 'failed' });
    }
  }

  return NextResponse.json({ ok: true, results });
}
