import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import YAML from 'yaml';

const collections = ['actors', 'campaigns', 'malware', 'tools', 'techniques', 'sources'];
const output = path.resolve('public/og/generated');
fs.mkdirSync(output, { recursive: true });

const escapeXml = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[character]);
const frontMatter = file => {
  const source = fs.readFileSync(file, 'utf8');
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match ? YAML.parse(match[1]) : null;
};
const wrap = (value, width = 28, lines = 3) => {
  const words = String(value).split(/\s+/); const result = [];
  for (const word of words) {
    const current = result.at(-1);
    if (!current || `${current} ${word}`.length > width) result.push(word); else result[result.length - 1] = `${current} ${word}`;
  }
  if (result.length > lines) result.splice(lines - 1, result.length, `${result.slice(lines - 1).join(' ').slice(0, width - 1)}…`);
  return result;
};

for (const collection of collections) {
  const directory = path.resolve('src/content', collection);
  for (const name of fs.readdirSync(directory).filter(file => /\.mdx?$/.test(file))) {
    const data = frontMatter(path.join(directory, name));
    if (!data || data.draft) continue;
    const title = data.name || data.title;
    const label = collection === 'actors' ? 'THREAT ACTOR PROFILE' : collection.slice(0, -1).replace('-', ' ').toUpperCase();
    const titleLines = wrap(title).map((line, index) => `<tspan x="92" dy="${index ? 72 : 0}">${escapeXml(line)}</tspan>`).join('');
    const summary = wrap(data.summary || `${collection.slice(0, -1)} intelligence record`, 66, 2).map((line, index) => `<tspan x="92" dy="${index ? 32 : 0}">${escapeXml(line)}</tspan>`).join('');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#0b0f14"/><path d="M760 0H1200V630H910L760 470Z" fill="#111923"/><path d="M960 0L1200 240M830 0L1200 370" stroke="#e85b50" stroke-opacity=".23"/><rect x="64" y="64" width="6" height="502" fill="#e85b50"/><path d="M94 82V138M146 82V138M94 82L120 110L146 82M94 138L120 110L146 138" stroke="#e85b50" stroke-width="7" fill="none"/><circle cx="120" cy="110" r="5" fill="#f4f6f8"/><text x="170" y="105" fill="#f4f6f8" font-family="Arial,sans-serif" font-size="25" font-weight="700" letter-spacing="5">APT NOTES</text><text x="170" y="134" fill="#73849a" font-family="monospace" font-size="14" letter-spacing="2">BY HECAVEX</text><text x="92" y="218" fill="#e85b50" font-family="monospace" font-size="17" font-weight="700" letter-spacing="3">${escapeXml(label)}</text><text x="92" y="302" fill="#f4f6f8" font-family="Arial,sans-serif" font-size="62" font-weight="700">${titleLines}</text><text x="92" y="510" fill="#aeb8c4" font-family="Arial,sans-serif" font-size="23">${summary}</text><text x="1008" y="556" fill="#7eb6ea" font-family="monospace" font-size="16">apt.hecavex.com</text></svg>`;
    await sharp(Buffer.from(svg)).png({ quality: 92 }).toFile(path.join(output, `${collection.slice(0, -1)}-${data.slug}.png`));
  }
}

console.log('Generated APT Notes social previews.');
