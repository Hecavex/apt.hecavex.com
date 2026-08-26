import type { APIRoute } from 'astro';
import { publicEntries } from '../../../utils/content';
import { datasetEnvelope, jsonResponse, serializeEntry } from '../../../utils/publication';

export async function getStaticPaths() {
  const actors = await publicEntries('actors');
  return actors
    .sort((left, right) => left.data.slug.localeCompare(right.data.slug))
    .map((entry) => ({ params: { slug: entry.data.slug }, props: { entry } }));
}

export const GET: APIRoute = ({ props }) => jsonResponse(datasetEnvelope({
  object_type: 'record',
  collection: 'actors',
  record: serializeEntry('actors', props.entry)
}));
