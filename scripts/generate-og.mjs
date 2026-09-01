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
const faviconSvgPath = path.resolve('public/favicon.svg');
const faviconIcoPath = path.resolve('public/favicon.ico');
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

const writePngIco = async (source, destination, sizes = [16, 32, 48]) => {
  const images = await Promise.all(sizes.map(size => sharp(source).resize(size, size).png().toBuffer()));
  const directory = Buffer.alloc(6 + images.length * 16);
  directory.writeUInt16LE(0, 0);
  directory.writeUInt16LE(1, 2);
  directory.writeUInt16LE(images.length, 4);
  let offset = directory.length;
  images.forEach((image, index) => {
    const entry = 6 + index * 16;
    directory.writeUInt8(sizes[index] === 256 ? 0 : sizes[index], entry);
    directory.writeUInt8(sizes[index] === 256 ? 0 : sizes[index], entry + 1);
    directory.writeUInt8(0, entry + 2);
    directory.writeUInt8(0, entry + 3);
    directory.writeUInt16LE(1, entry + 4);
    directory.writeUInt16LE(32, entry + 6);
    directory.writeUInt32LE(image.length, entry + 8);
    directory.writeUInt32LE(offset, entry + 12);
    offset += image.length;
  });
  fs.writeFileSync(destination, Buffer.concat([directory, ...images]));
};

const mark = '<path d="M94 82V138M146 82V138M94 82L120 110L146 82M94 138L120 110L146 138" stroke="#55b9b1" stroke-width="7" fill="none"/><circle cx="120" cy="110" r="5" fill="#ece9e1"/>';

const defaultSvg = svgDocument([
  '<rect width="1200" height="630" fill="#111416"/>',
  '<rect x="760" width="440" height="630" fill="#171b1d"/>',
  '<rect x="64" y="64" width="6" height="502" fill="#55b9b1"/>',
  mark,
  vectorText('APT NOTES', { x: 170, y: 105, font: fonts.interBold, size: 25, fill: '#ece9e1', letterSpacing: 5 }),
  vectorText('BY HECAVEX', { x: 170, y: 134, font: fonts.monoRegular, size: 14, fill: '#8d969a', letterSpacing: 2 }),
  vectorText('APT NOTES', { x: 92, y: 302, font: fonts.interBold, size: 62, fill: '#ece9e1', letterSpacing: -4 }),
  vectorText('STRUCTURED THREAT INTELLIGENCE', { x: 96, y: 356, font: fonts.monoRegular, size: 24, fill: '#55b9b1', letterSpacing: 5 }),
  vectorText('Source-backed threat actor research.', { x: 96, y: 462, font: fonts.interRegular, size: 28, fill: '#ece9e1' }),
  vectorText('apt.hecavex.com', { x: 96, y: 540, font: fonts.monoRegular, size: 17, fill: '#55b9b1' })
].join(''));
fs.writeFileSync(defaultSvgPath, `${defaultSvg}\n`, 'utf8');
await sharp(Buffer.from(defaultSvg)).png({ quality: 92 }).toFile(defaultPngPath);
await sharp(faviconSvgPath).resize(180, 180).png().toFile(path.resolve('public/apple-touch-icon.png'));
await sharp(faviconSvgPath).resize(192, 192).png().toFile(path.resolve('public/icon-192.png'));
await sharp(faviconSvgPath).resize(512, 512).png().toFile(path.resolve('public/icon-512.png'));
await writePngIco(faviconSvgPath, faviconIcoPath);

for (const collection of collections) {
  const { singular, label } = collectionMetadata[collection];
  const directory = path.resolve('src/content', collection);
  for (const name of fs.readdirSync(directory).filter(file => /\.mdx?$/.test(file))) {
    const data = frontMatter(path.join(directory, name));
    if (!data || data.draft) continue;
    const title = data.name || data.title;
    const titleLines = wrap(title).map((line, index) => vectorText(line, { x: 92, y: 302 + index * 72, font: fonts.interBold, size: 62, fill: '#ece9e1' })).join('');
    const summary = wrap(data.summary || `${singular} intelligence record`, 66, 2).map((line, index) => vectorText(line, { x: 92, y: 510 + index * 32, font: fonts.interRegular, size: 23, fill: '#ece9e1' })).join('');
    const svg = svgDocument([
      '<rect width="1200" height="630" fill="#111416"/>',
      '<rect x="760" width="440" height="630" fill="#171b1d"/>',
      '<rect x="64" y="64" width="6" height="502" fill="#55b9b1"/>',
      mark,
      vectorText('APT NOTES', { x: 170, y: 105, font: fonts.interBold, size: 25, fill: '#ece9e1', letterSpacing: 5 }),
      vectorText('BY HECAVEX', { x: 170, y: 134, font: fonts.monoRegular, size: 14, fill: '#8d969a', letterSpacing: 2 }),
      vectorText(label, { x: 92, y: 218, font: fonts.monoBold, size: 17, fill: '#55b9b1', letterSpacing: 3 }),
      titleLines,
      summary,
      vectorText('apt.hecavex.com', { x: 1008, y: 556, font: fonts.monoRegular, size: 16, fill: '#55b9b1' })
    ].join(''));
    await sharp(Buffer.from(svg)).png({ quality: 92 }).toFile(path.join(output, `${singular}-${data.slug}.png`));
  }
}

console.log('Generated APT Notes social previews from local font outlines.');
