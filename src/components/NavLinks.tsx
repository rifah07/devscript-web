'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Suspense } from 'react';
import { site } from '@/site/config';

// Reading the URL must sit in Suspense on dynamic routes; the fallback is
// the same links without the "current page" highlight, so nothing shifts.
export function NavLinks() {
  return (
    <Suspense fallback={<Links current="" />}>
      <CurrentLinks />
    </Suspense>
  );
}

function CurrentLinks() {
  return <Links current={usePathname()} />;
}

function Links({ current }: { current: string }) {
  return (
    <>
      {site.nav.map((item) => (
        <Link key={item.href} href={item.href} aria-current={current.startsWith(item.href) ? 'page' : undefined}>
          {item.label}
        </Link>
      ))}
    </>
  );
}
