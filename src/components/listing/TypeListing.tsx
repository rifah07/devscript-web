import type { Metadata } from 'next';
import { site, type PostType } from '@/site/config';
import { onlyOn } from '@/site/only';
import { Listing } from './Listing';

const INTRO: Record<string, string> = {
  POEM: 'Lines that wanted to be said slowly.',
  REFLECTION: 'On faith, patience, and the small mercies of ordinary days.',
  NOTE: 'Short thoughts, kept before they fade.',
};

export const typeMetadata = (type: PostType): Metadata => ({
  title: site.postTypes.find((t) => t.type === type)?.label + 's',
});

// /poems, /reflections and /notes are the same page with a different filter.
export function TypeListing({ type, searchParams }: { type: PostType; searchParams: PageProps<'/'>['searchParams'] }) {
  onlyOn('PERSONAL');
  const config = site.postTypes.find((t) => t.type === type)!;
  return (
    <>
      <header style={{ textAlign: 'center' }}>
        <h1>{config.label}s</h1>
        <p className="kicker">{INTRO[type]}</p>
      </header>
      <Listing filter={{ postType: type }} base={config.path!} searchParams={searchParams} empty="Nothing here yet." />
    </>
  );
}
