import { adminDb } from './admin';
import type { Plat, Actualite, Temoignage, Reservation } from '@/types';

// Firestore Timestamps are class instances — Next.js cannot pass them from
// Server Components to Client Components. Convert every Timestamp to an ISO string.
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
