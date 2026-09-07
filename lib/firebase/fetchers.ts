import { adminDb } from './admin';
import { buildSlug } from '@/lib/slug';
import { retraitAVenir } from '@/lib/vente';
import type { Plat, Actualite, Temoignage, Reservation, Moment, Vente } from '@/types';

function serializeDoc(data: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (
      value !== null &&
      typeof value === 'object' &&
      typeof (value as { toDate?: unknown }).toDate === 'function'
    ) {
      out[key] = (value as { toDate: () => Date }).toDate().toISOString();
    } else {
      out[key] = value;
    }
  }
  return out;
}

export async function getVenteByIdAdmin(id: string): Promise<Vente | null> {
  const doc = await adminDb.collection('ventes').doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...serializeDoc(doc.data()!) } as Vente;
}

export async function getVentesAdmin(): Promise<Vente[]> {
  const snap = await adminDb.collection('ventes').get();
  const items = snap.docs.map(
    doc => ({ id: doc.id, ...serializeDoc(doc.data()) } as Vente),
  );
  return items.sort((a, b) =>
    (b.dateRetrait ?? b.createdAt ?? '').localeCompare(a.dateRetrait ?? a.createdAt ?? ''),
  );
}

export async function getVenteEnCours(): Promise<Vente | null> {
  const snap = await adminDb.collection('ventes').where('statut', '==', 'ouverte').get();
  if (snap.empty) return null;
  const items = snap.docs
    .map(doc => ({ id: doc.id, ...serializeDoc(doc.data()) } as Vente))
    .sort((a, b) => (a.dateRetrait ?? '').localeCompare(b.dateRetrait ?? ''));
  return items[0];
}

export async function getProchaineVenteAnnoncee(): Promise<Vente | null> {
  const snap = await adminDb.collection('ventes').where('statut', '==', 'brouillon').get();
  if (snap.empty) return null;
  const items = snap.docs
    .map(doc => ({ id: doc.id, ...serializeDoc(doc.data()) } as Vente))
    .filter(vente => retraitAVenir(vente))
    .sort((a, b) => (a.dateRetrait ?? '').localeCompare(b.dateRetrait ?? ''));
  return items[0] ?? null;
}

export async function getPlatsByVenteAdmin(venteId: string): Promise<Plat[]> {
  const snap = await adminDb.collection('plats').where('venteId', '==', venteId).get();
  const items = snap.docs.map(
    doc => ({ id: doc.id, ...serializeDoc(doc.data()) } as Plat),
  );
  return items.sort((a, b) => (a.dateAjout ?? '').localeCompare(b.dateAjout ?? ''));
}

export async function getPlatByIdAdmin(id: string): Promise<Plat | null> {
  const doc = await adminDb.collection('plats').doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...serializeDoc(doc.data()!) } as Plat;
}

export async function getPlatsAdmin(): Promise<Plat[]> {
  const snap = await adminDb.collection('plats').get();
  const items = snap.docs.map(
    doc => ({ id: doc.id, ...serializeDoc(doc.data()) } as Plat),
  );
  return items.sort((a, b) => (b.dateAjout ?? '').localeCompare(a.dateAjout ?? ''));
}

export async function getActualiteByIdAdmin(id: string): Promise<Actualite | null> {
  const doc = await adminDb.collection('actualites').doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...serializeDoc(doc.data()!) } as Actualite;
}

export async function getActualiteBySlugAdmin(slug: string): Promise<Actualite | null> {
  const snap = await adminDb
    .collection('actualites')
    .where('slug', '==', slug)
    .limit(1)
    .get();

  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { id: doc.id, ...serializeDoc(doc.data()) } as Actualite;
}

export async function buildUniqueActualiteSlug(
  title: string,
  excludeId?: string,
): Promise<string> {
  const base = buildSlug(title);

  for (let suffix = 1; suffix < 50; suffix++) {
    const candidate = suffix === 1 ? base : `${base}-${suffix}`;
    const snap = await adminDb
      .collection('actualites')
      .where('slug', '==', candidate)
      .get();

    const taken = snap.docs.some(doc => doc.id !== excludeId);
    if (!taken) return candidate;
  }

  return `${base}-${Date.now()}`;
}

export async function getActualitesAdmin(): Promise<Actualite[]> {
  const snap = await adminDb.collection('actualites').get();
  const items = snap.docs.map(
    doc => ({ id: doc.id, ...serializeDoc(doc.data()) } as Actualite),
  );
  return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getTemoignageByIdAdmin(id: string): Promise<Temoignage | null> {
  const doc = await adminDb.collection('temoignages').doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...serializeDoc(doc.data()!) } as Temoignage;
}

export async function getTemoignagesAdmin(): Promise<Temoignage[]> {
  const snap = await adminDb.collection('temoignages').get();
  const items = snap.docs.map(
    doc => ({ id: doc.id, ...serializeDoc(doc.data()) } as Temoignage),
  );
  return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getReservationsAdmin(): Promise<Reservation[]> {
  const snap = await adminDb.collection('reservations').get();
  const items = snap.docs.map(doc => {
    const data = serializeDoc(doc.data());
    return { id: doc.id, ...data } as Reservation;
  });
  return items.sort(
    (a, b) =>
      new Date(b.dateReservation).getTime() - new Date(a.dateReservation).getTime(),
  );
}

export async function getMomentByIdAdmin(id: string): Promise<Moment | null> {
  const doc = await adminDb.collection('moments').doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...serializeDoc(doc.data()!) } as Moment;
}

export async function getMomentsAdmin(): Promise<Moment[]> {
  const snap = await adminDb.collection('moments').get();
  const items = snap.docs.map(
    doc => ({ id: doc.id, ...serializeDoc(doc.data()) } as Moment),
  );
  return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
