// Refresh tokens are single-use and rotate on every refresh. If two callers
// refresh at once (React StrictMode double-mount, two 401s in parallel), the
// second one presents an already-used token and the backend revokes the
// session. So every caller shares ONE in-flight request.

let inflight: Promise<string | null> | null = null;

export function refresh(fetchImpl: typeof fetch = fetch, retryMs = 1000): Promise<string | null> {
  inflight ??= attempt(fetchImpl, retryMs, 2).finally(() => {
    inflight = null;
  });
  return inflight;
}

// A waking serverless API (502/504), a network blip or a 429 is not "signed
// out": try again before showing the Log in button. Only a 4xx answer means
// the session is really gone.
async function attempt(fetchImpl: typeof fetch, retryMs: number, retriesLeft: number): Promise<string | null> {
  const res = await fetchImpl('/api/auth/refresh', { method: 'POST', credentials: 'include' }).catch(() => null);
  if (res?.ok) return ((await res.json().catch(() => null)) as { accessToken?: string } | null)?.accessToken ?? null;
  const transient = !res || res.status === 429 || res.status >= 500;
  if (!transient || retriesLeft === 0) return null;
  await new Promise((r) => setTimeout(r, retryMs));
  return attempt(fetchImpl, retryMs * 2, retriesLeft - 1);
}
