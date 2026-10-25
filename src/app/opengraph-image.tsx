import { ImageResponse } from 'next/og';
import { isMisk, site } from '@/site/config';

export const alt = `${site.name}: ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// The link preview for pages without their own cover (home, about, lists).
export default function OpengraphImage() {
  const accent = isMisk ? '#c98476' : '#4ade9a';
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          background: site.colors.dark,
          color: '#e9e6e1',
        }}
      >
        <div style={{ display: 'flex', width: 64, height: 6, background: accent }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -2 }}>{site.name}</div>
          <div style={{ fontSize: 40, color: '#9a978f' }}>{site.tagline}</div>
        </div>
        <div style={{ fontSize: 28, color: accent }}>{(process.env.NEXT_PUBLIC_SITE_URL ?? '').replace(/^https?:\/\//, '')}</div>
      </div>
    ),
    size,
  );
}
