'use client';

import { useEffect, useState } from 'react';
import { RequireLogin } from '@/components/RequireLogin';
import { Editor } from '@/components/studio/Editor';

export default function NewPostPage() {
  // cacheComponents keeps this page alive after you leave it; without a new
  // key, "New article" would reopen the piece saved here last time.
  const [visit, setVisit] = useState(0);
  useEffect(() => () => setVisit((v) => v + 1), []);

  return (
    <RequireLogin>
      <Editor key={visit} initial={null} />
    </RequireLogin>
  );
}
