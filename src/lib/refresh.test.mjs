// Run: npm test  (Node strips the TypeScript types itself, no test framework)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { refresh } from './refresh.ts';

test('concurrent refresh() calls share one network request', async () => {
  let calls = 0;
  const fakeFetch = async () => {
    calls++;
    await new Promise((r) => setTimeout(r, 10));
    return { ok: true, json: async () => ({ accessToken: 'tok' }) };
  };

  const results = await Promise.all([refresh(fakeFetch), refresh(fakeFetch), refresh(fakeFetch)]);

  assert.equal(calls, 1);
  assert.deepEqual(results, ['tok', 'tok', 'tok']);
});

test('a later refresh after the first settles makes a new request', async () => {
  let calls = 0;
  const fakeFetch = async () => {
    calls++;
    return { ok: false, json: async () => ({}) };
  };

  assert.equal(await refresh(fakeFetch), null);
  assert.equal(await refresh(fakeFetch), null);
  assert.equal(calls, 2);
});
