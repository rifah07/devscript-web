'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { GalleryImage } from '@/lib/types';

// Images one after another with captions (a photo essay, not a mosaic).
// Click opens a lightbox: ← → to move, Esc to close, Download per image.
export function PhotoEssay({ images }: { images: GalleryImage[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const sorted = [...images].sort((a, b) => a.order - b.order);

  const open = (i: number) => {
    setIndex(i);
    dialog.current?.showModal();
  };
  const step = useCallback((d: number) => setIndex((i) => (i + d + sorted.length) % sorted.length), [sorted.length]);

  useEffect(() => {
    const el = dialog.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    el?.addEventListener('keydown', onKey);
    return () => el?.removeEventListener('keydown', onKey);
  }, [step]);

  if (!sorted.length) return null;
  const current = sorted[index];

  return (
    <>
      <div className="photo-essay">
        {sorted.map((img, i) => (
          <figure key={img.publicId}>
            <button type="button" onClick={() => open(i)} aria-label={`Open image ${i + 1} of ${sorted.length}`}>
              {/* eslint-disable-next-line @next/next/no-img-element -- Cloudinary already sizes and formats */}
              <img src={img.variants.landscape} alt={img.alt ?? ''} width={img.width} height={img.height} loading="lazy" decoding="async" />
            </button>
            {img.alt && <figcaption>{img.alt}</figcaption>}
          </figure>
        ))}
      </div>
      <dialog ref={dialog} className="lightbox" aria-label="Image viewer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={current.variants.original} alt={current.alt ?? ''} />
        <div className="spread" style={{ marginTop: '0.75rem' }}>
          <span className="meta">
            {index + 1} / {sorted.length}
            {current.alt ? ` · ${current.alt}` : ''}
          </span>
          <div className="row">
            <button type="button" className="btn quiet small" onClick={() => step(-1)} aria-label="Previous image">
              ←
            </button>
            <button type="button" className="btn quiet small" onClick={() => step(1)} aria-label="Next image">
              →
            </button>
            <a className="btn quiet small" href={current.downloadUrl}>
              Download
            </a>
            <form method="dialog">
              <button className="btn small">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
