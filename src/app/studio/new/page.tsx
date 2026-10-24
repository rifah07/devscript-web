'use client';

import { RequireLogin } from '@/components/RequireLogin';
import { Editor } from '@/components/studio/Editor';

export default function NewPostPage() {
  return (
    <RequireLogin>
      <Editor initial={null} />
    </RequireLogin>
  );
}
