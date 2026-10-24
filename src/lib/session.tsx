'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { refresh } from './refresh';
import type { Me } from './types';

// The access token lives only in this module's memory: never localStorage,
// where any injected script could read it. A reload loses it, and the
// HttpOnly refresh cookie (which JS can't read) silently gets a new one.
let accessToken: string | null = null;

export class ClientApiError extends Error {
  constructor(
    message: string,
    public code: number,
  ) {
    super(message);
  }
}

// Any request through the same-origin /api proxy. On 401 it refreshes
// once (single-flight) and retries once, never in a loop.
async function authedFetch(path: string, init: RequestInit = {}, retried = false): Promise<Response> {
  const headers = new Headers(init.headers);
  if (accessToken) headers.set('authorization', `Bearer ${accessToken}`);
  const res = await fetch(`/api${path}`, { ...init, headers, credentials: 'include' });
  if (res.status === 401 && (await retryAfterRefresh(retried))) return authedFetch(path, init, true);
  return res;
}

async function retryAfterRefresh(alreadyRetried: boolean): Promise<boolean> {
  if (!accessToken || alreadyRetried) return false;
  accessToken = await refresh();
  return !!accessToken;
}

const friendly = (code: number, message: string) =>
  code === 429
    ? 'Slow down a little and try again in a minute.'
    : code >= 500
      ? 'Something went wrong on our side. Please try again.'
      : message;

export async function clientGql<T>(
  query: string,
  variables: Record<string, unknown> = {},
  retried = false,
): Promise<T> {
  const res = await authedFetch('/graphql', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const json = (await res.json()) as {
    data?: T;
    errors?: { message: string; extensions?: { code?: number } }[];
  };
  const err = json.errors?.[0];
  if (!err) return json.data as T;
  const code = Number(err.extensions?.code) || 500;
  // GraphQL reports an expired token inside a 200 response.
  if (code === 401 && (await retryAfterRefresh(retried))) return clientGql<T>(query, variables, true);
  throw new ClientApiError(friendly(code, err.message), code);
}

// REST endpoints: file uploads, downloads, deletes with a body.
export async function clientRest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await authedFetch(path, init);
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new ClientApiError(friendly(res.status, body.message ?? 'Request failed'), res.status);
  }
  return (res.headers.get('content-type')?.includes('json') ? res.json() : res.blob()) as Promise<T>;
}

const ME = `{ me { _id name email emailVerified role plan bio avatarUrl website github leetcode twitter } }`;

type Session = {
  user: Me | null;
  ready: boolean;
  signIn: (token: string, user?: Me) => Promise<void>;
  signOut: () => Promise<void>;
  reload: () => Promise<void>;
};

const SessionContext = createContext<Session | null>(null);

// Anonymous readers shouldn't call /auth/refresh on every page load: it's
// rate-limited per IP, and on a shared campus or mobile IP those calls would
// crowd out signed-in readers. This flag (no secret) only says "this browser
// signed in here before". It is cleared on sign-out, not on a failed refresh,
// so a brief 429 never looks like being logged out.
const HINT = 'signedIn';
const setHint = (on: boolean) => {
  try {
    if (on) localStorage.setItem(HINT, '1');
    else localStorage.removeItem(HINT);
  } catch {}
};
const hasHint = () => {
  try {
    return localStorage.getItem(HINT) === '1';
  } catch {
    return false;
  }
};

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Me | null>(null);
  const [ready, setReady] = useState(false);

  const reload = useCallback(async () => {
    setUser((await clientGql<{ me: Me }>(ME)).me);
  }, []);

  const signIn = useCallback(
    async (token: string, known?: Me) => {
      accessToken = token;
      setHint(true);
      if (known) setUser(known);
      else await reload();
    },
    [reload],
  );

  const signOut = useCallback(async () => {
    await clientGql(`mutation { logout }`).catch(() => undefined);
    accessToken = null;
    setUser(null);
    setHint(false);
  }, []);

  // Bootstrap: one refresh on first mount (single-flight, StrictMode-safe).
  useEffect(() => {
    void (hasHint() ? refresh() : Promise.resolve(null))
      .then((token) => (token ? signIn(token) : undefined))
      .catch(() => undefined)
      .finally(() => setReady(true));
  }, [signIn]);

  return (
    <SessionContext.Provider value={{ user, ready, signIn, signOut, reload }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): Session {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used inside <SessionProvider>');
  return ctx;
}
