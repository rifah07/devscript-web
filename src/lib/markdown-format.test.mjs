// Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatEdit } from './markdown-format.ts';

const apply = (text, start, end, format) => {
  const e = formatEdit(text, start, end, format);
  const out = text.slice(0, e.from) + e.insert + text.slice(e.to);
  return { out, selected: out.slice(...e.select) };
};

test('bold wraps the selection and keeps it selected', () => {
  assert.deepEqual(apply('say hello now', 4, 9, 'bold'), { out: 'say **hello** now', selected: 'hello' });
});

test('with nothing selected, a placeholder is inserted and selected', () => {
  assert.deepEqual(apply('ab', 1, 1, 'code'), { out: 'a`code`b', selected: 'code' });
});

test('a code block starts on its own line and selects the code', () => {
  const { out, selected } = apply('Intro: x = 1', 7, 12, 'codeBlock');
  assert.equal(out, 'Intro: \n```ts\nx = 1\n```\n');
  assert.equal(selected, 'x = 1');
});

test('link selects the URL so you can paste over it', () => {
  assert.deepEqual(apply('see docs', 4, 8, 'link'), { out: 'see [docs](https://)', selected: 'https://' });
});

test('list prefixes every line the selection touches', () => {
  assert.equal(apply('one\ntwo\nthree', 1, 5, 'list').out, '- one\n- two\nthree');
});
