/**
 * LaunchPad 4.0 – Shop Orders sheet
 *
 * Bound to the orders spreadsheet. Two jobs:
 *
 * 1. Web app ("Execute as: Me", "Who has access: Anyone"): the site's
 *    /api/orders route POSTs { secret, order } and a row is appended to the
 *    Orders tab (created with a header row if missing), one row per size ordered.
 *    If you have an older Orders tab with the previous layout, rename it first
 *    (e.g. "Orders (old)") so a fresh tab with the new columns is created.
 * 2. "Orders" menu → "Send confirmation emails": for every row whose Status is
 *    Confirmed and whose Email Sent is blank, asks the site
 *    (/api/orders/confirm) to send the "order verified" email, then stamps
 *    Email Sent. Set several rows to Confirmed, then run it once.
 *
 * Script properties (Project Settings → Script properties):
 *   SHEET_SECRET – must equal ORDERS_SHEET_SECRET in Vercel
 *   SITE_URL     – the live site origin, e.g. https://launchpad.example.lk (no trailing slash)
 *
 * Status values: Pending (default), Confirmed, Rejected. Rejected sends nothing.
 */

const ORDERS_TAB = 'Orders';
// One row per order line (one size of one item). Line ID is unique per row
// (e.g. LPO-001-M); Order ID repeats across the lines of an order. Order Total is
// filled on the first line only so SUM(Amount) and SUM(Order Total) never double count.
const HEADER = [
  'Order ID', 'Line ID', 'Time (Colombo)', 'Name', 'Email', 'Phone',
  'Item', 'Size', 'Qty', 'Amount (LKR)', 'Order Total (LKR)', 'Receipt', 'Status', 'Email Sent',
];
const COL = { orderId: 1, receipt: 12, status: 13, emailSent: 14 }; // 1-based
const STATUSES = ['Pending', 'Confirmed', 'Rejected'];

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const expected = PropertiesService.getScriptProperties().getProperty('SHEET_SECRET');
    if (!expected || body.secret !== expected) return json_({ ok: false, error: 'unauthorized' });

    const o = body.order;
    if (!o || !o.orderCode) return json_({ ok: false, error: 'missing order' });

    const lock = LockService.getScriptLock();
    lock.waitLock(30000);
    try {
      const sheet = ordersSheet_();
      const placed = Utilities.formatDate(new Date(o.createdAt), 'Asia/Colombo', 'yyyy-MM-dd HH:mm');
      const lines = (o.lines && o.lines.length) ? o.lines : [{ item: o.items, size: '', quantity: '', amount: o.total }];
      const rows = lines.map(function (l, i) {
        return [
          o.orderCode, o.orderCode + '-' + (l.size || (i + 1)), placed, o.fullName, o.email, o.phone,
          l.item, l.size, l.quantity, l.amount, i === 0 ? o.total : '', '', 'Pending', '',
        ];
      });
      const start = sheet.getLastRow() + 1;
      sheet.getRange(start, 1, rows.length, HEADER.length).setValues(rows);
      sheet.getRange(start, COL.receipt, rows.length, 1).setFormula('=HYPERLINK("' + o.receiptUrl + '","View receipt")');
      sheet.getRange(start, COL.status, rows.length, 1).setDataValidation(statusRule_());
      SpreadsheetApp.flush();
    } finally {
      lock.releaseLock();
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

// Keep every line of an order on the same status: edit one row, the rest follow.
function onEdit(e) {
  const r = e && e.range;
  if (!r || r.getSheet().getName() !== ORDERS_TAB || r.getColumn() !== COL.status || r.getRow() < 2 || r.getNumRows() !== 1) return;
  const sheet = r.getSheet();
  const id = sheet.getRange(r.getRow(), COL.orderId).getValue();
  const ids = sheet.getRange(2, COL.orderId, sheet.getLastRow() - 1, 1).getValues();
  ids.forEach(function (row, i) {
    if (row[0] === id) sheet.getRange(i + 2, COL.status).setValue(r.getValue());
  });
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Orders')
    .addItem('Send confirmation emails', 'sendConfirmations')
    .addToUi();
}

function sendConfirmations() {
  const ui = SpreadsheetApp.getUi();
  const props = PropertiesService.getScriptProperties();
  const secret = props.getProperty('SHEET_SECRET');
  const siteUrl = (props.getProperty('SITE_URL') || '').trim().replace(/\/+$/, '');
  if (!secret || !siteUrl) {
    ui.alert('Set SHEET_SECRET and SITE_URL in Script properties first.');
    return;
  }

  const sheet = ordersSheet_();
  const last = sheet.getLastRow();
  if (last < 2) return ui.alert('No orders yet.');

  const data = sheet.getRange(2, 1, last - 1, HEADER.length).getValues();
  const rowsByCode = {}; // order ID -> every sheet row of that order
  data.forEach(function (r, i) {
    const status = String(r[COL.status - 1]).trim();
    const sent = String(r[COL.emailSent - 1]).trim();
    if (status === 'Confirmed' && !sent) (rowsByCode[r[0]] = rowsByCode[r[0]] || []).push(i + 2);
  });
  const codes = Object.keys(rowsByCode);
  if (!codes.length) return ui.alert('No Confirmed orders waiting for an email.');

  if (ui.alert('Send confirmation emails to ' + codes.length + ' buyer(s)?', ui.ButtonSet.OK_CANCEL) !== ui.Button.OK) return;

  const res = UrlFetchApp.fetch(siteUrl + '/api/orders/confirm', {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({ secret: secret, orderCodes: codes }),
    muteHttpExceptions: true,
  });
  const body = JSON.parse(res.getContentText() || '{}');
  if (!body.ok) return ui.alert('Failed: ' + (body.error || 'HTTP ' + res.getResponseCode()));

  let sent = 0;
  const failed = [];
  body.results.forEach(function (r) {
    if (r.ok) {
      const when = Utilities.formatDate(new Date(r.sentAt), 'Asia/Colombo', 'yyyy-MM-dd HH:mm');
      rowsByCode[r.orderCode].forEach(function (row) {
        sheet.getRange(row, COL.emailSent).setValue(when);
      });
      sent++;
    } else {
      failed.push(r.orderCode + ' (' + r.error + ')');
    }
  });
  ui.alert('Sent ' + sent + ' email(s).' + (failed.length ? '\nFailed: ' + failed.join(', ') : ''));
}

function ordersSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(ORDERS_TAB);
  if (!sheet) {
    sheet = ss.insertSheet(ORDERS_TAB);
    sheet.appendRow(HEADER);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADER.length).setFontWeight('bold');
  }
  return sheet;
}

function statusRule_() {
  return SpreadsheetApp.newDataValidation().requireValueInList(STATUSES, true).setAllowInvalid(false).build();
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
