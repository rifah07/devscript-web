import { cacheLife } from 'next/cache';

// The backend generates the XML (it knows every published post); we
// re-serve it from this domain so feeds and sitemaps live on the site.
export async function proxyFeed(path: string): Promise<Response> {
  const feed = await fetchFeed(path);
  return new Response(feed.body, {
    status: feed.status,
    headers: {
      'content-type': feed.type,
      'cache-control': 's-maxage=300, stale-while-revalidate=3600',
    },
  });
}

async function fetchFeed(path: string) {
  'use cache';
  cacheLife('minutes');
  const res = await fetch(`${process.env.BACKEND_URL}${path}`);
  return {
    body: await res.text(),
    status: res.status,
    type: res.headers.get('content-type') ?? 'text/plain',
  };
}
