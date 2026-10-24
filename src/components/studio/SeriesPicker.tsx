'use client';

import { useEffect, useState } from 'react';
import { clientGql, useSession } from '@/lib/session';
import { EDIT_FIELDS } from '@/lib/studio-queries';
import type { EditablePost } from '@/lib/types';
import { SPACE } from '@/site/config';

type SeriesRef = { _id: string; title: string; space: string };

// Put a piece into one of your series ("Ramadan Reflections 2026"), or
// start a new series right here.
export function SeriesPicker({ post, onChange }: { post: EditablePost; onChange: (p: EditablePost) => void }) {
  const { user } = useSession();
  const [series, setSeries] = useState<SeriesRef[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    void clientGql<{ authorSeries: SeriesRef[] }>(`query($a: ID!){ authorSeries(authorId:$a){ _id title space } }`, { a: user!._id })
      .then((d) => setSeries(d.authorSeries.filter((s) => s.space === SPACE)))
      .catch(() => undefined);
  }, [user]);

  async function choose(value: string) {
    setError('');
    try {
      if (value === '') {
        const d = await clientGql<{ removePostFromSeries: EditablePost }>(
          `mutation($p: ID!){ removePostFromSeries(postId:$p){ ${EDIT_FIELDS} } }`,
          { p: post._id },
        );
        return onChange(d.removePostFromSeries);
      }
      let seriesId = value;
      if (value === 'new') {
        const title = prompt('Name the new series')?.trim();
        if (!title) return;
        const d = await clientGql<{ createSeries: SeriesRef }>(
          `mutation($i: CreateSeriesInput!){ createSeries(input:$i){ _id title space } }`,
          { i: { title, space: SPACE } },
        );
        setSeries((list) => [...list, d.createSeries]);
        seriesId = d.createSeries._id;
      }
      const d = await clientGql<{ addPostToSeries: EditablePost }>(
        `mutation($i: AddPostToSeriesInput!){ addPostToSeries(input:$i){ ${EDIT_FIELDS} } }`,
        { i: { seriesId, postId: post._id } },
      );
      onChange(d.addPostToSeries);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <label>
      Series
      <select value={post.series?._id ?? ''} onChange={(e) => void choose(e.target.value)}>
        <option value="">Not in a series</option>
        {series.map((s) => (
          <option key={s._id} value={s._id}>
            {s.title}
          </option>
        ))}
        <option value="new">+ New series…</option>
      </select>
      {error && <span className="error">{error}</span>}
    </label>
  );
}
