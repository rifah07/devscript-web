'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { formatDate } from '@/lib/format';
import { langOf } from '@/lib/lang';
import { clientGql, useSession } from '@/lib/session';
import type { Comment } from '@/lib/types';
import { ReportButton } from './ReportButton';

const FIELDS = `_id body isDeleted createdAt author { _id name }`;

// Comments are plain text (rendered with preserved line breaks, never as
// HTML), one level of replies, loaded in the browser so the post page itself
// stays cacheable.
export function CommentThread({ postId }: { postId: string }) {
  const { user } = useSession();
  const path = usePathname();
  const [comments, setComments] = useState<Comment[] | null>(null);

  useEffect(() => {
    void clientGql<{ comments: Comment[] }>(
      `query($p: ID!){ comments(postId:$p){ ${FIELDS} replies { ${FIELDS} } } }`,
      { p: postId },
    )
      .then((d) => setComments(d.comments))
      .catch(() => setComments([]));
  }, [postId]);

  const add = async (body: string, parentId?: string) => {
    const { createComment } = await clientGql<{ createComment: Comment }>(
      `mutation($i: CreateCommentInput!){ createComment(input:$i){ ${FIELDS} } }`,
      { i: { postId, body, parentId } },
    );
    setComments((list) =>
      parentId
        ? (list ?? []).map((c) => (c._id === parentId ? { ...c, replies: [...(c.replies ?? []), createComment] } : c))
        : [...(list ?? []), { ...createComment, replies: [] }],
    );
  };

  const remove = async (id: string) => {
    await clientGql(`mutation($id: ID!){ deleteComment(id:$id) }`, { id });
    const mark = (c: Comment): Comment => (c._id === id ? { ...c, isDeleted: true, body: '' } : c);
    setComments((list) => (list ?? []).map((c) => ({ ...mark(c), replies: c.replies?.map(mark) })));
  };

  return (
    <section className="comments" aria-labelledby="comments-title">
      <h2 id="comments-title" className="kicker">
        {comments?.length ? `${comments.length} conversation${comments.length > 1 ? 's' : ''}` : 'conversation'}
      </h2>
      {user ? (
        <Composer onSubmit={(body) => add(body)} />
      ) : (
        <p className="muted">
          <Link href={`/login?next=${encodeURIComponent(path)}`}>Log in</Link> to join the conversation.
        </p>
      )}
      {comments === null ? (
        <p className="muted">Loading…</p>
      ) : (
        comments.map((c) => (
          <CommentItem key={c._id} comment={c} onReply={user ? (body) => add(body, c._id) : undefined} onDelete={remove} />
        ))
      )}
    </section>
  );
}

function CommentItem({
  comment,
  onReply,
  onDelete,
}: {
  comment: Comment;
  onReply?: (body: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const { user } = useSession();
  const [replying, setReplying] = useState(false);
  const mine = user && (user._id === comment.author?._id || user.role === 'ADMIN');

  return (
    <article className="comment">
      <p className="meta">
        {comment.author ? <Link href={`/u/${comment.author._id}`}>{comment.author.name}</Link> : 'Someone'} ·{' '}
        <time dateTime={comment.createdAt}>{formatDate(comment.createdAt)}</time>
      </p>
      {comment.isDeleted ? (
        <p className="body muted">[deleted]</p>
      ) : (
        <p className="body" lang={langOf(comment.body)}>
          {comment.body}
        </p>
      )}
      {!comment.isDeleted && (
        <div className="row meta">
          {onReply && (
            <button type="button" className="link-button" onClick={() => setReplying(!replying)}>
              Reply
            </button>
          )}
          {mine && (
            <button type="button" className="link-button" onClick={() => void onDelete(comment._id)}>
              Delete
            </button>
          )}
          <ReportButton targetId={comment._id} targetType="COMMENT" compact />
        </div>
      )}
      {replying && onReply && (
        <Composer
          compact
          onSubmit={async (body) => {
            await onReply(body);
            setReplying(false);
          }}
        />
      )}
      {!!comment.replies?.length && (
        <div className="replies">
          {comment.replies.map((r) => (
            <CommentItem key={r._id} comment={r} onDelete={onDelete} />
          ))}
        </div>
      )}
    </article>
  );
}

function Composer({ onSubmit, compact }: { onSubmit: (body: string) => Promise<void>; compact?: boolean }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const body = String(new FormData(form).get('body') ?? '').trim();
    if (!body) return;
    setBusy(true);
    setError('');
    try {
      await onSubmit(body);
      form.reset();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="form" onSubmit={submit} style={{ marginBottom: '1rem' }}>
      <label className={compact ? 'sr-only' : undefined} htmlFor={compact ? undefined : 'comment-body'}>
        {compact ? 'Your reply' : 'Add to the conversation'}
      </label>
      <textarea
        id={compact ? undefined : 'comment-body'}
        name="body"
        rows={compact ? 2 : 3}
        maxLength={1000}
        required
        aria-label={compact ? 'Your reply' : undefined}
      />
      <p className="error" aria-live="polite">
        {error}
      </p>
      <div>
        <button type="submit" className="btn small" disabled={busy}>
          {busy ? 'Posting…' : compact ? 'Reply' : 'Post comment'}
        </button>
      </div>
    </form>
  );
}
