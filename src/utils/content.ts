import { getCollection } from 'astro:content';

export type CollectionName = 'actors' | 'campaigns' | 'malware' | 'tools' | 'techniques' | 'sources' | 'updates';
export const publicEntries = async (collection: CollectionName) => getCollection(collection, ({ data }) => !data.draft);

export const bySlug = <T extends { data: { slug: string } }>(entries: T[]) => new Map(entries.map((entry) => [entry.data.slug, entry]));
export const byId = <T extends { data: { id: string } }>(entries: T[]) => new Map(entries.map((entry) => [entry.data.id, entry]));
export const label = (value: string) => value.replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
export const formatDate = (value: Date | string) => new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(value));
export const unique = <T>(values: T[]) => [...new Set(values)];

export const reviewStatus = (value: Date | string, asOf = new Date()) => {
  const ageDays = Math.floor((asOf.getTime() - new Date(value).getTime()) / 86_400_000);
  if (ageDays <= 180) return { key: 'current', label: 'Review current', ageDays };
  if (ageDays <= 365) return { key: 'due', label: 'Review due', ageDays };
  return { key: 'stale', label: 'Review stale', ageDays };
};
