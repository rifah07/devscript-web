// Only pass well-formed ObjectIds on to the API; anything else is ignored
// instead of turning a hand-edited URL into a 400 error page.
export const asCursor = (v: string | string[] | undefined) =>
  typeof v === 'string' && /^[a-f0-9]{24}$/.test(v) ? v : undefined;
