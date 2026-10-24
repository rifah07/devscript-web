import { proxyFeed } from '@/lib/feed';
import { site } from '@/site/config';

export const GET = () => proxyFeed(`/rss.xml?space=${site.feedSpace}`);
