'use client';

import { useState } from 'react';
import { clientGql, useSession } from '@/lib/session';
import { SPACE } from '@/site/config';

// The server allows 3 resends a minute; one per click with a "sent" state
// keeps honest users well under that.
export function ResendButton() {
  const [state, setState] = useState<'idle' | 'busy' | 'sent' | string>('idle');

  async function send() {
    setState('busy');
    try {
      await clientGql(`mutation($s: PostSpace!){ resendVerificationEmail(space:$s) }`, { s: SPACE });
      setState('sent');
    } catch (err) {
      setState((err as Error).message);
    }
  }

  if (state === 'sent') return <span role="status">Sent. Check your inbox, and the spam folder too.</span>;
  return (
    <>
      <button type="button" className="link-button verify-resend" disabled={state === 'busy'} onClick={() => void send()}>
        {state === 'busy' ? 'Sending…' : 'Send the link again'}
      </button>
      {state !== 'idle' && state !== 'busy' && (
        <span className="error" role="alert">
          {state}
        </span>
      )}
    </>
  );
}

// Stays on every page until the address is confirmed: an unverified account
// can read but not publish, comment or upload, so this explains why.
export function VerifyBanner() {
  const { user } = useSession();
  if (!user || user.emailVerified) return null;

  return (
    <aside className="verify-banner" aria-label="Email not confirmed">
      <span className="verify-dot" aria-hidden="true" />
      <span>
        Confirm <strong>{user.email}</strong> to publish, comment and upload.
      </span>
      <ResendButton />
    </aside>
  );
}
