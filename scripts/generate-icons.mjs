import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LOGO = path.join(ROOT, 'public/images/test-logo.webp');

const GREEN = '#3f7a52';
const MINT = '#bfe7d3';

function markSvg(size) {
  const short = size < 24;
  const text = short ? 'A' : 'AAFD';
  const r = Math.round(size * 0.22);
  const fontSize = Math.round(size * (short ? 0.72 : 0.3));
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">` +
      `<rect width="${size}" height="${size}" rx="${r}" fill="${GREEN}"/>` +
      `<text x="${size / 2}" y="${size / 2}" font-family="Arial, Helvetica, sans-serif"` +
      ` font-size="${fontSize}" font-weight="700" letter-spacing="${short ? 0 : -size * 0.008}"` +
      ` fill="#ffffff" text-anchor="middle" dominant-baseline="central">${text}</text>` +
      `</svg>`,
  );
}

const markPng = size => sharp(markSvg(size)).png({ compressionLevel: 9 }).toBuffer();

function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  const dir = Buffer.alloc(16 * images.length);
  let offset = 6 + dir.length;

  images.forEach((img, i) => {
    const o = i * 16;
    dir[o] = img.size >= 256 ? 0 : img.size;
    dir[o + 1] = img.size >= 256 ? 0 : img.size;
    dir.writeUInt16LE(1, o + 4);
    dir.writeUInt16LE(32, o + 6);
    dir.writeUInt32LE(img.data.length, o + 8);
    dir.writeUInt32LE(offset, o + 12);
    offset += img.data.length;
  });

  return Buffer.concat([header, dir, ...images.map(i => i.data)]);
}

const write = (rel, buf) => {
  fs.writeFileSync(path.join(ROOT, rel), buf);
  console.log(`  ${rel} (${buf.length} octets)`);
};

const icoImages = [];
for (const size of [16, 32, 48]) {
  icoImages.push({ size, data: await markPng(size) });
}
write('app/favicon.ico', buildIco(icoImages));
write('app/icon.png', await markPng(512));

const logoOn = size =>
  sharp(LOGO)
    .resize(size, size, { fit: 'contain', background: MINT })
    .flatten({ background: MINT })
    .png({ compressionLevel: 9 })
    .toBuffer();

write('app/apple-icon.png', await logoOn(180));
write('public/icon-192.png', await logoOn(192));
write('public/icon-512.png', await logoOn(512));

const inner = await sharp(LOGO).resize(320, 320, { fit: 'contain', background: MINT }).toBuffer();
write(
  'public/icon-maskable-512.png',
  await sharp(inner)
    .extend({ top: 96, bottom: 96, left: 96, right: 96, background: MINT })
    .flatten({ background: MINT })
    .png({ compressionLevel: 9 })
    .toBuffer(),
);

console.log('Icônes générées.');
