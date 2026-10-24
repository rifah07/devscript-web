'use client';

import { useEffect, useState } from 'react';
import { clientGql, useSession } from '@/lib/session';
import { useLoginGate } from '@/lib/use-login-gate';
import type { Reaction } from '@/lib/types';
import { site, type ReactionType } from '@/site/config';

type Target = 'POST' | 'COMMENT';

// Optimistic: the toggle flips instantly, the server confirms, and on error
// we put the old state back. The site config decides which reactions show
// and what they're called (no emoji anywhere).
export function ReactionBar({ targetId, targetType = 'POST' }: { targetId: string; targetType?: Target }) {
  const { user, ready } = useSession();
  const ensureLogin = useLoginGate();
  const [state, setState] = useState<Record<string, Reaction>>({});

  useEffect(() => {
    if (!ready) return;
    void clientGql<{ reactions: Reaction[] }>(
      `query($t: ID!, $tt: ReactionTargetType!){ reactions(targetId:$t, targetType:$tt){ type count userReacted } }`,
      { t: targetId, tt: targetType },
    )
      .then((d) => setState(Object.fromEntries(d.reactions.map((r) => [r.type, r]))))
      .catch(() => undefined);
  }, [targetId, targetType, ready, user]);

  const toggle = async (type: ReactionType) => {
    if (!ensureLogin()) return;
    const before = state;
    const cur = state[type] ?? { type, count: 0, userReacted: false };
    setState({
      ...state,
      [type]: { ...cur, userReacted: !cur.userReacted, count: cur.count + (cur.userReacted ? -1 : 1) },
    });
    try {
      await clientGql(`mutation($i: ToggleReactionInput!){ toggleReaction(input:$i) }`, {
        i: { targetId, targetType, type },
      });
    } catch {
      setState(before);
    }
  };

  return (
    <div className="row" role="group" aria-label="Reactions">
      {site.reactions.map(({ type, label }) => {
        const r = state[type];
        return (
          <button key={type} type="button" className="toggle" aria-pressed={!!r?.userReacted} onClick={() => void toggle(type)}>
            <span className="pip" aria-hidden />
            {label}
            {!!r?.count && <span className="count">{r.count}</span>}
          </button>
        );
      })}
    </div>
  );
}
