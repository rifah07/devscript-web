'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { RequireLogin } from '@/components/RequireLogin';
import { Editor } from '@/components/studio/Editor';
import { clientGql } from '@/lib/session';
import { EDIT_FIELDS } from '@/lib/studio-queries';
import type { EditablePost } from '@/lib/types';

export default function EditPostPage() {
  return (
    <RequireLogin>
      <Load />
    </RequireLogin>
  );
}

// Drafts are only visible to their author (and admins), so this loads in
// the browser with the writer's token, never in a shared server cache.
function Load() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<EditablePost | null | undefined>(undefined);

  useEffect(() => {
    void clientGql<{ post: EditablePost }>(`query($s: String!){ post(slug:$s){ ${EDIT_FIELDS} } }`, { s: slug })
      .then((d) => setPost(d.post))
      .catch(() => setPost(null));
  }, [slug]);

  if (post === undefined) return <p className="muted">Loading…</p>;
  if (post === null) return <p>This piece doesn’t exist, or isn’t yours to edit.</p>;
  return <Editor initial={post} />;
}
