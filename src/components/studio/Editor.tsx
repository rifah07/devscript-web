'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PostBody } from '@/components/PostBody';
import { clientGql } from '@/lib/session';
import { EDIT_FIELDS } from '@/lib/studio-queries';
import type { Category, EditablePost } from '@/lib/types';
import { isMisk, site, SPACE, type PostType } from '@/site/config';
import { AiPanel } from './AiPanel';
import { GalleryManager } from './GalleryManager';
import { SeriesPicker } from './SeriesPicker';
import { StatusChip } from './StatusChip';

type Draft = { title: string; body: string; postType: PostType; tags: string; categoryId: string };
type SaveState = 'idle' | 'saving' | 'saved' | 'error';

const AUTOSAVE_MS = 2000;
const toDraft = (p?: EditablePost | null): Draft => ({
  title: p?.title ?? '',
  body: p?.body ?? '',
  postType: p?.postType ?? site.postTypes[0].type,
  tags: p?.tags.join(', ') ?? '',
  categoryId: p?.category?._id ?? '',
});
const parseTags = (s: string) =>
  [...new Set(s.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean))].slice(0, 10);
const canSave = (d: Draft) => d.title.trim().length > 0 && d.body.trim().length >= 10;

// Writing surface for both sites: autosaves 2 s after you stop typing,
// creates the post on the first save, and keeps publishing separate from
// saving (a draft is private until you choose to publish).
export function Editor({ initial }: { initial: EditablePost | null }) {
  const router = useRouter();
  const [post, setPost] = useState(initial);
  const [draft, setDraft] = useState<Draft>(() => toDraft(initial));
  const [dirty, setDirty] = useState(false);
  const [state, setState] = useState<SaveState>('idle');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const saving = useRef(false);

  useEffect(() => {
    void clientGql<{ categories: Category[] }>(`query($s: PostSpace){ categories(space:$s){ _id name slug } }`, { s: SPACE })
      .then((d) => setCategories(d.categories))
      .catch(() => undefined);
  }, []);

  const update = (patch: Partial<Draft>) => {
    setDraft((d) => ({ ...d, ...patch }));
    setDirty(true);
  };

  const save = useCallback(async (): Promise<EditablePost | null> => {
    if (saving.current || !canSave(draft)) return post;
    saving.current = true;
    setState('saving');
    const fields = {
      title: draft.title.trim(),
      body: draft.body,
      postType: draft.postType,
      tags: parseTags(draft.tags),
      ...(draft.categoryId && { categoryId: draft.categoryId }),
    };
    try {
      const saved = post
        ? (
            await clientGql<{ updatePost: EditablePost }>(
              `mutation($i: UpdatePostInput!){ updatePost(input:$i){ ${EDIT_FIELDS} } }`,
              { i: { id: post._id, ...fields } },
            )
          ).updatePost
        : (
            await clientGql<{ createPost: EditablePost }>(
              `mutation($i: CreatePostInput!){ createPost(input:$i){ ${EDIT_FIELDS} } }`,
              { i: { ...fields, space: SPACE } },
            )
          ).createPost;
      // First save: give the draft its real URL without reloading the page.
      if (!post) window.history.replaceState(null, '', `/studio/edit/${saved.slug}`);
      setPost(saved);
      setDirty(false);
      setState('saved');
      setError('');
      return saved;
    } catch (e) {
      setState('error');
      setError((e as Error).message);
      return null;
    } finally {
      saving.current = false;
    }
  }, [draft, post]);

  // Debounced autosave: each keystroke restarts the 2 s timer.
  useEffect(() => {
    if (!dirty || !canSave(draft)) return;
    const timer = setTimeout(() => void save(), AUTOSAVE_MS);
    return () => clearTimeout(timer);
  }, [dirty, draft, save]);

  // Warn before closing the tab with unsaved changes.
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  async function run(mutation: string, variables: Record<string, unknown>) {
    const saved = dirty ? await save() : post;
    if (!saved) return;
    try {
      const d = await clientGql<Record<string, EditablePost>>(mutation, { id: saved._id, ...variables });
      setPost(Object.values(d)[0]);
      setError('');
    } catch (e) {
      setError((e as Error).message);
    }
  }

  const publish = () => run(`mutation($id: ID!){ publishPost(id:$id){ ${EDIT_FIELDS} } }`, {});
  const schedule = (at: string) =>
    run(`mutation($id: ID!, $at: String!){ schedulePost(postId:$id, scheduledAt:$at){ ${EDIT_FIELDS} } }`, {
      at: new Date(at).toISOString(),
    });
  const unschedule = () => run(`mutation($id: ID!){ cancelSchedule(postId:$id){ ${EDIT_FIELDS} } }`, {});

  async function remove() {
    if (!post || !confirm('Delete this piece for good? This cannot be undone.')) return;
    await clientGql(`mutation($id: ID!){ deletePost(id:$id) }`, { id: post._id });
    router.push('/studio');
  }

  return (
    <div className="wide editor-layout">
      <section className="stack">
        <div className="spread">
          <div className="row">
            {/* In-app navigation skips beforeunload, so save on the way out */}
            <Link className="back" href="/studio" onClick={() => dirty && void save()}>
              ← Studio
            </Link>
            {post && <StatusChip status={post.status} />}
            <span className="save-state" aria-live="polite">
              {state === 'saving' ? 'Saving…' : state === 'saved' ? 'Saved' : state === 'error' ? 'Not saved' : ''}
            </span>
          </div>
          <div className="tabs" role="tablist" style={{ margin: 0, border: 0 }}>
            <button type="button" role="tab" aria-selected={!preview} onClick={() => setPreview(false)}>
              Write
            </button>
            <button type="button" role="tab" aria-selected={preview} onClick={() => setPreview(true)}>
              Preview
            </button>
          </div>
        </div>

        <label className="sr-only" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          className="editor-title"
          placeholder="Title"
          maxLength={150}
          value={draft.title}
          onChange={(e) => update({ title: e.target.value })}
        />

        {preview ? (
          <div className="card">
            <PostBody body={draft.body || '*Nothing to preview yet.*'} format={isMisk ? 'PLAINTEXT' : 'MARKDOWN'} />
          </div>
        ) : (
          <>
            <label className="sr-only" htmlFor="body">
              Body
            </label>
            <textarea
              id="body"
              className="editor-body"
              placeholder={isMisk ? 'Begin here. Leave an empty line between stanzas.' : 'Write in Markdown. # for headings, ``` for code.'}
              value={draft.body}
              spellCheck
              onChange={(e) => update({ body: e.target.value })}
            />
          </>
        )}
        <p className="error" aria-live="polite">
          {error}
        </p>
      </section>

      <aside className="panel" aria-label="Post settings">
        <div className="card panel">
          <h3>Publish</h3>
          {post?.status === 'PUBLISHED' ? (
            <a className="btn quiet" href={`/posts/${post.slug}`} target="_blank">
              View live ↗
            </a>
          ) : (
            <>
              <button type="button" className="btn" disabled={!canSave(draft)} onClick={() => void publish()}>
                Publish now
              </button>
              {post?.status === 'SCHEDULED' ? (
                <button type="button" className="btn quiet" onClick={() => void unschedule()}>
                  Cancel schedule ({new Date(post.scheduledAt!).toLocaleString()})
                </button>
              ) : (
                <ScheduleForm disabled={!canSave(draft)} onSchedule={(at) => void schedule(at)} />
              )}
            </>
          )}
        </div>

        <div className="card panel">
          <h3>Details</h3>
          <label>
            Type
            <select value={draft.postType} onChange={(e) => update({ postType: e.target.value as PostType })}>
              {site.postTypes.map((t) => (
                <option key={t.type} value={t.type}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Tags (comma separated, up to 10)
            <input value={draft.tags} onChange={(e) => update({ tags: e.target.value })} placeholder="e.g. auth, security" />
          </label>
          {!!categories.length && (
            <label>
              Category
              <select value={draft.categoryId} onChange={(e) => update({ categoryId: e.target.value })}>
                <option value="">None</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          {post && <SeriesPicker post={post} onChange={setPost} />}
        </div>

        <AiPanel
          post={post}
          draft={draft}
          onTitle={(title) => update({ title })}
          onTags={(tags) => update({ tags: parseTags([draft.tags, ...tags].join(',')).join(', ') })}
          onPost={setPost}
        />

        {post ? (
          <GalleryManager post={post} onChange={setPost} />
        ) : (
          <p className="meta">Images can be added once the draft has saved.</p>
        )}

        {post && (
          <button type="button" className="btn danger small" onClick={() => void remove()}>
            Delete this piece
          </button>
        )}
      </aside>
    </div>
  );
}

function ScheduleForm({ disabled, onSchedule }: { disabled: boolean; onSchedule: (at: string) => void }) {
  const [at, setAt] = useState('');
  // datetime-local is in the writer's own timezone; we send UTC ISO.
  // Earliest allowed: five minutes from when the form opened.
  const [min] = useState(() =>
    new Date(Date.now() - new Date().getTimezoneOffset() * 60_000 + 5 * 60_000).toISOString().slice(0, 16),
  );
  return (
    <div className="row" style={{ alignItems: 'end' }}>
      <label style={{ flex: 1 }}>
        Or schedule for
        <input type="datetime-local" min={min} value={at} onChange={(e) => setAt(e.target.value)} />
      </label>
      <button type="button" className="btn quiet small" disabled={disabled || !at} onClick={() => onSchedule(at)}>
        Schedule
      </button>
    </div>
  );
}
