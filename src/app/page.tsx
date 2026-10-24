import Link from 'next/link';
import { Suspense } from 'react';
import { Khatam } from '@/components/art/Khatam';
import { SignalField } from '@/components/art/SignalField';
import { Listing } from '@/components/listing/Listing';
import { SubscribeForm } from '@/components/SubscribeForm';
import { getTrendingTags } from '@/lib/queries';
import { isMisk, site } from '@/site/config';

export default function Home({ searchParams }: PageProps<'/'>) {
  return isMisk ? (
    <>
      <header style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <Khatam />
        <h1 style={{ margin: 0 }}>{site.name}</h1>
        <p className="kicker" style={{ marginTop: '0.6rem' }}>
          {site.tagline}
        </p>
      </header>
      <Listing filter={{}} base="/" searchParams={searchParams} empty="The first poem is still being written." />
      <section className="rule" style={{ textAlign: 'center', paddingTop: '2.5rem' }}>
        <p className="kicker">new pieces, by letter</p>
        <p className="muted">One quiet email when something new is written. Never anything else.</p>
        <SubscribeForm />
      </section>
    </>
  ) : (
    <>
      <SignalField />
      <p className="kicker">backend · security · systems · ai</p>
      <h1 style={{ margin: '0.4rem 0 0.8rem' }}>{site.tagline}</h1>
      <p className="muted" style={{ maxWidth: '34rem' }}>
        {site.description}
      </p>
      <div className="row" style={{ marginTop: '1.4rem' }}>
        <Link className="btn" href="/write">
          Write with us
        </Link>
        <Link className="btn quiet" href="/projects">
          See the projects
        </Link>
      </div>
      <Listing filter={{}} base="/" searchParams={searchParams} empty="No articles yet. Be the first to write one." />
      <Suspense>
        <Topics />
      </Suspense>
    </>
  );
}

async function Topics() {
  const tags = await getTrendingTags();
  if (!tags.length) return null;
  return (
    <section className="related" aria-labelledby="topics">
      <h2 id="topics" className="kicker">
        topics
      </h2>
      <ul className="tags">
        {tags.map((t) => (
          <li key={t.tag}>
            <Link href={`/tags/${encodeURIComponent(t.tag)}`}>
              #{t.tag} <span className="muted">{t.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
