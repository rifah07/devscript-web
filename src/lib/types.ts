// Hand-written from devscript-api/src/schema.gql. Only fields we select.
import type { PostType, ReactionType, Space } from '@/site/config';

export type PublicUser = {
  _id: string;
  name: string;
  bio?: string | null;
  avatarUrl?: string | null;
  website?: string | null;
  github?: string | null;
  leetcode?: string | null;
  twitter?: string | null;
  createdAt?: string;
};

export type Me = PublicUser & { email: string; role: 'USER' | 'ADMIN'; plan: 'FREE' | 'PREMIUM'; emailVerified: boolean };

export type Category = { _id: string; name: string; slug: string; description?: string | null; postCount?: number };

export type PostCard = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  tags: string[];
  readTime: number;
  createdAt: string;
  postType: PostType;
  space: Space;
  category?: { name: string; slug: string } | null;
  author?: PublicUser | null;
};

export type GalleryImage = {
  url: string;
  publicId: string;
  width: number;
  height: number;
  alt?: string | null;
  order: number;
  downloadUrl: string;
  variants: { thumbnail: string; landscape: string; original: string };
};

export type PostFull = PostCard & {
  body: string;
  summary?: string | null;
  bodyFormat: 'MARKDOWN' | 'PLAINTEXT';
  updatedAt: string;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  coverImageVariants?: { landscape: string } | null;
  series?: { title: string; slug: string } | null;
  seriesOrder?: number | null;
  narrationUrl?: string | null;
  narrationDuration?: number | null;
  gallery: GalleryImage[];
};

// What the Studio editor loads (own posts, any status).
export type EditablePost = PostFull & {
  status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED';
  scheduledAt?: string | null;
  viewCount: number;
  bookmarksCount: number;
  category?: (Category & { _id: string }) | null;
  series?: { _id: string; title: string; slug: string } | null;
};

export type Series = {
  _id: string;
  title: string;
  slug: string;
  description?: string | null;
  postCount: number;
  author?: PublicUser | null;
  posts?: PostCard[] | null;
};

export type Comment = {
  _id: string;
  body: string;
  isDeleted: boolean;
  createdAt: string;
  author?: PublicUser | null;
  replies?: Comment[] | null;
};

export type Reaction = { type: ReactionType; count: number; userReacted: boolean };

export type Notification = {
  _id: string;
  type: string;
  message?: string | null;
  isRead: boolean;
  createdAt: string;
  postSlug?: string | null;
  postSpace?: Space | null;
  actor?: PublicUser | null;
};

export type Page<T> = { items: T[]; nextCursor?: string | null; hasNextPage: boolean };
