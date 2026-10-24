import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { AskArticle } from '@/components/post/AskArticle';
import { BookmarkButton } from '@/components/post/BookmarkButton';
import { CommentThread } from '@/components/post/CommentThread';
import { PhotoEssay } from '@/components/post/PhotoEssay';
import { ReactionBar } from '@/components/post/ReactionBar';
import { ReportButton } from '@/components/post/ReportButton';
import { PostBody } from '@/components/PostBody';
import { PostList, TagList } from '@/components/PostList';
import { ViewTracker } from '@/components/ViewTracker';
import { formatDate } from '@/lib/format';
import { langOf } from '@/lib/lang';
import { getPost, getRelated } from '@/lib/queries';
import type { PostFull } from '@/lib/types';
import { isMisk, site } from '@/site/config';

export async function generateMetadata({ params }: PageProps<'/posts/[slug]'>): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return {};
  const title = post.ogTitle || post.title;
  const description = post.ogDescription || post.excerpt;
  const image = post.ogImage || post.coverImageVariants?.landscape;
  return {
    title,
    description,
    alternates: { canonical: `/posts/${post.slug}` },
    openGraph: { type: 'article', title, description, images: image ? [image] : [] },
    twitter: { card: image ? 'summary_large_image' : 'summary', title, description },
  };
}

export default function PostPage({ params }: PageProps<'/posts/[slug]'>) {
  return (
    <Suspense fallback={<p className="muted">Loading…</p>}>
      <Article params={params} />
    </Suspense>
  );
}

async function Article({ params }: Pick<PageProps<'/posts/[slug]'>, 'params'>) {
  const post = await getPost((await params).slug);
  // Drafts, missing posts and the other site's posts all look the same: 404.
  if (!post) notFound();

  return (
    <article lang={langOf(post.title)}>
      <JsonLd post={post} />
      <header className="article-header">
        {post.series && (
          <p className="kicker">
            <Link href={`/series/${post.series.slug}`}>{post.series.title}</Link>
            {post.seriesOrder ? ` · part ${post.seriesOrder}` : ''}
          </p>
        )}
        <h1>{post.title}</h1>
        <p className="meta">
          {post.author && <Link href={`/u/${post.author._id}`}>{post.author.name}</Link>}
          {' · '}
          <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
          {' · '}
          {post.readTime} min {isMisk ? 'to read' : 'read'}
        </p>
        <TagList tags={post.tags} />
      </header>

      {post.coverImageVariants && !isMisk && (
        // eslint-disable-next-line @next/next/no-img-element -- Cloudinary already sizes and formats
        <img className="cover" src={post.coverImageVariants.landscape} alt="" width={1200} height={630} fetchPriority="high" />
      )}

      {post.summary && !isMisk && (
        <aside className="summary-box" aria-label="Summary">
          <span className="kicker">tl;dr · </span>
          {post.summary}
        </aside>
      )}

      {post.narrationUrl && (
        <figure style={{ margin: '0 0 2rem', textAlign: 'center' }}>
          <figcaption className="meta" style={{ marginBottom: '0.5rem' }}>
            Listen{post.narrationDuration ? ` · about ${Math.ceil(post.narrationDuration / 60)} min` : ''}
          </figcaption>
          <audio controls preload="none" src={post.narrationUrl} style={{ width: '100%' }} />
        </figure>
      )}

      <PostBody body={post.body} format={post.bodyFormat} />
      <PhotoEssay images={post.gallery} />
      <ViewTracker postId={post._id} />

      <div className="post-actions">
        <ReactionBar targetId={post._id} />
        <div className="row">
          <BookmarkButton postId={post._id} />
          <ReportButton targetId={post._id} targetType="POST" />
        </div>
      </div>

      {!isMisk && (
        <div style={{ marginTop: '2.5rem' }}>
          <AskArticle postId={post._id} />
        </div>
      )}

      <Suspense>
        <Related postId={post._id} />
      </Suspense>
      <CommentThread postId={post._id} />
    </article>
  );
}

async function Related({ postId }: { postId: string }) {
  const posts = await getRelated(postId);
  if (!posts.length) return null;
  return (
    <section className="related" aria-labelledby="related">
      <h2 id="related" className="kicker">
        {isMisk ? 'you may also sit with' : 'read next'}
      </h2>
      <PostList posts={posts} />
    </section>
  );
}

// Structured data for search engines. JSON in a script tag is the one safe
// use of an inline script: "<" is escaped so the post's text can't close the
// tag and inject HTML.
function JsonLd({ post }: { post: PostFull }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': isMisk ? 'CreativeWork' : 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    author: post.author ? { '@type': 'Person', name: post.author.name } : undefined,
    publisher: { '@type': 'Organization', name: site.name },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
