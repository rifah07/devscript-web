import { TokenAction } from '@/components/TokenAction';

export const metadata = { title: 'Confirm email', robots: { index: false } };

export default function VerifyEmailPage() {
  return (
    <>
      <h1>Your email</h1>
      <TokenAction
        mutation="verifyEmail"
        done="Confirmed. You can publish, comment and upload now."
        failed="This link has expired or was already used. Log in and send a new one from the banner."
        reloadSession
      />
    </>
  );
}
