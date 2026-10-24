import { Suspense } from 'react';
import { PostList, Pager } from '@/components/PostList';
import { asCursor } from '@/lib/cursor';
import { getPosts } from '@/lib/queries';
import type { PostType } from '@/site/config';

type Filter = { tag?: string; postType?: PostType; authorId?: string; categoryId?: string };

// The shared "a filtered list of posts with Older →" block used by home,
// tags, categories, poem/reflection/note pages and profiles.
export function Listing({
  filter,
  base,
  searchParams,
  empty,
}: {
  filter: Filter;
  base: string;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  empty?: string;
}) {
  return (
    <Suspense fallback={<p className="muted">Loading…</p>}>
      <ListingPage filter={filter} base={base} searchParams={searchParams} empty={empty} />
    </Suspense>
  );
}

async function ListingPage({
  filter,
  base,
  searchParams,
  empty,
}: {
  filter: Filter;
  base: string;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  empty?: string;
}) {
  const cursor = asCursor((await searchParams).after);
  const page = await getPosts({ ...filter, cursor });
  return (
    <>
      <PostList posts={page.items} empty={empty} />
      <Pager base={base} nextCursor={page.nextCursor} isFirst={!cursor} />
    </>
  );
}
