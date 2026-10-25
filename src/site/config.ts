// One codebase, two sites. NEXT_PUBLIC_SPACE is fixed at build time, so each
// Vercel project bakes in exactly one of these and dead code drops out.
export type Space = 'DEVSCRIPT' | 'PERSONAL';
export type PostType = 'ARTICLE' | 'POEM' | 'REFLECTION' | 'NOTE';
export type ReactionType = 'LIKE' | 'HELPFUL' | 'INSPIRING' | 'BRILLIANT';

// A theme is a set of colour tokens in globals.css ([data-theme='id']); some
// also paint a scene behind the page (components/Scenery.tsx).
export type Scene = 'meadow' | 'moonlit' | 'earth' | 'summer';
export type Theme = { id: string; label: string; hint: string; swatch: string; scene?: Scene };

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
  themes: Theme[];
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
  themes: [
    { id: 'dark', label: 'Terminal', hint: 'Green on black', swatch: 'linear-gradient(135deg, #0b0c0e 55%, #4ade9a 55%)' },
    { id: 'light', label: 'Paper', hint: 'Plain and bright', swatch: 'linear-gradient(135deg, #fbfbfa 55%, #0f7a4b 55%)' },
    { id: 'earth', label: 'Earth', hint: 'Clay, sand and contour lines', swatch: 'linear-gradient(135deg, #efe4d2 0 40%, #c27a4a 40% 70%, #5b6b3a 70%)', scene: 'earth' },
    { id: 'summer', label: 'Summer', hint: 'Big clouds over green hills, painted by hand', swatch: 'linear-gradient(180deg, #7db6e3 0 40%, #f4f8fb 40% 55%, #86bc63 55%)', scene: 'summer' },
  ],
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
  themes: [
    { id: 'light', label: 'Paper', hint: 'Warm, like a notebook', swatch: 'linear-gradient(135deg, #f7f1e6 55%, #a4574b 55%)' },
    { id: 'dark', label: 'Ink', hint: 'Lamplight on dark paper', swatch: 'linear-gradient(135deg, #15110e 55%, #c98476 55%)' },
    { id: 'summer', label: 'Summer', hint: 'Big clouds over green hills, painted by hand', swatch: 'linear-gradient(180deg, #7db6e3 0 40%, #f4f8fb 40% 55%, #86bc63 55%)', scene: 'summer' },
    { id: 'meadow', label: 'Meadow', hint: 'Hills, trees, a pond and a river', swatch: 'linear-gradient(180deg, #dbeaf0 0 45%, #b8d4a8 45% 75%, #7fa774 75%)', scene: 'meadow' },
    { id: 'moonlit', label: 'Moonlit', hint: 'Stars, a moon and the sea at night', swatch: 'radial-gradient(circle at 70% 30%, #f6e7b0 0 14%, transparent 15%), linear-gradient(180deg, #0b1430 60%, #1d3b6b 60%)', scene: 'moonlit' },
  ],
};

export const SPACE: Space = process.env.NEXT_PUBLIC_SPACE === 'PERSONAL' ? 'PERSONAL' : 'DEVSCRIPT';
export const site: SiteConfig = SPACE === 'PERSONAL' ? MISK : DEVSCRIPT;
export const isMisk = SPACE === 'PERSONAL';
