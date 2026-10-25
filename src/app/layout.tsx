import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Newsreader, Noto_Serif_Bengali } from 'next/font/google';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Scenery } from '@/components/Scenery';
import { VerifyBanner } from '@/components/VerifyBanner';
import { SessionProvider } from '@/lib/session';
import { site } from '@/site/config';
import './globals.css';

// Fonts are self-hosted by next/font (no request to Google at runtime).
// Both sites declare all four, but a browser only downloads a font that the
// page's CSS actually uses, so DevScript never fetches the serif and Misk
// never fetches Geist. preload must be a literal, so it's off for all; the
// generated fallback metrics keep layout shift near zero while fonts load.
const sans = Geist({ variable: '--font-sans', subsets: ['latin'], preload: false });
const mono = Geist_Mono({ variable: '--font-mono', subsets: ['latin'], preload: false });
const serif = Newsreader({ variable: '--font-serif', subsets: ['latin'], style: ['normal', 'italic'], preload: false });
const bangla = Noto_Serif_Bengali({ variable: '--font-bn', subsets: ['bengali'], preload: false });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: site.name, template: `%s · ${site.name}` },
  description: site.description,
  alternates: { types: { 'application/rss+xml': '/rss.xml' } },
  openGraph: { siteName: site.name, type: 'website' },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: site.colors.dark },
    { media: '(prefers-color-scheme: light)', color: site.colors.light },
  ],
};

// Runs before first paint, so the page never flashes the wrong theme. The
// only inline script on the site; it reads a UI preference, nothing secret.
// A saved theme only counts if this site offers it (Misk's Moonlit isn't a DevScript theme).
const themeIds = JSON.stringify(site.themes.map((t) => t.id));
const themeScript = `try{var t=localStorage.getItem('theme');document.documentElement.dataset.theme=${themeIds}.indexOf(t)>-1?t:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      data-site={site.key}
      data-theme={site.defaultTheme}
      className={`${sans.variable} ${mono.variable} ${serif.variable} ${bangla.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Scenery />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SessionProvider>
          <Header />
          <VerifyBanner />
          <main id="main">{children}</main>
        </SessionProvider>
        <Footer />
      </body>
    </html>
  );
}
