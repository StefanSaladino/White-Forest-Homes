/** Regenerate responsive WebP files from downloaded, full-resolution Pexels originals.
 * Usage: node scripts/build-photos.mjs /path/to/originals
 * Requires sharp (an optional authoring tool; not a site runtime dependency).
 * Original names: <Pexels ID>-original.jpg. Source URLs and credits: PHOTO-CREDITS.md.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const sharp = process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES
  ? require(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, 'sharp'))
  : require('sharp');
const root = fileURLToPath(new URL('../', import.meta.url));
const sources = JSON.parse(await fs.readFile(new URL('./photo-sources.json', import.meta.url), 'utf8'));
if (!process.argv[2]) throw new Error('Pass the directory containing full-resolution originals.');
const output = path.join(root, 'assets/images/photos');
await fs.mkdir(output, { recursive: true });
for (const photo of sources) {
  const source = path.resolve(process.argv[2], `${photo.id}-original.jpg`);
  const meta = await sharp(source).metadata();
  for (const width of photo.widths) {
    const height = Math.round(width * photo.ratio[1] / photo.ratio[0]);
    if (width > meta.width || height > meta.height) throw new Error(`Would upscale ${photo.name}`);
    await sharp(source).rotate().resize(width, height, { fit: 'cover', position: 'centre', withoutEnlargement: true })
      .webp({ quality: 85, effort: 6 }).toFile(path.join(output, `${photo.name}-${width}.webp`));
  }
  console.log(`Built ${photo.name} from ${meta.width}×${meta.height} original`);
}
