'use client';

import { useState } from 'react';

// Google photo links are saved at signup and die when the person changes
// their Google photo. Fall back to an initial instead of a broken image,
// and tell the owner how to fix it.
export function Avatar({ src, name, size, own }: { src: string; name: string; size: number; own?: boolean }) {
  const [broken, setBroken] = useState(false);

  if (broken) {
    return (
      <div className="stack" style={{ gap: '0.4rem' }}>
        <span className="avatar-fallback" style={{ width: size, height: size }} aria-hidden="true">
          {name.trim()[0]?.toUpperCase()}
        </span>
        {own && <p className="meta">Your photo couldn’t be loaded. Uploading a photo here replaces it.</p>}
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      referrerPolicy="no-referrer"
      width={size}
      height={size}
      style={{ borderRadius: '50%' }}
      onError={() => setBroken(true)}
    />
  );
}
