-- LaunchPad 4.0 shop orders. Run once in the Supabase SQL editor.
-- All access goes through the Next.js API routes with the service-role key,
-- so RLS is enabled with no policies (anon/authenticated get nothing).

create sequence if not exists shop_order_seq;

create table if not exists shop_orders (
  id            uuid primary key default gen_random_uuid(),
  order_no      bigint not null default nextval('shop_order_seq'),
  order_code    text generated always as ('LPO' || lpad(order_no::text, 3, '0')) stored unique,
  full_name     text not null,
  email         text not null,
  phone         text not null,
  items         jsonb not null,
  total         integer not null,
  receipt_path  text not null,
  receipt_key   text not null,
  status        text not null default 'pending' check (status in ('pending', 'confirmed')),
  email_sent_at timestamptz,
  created_at    timestamptz not null default now()
);

alter table shop_orders enable row level security;

-- Private bucket for bank-transfer receipts (images/PDF, 4 MB).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('receipts', 'receipts', false, 4194304,
        array['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
on conflict (id) do nothing;
