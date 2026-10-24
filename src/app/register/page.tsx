'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthForm } from '@/components/AuthForm';
import { rememberLogin } from '@/lib/last-login';
import { clientGql, useSession } from '@/lib/session';
import type { Me } from '@/lib/types';
import { SPACE } from '@/site/config';

const REGISTER = `mutation($i: RegisterInput!){ register(registerInput:$i){ accessToken user{ _id name email emailVerified role } } }`;

export default function RegisterPage() {
  const router = useRouter();
  const { signIn } = useSession();
  return (
    <AuthForm
      title="Create an account"
      submitLabel="Create account"
      fields={[
        { name: 'name', label: 'Name', autoComplete: 'name' },
        { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
        { name: 'password', label: 'Password (8+ characters)', type: 'password', autoComplete: 'new-password', minLength: 8 },
      ]}
      onSubmit={async (i) => {
        const { register } = await clientGql<{ register: { accessToken: string; user: Me } }>(REGISTER, {
          i: { ...i, space: SPACE },
        });
        await signIn(register.accessToken, register.user);
        rememberLogin('email');
        router.replace('/');
      }}
      footer={
        <p className="muted">
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      }
    />
  );
}
