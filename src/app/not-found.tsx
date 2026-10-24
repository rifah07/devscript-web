import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <p className="kicker">404</p>
      <h1>Nothing at this address.</h1>
      <p className="muted">
        The post may have moved, or never existed. <Link href="/">Back to all posts</Link> or{' '}
        <Link href="/search">search</Link>.
      </p>
    </>
  );
}
