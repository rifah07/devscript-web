import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Listing } from '@/components/listing/Listing';

export async function generateMetadata({ params }: PageProps<'/tags/[tag]'>): Promise<Metadata> {
  return { title: `#${decodeURIComponent((await params).tag)}` };
}

export default function TagPage(props: PageProps<'/tags/[tag]'>) {
  return (
    <Suspense>
      <Tag {...props} />
    </Suspense>
  );
}

async function Tag({ params, searchParams }: PageProps<'/tags/[tag]'>) {
  const tag = decodeURIComponent((await params).tag);
  return (
    <>
      <p className="kicker">tag</p>
      <h1>#{tag}</h1>
      <Listing filter={{ tag }} base={`/tags/${encodeURIComponent(tag)}`} searchParams={searchParams} />
    </>
  );
}
