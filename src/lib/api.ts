import 'server-only';

// Server-side GraphQL: talks to the backend directly (never through /api)
// and sends the internal key so SSR traffic isn't rate-limited as one IP.
// `server-only` makes the build fail if this file ever reaches the browser,
// which is what keeps INTERNAL_API_KEY out of client bundles.

export class ApiError extends Error {
  constructor(
    message: string,
    public code: number,
  ) {
    super(message);
  }
}

export async function gql<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch(`${process.env.BACKEND_URL}/graphql`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-internal-key': process.env.INTERNAL_API_KEY ?? '',
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = (await res.json()) as {
    data?: T;
    errors?: { message: string; extensions?: { code?: number } }[];
  };
  const err = json.errors?.[0];
  if (err) throw new ApiError(err.message, Number(err.extensions?.code) || 500);
  return json.data as T;
}
