import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PostList, Pager } from '@/components/PostList';
import { asCursor } from '@/lib/cursor';
import { searchPosts } from '@/lib/queries';

export const metadata: Metadata = { title: 'Search', robots: { index: false } };

// A plain GET form: works without JavaScript and the URL is shareable.
export default function SearchPage({ searchParams }: PageProps<'/search'>) {
  return (
    <>
      <h1>Search</h1>
      <Suspense>
        <SearchForm searchParams={searchParams} />
      </Suspense>
      <Suspense fallback={<p className="muted">Searching…</p>}>
        <Results searchParams={searchParams} />
      </Suspense>
    </>
  );
}

const queryOf = (v: string | string[] | undefined) => (typeof v === 'string' ? v.trim().slice(0, 100) : '');

async function SearchForm({ searchParams }: Pick<PageProps<'/search'>, 'searchParams'>) {
  return (
    <form className="search-form" action="/search" role="search">
      <label className="sr-only" htmlFor="q">
        Search
      </label>
      <input id="q" name="q" type="search" minLength={2} defaultValue={queryOf((await searchParams).q)} required />
      <button type="submit">Search</button>
    </form>
  );
}

async function Results({ searchParams }: Pick<PageProps<'/search'>, 'searchParams'>) {
  const params = await searchParams;
  const q = queryOf(params.q);
  if (q.length < 2) return <p className="muted">Search by a word from a title or the text, in Bangla or English.</p>;
  const cursor = asCursor(params.after);
  const page = await searchPosts(q, cursor);
  return (
    <>
      <PostList posts={page.items} empty={`Nothing matches “${q}”. Try a broader word.`} />
      <Pager base={`/search?q=${encodeURIComponent(q)}`} nextCursor={page.nextCursor} isFirst={!cursor} />
    </>
  );
}
