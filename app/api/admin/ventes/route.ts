import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { adminDb } from '@/lib/firebase/admin';
import { requireSession } from '@/lib/auth/requireSession';
import { getVentesAdmin } from '@/lib/firebase/fetchers';

export const runtime = 'nodejs';

export async function GET() {
  try {
    await requireSession();
    return NextResponse.json(await getVentesAdmin());
  } catch {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireSession();
  } catch {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const titre = String(body.titre ?? '').trim();

  if (!titre) {
    return NextResponse.json({ error: 'Le titre de la vente est obligatoire.' }, { status: 400 });
  }

  const docRef = await adminDb.collection('ventes').add({
    titre,
    statut: 'brouillon',
    dateLimiteCommande: String(body.dateLimiteCommande ?? ''),
    dateRetrait: String(body.dateRetrait ?? ''),
    lieuRetrait: String(body.lieuRetrait ?? ''),
    message: String(body.message ?? ''),
    createdAt: new Date().toISOString(),
  });

  revalidatePath('/vente-plats');
  return NextResponse.json({ id: docRef.id }, { status: 201 });
}
