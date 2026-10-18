/**
 * LaunchPad 4.0 – Shop Orders sheet
 *
 * Bound to the orders spreadsheet. Two jobs:
 *
 * 1. Web app ("Execute as: Me", "Who has access: Anyone"): the site's
 *    /api/orders route POSTs { secret, order } and a row is appended to the
 *    Orders tab (created with a header row if missing).
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
const HEADER = [
  'Order ID', 'Time (Colombo)', 'Name', 'Email', 'Phone',
  'Items', 'Total (LKR)', 'Receipt', 'Status', 'Email Sent',
];
const COL = { status: 9, emailSent: 10 }; // 1-based
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
      sheet.appendRow([
        o.orderCode, placed, o.fullName, o.email, o.phone,
        o.items, o.total, '', 'Pending', '',
      ]);
      const row = sheet.getLastRow();
      sheet.getRange(row, 8).setFormula('=HYPERLINK("' + o.receiptUrl + '","View receipt")');
      sheet.getRange(row, COL.status).setDataValidation(statusRule_());
      SpreadsheetApp.flush();
    } finally {
      lock.releaseLock();
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
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
  const siteUrl = props.getProperty('SITE_URL');
  if (!secret || !siteUrl) {
    ui.alert('Set SHEET_SECRET and SITE_URL in Script properties first.');
    return;
  }

  const sheet = ordersSheet_();
  const last = sheet.getLastRow();
  if (last < 2) return ui.alert('No orders yet.');

  const data = sheet.getRange(2, 1, last - 1, HEADER.length).getValues();
  const rowByCode = {};
  data.forEach(function (r, i) {
    const status = String(r[COL.status - 1]).trim();
    const sent = String(r[COL.emailSent - 1]).trim();
    if (status === 'Confirmed' && !sent) rowByCode[r[0]] = i + 2;
  });
  const codes = Object.keys(rowByCode);
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
      sheet.getRange(rowByCode[r.orderCode], COL.emailSent).setValue(when);
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
