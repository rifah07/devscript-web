'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { RequireLogin } from '@/components/RequireLogin';
import { formatDate } from '@/lib/format';
import { clientGql } from '@/lib/session';
import type { Notification } from '@/lib/types';
import { SPACE } from '@/site/config';

export default function NotificationsPage() {
  return (
    <RequireLogin>
      <Inbox />
    </RequireLogin>
  );
}

function Inbox() {
  const [items, setItems] = useState<Notification[] | null>(null);

  useEffect(() => {
    void clientGql<{ notifications: { notifications: Notification[] } }>(
      `{ notifications { notifications { _id type message isRead createdAt postSlug postSpace actor { _id name } } } }`,
    )
      // A notification about the other site's post would link nowhere here.
      .then((d) => setItems(d.notifications.notifications.filter((n) => !n.postSpace || n.postSpace === SPACE)))
      .catch(() => setItems([]));
  }, []);

  const markAll = async () => {
    await clientGql(`mutation { markAllNotificationsRead }`);
    setItems((list) => list?.map((n) => ({ ...n, isRead: true })) ?? null);
  };
  const open = (id: string) => void clientGql(`mutation($id: ID!){ markNotificationRead(id:$id) }`, { id });

  return (
    <>
      <div className="spread">
        <h1>Inbox</h1>
        <button type="button" className="btn quiet small" onClick={markAll}>
          Mark all read
        </button>
      </div>
      {!items ? (
        <p className="muted">Loading…</p>
      ) : !items.length ? (
        <p className="muted">All quiet. Nothing new.</p>
      ) : (
        <ul className="post-list">
          {items.map((n) => (
            <li key={n._id} style={{ opacity: n.isRead ? 0.65 : 1 }}>
              <p className="meta">
                <time dateTime={n.createdAt}>{formatDate(n.createdAt)}</time>
                {!n.isRead && <span className="chip live" style={{ marginLeft: '0.5rem' }}>new</span>}
              </p>
              {n.postSlug ? (
                <Link href={`/posts/${n.postSlug}`} onClick={() => open(n._id)}>
                  {n.message}
                </Link>
              ) : n.actor ? (
                <Link href={`/u/${n.actor._id}`} onClick={() => open(n._id)}>
                  {n.message}
                </Link>
              ) : (
                <p>{n.message}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
