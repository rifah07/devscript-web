import { notFound } from 'next/navigation';
import { SPACE, type Space } from './config';

// Pages that exist on one site only (e.g. /cv on DevScript, /poems on Misk)
// call this first; on the other site the route is a plain 404.
export function onlyOn(space: Space): void {
  if (SPACE !== space) notFound();
}
