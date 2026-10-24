'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { RequireLogin } from '@/components/RequireLogin';
import { StatusChip } from '@/components/studio/StatusChip';
import { formatDate } from '@/lib/format';
import { clientGql, useSession } from '@/lib/session';
import { MY_POST_FIELDS } from '@/lib/studio-queries';
import { SPACE, site } from '@/site/config';

type MyPost = {
  _id: string;
  title: string;
  slug: string;
  status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED';
  scheduledAt?: string | null;
  viewCount: number;
  bookmarksCount: number;
  updatedAt: string;
};
type Stats = { totalViews: number; totalPosts: number; totalBookmarks: number };

export default function StudioPage() {
  return (
    <RequireLogin>
      <Dashboard />
    </RequireLogin>
  );
}

function Dashboard() {
  const { user } = useSession();
  const [posts, setPosts] = useState<MyPost[] | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);

  const fetchPage = useCallback(
    (after?: string) =>
      clientGql<{ posts: { posts: MyPost[]; nextCursor?: string } }>(
        `query($f: PostsFilterInput){ posts(filter:$f){ posts{ ${MY_POST_FIELDS} } nextCursor } }`,
        { f: { authorId: user!._id, space: SPACE, cursor: after } },
      ),
    [user],
  );

  const loadMore = (after?: string) =>
    void fetchPage(after).then((d) => {
      setPosts((prev) => [...(after ? (prev ?? []) : []), ...d.posts.posts]);
      setCursor(d.posts.nextCursor ?? null);
    });

  useEffect(() => {
    void fetchPage().then((d) => {
      setPosts(d.posts.posts);
      setCursor(d.posts.nextCursor ?? null);
    });
    void clientGql<{ myAnalytics: Stats }>(`{ myAnalytics { totalViews totalPosts totalBookmarks } }`)
      .then((d) => setStats(d.myAnalytics))
      .catch(() => undefined);
  }, [fetchPage]);

  return (
    <div className="wide stack">
      <div className="spread">
        <div>
          <p className="kicker">studio</p>
          <h1 style={{ margin: 0 }}>Hello, {user!.name.split(' ')[0]}</h1>
          {!user!.emailVerified && (
            <Link href="/studio/settings" className="chip pending">
              email not confirmed
            </Link>
          )}
        </div>
        <div className="row">
          <Link className="btn quiet" href="/studio/settings">
            Settings
          </Link>
          {user!.role === 'ADMIN' && (
            <Link className="btn quiet" href="/studio/admin">
              Admin
            </Link>
          )}
          <Link className="btn" href="/studio/new">
            New {site.postTypes[0].label.toLowerCase()}
          </Link>
        </div>
      </div>

      {stats && (
        <div className="grid-2">
          {(
            [
              ['pieces (all sites)', stats.totalPosts],
              ['reads', stats.totalViews],
              ['saved by readers', stats.totalBookmarks],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="card">
              <div className="stat">{value}</div>
              <div className="meta">{label}</div>
            </div>
          ))}
        </div>
      )}

      {!posts ? (
        <p className="muted">Loading…</p>
      ) : !posts.length ? (
        <div className="card">
          <p>Nothing written yet. Your first piece is one click away.</p>
          <Link href="/write">Read the writer’s guide</Link>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Reads</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p._id}>
                  <td>
                    <Link href={`/studio/edit/${p.slug}`}>{p.title}</Link>
                  </td>
                  <td>
                    <StatusChip status={p.status} />
                    {p.scheduledAt && <div className="meta">{new Date(p.scheduledAt).toLocaleString()}</div>}
                  </td>
                  <td className="meta">{p.viewCount}</td>
                  <td className="meta">{formatDate(p.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {cursor && (
            <button type="button" className="btn quiet small" style={{ marginTop: '1rem' }} onClick={() => loadMore(cursor)}>
              Load more
            </button>
          )}
        </div>
      )}
    </div>
  );
}
