'use client';

import { useEffect, useState } from 'react';
import { clientGql, useSession } from '@/lib/session';
import { useLoginGate } from '@/lib/use-login-gate';

export function BookmarkButton({ postId }: { postId: string }) {
  const { user } = useSession();
  const ensureLogin = useLoginGate();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    void clientGql<{ isBookmarked: boolean }>(`query($p: ID!){ isBookmarked(postId:$p) }`, { p: postId })
      .then((d) => setSaved(d.isBookmarked))
      .catch(() => undefined);
  }, [postId, user]);

  const toggle = async () => {
    if (!ensureLogin()) return;
    setSaved(!saved);
    try {
      const d = await clientGql<{ toggleBookmark: boolean }>(`mutation($p: ID!){ toggleBookmark(postId:$p) }`, { p: postId });
      setSaved(d.toggleBookmark);
    } catch {
      setSaved(saved);
    }
  };
  // Logged out: always shown as not saved (no stale state after logout).
  const shown = !!user && saved;

  return (
    <button type="button" className="toggle" aria-pressed={shown} onClick={() => void toggle()}>
      <span className="pip" aria-hidden />
      {shown ? 'Saved' : 'Save for later'}
    </button>
  );
}
