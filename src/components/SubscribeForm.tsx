'use client';

import { useState } from 'react';
import { clientGql } from '@/lib/session';
import { SPACE } from '@/site/config';

// Double opt-in: nothing is sent until the reader confirms by email.
export function SubscribeForm() {
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    try {
      await clientGql(`mutation($i: SubscribeInput!){ subscribeToNewsletter(input:$i) }`, {
        i: { email: new FormData(e.currentTarget).get('email'), space: SPACE },
      });
      setMessage('Check your inbox to confirm. Nothing arrives until you do.');
    } catch (err) {
      setMessage((err as { code?: number }).code === 409 ? "You're already subscribed. Thank you." : (err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (message) return <p role="status" className="notice">{message}</p>;
  return (
    <form className="search-form" onSubmit={submit}>
      <label className="sr-only" htmlFor="sub-email">
        Email
      </label>
      <input id="sub-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
      <button type="submit" disabled={busy}>
        {busy ? '…' : 'Subscribe'}
      </button>
    </form>
  );
}
