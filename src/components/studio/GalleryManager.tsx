'use client';

import { useState } from 'react';
import { shrinkImage } from '@/lib/image';
import { clientGql, clientRest } from '@/lib/session';
import { EDIT_FIELDS } from '@/lib/studio-queries';
import type { EditablePost } from '@/lib/types';
import { isMisk } from '@/site/config';

const MAX = 10;

// Upload, describe, order and remove images. Alt text is part of writing:
// it's what a screen-reader user hears instead of the picture.
export function GalleryManager({ post, onChange }: { post: EditablePost; onChange: (p: EditablePost) => void }) {
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');
  const images = [...post.gallery].sort((a, b) => a.order - b.order);

  // REST upload responses lack GraphQL-only fields (variants), so reload.
  const reload = async () =>
    onChange((await clientGql<{ post: EditablePost }>(`query($s: String!){ post(slug:$s){ ${EDIT_FIELDS} } }`, { s: post.slug })).post);

  const mutate = async (mutation: string, vars: Record<string, unknown>) => {
    try {
      const d = await clientGql<Record<string, EditablePost>>(mutation, { postId: post._id, ...vars });
      onChange(Object.values(d)[0]);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  async function upload(files: FileList) {
    setError('');
    const list = [...files].slice(0, MAX - images.length);
    try {
      // One file per request keeps each request under the host's body limit.
      for (const [i, file] of list.entries()) {
        setBusy(`Uploading ${i + 1} of ${list.length}…`);
        const form = new FormData();
        form.append('files', await shrinkImage(file), file.name.replace(/\.\w+$/, '.jpg'));
        await clientRest(`/posts/${post._id}/gallery`, { method: 'POST', body: form });
      }
      await reload();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy('');
    }
  }

  async function remove(publicId: string) {
    if (!confirm('Remove this image?')) return;
    await clientRest(`/posts/${post._id}/gallery/${encodeURIComponent(publicId)}`, { method: 'DELETE' }).catch((e: Error) =>
      setError(e.message),
    );
    await reload();
  }

  // The CSP blocks images from other sites, so the body can only show
  // pictures uploaded here. This hands over the ready-made Markdown.
  async function copyMarkdown(img: (typeof images)[number]) {
    await navigator.clipboard.writeText(`![${img.alt ?? ''}](${img.url})`).catch(() => undefined);
    setCopied(img.publicId);
    setTimeout(() => setCopied((id) => (id === img.publicId ? '' : id)), 1600);
  }

  const move = (index: number, by: number) => {
    const ids = images.map((img) => img.publicId);
    [ids[index], ids[index + by]] = [ids[index + by], ids[index]];
    void mutate(`mutation($postId: ID!, $ids: [String!]!){ reorderGallery(postId:$postId, publicIds:$ids){ ${EDIT_FIELDS} } }`, { ids });
  };

  return (
    <div className="card panel">
      <h3>Images ({images.length}/{MAX})</h3>
      {isMisk && (
        <p className="meta" style={{ margin: 0 }}>
          Writing under a pen name? Avoid photos you’ve posted elsewhere; they can link your accounts.
        </p>
      )}
      <div className="thumbs">
        {images.map((img, i) => (
          <div key={img.publicId} className="thumb">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.variants.thumbnail} alt="" />
            <div className="stack" style={{ gap: '0.4rem' }}>
              <label className="sr-only" htmlFor={`alt-${i}`}>
                Describe image {i + 1}
              </label>
              <input
                id={`alt-${i}`}
                defaultValue={img.alt ?? ''}
                placeholder="Describe this image"
                maxLength={300}
                onBlur={(e) =>
                  e.target.value !== (img.alt ?? '') &&
                  void mutate(
                    `mutation($postId: ID!, $id: String!, $alt: String!){ updateGalleryImageAlt(postId:$postId, publicId:$id, alt:$alt){ ${EDIT_FIELDS} } }`,
                    { id: img.publicId, alt: e.target.value },
                  )
                }
              />
              <div className="row meta">
                <button type="button" className="link-button" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up">
                  ↑
                </button>
                <button type="button" className="link-button" disabled={i === images.length - 1} onClick={() => move(i, 1)} aria-label="Move down">
                  ↓
                </button>
                <button
                  type="button"
                  className="link-button"
                  onClick={() =>
                    void mutate(`mutation($postId: ID!, $id: String!){ setPostCover(postId:$postId, publicId:$id){ ${EDIT_FIELDS} } }`, {
                      id: img.publicId,
                    })
                  }
                >
                  Make cover
                </button>
                <button type="button" className="link-button" onClick={() => void copyMarkdown(img)}>
                  <span role="status">{copied === img.publicId ? 'Copied ✓' : 'Copy Markdown'}</span>
                </button>
                <button type="button" className="link-button" onClick={() => void remove(img.publicId)}>
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {images.length < MAX && (
        <label className="btn quiet small" style={{ cursor: 'pointer' }}>
          {busy || 'Add images'}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="sr-only"
            disabled={!!busy}
            onChange={(e) => e.target.files && void upload(e.target.files)}
          />
        </label>
      )}
      <p className="error" aria-live="polite">
        {error}
      </p>
    </div>
  );
}
