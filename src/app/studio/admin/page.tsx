'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { RequireLogin } from '@/components/RequireLogin';
import { formatDate } from '@/lib/format';
import { clientGql } from '@/lib/session';
import type { Category } from '@/lib/types';
import { SPACE } from '@/site/config';

const TABS = ['Overview', 'Reports', 'Categories', 'Users'] as const;
type Tab = (typeof TABS)[number];

// Admin tools. The API checks the ADMIN role on every call; this page only
// hides the screens from everyone else.
export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('Overview');
  return (
    <RequireLogin admin>
      <div className="wide">
        <Link className="back" href="/studio">
          ← Studio
        </Link>
        <p className="kicker">studio · admin</p>
        <h1>Admin</h1>
        <div className="tabs" role="tablist">
          {TABS.map((t) => (
            <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </div>
        {tab === 'Overview' && <Overview />}
        {tab === 'Reports' && <Reports />}
        {tab === 'Categories' && <Categories />}
        {tab === 'Users' && <Users />}
      </div>
    </RequireLogin>
  );
}

// Small hook: load once, expose data plus a reload function.
function useLoad<T>(query: string, variables: Record<string, unknown> = {}) {
  const [data, setData] = useState<T | null>(null);
  const key = JSON.stringify(variables);
  const load = () => void clientGql<T>(query, JSON.parse(key) as Record<string, unknown>).then(setData).catch(() => undefined);
  useEffect(load, [query, key]);
  return [data, load] as const;
}

function Overview() {
  const [d] = useLoad<{ platformStats: Record<string, number> }>(
    `{ platformStats { totalUsers totalPosts totalComments totalReactions totalBookmarks newUsersThisMonth newPostsThisMonth pendingReports } }`,
  );
  if (!d) return <p className="muted">Loading…</p>;
  return (
    <div className="grid-2">
      {Object.entries(d.platformStats).map(([k, v]) => (
        <div key={k} className="card">
          <div className="stat">{v}</div>
          <div className="meta">{k.replace(/([A-Z])/g, ' $1').toLowerCase()}</div>
        </div>
      ))}
    </div>
  );
}

type Report = {
  _id: string;
  reason: string;
  description?: string;
  targetId: string;
  targetType: string;
  status: string;
  createdAt: string;
  reporter?: { name: string };
};

function Reports() {
  const [d, reload] = useLoad<{ adminReports: { reports: Report[] } }>(
    `query($s: ReportStatus){ adminReports(status:$s){ reports { _id reason description targetId targetType status createdAt reporter { name } } } }`,
    { s: 'PENDING' },
  );
  const review = async (reportId: string, status: string) => {
    await clientGql(`mutation($i: ReviewReportInput!){ reviewReport(input:$i){ _id } }`, { i: { reportId, status } });
    reload();
  };
  const removeTarget = async (r: Report) => {
    if (!confirm(`Delete this ${r.targetType.toLowerCase()}?`)) return;
    const field = r.targetType === 'POST' ? 'adminDeletePost(postId:$id)' : 'adminDeleteComment(commentId:$id)';
    await clientGql(`mutation($id: ID!){ ${field} }`, { id: r.targetId });
    await review(r._id, 'RESOLVED');
  };
  if (!d) return <p className="muted">Loading…</p>;
  if (!d.adminReports.reports.length) return <p className="muted">No pending reports.</p>;
  return (
    <table className="table">
      <thead>
        <tr>
          <th>When</th>
          <th>What</th>
          <th>Why</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {d.adminReports.reports.map((r) => (
          <tr key={r._id}>
            <td className="meta">{formatDate(r.createdAt)}</td>
            <td>
              {r.targetType.toLowerCase()} <span className="meta">{r.targetId}</span>
            </td>
            <td>
              {r.reason.toLowerCase()}
              {r.description && <div className="meta">{r.description}</div>}
            </td>
            <td className="row">
              {r.targetType !== 'USER' && (
                <button type="button" className="btn danger small" onClick={() => void removeTarget(r)}>
                  Remove
                </button>
              )}
              <button type="button" className="btn quiet small" onClick={() => void review(r._id, 'DISMISSED')}>
                Dismiss
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Categories() {
  const [d, reload] = useLoad<{ categories: Category[] }>(`query($s: PostSpace){ categories(space:$s){ _id name slug description postCount } }`, {
    s: SPACE,
  });
  const [error, setError] = useState('');

  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      await clientGql(`mutation($i: CreateCategoryInput!){ createCategory(input:$i){ _id } }`, {
        i: { name: data.get('name'), description: data.get('description') || undefined, space: SPACE },
      });
      form.reset();
      setError('');
      reload();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div className="stack">
      <form className="card form" onSubmit={create}>
        <label>
          New category
          <input name="name" required maxLength={50} />
        </label>
        <label>
          Description (optional)
          <input name="description" maxLength={200} />
        </label>
        <p className="error">{error}</p>
        <div>
          <button type="submit">Add category</button>
        </div>
      </form>
      {d?.categories.map((c) => (
        <div key={c._id} className="spread card">
          <div>
            <Link href={`/category/${c.slug}`}>{c.name}</Link> <span className="meta">{c.postCount} posts</span>
          </div>
          <button
            type="button"
            className="btn danger small"
            onClick={() => confirm(`Delete “${c.name}”?`) && void clientGql(`mutation($id: ID!){ deleteCategory(id:$id) }`, { id: c._id }).then(reload)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

type AdminUser = { _id: string; name: string; email: string; role: string; plan: string; isActive?: boolean; createdAt: string };

function Users() {
  const [search, setSearch] = useState('');
  const [d, reload] = useLoad<{ adminUsers: { users: AdminUser[] } }>(
    `query($f: AdminUsersFilterInput){ adminUsers(filter:$f){ users { _id name email role plan createdAt } } }`,
    { f: { search: search || undefined } },
  );
  const act = (mutation: string, userId: string) => void clientGql(`mutation($u: ID!){ ${mutation}(userId:$u){ _id } }`, { u: userId }).then(reload);

  return (
    <div className="stack">
      <input placeholder="Search name or email" value={search} onChange={(e) => setSearch(e.target.value)} />
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role · plan</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {d?.adminUsers.users.map((u) => (
            <tr key={u._id}>
              <td>
                <Link href={`/u/${u._id}`}>{u.name}</Link>
              </td>
              <td className="meta">{u.email}</td>
              <td className="meta">
                {u.role.toLowerCase()} · {u.plan.toLowerCase()}
              </td>
              <td className="row">
                <button type="button" className="btn quiet small" onClick={() => act('deactivateUser', u._id)}>
                  Deactivate
                </button>
                <button type="button" className="btn quiet small" onClick={() => act('activateUser', u._id)}>
                  Activate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
