'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import { clientGql, useSession } from '@/lib/session';

// Pages opened from an email link with ?token=: run one mutation once and
// say how it went. Used by confirm-subscription, unsubscribe and verify-email.
type Props = { mutation: string; done: string; failed: string; reloadSession?: boolean };

function Run({ mutation, done, failed, reloadSession }: Props) {
  const { reload } = useSession();
  const token = useSearchParams().get('token');
  const [message, setMessage] = useState(token ? 'One moment…' : failed);
  const ran = useRef(false); // StrictMode runs effects twice in dev

  useEffect(() => {
    if (ran.current || !token) return;
    ran.current = true;
    clientGql(`mutation($t: String!){ ${mutation}(token:$t) }`, { t: token })
      .then(() => setMessage(done))
      .then(() => (reloadSession ? reload().catch(() => undefined) : undefined)) // logged out is fine
      .catch(() => setMessage(failed));
  }, [token, mutation, done, failed, reloadSession, reload]);

  return <p role="status">{message}</p>;
}

export function TokenAction(props: Props) {
  return (
    <Suspense>
      <Run {...props} />
    </Suspense>
  );
}
