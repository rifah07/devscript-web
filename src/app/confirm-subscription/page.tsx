import { TokenAction } from '@/components/TokenAction';

export const metadata = { title: 'Confirm subscription', robots: { index: false } };

export default function ConfirmPage() {
  return (
    <>
      <h1>Newsletter</h1>
      <TokenAction
        mutation="confirmSubscription"
        done="You're subscribed. Thank you for reading."
        failed="This link has expired or was already used."
      />
    </>
  );
}
