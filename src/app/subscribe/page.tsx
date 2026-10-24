import type { Metadata } from 'next';
import { SubscribeForm } from '@/components/SubscribeForm';
import { site } from '@/site/config';

export const metadata: Metadata = { title: 'Newsletter' };

export default function SubscribePage() {
  return (
    <>
      <p className="kicker">newsletter</p>
      <h1>New writing, by email</h1>
      <p className="muted">
        One short email when something new appears on {site.name}. No tracking pixels, no other mail, and every email
        has a one-click unsubscribe.
      </p>
      <SubscribeForm />
    </>
  );
}
