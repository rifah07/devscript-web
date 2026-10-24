import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Listing } from '@/components/listing/Listing';
import { getCategory } from '@/lib/queries';

export async function generateMetadata({ params }: PageProps<'/category/[slug]'>): Promise<Metadata> {
  const c = await getCategory((await params).slug);
  return c ? { title: c.name, description: c.description ?? undefined } : {};
}

export default function CategoryPage(props: PageProps<'/category/[slug]'>) {
  return (
    <Suspense>
      <Category {...props} />
    </Suspense>
  );
}

async function Category({ params, searchParams }: PageProps<'/category/[slug]'>) {
  const category = await getCategory((await params).slug);
  if (!category) notFound();
  return (
    <>
      <p className="kicker">category</p>
      <h1>{category.name}</h1>
      {category.description && <p className="muted">{category.description}</p>}
      <Listing filter={{ categoryId: category._id }} base={`/category/${category.slug}`} searchParams={searchParams} />
    </>
  );
}
