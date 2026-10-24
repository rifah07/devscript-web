'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { AuthForm } from '@/components/AuthForm';
import { clientGql } from '@/lib/session';

function Reset() {
  const token = useSearchParams().get('token') ?? '';
  if (!token) return <p>This link is incomplete. Ask for a new one from <Link href="/forgot-password">reset password</Link>.</p>;
  return (
    <AuthForm
      title="Choose a new password"
      submitLabel="Update password"
      fields={[{ name: 'newPassword', label: 'New password (8+ characters)', type: 'password', autoComplete: 'new-password', minLength: 8 }]}
      onSubmit={async ({ newPassword }) => {
        await clientGql(`mutation($i: ResetPasswordInput!){ resetPassword(input:$i) }`, {
          i: { token, newPassword },
        });
        return 'Password updated. You have been logged out everywhere; please log in again.';
      }}
      footer={<p className="muted"><Link href="/login">Go to log in</Link></p>}
    />
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <Reset />
    </Suspense>
  );
}
