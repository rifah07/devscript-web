'use client';

import { useEffect, useState } from 'react';
import { clientGql, useSession } from '@/lib/session';
import { useLoginGate } from '@/lib/use-login-gate';

type Stats = { followersCount: number; followingCount: number; isFollowing: boolean };

export function FollowButton({ userId }: { userId: string }) {
  const { user, ready } = useSession();
  const ensureLogin = useLoginGate();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (!ready) return;
    void clientGql<{ followStats: Stats }>(
      `query($u: ID!){ followStats(userId:$u){ followersCount followingCount isFollowing } }`,
      { u: userId },
    )
      .then((d) => setStats(d.followStats))
      .catch(() => undefined);
  }, [userId, ready, user]);

  const toggle = async () => {
    if (!stats || !ensureLogin()) return;
    const before = stats;
    const following = !stats.isFollowing;
    setStats({ ...stats, isFollowing: following, followersCount: stats.followersCount + (following ? 1 : -1) });
    try {
      await clientGql(`mutation($u: ID!){ ${following ? 'followUser' : 'unfollowUser'}(userId:$u) }`, { u: userId });
    } catch {
      setStats(before);
    }
  };

  if (!stats) return null;
  return (
    <div className="row">
      {user?._id !== userId && (
        <button type="button" className="toggle" aria-pressed={stats.isFollowing} onClick={() => void toggle()}>
          <span className="pip" aria-hidden />
          {stats.isFollowing ? 'Following' : 'Follow'}
        </button>
      )}
      <span className="meta">
        {stats.followersCount} followers · {stats.followingCount} following
      </span>
    </div>
  );
}
