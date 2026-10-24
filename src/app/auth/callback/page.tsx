'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import { rememberLogin } from '@/lib/last-login';
import { useSession } from '@/lib/session';

// Google sends the browser here with a 60-second, single-use code. We trade
// it for tokens through our own /api proxy, so the refresh cookie is set on
// this site's domain. The code is useless a second time.
function Callback() {
  const code = useSearchParams().get('code');
  const router = useRouter();
  const { signIn } = useSession();
  const [error, setError] = useState('');
  const started = useRef(false); // StrictMode runs effects twice in dev

  useEffect(() => {
    if (!code || started.current) return;
    started.current = true;
    void fetch('/api/auth/google/exchange', {
      method: 'POST',
      credentials: 'include',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ code }),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('expired'))))
      .then((d: { accessToken: string }) => signIn(d.accessToken))
      .then(() => rememberLogin('google'))
      .then(() => router.replace('/'))
      .catch(() => setError('That sign-in link expired. Please try again.'));
  }, [code, router, signIn]);

  return <p role="status">{error || (code ? 'Signing you in…' : 'Missing sign-in code.')}</p>;
}

export default function AuthCallbackPage() {
  return (
    <Suspense>
      <Callback />
    </Suspense>
  );
}
