// Pure helpers for the editor toolbar: given the text and the selection,
// say what to insert and what to select afterwards. No DOM, so it's testable.

export type Format = 'bold' | 'italic' | 'code' | 'codeBlock' | 'link' | 'heading' | 'quote' | 'list';

export type Edit = {
  from: number; // replace text[from, to) ...
  to: number;
  insert: string; // ... with this
  select: [number, number]; // then select this range (absolute, after the edit)
};

const WRAP: Partial<Record<Format, [string, string, string]>> = {
  // [before, after, placeholder when nothing is selected]
  bold: ['**', '**', 'bold text'],
  italic: ['*', '*', 'italic text'],
  code: ['`', '`', 'code'],
};

const LINE_PREFIX: Partial<Record<Format, string>> = {
  heading: '## ',
  quote: '> ',
  list: '- ',
};

export function formatEdit(text: string, start: number, end: number, format: Format): Edit {
  const selected = text.slice(start, end);

  const wrap = WRAP[format];
  if (wrap) {
    const [before, after, placeholder] = wrap;
    const inner = selected || placeholder;
    const at = start + before.length;
    return { from: start, to: end, insert: before + inner + after, select: [at, at + inner.length] };
  }

  if (format === 'link') {
    const label = selected || 'link text';
    const insert = `[${label}](https://)`;
    const urlAt = start + label.length + 3; // past "[label]("
    return { from: start, to: end, insert, select: [urlAt, urlAt + 'https://'.length] };
  }

  if (format === 'codeBlock') {
    const code = selected || 'code';
    // A fence must start on its own line
    const lead = start > 0 && text[start - 1] !== '\n' ? '\n' : '';
    const insert = `${lead}\`\`\`ts\n${code}\n\`\`\`\n`;
    const codeAt = start + lead.length + '```ts\n'.length;
    return { from: start, to: end, insert, select: [codeAt, codeAt + code.length] };
  }

  // Line formats apply to every line the selection touches
  const prefix = LINE_PREFIX[format]!;
  const from = text.lastIndexOf('\n', start - 1) + 1;
  const lineEnd = text.indexOf('\n', end);
  const to = lineEnd === -1 ? text.length : lineEnd;
  const insert = text
    .slice(from, to)
    .split('\n')
    .map((line) => prefix + line)
    .join('\n');
  return { from, to, insert, select: [from + insert.length, from + insert.length] };
}
