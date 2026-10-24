import { test } from 'node:test';
import assert from 'node:assert/strict';

import { splitStanzas } from './poem.ts';

test('blank lines split stanzas; single line breaks and indents survive', () => {
  const poem = 'first line\n  indented second\n\nnew stanza\n\n\n\nlast';
  assert.deepEqual(splitStanzas(poem), ['first line\n  indented second', 'new stanza', 'last']);
});

test('Bangla text and Windows line endings', () => {
  assert.deepEqual(splitStanzas('সন্ধ্যার আলো\r\nনীরব\r\n\r\nশেষ'), ['সন্ধ্যার আলো\nনীরব', 'শেষ']);
});
