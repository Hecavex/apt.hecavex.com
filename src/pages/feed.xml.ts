import type { APIRoute } from 'astro';
import { publication } from '../data/release';
import { buildChangesFeed } from './changes/feed.xml';

// Compatibility route: the historical feed URL now carries the same bounded
// change-event stream as /changes/feed.xml. Actor review dates are not events.
export const GET: APIRoute = () => buildChangesFeed(`${publication.site}/feed.xml`);
