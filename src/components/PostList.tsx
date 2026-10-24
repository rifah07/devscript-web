import Link from 'next/link';
import { formatDate } from '@/lib/format';
import { langOf } from '@/lib/lang';
import type { PostCard } from '@/lib/types';

// A typographic list, not a card grid: these are reading sites.
export function PostList({ posts, empty = 'Nothing here yet.' }: { posts: PostCard[]; empty?: string }) {
  if (!posts.length) return <p className="muted">{empty}</p>;
  return (
    <ol className="post-list">
      {posts.map((p, i) => (
        <li key={p._id} style={{ '--i': i } as React.CSSProperties}>
          <p className="meta">
            <time dateTime={p.createdAt}>{formatDate(p.createdAt)}</time>
            {' · '}
            {p.readTime} min
            {p.author && (
              <>
                {' · '}
                <Link href={`/u/${p.author._id}`}>{p.author.name}</Link>
              </>
            )}
          </p>
          <h2 lang={langOf(p.title)}>
            <Link href={`/posts/${p.slug}`}>{p.title}</Link>
          </h2>
          <p className="excerpt" lang={langOf(p.excerpt)}>
            {p.excerpt}
          </p>
          <TagList tags={p.tags} />
        </li>
      ))}
    </ol>
  );
}

export function TagList({ tags }: { tags: string[] }) {
  if (!tags.length) return null;
  return (
    <ul className="tags" aria-label="Tags">
      {tags.map((t) => (
        <li key={t}>
          <Link href={`/tags/${encodeURIComponent(t)}`}>#{t}</Link>
        </li>
      ))}
    </ul>
  );
}

// Cursor pagination as plain links: works without JavaScript.
export function Pager({ base, nextCursor, isFirst }: { base: string; nextCursor?: string | null; isFirst: boolean }) {
  if (isFirst && !nextCursor) return null;
  const sep = base.includes('?') ? '&' : '?';
  return (
    <nav className="pager" aria-label="Pagination">
      {!isFirst && <Link href={base}>← Newest</Link>}
      {nextCursor && <Link href={`${base}${sep}after=${nextCursor}`}>Older →</Link>}
    </nav>
  );
}
