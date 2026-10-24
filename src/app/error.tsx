'use client';

import { useEffect } from 'react';

// Never show the raw error to readers; it may contain internals. Server
// errors are already in the logs under `digest`; browser errors are sent
// there too. The reader gets the digest to quote when reporting.
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    if (error.digest) return;
    void fetch('/api/client-error', {
      method: 'POST',
      body: JSON.stringify({ path: location.pathname, message: error.message, stack: error.stack?.slice(0, 1200) }),
    }).catch(() => undefined);
  }, [error]);

  return (
    <>
      <p className="kicker">error</p>
      <h1>Something went wrong on our side.</h1>
      {error.digest && <p className="meta">Reference: {error.digest}</p>}
      <button type="submit" onClick={reset}>
        Try again
      </button>
    </>
  );
}
