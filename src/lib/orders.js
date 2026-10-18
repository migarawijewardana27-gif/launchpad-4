import { SIZES, MAX_QTY_PER_LINE, TSHIRT } from './products.js';

export const MAX_RECEIPT_BYTES = 4 * 1024 * 1024; // Vercel caps request bodies at ~4.5 MB
export const RECEIPT_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'application/pdf': 'pdf',
};

// Validates the cart lines sent by the browser and prices them server-side,
// so the client can never choose its own price. Lines for the same size merge.
export function parseItems(raw) {
  let lines;
  try {
    lines = typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch {
    throw new Error('Invalid items');
  }
  if (!Array.isArray(lines) || lines.length === 0) throw new Error('Cart is empty');

  const bySize = new Map();
  for (const line of lines) {
    const size = line?.size;
    const quantity = Number(line?.quantity);
    if (!SIZES.includes(size)) throw new Error(`Invalid size: ${size}`);
    if (!Number.isInteger(quantity) || quantity < 1) throw new Error('Invalid quantity');
    const next = (bySize.get(size) ?? 0) + quantity;
    if (next > MAX_QTY_PER_LINE) throw new Error(`Maximum ${MAX_QTY_PER_LINE} per size`);
    bySize.set(size, next);
  }

  const items = SIZES.filter((s) => bySize.has(s)).map((size) => ({
    productId: TSHIRT.id,
    name: TSHIRT.name,
    size,
    quantity: bySize.get(size),
    unitPrice: TSHIRT.price,
  }));
  const total = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  return { items, total };
}

export const formatLkr = (n) => `LKR ${Number(n).toLocaleString('en-US')}`;

export const itemsSummary = (items) =>
  items.map((i) => `${i.quantity} x ${i.name} (${i.size})`).join('; ');

export const escapeHtml = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function emailShell(heading, intro, order, footer) {
  const rows = order.items
    .map(
      (i) => `<tr>
        <td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;">${escapeHtml(i.name)}</td>
        <td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;text-align:center;">${escapeHtml(i.size)}</td>
        <td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;text-align:center;">${i.quantity}</td>
        <td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;text-align:right;">${formatLkr(i.unitPrice * i.quantity)}</td>
      </tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:#f4f4f6;margin:0;padding:24px 12px;color:#1e293b;">
  <div style="max-width:580px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
    <div style="background:#8b151b;color:#fff;padding:28px;text-align:center;">
      <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;opacity:.8;">LaunchPad 4.0</div>
      <h1 style="margin:8px 0 0;font-size:24px;">${heading}</h1>
    </div>
    <div style="padding:28px;">
      <p style="margin:0 0 16px;">Hi ${escapeHtml(order.full_name)},</p>
      <p style="margin:0 0 20px;line-height:1.6;">${intro}</p>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px 18px;margin-bottom:20px;">
        <span style="color:#64748b;font-size:12px;text-transform:uppercase;">Order ID</span><br>
        <strong style="font-size:20px;color:#8b151b;">${escapeHtml(order.order_code)}</strong>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:14px;border:1px solid #e2e8f0;">
        <thead style="background:#f8fafc;"><tr>
          <th style="text-align:left;padding:10px 14px;">Item</th>
          <th style="padding:10px 14px;">Size</th>
          <th style="padding:10px 14px;">Qty</th>
          <th style="text-align:right;padding:10px 14px;">Amount</th>
        </tr></thead>
        <tbody>${rows}</tbody>
        <tfoot><tr>
          <td colspan="3" style="padding:12px 14px;text-align:right;"><strong>Total</strong></td>
          <td style="padding:12px 14px;text-align:right;"><strong>${formatLkr(order.total)}</strong></td>
        </tr></tfoot>
      </table>
      <p style="margin:24px 0 0;line-height:1.6;color:#475569;font-size:14px;">${footer}</p>
    </div>
  </div>
</body></html>`;
}

export const receivedEmail = (order) => ({
  subject: `Order ${order.order_code} received - LaunchPad 4.0`,
  html: emailShell(
    'We got your order',
    'Thank you for ordering! We have received your order and bank transfer receipt. Our team will verify your payment and you will get another email once your order is confirmed.',
    order,
    'No action is needed from you right now.'
  ),
});

export const verifiedEmail = (order) => ({
  subject: `Order ${order.order_code} confirmed - LaunchPad 4.0`,
  html: emailShell(
    'Your order is confirmed',
    'Great news - your payment has been verified and your order is confirmed.',
    order,
    'Collection details will be shared closer to the event.'
  ),
});
