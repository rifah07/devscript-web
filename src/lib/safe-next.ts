// `/login?next=https://evil.example` must never send a freshly logged-in
// user off-site (open redirect → phishing). Only same-site paths pass:
// "/x" yes; "//evil.example" and "/\evil.example" are protocol-relative, no.
export function safeNext(next: string | null): string {
  return next && /^\/(?![/\\])/.test(next) ? next : '/';
}
