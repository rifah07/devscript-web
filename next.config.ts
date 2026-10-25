import type { NextConfig } from 'next';

const dev = process.env.NODE_ENV !== 'production';

// Static, not nonce-based: nonces force every page to render per request,
// which would switch off caching. 'unsafe-inline' scripts cover the theme
// script and Next's inline RSC payload; the real protection is that nothing
// can load from or send to any other origin. Dev adds eval and the HMR socket.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://res.cloudinary.com https://*.googleusercontent.com",
  "media-src 'self' https://res.cloudinary.com",
  `connect-src 'self'${dev ? ' ws:' : ''}`,
  "object-src 'none'",
  "frame-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(dev ? [] : ['upgrade-insecure-requests']),
].join('; ');

const nextConfig: NextConfig = {
  // Lets both sites run side by side in dev (`npm run dev:misk` uses .next-misk).
  distDir: process.env.NEXT_DIST_DIR ?? '.next',
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    root: process.cwd(), // ignore stray lockfiles in parent folders
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
