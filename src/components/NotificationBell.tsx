'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { clientGql } from '@/lib/session';

const POLL_MS = 60_000;

// Polls the unread count, but only while the tab is visible: a backgrounded
// tab makes zero requests.
export function NotificationBell() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    const load = () =>
      clientGql<{ unreadNotificationsCount: number }>(`{ unreadNotificationsCount }`)
        .then((d) => setCount(d.unreadNotificationsCount))
        .catch(() => undefined);
    const sync = () => {
      clearInterval(timer);
      if (document.visibilityState === 'visible') {
        void load();
        timer = setInterval(load, POLL_MS);
      }
    };
    sync();
    document.addEventListener('visibilitychange', sync);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  return (
    <Link href="/notifications" aria-label={`Notifications${count ? `, ${count} unread` : ''}`}>
      Inbox {count > 0 && <span className="badge">{count > 99 ? '99+' : count}</span>}
    </Link>
  );
}
