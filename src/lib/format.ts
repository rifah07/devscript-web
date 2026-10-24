// Fixed locale + timezone: the server and the browser format the same date
// identically, so React never sees a hydration mismatch.
const fmt = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'Asia/Dhaka',
});

export const formatDate = (iso: string) => fmt.format(new Date(iso));
