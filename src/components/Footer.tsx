import Link from 'next/link';
import { isMisk, site } from '@/site/config';

export function Footer() {
  return (
    <footer className="site-footer">
      <span>
        {site.name} · {isMisk ? 'free to read, always' : 'built in public by Rifah'}
      </span>
      <nav aria-label="Footer">
        <Link href="/about">About</Link>
        <Link href="/write">Write with us</Link>
        <Link href="/subscribe">Newsletter</Link>
        <a href="/rss.xml">RSS</a>
      </nav>
    </footer>
  );
}
