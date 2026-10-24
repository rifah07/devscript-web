'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { AuthForm } from '@/components/AuthForm';
import { rememberLogin, useLastLogin } from '@/lib/last-login';
import { clientGql, useSession } from '@/lib/session';
import { safeNext } from '@/lib/safe-next';
import type { Me } from '@/lib/types';
import { site } from '@/site/config';

const LOGIN = `mutation($i: LoginInput!){ login(loginInput:$i){ accessToken user{ _id name email emailVerified role } } }`;

function Login() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get('next'));
  const { signIn } = useSession();
  const last = useLastLogin();
  const lastUsed = <span className="last-used">last used</span>;

  return (
    <AuthForm
      title={<>Log in {last === 'email' && lastUsed}</>}
      submitLabel="Log in"
      fields={[
        { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
        { name: 'password', label: 'Password', type: 'password', autoComplete: 'current-password' },
      ]}
      onSubmit={async ({ email, password }) => {
        const { login } = await clientGql<{ login: { accessToken: string; user: Me } }>(LOGIN, {
          i: { email, password },
        });
        await signIn(login.accessToken, login.user);
        rememberLogin('email');
        router.replace(next);
      }}
      footer={
        <p className="muted">
          <a href={`/api/auth/google?state=${site.oauthState}`}>Continue with Google</a> {last === 'google' && lastUsed}
          <br />
          <Link href="/forgot-password">Forgot password?</Link> · <Link href="/register">Create an account</Link>
        </p>
      }
    />
  );
}

// useSearchParams reads the URL, so it must sit inside Suspense.
export default function LoginPage() {
  return (
    <Suspense>
      <Login />
    </Suspense>
  );
}
