/**
 * LaunchPad 4.0 – Ambassador Sheet sync
 *
 * Bound to the ambassador report spreadsheet and deployed as a web app
 * ("Execute as: Me", "Who has access: Anyone"). The nightly report route
 * (/api/cron/ambassador-report) POSTs:
 *
 *   { "secret": "...", "ambassadors": [[...], ...], "leaderboard": [[...], ...], "history": [...] }
 *
 * The secret is checked against the SHEET_SECRET script property
 * (Project Settings → Script properties), which must equal the
 * AMBASSADOR_SHEET_SECRET env var in Vercel. Ambassadors and Leaderboard are
 * cleared and rewritten with a header row; the history row is appended to
 * Daily History (created with a header row if missing), leaving earlier rows
 * untouched. Responds { ok: true } or { ok: false, error }.
 */

const TABS = {
  Ambassadors: [
    'Code',
    'Full Name',
    'Email',
    'WhatsApp',
    'Current Status',
    'Organization',
    'AIESECer',
    'AIESEC Entity',
    'Signup Time (Colombo)',
  ],
  Leaderboard: ['Rank', 'Code', 'Name', 'Referrals'],
};

const HISTORY_TAB = 'Daily History';
const HISTORY_HEADER = ['Date (Asia/Colombo)', 'Total Ambassadors', 'New in Last 24h', 'Total Referred Delegates'];

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);

    const expected = PropertiesService.getScriptProperties().getProperty('SHEET_SECRET');
    if (!expected || body.secret !== expected) {
      return json_({ ok: false, error: 'unauthorized' });
    }

    validateRows_('ambassadors', body.ambassadors, TABS.Ambassadors.length);
    validateRows_('leaderboard', body.leaderboard, TABS.Leaderboard.length);
    validateRows_('history', [body.history], HISTORY_HEADER.length);

    // Serialise overlapping runs (e.g. a manual trigger during the cron run).
    const lock = LockService.getScriptLock();
    lock.waitLock(30000);
    try {
      writeTab_('Ambassadors', TABS.Ambassadors, body.ambassadors);
      writeTab_('Leaderboard', TABS.Leaderboard, body.leaderboard);
      appendHistory_(body.history);
      SpreadsheetApp.flush();
    } finally {
      lock.releaseLock();
    }

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String((err && err.message) || err) });
  }
}

function validateRows_(name, rows, width) {
  if (!Array.isArray(rows)) throw new Error(name + ' must be an array of rows');
  rows.forEach(function (row, i) {
    if (!Array.isArray(row) || row.length !== width) {
      throw new Error(name + ' row ' + (i + 1) + ' must have ' + width + ' columns');
    }
  });
}

function writeTab_(name, header, rows) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(name) || spreadsheet.insertSheet(name);

  sheet.clearContents();
  const values = [header].concat(rows.map(function (row) { return row.map(asCell_); }));
  sheet.getRange(1, 1, values.length, header.length).setValues(values);
  sheet.getRange(1, 1, 1, header.length).setFontWeight('bold');
  sheet.setFrozenRows(1);
}

function appendHistory_(row) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(HISTORY_TAB);
  if (!sheet) sheet = spreadsheet.insertSheet(HISTORY_TAB);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HISTORY_HEADER);
    sheet.getRange(1, 1, 1, HISTORY_HEADER.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.getRange('A:A').setNumberFormat('yyyy-mm-dd');
  }
  sheet.appendRow(row.map(asCell_));
}

// Strings starting with = + - @ would be parsed as formulas (and "+94..."
// would lose its "+"), so force them to plain text with a leading apostrophe.
function asCell_(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string' && /^[=+\-@]/.test(value)) return "'" + value;
  return value;
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
