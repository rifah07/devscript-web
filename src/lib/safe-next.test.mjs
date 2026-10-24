import { test } from 'node:test';
import assert from 'node:assert/strict';
import { safeNext } from './safe-next.ts';

test('keeps local paths', () => {
  assert.equal(safeNext('/posts/x?y=1'), '/posts/x?y=1');
});

test('rejects anything that leaves the site', () => {
  for (const bad of ['https://evil.example', '//evil.example', '/\\evil.example', 'javascript:alert(1)', null]) {
    assert.equal(safeNext(bad), '/');
  }
});
