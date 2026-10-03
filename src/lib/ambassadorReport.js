// Pure builder for the nightly ambassador report. No I/O: the caller supplies
// the rows and the run time, so this can be tested in isolation.

const DAY_MS = 24 * 60 * 60 * 1000;
const TIME_ZONE = 'Asia/Colombo';
const LAST_REPORT_DATE = '2026-10-31'; // Colombo date, inclusive
const TOP_N = 10;

const normalizeCode = (code) => (typeof code === 'string' ? code.trim().toUpperCase() : '');

// YYYY-MM-DD in Colombo time (en-CA formats dates as ISO)
const colomboIsoDate = (date) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE }).format(date);

// e.g. "4 Oct 2026"
const colomboDisplayDate = (date) =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone: TIME_ZONE,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);

// e.g. "2026-10-04 23:30:00" in Colombo time; blank if missing or invalid
const colomboTimestamp = (value) => {
  const date = new Date(value ?? NaN);
  if (!value || Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).format(date);
};

const byCode = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const orBlank = (value) => value ?? '';

/**
 * @param {object} input
 * @param {Array<object>} input.ambassadors  rows from the `ambassadors` table
 * @param {Array<string | null | undefined>} input.referralCodes  `ambassador_code` of each registration
 * @param {Date} input.now  the run time
 */
export function buildAmbassadorReport({ ambassadors, referralCodes, now }) {
  const nowMs = now.getTime();

  const referralsByCode = new Map(
    ambassadors.map((a) => [normalizeCode(a.ambassador_code), 0])
  );
  let totalReferrals = 0;
  for (const raw of referralCodes) {
    const code = normalizeCode(raw);
    if (!referralsByCode.has(code)) continue;
    referralsByCode.set(code, referralsByCode.get(code) + 1);
    totalReferrals += 1;
  }

  const newAmbassadors = ambassadors.filter((a) => {
    const createdMs = new Date(a.created_at).getTime();
    return createdMs > nowMs - DAY_MS && createdMs <= nowMs;
  }).length;

  const ranking = ambassadors
    .map((a) => ({
      code: a.ambassador_code,
      name: a.full_name,
      referrals: referralsByCode.get(normalizeCode(a.ambassador_code)),
    }))
    .sort((a, b) => b.referrals - a.referrals || byCode(a.code, b.code));

  // Sheet "Ambassadors" tab: registration details only, no referral counts
  const ambassadorRows = [...ambassadors]
    .sort((a, b) => byCode(a.ambassador_code, b.ambassador_code))
    .map((a) => [
      orBlank(a.ambassador_code),
      orBlank(a.full_name),
      orBlank(a.email),
      a.whatsapp ? `+94${a.whatsapp}` : '',
      orBlank(a.current_status),
      orBlank(a.organization),
      orBlank(a.is_aiesecer),
      orBlank(a.aiesec_entity),
      colomboTimestamp(a.created_at),
    ]);

  // Sheet "Leaderboard" tab: rank, code, name, referral count
  const leaderboardRows = ranking.map((a, i) => [i + 1, a.code, a.name, a.referrals]);

  const reportIsoDate = colomboIsoDate(now);

  return {
    shouldSend: reportIsoDate <= LAST_REPORT_DATE,
    reportDate: colomboDisplayDate(now),
    totalAmbassadors: ambassadors.length,
    newAmbassadors,
    totalReferrals,
    topAmbassadors: ranking.slice(0, TOP_N),
    ambassadorRows,
    leaderboardRows,
    // Sheet "Daily History" tab: one row appended per run
    historyRow: [reportIsoDate, ambassadors.length, newAmbassadors, totalReferrals],
  };
}
