'use client';

import { AuthForm } from '@/components/AuthForm';
import { clientGql } from '@/lib/session';
import { SPACE } from '@/site/config';

export default function ForgotPasswordPage() {
  return (
    <AuthForm
      title="Reset your password"
      submitLabel="Send reset link"
      fields={[{ name: 'email', label: 'Email', type: 'email', autoComplete: 'email' }]}
      onSubmit={async ({ email }) => {
        await clientGql(`mutation($i: ForgotPasswordInput!){ forgotPassword(input:$i) }`, {
          i: { email, space: SPACE },
        });
        // Same message whether or not the account exists (no enumeration).
        return 'If that email has an account, a reset link is on its way. It expires in 1 hour.';
      }}
    />
  );
}
