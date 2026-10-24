'use client';

import { useState } from 'react';
import { clientGql } from '@/lib/session';
import { EDIT_FIELDS } from '@/lib/studio-queries';
import type { EditablePost } from '@/lib/types';
import { isMisk } from '@/site/config';

type Draft = { title: string; body: string; postType: string };
type Result = { kind: 'titles' | 'tags' | 'review'; items: string[] } | { kind: 'text'; text: string };

// AI as a quiet assistant: every result is a suggestion you can click to
// apply, or ignore. Nothing is changed without you. Limits per day depend
// on your plan; when they run out the panel says so plainly.
export function AiPanel({
  post,
  draft,
  onTitle,
  onTags,
  onPost,
}: {
  post: EditablePost | null;
  draft: Draft;
  onTitle: (title: string) => void;
  onTags: (tags: string[]) => void;
  onPost: (post: EditablePost) => void;
}) {
  const [busy, setBusy] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');
  const hasText = draft.body.trim().length >= 30;

  async function ask(label: string, job: () => Promise<Result | null>) {
    setBusy(label);
    setError('');
    try {
      const r = await job();
      if (r && (('items' in r && r.items.length) || ('text' in r && r.text))) setResult(r);
      else setError('The assistant had nothing to suggest. Try again in a moment.');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy('');
    }
  }

  // Each query declares only the variables it uses (GraphQL rejects unused ones).
  const list = async (field: string, withTitle: boolean): Promise<string[]> => {
    const args = withTitle ? 'title:$title, body:$body, postType:$postType' : 'draft:$body, postType:$postType';
    const decl = `${withTitle ? '$title: String!, ' : ''}$body: String!, $postType: PostType`;
    const d = await clientGql<Record<string, { suggestions: string[] }>>(`query(${decl}){ ${field}(${args}){ suggestions } }`, {
      ...(withTitle && { title: draft.title || 'Untitled' }),
      body: draft.body,
      postType: draft.postType,
    });
    return d[field].suggestions;
  };

  const actions: [string, () => Promise<Result | null>][] = [
    ['Suggest titles', async () => ({ kind: 'titles', items: await list('suggestTitles', false) })],
    ['Suggest tags', async () => ({ kind: 'tags', items: await list('suggestTags', true) })],
    ['Feedback on draft', async () => ({ kind: 'review', items: await list('reviewDraft', true) })],
  ];

  async function summarize() {
    const d = await clientGql<{ generatePostSummary: string }>(`mutation($id: ID!){ generatePostSummary(postId:$id) }`, { id: post!._id });
    return { kind: 'text' as const, text: d.generatePostSummary };
  }

  async function narrate() {
    const d = await clientGql<{ generateNarration: EditablePost }>(
      `mutation($id: ID!){ generateNarration(postId:$id){ ${EDIT_FIELDS} } }`,
      { id: post!._id },
    );
    onPost(d.generateNarration);
    return { kind: 'text' as const, text: 'Narration ready. Readers will see a Listen player on the piece.' };
  }

  return (
    <div className="card panel">
      <h3>Writing assistant</h3>
      <p className="meta" style={{ margin: 0 }}>
        Suggestions only. Your words stay yours.
      </p>
      <div className="row">
        {actions.map(([label, job]) => (
          <button key={label} type="button" className="btn quiet small" disabled={!hasText || !!busy} onClick={() => void ask(label, job)}>
            {busy === label ? '…' : label}
          </button>
        ))}
        {post && !isMisk && (
          <button type="button" className="btn quiet small" disabled={!!busy} onClick={() => void ask('summary', summarize)}>
            {busy === 'summary' ? '…' : 'Write tl;dr'}
          </button>
        )}
        {post && isMisk && (
          <button type="button" className="btn quiet small" disabled={!!busy} onClick={() => void ask('narration', narrate)}>
            {busy === 'narration' ? 'Recording… (up to a minute)' : post.narrationUrl ? 'Re-record narration' : 'Add narration'}
          </button>
        )}
      </div>
      <p className="error" aria-live="polite">
        {error}
      </p>
      {result && <Suggestions result={result} onTitle={onTitle} onTags={onTags} />}
    </div>
  );
}

function Suggestions({ result, onTitle, onTags }: { result: Result; onTitle: (t: string) => void; onTags: (t: string[]) => void }) {
  if (result.kind === 'text') return <p className="notice">{result.text}</p>;
  if (result.kind === 'review')
    return (
      <ul className="stack" style={{ paddingLeft: '1rem', listStyle: 'disc', fontSize: '0.92rem' }}>
        {result.items.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    );
  return (
    <div className="row">
      {result.kind === 'tags' && (
        <button type="button" className="btn small" onClick={() => onTags(result.items)}>
          Add all
        </button>
      )}
      {result.items.map((s) => (
        <button
          key={s}
          type="button"
          className="toggle"
          onClick={() => (result.kind === 'titles' ? onTitle(s) : onTags([s]))}
          title={result.kind === 'titles' ? 'Use this title' : 'Add this tag'}
        >
          {result.kind === 'tags' ? `#${s}` : s}
        </button>
      ))}
    </div>
  );
}
