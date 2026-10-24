'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { useSession } from '@/lib/session';

// Client-only gate for private pages. The API enforces access anyway; this
// only decides what to render and sends anonymous visitors to log in.
type Props = { children: React.ReactNode; admin?: boolean };

export function RequireLogin(props: Props) {
  return (
    <Suspense fallback={<p className="muted">Loading…</p>}>
      <Gate {...props} />
    </Suspense>
  );
}

function Gate({ children, admin }: Props) {
  const { user, ready } = useSession();
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (ready && !user) router.replace(`/login?next=${encodeURIComponent(path)}`);
  }, [ready, user, router, path]);

  if (!ready || !user) return <p className="muted">Loading…</p>;
  if (admin && user.role !== 'ADMIN') return <p>This area is for admins.</p>;
  return <>{children}</>;
}
