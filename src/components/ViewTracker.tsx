'use client';

import { useEffect } from 'react';
import { clientGql } from '@/lib/session';

// Counts a view after 3 s on the page, once per post per tab session.
// The backend derives who is viewing from the token (or a daily hash for
// anonymous readers); we never send an id.
export function ViewTracker({ postId }: { postId: string }) {
  useEffect(() => {
    const key = `viewed:${postId}`;
    if (sessionStorage.getItem(key)) return;
    const timer = setTimeout(() => {
      sessionStorage.setItem(key, '1');
      void clientGql(`mutation($p: ID!){ recordPostView(postId:$p) }`, { p: postId }).catch(() => undefined);
    }, 3000);
    return () => clearTimeout(timer);
  }, [postId]);
  return null;
}
