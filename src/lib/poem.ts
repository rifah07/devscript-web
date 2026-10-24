// Poems are plain text where every line break carries meaning. Blank lines
// split stanzas; inside a stanza each line and its indentation is kept.
export function splitStanzas(body: string): string[] {
  return body
    .replace(/\r\n?/g, '\n')
    .replace(/^\n+|\n+\s*$/g, '')
    .split(/\n[ \t]*\n+/)
    .filter((s) => s.trim());
}
