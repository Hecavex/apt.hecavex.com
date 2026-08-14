import { publicEntries } from '../../utils/content';

export async function GET() {
  const actors: any[] = await publicEntries('actors');
  const body = {
    schema_version: '1.0.0',
    generated_at: new Date().toISOString(),
    publisher: 'HECAVEX',
    licence: 'CC-BY-4.0',
    methodology: 'https://apt.hecavex.com/about/methodology/',
    notice: 'Curated public research records. Not a live IOC feed or exhaustive actor directory.',
    actors: actors.map((entry: any) => ({ ...entry.data, last_reviewed: entry.data.last_reviewed.toISOString(), url: `https://apt.hecavex.com/actors/${entry.data.slug}/`, json_url: `https://apt.hecavex.com/api/actors/${entry.data.slug}.json` }))
  };
  return new Response(JSON.stringify(body, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}

