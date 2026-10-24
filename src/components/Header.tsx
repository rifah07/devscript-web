import Link from 'next/link';
import { isMisk, site } from '@/site/config';
import { NavLinks } from './NavLinks';
import { SessionNav } from './SessionNav';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  return (
    <header className="site-header">
      <Link href="/" className="logo" aria-label={`${site.name}, home`}>
        {isMisk ? (
          site.name
        ) : (
          <>
            dev<span>script</span>
          </>
        )}
      </Link>
      <nav className="site-nav" aria-label="Main">
        <NavLinks />
        <SessionNav />
        <ThemeToggle />
      </nav>
    </header>
  );
}
