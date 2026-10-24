import { useSyncExternalStore } from 'react';

// Remembers only which button was used last (never the email), so the login
// page can nudge people who forgot whether they signed up with Google.
const KEY = 'lastLogin';
type Method = 'email' | 'google';

export function rememberLogin(method: Method) {
  try {
    localStorage.setItem(KEY, method);
  } catch {}
}

const read = (): Method | null => {
  try {
    return localStorage.getItem(KEY) as Method | null;
  } catch {
    return null;
  }
};

export const useLastLogin = () =>
  useSyncExternalStore(
    () => () => {},
    read,
    () => null,
  );
