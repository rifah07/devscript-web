// Refresh tokens are single-use and rotate on every refresh. If two callers
// refresh at once (React StrictMode double-mount, two 401s in parallel), the
// second one presents an already-used token and the backend revokes the
// session. So every caller shares ONE in-flight request.

let inflight: Promise<string | null> | null = null;

export function refresh(fetchImpl: typeof fetch = fetch): Promise<string | null> {
  inflight ??= fetchImpl('/api/auth/refresh', { method: 'POST', credentials: 'include' })
    .then((r) => (r.ok ? (r.json() as Promise<{ accessToken?: string }>) : null))
    .then((d) => d?.accessToken ?? null)
    .catch(() => null)
    .finally(() => {
      inflight = null;
    });
  return inflight;
}
