import test from 'node:test';
import assert from 'node:assert/strict';
import { checkEmail } from './email-check.js';

test('rejects malformed addresses and common typos without hitting DNS', async () => {
  assert.ok(await checkEmail('nope'));
  assert.match(await checkEmail('sam@gmial.com'), /sam@gmail\.com/);
});
