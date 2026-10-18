import test from 'node:test';
import assert from 'node:assert/strict';
import { issueCodeToken, exchangeCode, checkProof, newCode } from './email-verify.js';

const S = 'secret';

test('correct code yields a proof bound to that email', () => {
  const code = newCode();
  const token = issueCodeToken(S, 'A@x.com', code);
  const proof = exchangeCode(S, 'a@x.com', code, token);
  assert.ok(proof);
  assert.ok(checkProof(S, 'a@x.com', proof));
  assert.ok(!checkProof(S, 'b@x.com', proof));
});

test('wrong code, other email and expired token are rejected', () => {
  const token = issueCodeToken(S, 'a@x.com', '123456', 0);
  assert.equal(exchangeCode(S, 'a@x.com', '000000', token, 1), null);
  assert.equal(exchangeCode(S, 'b@x.com', '123456', token, 1), null);
  assert.equal(exchangeCode(S, 'a@x.com', '123456', token, 11 * 60 * 1000), null);
  assert.ok(!checkProof(S, 'a@x.com', 'garbage'));
});
