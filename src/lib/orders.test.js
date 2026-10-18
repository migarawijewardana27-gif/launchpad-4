import test from 'node:test';
import assert from 'node:assert/strict';
import { parseItems, verifiedEmail } from './orders.js';

test('prices server-side and merges duplicate sizes', () => {
  const { items, total } = parseItems([
    { size: 'M', quantity: 2 },
    { size: 'L', quantity: 1 },
    { size: 'M', quantity: 1, unitPrice: 1 },
  ]);
  assert.deepEqual(items.map((i) => [i.size, i.quantity]), [['M', 3], ['L', 1]]);
  assert.equal(total, 4 * 1700);
});

test('rejects bad sizes, quantities and empty carts', () => {
  assert.throws(() => parseItems([{ size: 'XXXL', quantity: 1 }]));
  assert.throws(() => parseItems([{ size: 'M', quantity: 0 }]));
  assert.throws(() => parseItems([{ size: 'M', quantity: 11 }]));
  assert.throws(() => parseItems([{ size: 'M', quantity: 6 }, { size: 'M', quantity: 5 }]));
  assert.throws(() => parseItems([]));
  assert.throws(() => parseItems('nope'));
});

test('verified email escapes the buyer name', () => {
  const { items, total } = parseItems([{ size: 'S', quantity: 1 }]);
  const { html } = verifiedEmail({ order_code: 'LPO-001', full_name: '<b>x</b>', items, total });
  assert.ok(!html.includes('<b>x</b>'));
  assert.ok(html.includes('LPO-001'));
});
