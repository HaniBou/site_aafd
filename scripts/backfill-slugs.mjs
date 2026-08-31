/**
 * Recalcule le slug de chaque actualité à partir de son titre, et garantit
 * l'unicité. À lancer une fois après la mise en place des URLs parlantes,
 * ou après avoir renommé des articles avec une ancienne version du site.
 *
 *   node --env-file=.env.local scripts/backfill-slugs.mjs          (aperçu)
 *   node --env-file=.env.local scripts/backfill-slugs.mjs --write  (applique)
 */
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;

if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
  console.error(
    'Variables Firebase Admin manquantes.\n' +
      'Lancez avec : node --env-file=.env.local scripts/backfill-slugs.mjs',
  );
  process.exit(1);
}

const write = process.argv.includes('--write');

const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });

const db = getFirestore(app);

// Doit rester identique à buildSlug() dans lib/slug.ts
function buildSlug(title) {
  const slug = String(title ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
    .replace(/^-+|-+$/g, '');
  return slug || 'actualite';
}

const snap = await db.collection('actualites').orderBy('date', 'asc').get();
const used = new Set();
let changed = 0;

for (const doc of snap.docs) {
  const data = doc.data();
  const base = buildSlug(data.title);

  let slug = base;
  let suffix = 2;
  while (used.has(slug)) slug = `${base}-${suffix++}`;
  used.add(slug);

  if (data.slug === slug) continue;

  changed++;
  console.log(`${doc.id}\n  "${data.title}"\n  ${data.slug ?? '(aucun)'} → ${slug}\n`);
  if (write) await doc.ref.update({ slug });
}

console.log(
  changed === 0
    ? `${snap.size} actualité(s) — tous les slugs sont déjà corrects.`
    : write
      ? `${changed} slug(s) mis à jour sur ${snap.size}.`
      : `${changed} slug(s) à corriger sur ${snap.size}. Relancez avec --write pour appliquer.`,
);

process.exit(0);
