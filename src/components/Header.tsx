import Link from 'next/link';
import { isMisk, site } from '@/site/config';
import { NavLinks } from './NavLinks';
import { SessionNav } from './SessionNav';
import { ThemeMenu } from './ThemeMenu';

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
      <div className="header-end">
        <nav className="site-nav" aria-label="Main">
          <NavLinks />
          <SessionNav />
        </nav>
        <ThemeMenu />
      </div>
    </header>
  );
}
