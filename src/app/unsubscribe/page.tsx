import { TokenAction } from '@/components/TokenAction';

export const metadata = { title: 'Unsubscribe', robots: { index: false } };

export default function UnsubscribePage() {
  return (
    <>
      <h1>Newsletter</h1>
      <TokenAction
        mutation="unsubscribeFromNewsletter"
        done="You've been unsubscribed. You won't hear from us again. Thank you for reading."
        failed="This link has expired, or you're already unsubscribed."
      />
    </>
  );
}
