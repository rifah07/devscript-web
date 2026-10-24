# Frontend decisions

Spec: `devscript-api/docs/FRONTEND_SPEC.md`. Where this app differs, the reason is here.

| Topic | Decision | Why |
|---|---|---|
| Two sites | One codebase, two Vercel projects, `NEXT_PUBLIC_SPACE` selects the site | Studio, auth, comments and the API client written once; sessions stay separate because cookies are per domain |
| No cross-links | DevScript never links to Misk and vice versa; posts from the other space 404 | Links would tie the pen name to the real name |
| Data (server) | Plain `fetch` + `'use cache'` functions; types hand-written from `schema.gql` | ~30 lines instead of graphql-request + codegen |
| Data (client) | `clientGql`/`clientRest` with optimistic state in components; no TanStack Query | A handful of toggles doesn't need a cache library |
| API proxy | Route handler at `/api/[...path]` instead of a rewrite | Adds the internal key and the reader's IP, strips spoofable headers, passes cookies and redirects through |
| Forms | Native HTML validation, server messages shown as-is | No form library for small forms |
| Editor | `<textarea>` with live preview, no CodeMirror | Small bundle; Markdown and poems are plain text anyway |
| Dialogs | Native `<dialog>` | Focus trap, Escape and focus return come from the browser |
| Images | Shrunk in the browser to ≤ 2000 px JPEG before upload, one file per request | Vercel body limit; faster on mobile data |
| Fonts | Geist/Geist Mono (DevScript), Newsreader + Noto Serif Bengali (Misk), `preload: false` | next/font requires literal options; a page only downloads fonts its CSS uses |
| Animation | SVG + CSS only, paused off-screen, off for reduced motion | No per-frame JavaScript; cheap on low-end phones |
| Hidden posts | Streamed 404 has HTTP 200 but `noindex` | Streaming sends headers before `notFound()` runs |
| CV | HTML page without phone and address, print-to-PDF button | Public pages get scraped |
| CSP | Static header in `next.config.ts`; only this site, Cloudinary and Google avatars (`*.googleusercontent.com`, shown with `referrerPolicy="no-referrer"` because Google can refuse hotlinked photos); inline scripts allowed | A nonce CSP makes every page dynamic and kills caching; outside images are blocked, so the gallery has Copy Markdown |
| Email confirmation | Banner on every page until confirmed, with resend | Unconfirmed accounts can't publish or comment, so people must see why |
| Last-used login | `localStorage` stores only `email` or `google`, read with `useSyncExternalStore` | No personal data; no hydration mismatch |
| Not yet | Code highlighting (Shiki), nonce-based CSP, proactive token refresh, Playwright tests | Next hardening steps |
