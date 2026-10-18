import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { timingSafeEqual } from 'node:crypto';

const BUCKET = 'receipts';
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const safeEqual = (a, b) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

// Receipts live in a private bucket. The sheet links here with the order's
// secret key; a valid key is redirected to a short-lived signed URL.
export async function GET(request, { params }) {
  const { id } = await params;
  const key = new URL(request.url).searchParams.get('key') ?? '';
  if (!UUID_RE.test(id) || !key) return new NextResponse('Not found', { status: 404 });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  const { data: order } = await supabase
    .from('shop_orders')
    .select('receipt_path, receipt_key')
    .eq('id', id)
    .maybeSingle();
  if (!order || !safeEqual(order.receipt_key, key)) return new NextResponse('Not found', { status: 404 });

  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(order.receipt_path, 60);
  if (error || !data?.signedUrl) return new NextResponse('Not found', { status: 404 });

  const response = NextResponse.redirect(data.signedUrl);
  response.headers.set('Cache-Control', 'no-store');
  return response;
}
