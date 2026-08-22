import fs from 'node:fs';
import path from 'node:path';
import * as fontkit from 'fontkit';
import sharp from 'sharp';
import YAML from 'yaml';

const collectionMetadata = {
  actors: { singular: 'actor', label: 'THREAT ACTOR PROFILE' },
  campaigns: { singular: 'campaign', label: 'CAMPAIGN' },
  malware: { singular: 'malware', label: 'MALWARE' },
  tools: { singular: 'tool', label: 'TOOL' },
  techniques: { singular: 'technique', label: 'TECHNIQUE' },
  sources: { singular: 'source', label: 'SOURCE' }
};
const collections = Object.keys(collectionMetadata);
const output = path.resolve('public/og/generated');
const defaultSvgPath = path.resolve('public/og/default.svg');
const defaultPngPath = path.resolve('public/og/default.png');
fs.mkdirSync(output, { recursive: true });

const fontFiles = {
  interRegular: 'public/fonts/inter/inter-latin-400-normal.woff2',
  interBold: 'public/fonts/inter/inter-latin-700-normal.woff2',
  monoRegular: 'public/fonts/ibm-plex-mono/ibm-plex-mono-latin-400-normal.woff2',
  monoBold: 'public/fonts/ibm-plex-mono/ibm-plex-mono-latin-700-normal.woff2'
};

for (const file of Object.values(fontFiles)) {
  if (!fs.existsSync(path.resolve(file))) throw new Error(`Required social-card font is missing: ${file}`);
}

const fonts = Object.fromEntries(
  Object.entries(fontFiles).map(([name, file]) => [name, fontkit.openSync(path.resolve(file))])
);

const number = value => Number(value.toFixed(5));
const vectorText = (value, { x, y, font, size, fill, letterSpacing = 0 }) => {
  const run = font.layout(String(value));
  const scale = size / font.unitsPerEm;
  const spacing = letterSpacing / scale;
  let cursor = 0;
  const glyphs = run.glyphs.map((glyph, index) => {
    const position = run.positions[index];
    const transform = `translate(${number(cursor + position.xOffset)} ${number(position.yOffset)})`;
    cursor += position.xAdvance + (index < run.glyphs.length - 1 ? spacing : 0);
    return `<path d="${glyph.path.toSVG()}" transform="${transform}"/>`;
  }).join('');
  return `<g fill="${fill}" transform="translate(${x} ${y}) scale(${number(scale)} ${number(-scale)})">${glyphs}</g>`;
};

const svgDocument = body => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><metadata>Text converted to vector outlines from repository-pinned Inter and IBM Plex Mono WOFF2 assets.</metadata>${body}</svg>`;
const frontMatter = file => {
  const source = fs.readFileSync(file, 'utf8');
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match ? YAML.parse(match[1]) : null;
};
const wrap = (value, width = 28, lines = 3) => {
  const words = String(value).split(/\s+/);
  const result = [];
  for (const word of words) {
    const current = result.at(-1);
    if (!current || `${current} ${word}`.length > width) result.push(word);
    else result[result.length - 1] = `${current} ${word}`;
  }
  if (result.length > lines) result.splice(lines - 1, result.length, `${result.slice(lines - 1).join(' ').slice(0, width - 1)}…`);
  return result;
};

const grid = '<path d="M760 86h440M760 166h440M760 246h440M760 326h440M760 406h440M840 0v630M920 0v630M1000 0v630M1080 0v630M1160 0v630" stroke="#1e3440"/>';
const mark = '<path d="M94 82V138M146 82V138M94 82L120 110L146 82M94 138L120 110L146 138" stroke="#44c7dc" stroke-width="7" fill="none"/><circle cx="120" cy="110" r="5" fill="#f2f8fb"/>';

const defaultSvg = svgDocument([
  '<rect width="1200" height="630" fill="#05080b"/>',
  '<path d="M760 0h440v630H910L760 470Z" fill="#0b1117"/>',
  grid,
  '<rect x="64" y="64" width="6" height="502" fill="#44c7dc"/>',
  mark,
  vectorText('APT NOTES', { x: 170, y: 105, font: fonts.interBold, size: 25, fill: '#f2f8fb', letterSpacing: 5 }),
  vectorText('BY HECAVEX', { x: 170, y: 134, font: fonts.monoRegular, size: 14, fill: '#8397a3', letterSpacing: 2 }),
  vectorText('APT NOTES', { x: 92, y: 302, font: fonts.interBold, size: 62, fill: '#f2f8fb', letterSpacing: -4 }),
  vectorText('STRUCTURED THREAT INTELLIGENCE', { x: 96, y: 356, font: fonts.monoRegular, size: 24, fill: '#a2da68', letterSpacing: 5 }),
  vectorText('Source-backed threat actor research.', { x: 96, y: 462, font: fonts.interRegular, size: 28, fill: '#b6c6cf' }),
  vectorText('apt.hecavex.com', { x: 96, y: 540, font: fonts.monoRegular, size: 17, fill: '#44c7dc' })
].join(''));
fs.writeFileSync(defaultSvgPath, `${defaultSvg}\n`, 'utf8');
await sharp(Buffer.from(defaultSvg)).png({ quality: 92 }).toFile(defaultPngPath);

for (const collection of collections) {
  const { singular, label } = collectionMetadata[collection];
  const directory = path.resolve('src/content', collection);
  for (const name of fs.readdirSync(directory).filter(file => /\.mdx?$/.test(file))) {
    const data = frontMatter(path.join(directory, name));
    if (!data || data.draft) continue;
    const title = data.name || data.title;
    const titleLines = wrap(title).map((line, index) => vectorText(line, { x: 92, y: 302 + index * 72, font: fonts.interBold, size: 62, fill: '#f2f8fb' })).join('');
    const summary = wrap(data.summary || `${singular} intelligence record`, 66, 2).map((line, index) => vectorText(line, { x: 92, y: 510 + index * 32, font: fonts.interRegular, size: 23, fill: '#b6c6cf' })).join('');
    const svg = svgDocument([
      '<rect width="1200" height="630" fill="#05080b"/>',
      '<path d="M760 0H1200V630H910L760 470Z" fill="#0b1117"/>',
      grid,
      '<rect x="64" y="64" width="6" height="502" fill="#44c7dc"/>',
      mark,
      vectorText('APT NOTES', { x: 170, y: 105, font: fonts.interBold, size: 25, fill: '#f2f8fb', letterSpacing: 5 }),
      vectorText('BY HECAVEX', { x: 170, y: 134, font: fonts.monoRegular, size: 14, fill: '#8397a3', letterSpacing: 2 }),
      vectorText(label, { x: 92, y: 218, font: fonts.monoBold, size: 17, fill: '#44c7dc', letterSpacing: 3 }),
      titleLines,
      summary,
      vectorText('apt.hecavex.com', { x: 1008, y: 556, font: fonts.monoRegular, size: 16, fill: '#a2da68' })
    ].join(''));
    await sharp(Buffer.from(svg)).png({ quality: 92 }).toFile(path.join(output, `${singular}-${data.slug}.png`));
  }
}

console.log('Generated APT Notes social previews from local font outlines.');
