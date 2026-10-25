import { cacheLife, cacheTag } from 'next/cache';
import { ApiError, gql } from './api';
import { POST_CARD_FIELDS } from './fields';
import { SPACE, type PostType } from '@/site/config';
import type { Category, Page, PostCard, PostFull, PublicUser, Series } from './types';

// Public reads: anonymous, identical for every reader, so they're cached.
// Every query is scoped to this site's space: a Misk poem can never render
// on DevScript and vice versa (that would link the two identities).

const POST_CARD = POST_CARD_FIELDS;

type PostsResult = { posts: PostCard[]; nextCursor?: string; hasNextPage: boolean };
const toPage = (r: PostsResult): Page<PostCard> => ({
  items: r.posts,
  nextCursor: r.nextCursor,
  hasNextPage: r.hasNextPage,
});

// 404/400 from the API → null, which pages turn into notFound().
async function orNull<T>(load: () => Promise<T>): Promise<T | null> {
  try {
    return await load();
  } catch (e) {
    if (e instanceof ApiError && (e.code === 404 || e.code === 400)) return null;
    throw e;
  }
}

export async function getPosts(
  filter: { tag?: string; cursor?: string; postType?: PostType; authorId?: string; categoryId?: string } = {},
) {
  'use cache';
  cacheLife('minutes');
  cacheTag('posts');
  const data = await gql<{ posts: PostsResult }>(
    `query($f: PostsFilterInput){ posts(filter:$f){ posts{ ${POST_CARD} } nextCursor hasNextPage } }`,
    { f: { space: SPACE, ...filter } },
  );
  return toPage(data.posts);
}

export async function getPost(slug: string): Promise<PostFull | null> {
  'use cache';
  cacheLife('minutes');
  cacheTag('posts');
  const post = await orNull(async () =>
    (
      await gql<{ post: PostFull }>(
        `query($s: String!){ post(slug:$s){
          ${POST_CARD} body summary bodyFormat updatedAt ogTitle ogDescription ogImage
          coverImageVariants { landscape } coverImageUrl series { title slug } seriesOrder
          narrationUrl narrationDuration
          gallery { url publicId width height alt order downloadUrl variants { thumbnail landscape original } }
        } }`,
        { s: slug },
      )
    ).post,
  );
  return post && post.space === SPACE ? post : null;
}

export async function getRelated(postId: string) {
  'use cache';
  cacheLife('hours');
  cacheTag('posts');
  const data = await orNull(() =>
    gql<{ relatedPosts: PostCard[] }>(
      `query($id: ID!){ relatedPosts(postId:$id, limit:3){ ${POST_CARD} } }`,
      { id: postId },
    ),
  );
  return data?.relatedPosts ?? [];
}

export async function getTrendingTags() {
  'use cache';
  cacheLife('hours');
  const data = await gql<{ trendingTags: { tag: string; count: number }[] }>(
    `query($s: PostSpace!){ trendingTags(space:$s, limit:12){ tag count } }`,
    { s: SPACE },
  );
  return data.trendingTags;
}

export async function searchPosts(query: string, cursor?: string) {
  'use cache';
  cacheLife('minutes');
  const data = await gql<{ search: PostsResult }>(
    `query($i: SearchInput!){ search(input:$i){ posts{ ${POST_CARD} } nextCursor hasNextPage } }`,
    { i: { query, space: SPACE, cursor, limit: 10 } },
  );
  return toPage(data.search);
}

export async function getCategories(): Promise<Category[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('categories');
  const data = await gql<{ categories: Category[] }>(
    `query($s: PostSpace){ categories(space:$s){ _id name slug description postCount } }`,
    { s: SPACE },
  );
  return data.categories;
}

export async function getSeries(slug: string): Promise<Series | null> {
  'use cache';
  cacheLife('minutes');
  cacheTag('posts');
  const series = await orNull(async () =>
    (
      await gql<{ series: Series & { space: string } }>(
        `query($s: String!){ series(slug:$s){ _id title slug description postCount space
          author { _id name } posts { ${POST_CARD} } } }`,
        { s: slug },
      )
    ).series,
  );
  return series && series.space === SPACE ? series : null;
}

export async function getUser(id: string): Promise<PublicUser | null> {
  'use cache';
  cacheLife('hours');
  return orNull(async () =>
    (
      await gql<{ user: PublicUser }>(
        `query($id: ID!){ user(id:$id){ _id name bio avatarUrl website github leetcode twitter createdAt } }`,
        { id },
      )
    ).user,
  );
}

export async function getCategory(slug: string): Promise<Category | null> {
  'use cache';
  cacheLife('hours');
  cacheTag('categories');
  const c = await orNull(async () =>
    (
      await gql<{ category: Category & { space: string } }>(
        `query($s: String!){ category(slug:$s){ _id name slug description postCount space } }`,
        { s: slug },
      )
    ).category,
  );
  return c && c.space === SPACE ? c : null;
}
