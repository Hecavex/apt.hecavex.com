import { getCollection } from 'astro:content';

export type CollectionName = 'actors' | 'campaigns' | 'malware' | 'tools' | 'techniques' | 'sources' | 'updates';
export const publicEntries = async (collection: CollectionName) => getCollection(collection, ({ data }) => !data.draft);

export const bySlug = <T extends { data: { slug: string } }>(entries: T[]) => new Map(entries.map((entry) => [entry.data.slug, entry]));
export const label = (value: string) => value.replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
export const formatDate = (value: Date | string) => new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(value));
export const unique = <T>(values: T[]) => [...new Set(values)];
