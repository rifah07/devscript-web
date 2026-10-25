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

test('a waking API (503) or network error is retried, not treated as signed out', async () => {
  const answers = [() => Promise.reject(new Error('offline')), async () => ({ ok: false, status: 503 }), async () => ({ ok: true, json: async () => ({ accessToken: 'tok' }) })];
  let calls = 0;
  const fakeFetch = () => answers[calls++]();

  assert.equal(await refresh(fakeFetch, 0), 'tok');
  assert.equal(calls, 3);
});

test('401 means signed out: no retry', async () => {
  let calls = 0;
  const fakeFetch = async () => {
    calls++;
    return { ok: false, status: 401, json: async () => ({}) };
  };

  assert.equal(await refresh(fakeFetch, 0), null);
  assert.equal(calls, 1);
});
