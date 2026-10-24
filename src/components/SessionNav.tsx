'use client';

import Link from 'next/link';
import { useSession } from '@/lib/session';
import { NotificationBell } from './NotificationBell';

export function SessionNav() {
  const { user, ready } = useSession();
  // Fixed-width placeholder while the session loads: no layout shift.
  if (!ready) return <span style={{ minWidth: '4.5rem' }} aria-hidden />;
  if (!user) return <Link href="/login">Log in</Link>;
  return (
    <>
      <Link href="/studio">Studio</Link>
      <NotificationBell />
    </>
  );
}
