// One codebase, two sites. NEXT_PUBLIC_SPACE is fixed at build time, so each
// Vercel project bakes in exactly one of these and dead code drops out.
export type Space = 'DEVSCRIPT' | 'PERSONAL';
export type PostType = 'ARTICLE' | 'POEM' | 'REFLECTION' | 'NOTE';
export type ReactionType = 'LIKE' | 'HELPFUL' | 'INSPIRING' | 'BRILLIANT';

type SiteConfig = {
  space: Space;
  key: 'devscript' | 'misk';
  name: string;
  tagline: string;
  description: string;
  author: string;
  oauthState: 'devscript' | 'personal';
  feedSpace: 'devscript' | 'personal';
  postTypes: { type: PostType; label: string; path?: string }[];
  reactions: { type: ReactionType; label: string }[];
  nav: { href: string; label: string }[];
  defaultTheme: 'light' | 'dark';
  colors: { light: string; dark: string };
};

const DEVSCRIPT: SiteConfig = {
  space: 'DEVSCRIPT',
  key: 'devscript',
  name: 'DevScript',
  tagline: 'Writing about how backends actually work.',
  description: 'Backend engineering, security and the bugs that taught us something. Open to every developer who writes.',
  author: 'Rifah Sajida Deya',
  oauthState: 'devscript',
  feedSpace: 'devscript',
  postTypes: [
    { type: 'ARTICLE', label: 'Article' },
    { type: 'NOTE', label: 'Note' },
  ],
  reactions: [
    { type: 'LIKE', label: 'Like' },
    { type: 'HELPFUL', label: 'Helpful' },
    { type: 'INSPIRING', label: 'Inspiring' },
    { type: 'BRILLIANT', label: 'Brilliant' },
  ],
  nav: [
    { href: '/search', label: 'Search' },
    { href: '/write', label: 'Write' },
    { href: '/about', label: 'About' },
  ],
  defaultTheme: 'dark',
  colors: { light: '#FBFBFA', dark: '#0B0C0E' },
};

const MISK: SiteConfig = {
  space: 'PERSONAL',
  key: 'misk',
  name: 'The Misk Journal',
  tagline: 'Poems, reflections and quiet notes.',
  description: 'A calm, ad-free place to write and read poetry and reflections, in Bangla and English.',
  author: 'PP',
  oauthState: 'personal',
  feedSpace: 'personal',
  postTypes: [
    { type: 'POEM', label: 'Poem', path: '/poems' },
    { type: 'REFLECTION', label: 'Reflection', path: '/reflections' },
    { type: 'NOTE', label: 'Note', path: '/notes' },
  ],
  // Softer words for a poetry site; same reaction types underneath.
  reactions: [
    { type: 'LIKE', label: 'Felt this' },
    { type: 'INSPIRING', label: 'Stayed with me' },
  ],
  nav: [
    { href: '/poems', label: 'Poems' },
    { href: '/reflections', label: 'Reflections' },
    { href: '/notes', label: 'Notes' },
    { href: '/write', label: 'Write' },
  ],
  defaultTheme: 'light',
  colors: { light: '#F7F1E6', dark: '#15110E' },
};

export const SPACE: Space = process.env.NEXT_PUBLIC_SPACE === 'PERSONAL' ? 'PERSONAL' : 'DEVSCRIPT';
export const site: SiteConfig = SPACE === 'PERSONAL' ? MISK : DEVSCRIPT;
export const isMisk = SPACE === 'PERSONAL';
