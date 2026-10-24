import { proxyFeed } from '@/lib/feed';
import { site } from '@/site/config';

export const GET = () => proxyFeed(`/sitemap.xml?space=${site.feedSpace}`);
