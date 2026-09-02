/**
 * Génère le jeu d'icônes du site à partir du logo AAFD.
 *
 *   node scripts/generate-icons.mjs
 *
 * `sharp` n'est pas déclaré dans package.json : il arrive avec Next, qui s'en sert
 * pour optimiser les images. Si un jour l'import échoue, `npm i -D sharp`.
 *
 * À relancer si le logo change. Produit :
 *   app/favicon.ico          onglet du navigateur (16/32/48)
 *   app/icon.png             icône haute définition
 *   app/apple-icon.png       écran d'accueil iOS
 *   public/icon-192.png      manifeste PWA
 *   public/icon-512.png      manifeste PWA
 *   public/icon-maskable-512.png  gabarit rond Android
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LOGO = path.join(ROOT, 'public/images/test-logo.webp');

// Vert repris du globe du logo, assombri pour tenir le contraste avec du blanc.
const GREEN = '#3f7a52';
// Fond menthe du logo, pour combler les bords des icônes carrées.
const MINT = '#bfe7d3';

/**
 * Marque simplifiée. Le logo complet est une illustration détaillée : réduit à
 * 16 ou 32 px il devient une tache. C'est la seule chose lisible à cette taille.
 *
 * En dessous de 24 px, même « AAFD » se referme : chaque lettre ne dispose plus
 * que de trois pixels de large. Le monogramme prend alors le relais — même vert,
 * même carré arrondi, donc la même identité, simplement plus lisible.
 */
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

/** Conteneur ICO à charges PNG, accepté par tous les navigateurs actuels. */
function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // réservé
  header.writeUInt16LE(1, 2); // type 1 = icône
  header.writeUInt16LE(images.length, 4);

  const dir = Buffer.alloc(16 * images.length);
  let offset = 6 + dir.length;

  images.forEach((img, i) => {
    const o = i * 16;
    dir[o] = img.size >= 256 ? 0 : img.size; // 0 signifie 256
    dir[o + 1] = img.size >= 256 ? 0 : img.size;
    dir.writeUInt16LE(1, o + 4); // plans
    dir.writeUInt16LE(32, o + 6); // bits par pixel
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

// --- Onglet du navigateur : la marque simplifiée ---
const icoImages = [];
for (const size of [16, 32, 48]) {
  icoImages.push({ size, data: await markPng(size) });
}
write('app/favicon.ico', buildIco(icoImages));
write('app/icon.png', await markPng(512));

// --- Écran d'accueil et application installée : le vrai logo, lisible à cette taille ---
const logoOn = size =>
  sharp(LOGO)
    .resize(size, size, { fit: 'contain', background: MINT })
    .flatten({ background: MINT })
    .png({ compressionLevel: 9 })
    .toBuffer();

write('app/apple-icon.png', await logoOn(180));
write('public/icon-192.png', await logoOn(192));
write('public/icon-512.png', await logoOn(512));

// Maskable : Android rogne jusqu'à 20 % de chaque bord. Le logo tient dans les
// 60 % centraux pour survivre au gabarit rond.
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
