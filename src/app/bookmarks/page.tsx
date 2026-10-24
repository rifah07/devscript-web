'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { PostList } from '@/components/PostList';
import { RequireLogin } from '@/components/RequireLogin';
import { POST_CARD_FIELDS } from '@/lib/fields';
import { clientGql } from '@/lib/session';
import type { PostCard } from '@/lib/types';
import { SPACE } from '@/site/config';

export default function BookmarksPage() {
  return (
    <RequireLogin>
      <Link className="back" href="/studio">
        ← Studio
      </Link>
      <h1>Saved for later</h1>
      <Saved />
    </RequireLogin>
  );
}

function Saved() {
  const [posts, setPosts] = useState<PostCard[] | null>(null);
  useEffect(() => {
    void clientGql<{ myBookmarks: { posts: PostCard[] } }>(`{ myBookmarks { posts { ${POST_CARD_FIELDS} } } }`)
      // Bookmarks span both sites; show only this site's.
      .then((d) => setPosts(d.myBookmarks.posts.filter((p) => p.space === SPACE)))
      .catch(() => setPosts([]));
  }, []);
  return posts ? <PostList posts={posts} empty="Nothing saved yet." /> : <p className="muted">Loading…</p>;
}
