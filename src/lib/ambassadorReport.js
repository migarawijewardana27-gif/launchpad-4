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

/**
 * @param {object} input
 * @param {Array<{ ambassador_code: string, full_name: string, created_at: string }>} input.ambassadors
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

  const topAmbassadors = ambassadors
    .map((a) => ({
      code: a.ambassador_code,
      name: a.full_name,
      referrals: referralsByCode.get(normalizeCode(a.ambassador_code)),
    }))
    .sort((a, b) => b.referrals - a.referrals || (a.code < b.code ? -1 : a.code > b.code ? 1 : 0))
    .slice(0, TOP_N);

  return {
    shouldSend: colomboIsoDate(now) <= LAST_REPORT_DATE,
    reportDate: colomboDisplayDate(now),
    totalAmbassadors: ambassadors.length,
    newAmbassadors,
    totalReferrals,
    topAmbassadors,
  };
}
