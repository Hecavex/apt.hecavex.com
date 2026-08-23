import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const entries = await getCollection('actors', ({ data }) => !data.draft);
  return entries.map((entry) => ({ params: { slug: entry.data.slug }, props: { entry } }));
}

export function GET({ props }: { props: { entry: any } }) {
  const { entry } = props;
  const body = {
    schema_version: '1.0.0',
    generated_at: new Date().toISOString(),
    publisher: 'HECAVEX',
    licence: 'CC-BY-4.0',
    licence_url: 'https://apt.hecavex.com/licence/',
    methodology: 'https://apt.hecavex.com/about/methodology/',
    notice: 'Source-driven public research record. Preserve confidence, review date and source-specific attribution boundaries.',
    record: { ...entry.data, last_reviewed: entry.data.last_reviewed.toISOString(), url: `https://apt.hecavex.com/actors/${entry.data.slug}/` }
  };
  return new Response(JSON.stringify(body, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}
