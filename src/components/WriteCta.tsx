'use client';

import Link from 'next/link';
import { useSession } from '@/lib/session';

// Signed-in writers go straight to a new piece; everyone else signs up first.
export function WriteCta({ className, label, style }: { className: string; label: string; style?: React.CSSProperties }) {
  const { user, ready } = useSession();
  // Same-size placeholder while the session loads: no flash of the wrong button.
  if (!ready)
    return (
      <span className={className} style={{ ...style, visibility: 'hidden' }} aria-hidden>
        {label}
      </span>
    );
  return (
    <Link className={className} href={user ? '/studio/new' : '/register'} style={style}>
      {user ? 'Start a new piece' : label}
    </Link>
  );
}
