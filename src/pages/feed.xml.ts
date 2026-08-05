import type { APIRoute } from 'astro';
import { publicEntries } from '../utils/content';

const xml = (value: string) => value.replace(/[<>&'"]/g, character => ({
  '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;'
}[character]!));

export const GET: APIRoute = async () => {
  const updates: any[] = (await publicEntries('updates'))
    .filter((update: any) => update.data.substantive)
    .map((update: any) => ({
      title: update.data.title,
      summary: update.data.summary,
      date: update.data.date,
      url: `https://apt.hecavex.com/updates/#${update.data.slug}`
    }));
  const actors: any[] = (await publicEntries('actors')).map((actor: any) => ({
    title: `${actor.data.name} profile`,
    summary: actor.data.summary,
    date: actor.data.last_reviewed,
    url: `https://apt.hecavex.com/actors/${actor.data.slug}/`
  }));
  const entries = [...updates, ...actors].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  const latest = entries[0]?.date ?? new Date('2026-08-05');
  const body = `<?xml version="1.0" encoding="utf-8"?><feed xmlns="http://www.w3.org/2005/Atom"><title>APT Notes profiles and updates</title><id>https://apt.hecavex.com/</id><link href="https://apt.hecavex.com/feed.xml" rel="self"/><link href="https://apt.hecavex.com/"/><updated>${new Date(latest).toISOString()}</updated>${entries.map(entry => `<entry><title>${xml(entry.title)}</title><id>${xml(entry.url)}</id><link href="${xml(entry.url)}"/><updated>${new Date(entry.date).toISOString()}</updated><summary>${xml(entry.summary)}</summary></entry>`).join('')}</feed>`;
  return new Response(body, { headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' } });
};
