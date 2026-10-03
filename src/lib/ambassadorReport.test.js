import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildAmbassadorReport } from './ambassadorReport.js';

const HOUR = 60 * 60 * 1000;
const NOW = new Date('2026-10-04T18:00:00Z'); // 23:30 Colombo

const ambassador = (code, overrides = {}) => ({
  ambassador_code: code,
  full_name: `Name ${code}`,
  created_at: '2026-09-01T00:00:00Z',
  ...overrides,
});

test('matches referral codes case-insensitively and ignoring surrounding whitespace', () => {
  const report = buildAmbassadorReport({
    ambassadors: [ambassador('LPA001')],
    referralCodes: ['LPA001', 'lpa001', '  Lpa001 ', '\tLPA001\n'],
    now: NOW,
  });

  assert.equal(report.totalReferrals, 4);
  assert.deepEqual(report.topAmbassadors, [
    { code: 'LPA001', name: 'Name LPA001', referrals: 4 },
  ]);
});

test('drops codes that match no ambassador and excludes them from totals', () => {
  const report = buildAmbassadorReport({
    ambassadors: [ambassador('LPA001')],
    referralCodes: ['LPA001', 'LPA999', 'NOPE', '', null, undefined, '   '],
    now: NOW,
  });

  assert.equal(report.totalReferrals, 1);
  assert.equal(report.topAmbassadors.length, 1);
  assert.equal(report.topAmbassadors[0].referrals, 1);
});

test('counts total ambassadors', () => {
  const report = buildAmbassadorReport({
    ambassadors: [ambassador('LPA001'), ambassador('LPA002'), ambassador('LPA003')],
    referralCodes: [],
    now: NOW,
  });

  assert.equal(report.totalAmbassadors, 3);
  assert.equal(report.totalReferrals, 0);
});

test('new in last 24h is relative to the run time, with an exclusive lower and inclusive upper bound', () => {
  const at = (msBeforeNow) => new Date(NOW.getTime() - msBeforeNow).toISOString();
  const report = buildAmbassadorReport({
    ambassadors: [
      ambassador('LPA001', { created_at: at(24 * HOUR) }), // exactly 24h ago: excluded
      ambassador('LPA002', { created_at: at(24 * HOUR - 1) }), // just inside
      ambassador('LPA003', { created_at: at(0) }), // exactly now: included
      ambassador('LPA004', { created_at: at(25 * HOUR) }), // yesterday
    ],
    referralCodes: [],
    now: NOW,
  });

  assert.equal(report.newAmbassadors, 2);
});

test('a late run shifts the 24h window with it rather than using the calendar date', () => {
  // Cron scheduled 18:00 UTC but fired an hour late.
  const lateRun = new Date('2026-10-04T19:00:00Z');
  const report = buildAmbassadorReport({
    ambassadors: [
      // Within 24h of the scheduled time, but more than 24h before the actual run: excluded
      ambassador('LPA001', { created_at: '2026-10-03T18:30:00Z' }),
      // Within 24h of the actual run: included
      ambassador('LPA002', { created_at: '2026-10-03T19:30:00Z' }),
      // After the scheduled time but before the late run: included
      ambassador('LPA003', { created_at: '2026-10-04T18:45:00Z' }),
    ],
    referralCodes: [],
    now: lateRun,
  });

  assert.equal(report.newAmbassadors, 2);
});

test('ranks the top 10 by referrals desc, tie-broken by code asc, including zero-referral ambassadors', () => {
  const codes = Array.from({ length: 12 }, (_, i) => `LPA${String(i + 1).padStart(3, '0')}`);
  const report = buildAmbassadorReport({
    // Deliberately unsorted input
    ambassadors: [...codes].reverse().map((code) => ambassador(code)),
    referralCodes: [
      'LPA005', 'LPA005', 'LPA005',
      'LPA002', 'LPA002',
      'LPA009', 'LPA009',
      'LPA011',
    ],
    now: NOW,
  });

  assert.deepEqual(
    report.topAmbassadors.map(({ code, referrals }) => [code, referrals]),
    [
      ['LPA005', 3],
      ['LPA002', 2],
      ['LPA009', 2],
      ['LPA011', 1],
      ['LPA001', 0],
      ['LPA003', 0],
      ['LPA004', 0],
      ['LPA006', 0],
      ['LPA007', 0],
      ['LPA008', 0],
    ],
  );
});

test('returns fewer than 10 when there are fewer ambassadors', () => {
  const report = buildAmbassadorReport({
    ambassadors: [ambassador('LPA002'), ambassador('LPA001')],
    referralCodes: [],
    now: NOW,
  });

  assert.deepEqual(report.topAmbassadors.map((a) => a.code), ['LPA001', 'LPA002']);
});

test('shouldSend is true at 31 Oct 23:59 Colombo time', () => {
  const report = buildAmbassadorReport({
    ambassadors: [],
    referralCodes: [],
    now: new Date('2026-10-31T23:59:00+05:30'),
  });

  assert.equal(report.shouldSend, true);
});

test('shouldSend is false on 1 Nov Colombo time, even while it is still 31 Oct in UTC', () => {
  const report = buildAmbassadorReport({
    ambassadors: [],
    referralCodes: [],
    now: new Date('2026-11-01T00:00:00+05:30'), // 2026-10-31T18:30Z
  });

  assert.equal(report.shouldSend, false);
});

test('reports the Colombo calendar date of the run', () => {
  const report = buildAmbassadorReport({
    ambassadors: [],
    referralCodes: [],
    now: new Date('2026-10-04T19:00:00Z'), // 00:30 on 5 Oct in Colombo
  });

  assert.equal(report.reportDate, '5 Oct 2026');
});
