import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;

if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
  console.error(
    'Variables Firebase Admin manquantes.\n' +
      'Lancez avec : node --env-file=.env.local scripts/migrate-ventes.mjs',
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

const platsSnap = await db.collection('plats').get();
const aMigrer = platsSnap.docs.filter(doc => !doc.data().venteId);

if (aMigrer.length === 0) {
  console.log(`${platsSnap.size} plat(s) — tous sont déjà rattachés à une vente.`);
  process.exit(0);
}

const enVente = aMigrer.filter(doc => !doc.data().cloture);
const archives = aMigrer.filter(doc => doc.data().cloture);

const maintenant = new Date();
const dansUnMois = new Date(maintenant.getTime() + 30 * 24 * 60 * 60 * 1000);

const ventes = [];

if (enVente.length > 0) {
  ventes.push({
    ref: db.collection('ventes').doc(),
    plats: enVente,
    data: {
      titre: 'Vente en cours',
      statut: 'ouverte',
      dateLimiteCommande: '',
      dateRetrait: dansUnMois.toISOString(),
      lieuRetrait: 'Local associatif — Val de Saône',
      message: '',
      createdAt: maintenant.toISOString(),
    },
  });
}

if (archives.length > 0) {
  ventes.push({
    ref: db.collection('ventes').doc(),
    plats: archives,
    data: {
      titre: 'Ventes passées (avant refonte)',
      statut: 'fermee',
      dateLimiteCommande: '',
      dateRetrait: maintenant.toISOString(),
      lieuRetrait: 'Local associatif — Val de Saône',
      message: '',
      createdAt: maintenant.toISOString(),
    },
  });
}

const reservationsSnap = await db.collection('reservations').get();
const venteIdParPlat = new Map();
for (const vente of ventes) {
  for (const plat of vente.plats) venteIdParPlat.set(plat.id, vente.ref.id);
}
const reservationsAMigrer = reservationsSnap.docs.filter(
  doc => !doc.data().venteId && venteIdParPlat.has(doc.data().platId),
);

for (const vente of ventes) {
  console.log(`\nVente « ${vente.data.titre} » (${vente.data.statut}) — ${vente.plats.length} plat(s) :`);
  for (const plat of vente.plats) console.log(`  · ${plat.data().nom}`);
}
console.log(`\n${reservationsAMigrer.length} réservation(s) à rattacher.`);

if (!write) {
  console.log('\nAperçu uniquement. Relancez avec --write pour appliquer.');
  process.exit(0);
}

const batch = db.batch();

for (const vente of ventes) {
  batch.set(vente.ref, vente.data);
  for (const plat of vente.plats) {
    batch.update(plat.ref, { venteId: vente.ref.id, cloture: FieldValue.delete() });
  }
}

for (const reservation of reservationsAMigrer) {
  const venteId = venteIdParPlat.get(reservation.data().platId);
  const vente = ventes.find(item => item.ref.id === venteId);
  batch.update(reservation.ref, { venteId, venteTitre: vente.data.titre });
}

await batch.commit();

console.log(
  `\n${ventes.length} vente(s) créée(s), ${aMigrer.length} plat(s) et ` +
    `${reservationsAMigrer.length} réservation(s) rattaché(e)s.`,
);

process.exit(0);
