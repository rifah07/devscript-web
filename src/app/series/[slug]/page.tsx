import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { PostList } from '@/components/PostList';
import { getSeries } from '@/lib/queries';

export async function generateMetadata({ params }: PageProps<'/series/[slug]'>): Promise<Metadata> {
  const s = await getSeries((await params).slug);
  return s ? { title: s.title, description: s.description ?? undefined } : {};
}

export default function SeriesPage({ params }: PageProps<'/series/[slug]'>) {
  return (
    <Suspense>
      <SeriesView params={params} />
    </Suspense>
  );
}

async function SeriesView({ params }: Pick<PageProps<'/series/[slug]'>, 'params'>) {
  const series = await getSeries((await params).slug);
  if (!series) notFound();
  return (
    <>
      <p className="kicker">a series · {series.postCount} parts</p>
      <h1>{series.title}</h1>
      {series.description && <p className="muted">{series.description}</p>}
      <PostList posts={series.posts ?? []} empty="Parts are on their way." />
    </>
  );
}
