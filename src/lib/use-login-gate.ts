'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useSession } from './session';

// Returns ensureLogin(): true if logged in; otherwise sends the reader to log
// in (and back here afterwards) and returns false. Use at the top of a
// handler:  if (!ensureLogin()) return;
export function useLoginGate() {
  const { user } = useSession();
  const router = useRouter();
  const path = usePathname();
  return () => {
    if (user) return true;
    router.push(`/login?next=${encodeURIComponent(path)}`);
    return false;
  };
}
