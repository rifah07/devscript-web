import { proxyFeed } from '@/lib/feed';
import { site } from '@/site/config';

export const GET = () => proxyFeed(`/robots.txt?space=${site.feedSpace}`);
