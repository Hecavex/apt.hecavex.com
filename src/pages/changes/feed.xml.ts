import type { APIRoute } from 'astro';
import { publication, release } from '../../data/release';
import { publicEntries } from '../../utils/content';

const xml = (value: unknown) => String(value ?? '').replace(/[<>&'"]/g, (character) => ({
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  "'": '&apos;',
  '"': '&quot;'
}[character]!));

export const buildChangesFeed = async (selfUrl = `${publication.site}/changes/feed.xml`) => {
  const entries: any[] = await publicEntries('updates');
  entries.sort((left, right) => +right.data.date - +left.data.date || left.data.id.localeCompare(right.data.id));
  const updated = entries[0]?.data.date?.toISOString() ?? release.releasedAt;
  const body = [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<feed xmlns="http://www.w3.org/2005/Atom">',
    `<title>${xml('APT Notes changes')}</title>`,
    `<subtitle>${xml('Published revisions, additions, corrections, deprecations and relationship changes.')}</subtitle>`,
    `<id>${xml(`${publication.site}/changes/`)}</id>`,
    `<link href="${xml(selfUrl)}" rel="self" type="application/atom+xml"/>`,
    `<link href="${xml(`${publication.site}/changes/`)}" rel="alternate" type="text/html"/>`,
    `<link href="${xml(`${publication.site}/api/changes.json`)}" rel="alternate" type="application/json"/>`,
    `<updated>${xml(updated)}</updated>`,
    `<rights>${xml(`${publication.licence} · ${publication.licenceUrl}`)}</rights>`,
    '<author><name>HECAVEX</name><uri>https://hecavex.com/</uri></author>',
    ...entries.map(({ data }) => {
      const url = `${publication.site}/changes/#${data.slug}`;
      const jsonUrl = `${publication.site}/api/changes/${data.slug}.json`;
      const content = [data.what_changed, data.why].filter(Boolean).join(' ');
      return [
        '<entry>',
        `<title>${xml(data.title)}</title>`,
        `<id>${xml(`urn:hecavex:apt-notes:change:${data.id}`)}</id>`,
        `<link href="${xml(url)}" rel="alternate" type="text/html"/>`,
        `<link href="${xml(jsonUrl)}" rel="alternate" type="application/json"/>`,
        `<published>${xml(data.date.toISOString())}</published>`,
        `<updated>${xml(data.date.toISOString())}</updated>`,
        `<category term="${xml(data.update_type)}" scheme="${xml(`${publication.site}/changes/types/`)}"/>`,
        `<category term="${xml(data.entity_type)}" scheme="${xml(`${publication.site}/knowledge/types/`)}"/>`,
        `<summary type="text">${xml(data.summary)}</summary>`,
        content ? `<content type="text">${xml(content)}</content>` : '',
        '</entry>'
      ].join('');
    }),
    '</feed>'
  ].join('');

  return new Response(body, {
    headers: {
      'Content-Type': 'application/atom+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};

export const GET: APIRoute = () => buildChangesFeed();
