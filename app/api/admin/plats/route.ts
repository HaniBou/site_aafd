import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { adminDb } from '@/lib/firebase/admin';
import { verifySessionToken, COOKIE_NAME } from '@/lib/auth/session';
import { getPlatsAdmin } from '@/lib/firebase/fetchers';

export const runtime = 'nodejs';

async function checkSession() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) throw new Error('Unauthorized');
  await verifySessionToken(token);
}

export async function GET() {
  try {
    await checkSession();
    const items = await getPlatsAdmin();
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await checkSession();
  } catch {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const body = await request.json();
  const { nom, description, typeMenu, cuisiniers, quantite, prix, image } = body;
  const docRef = await adminDb.collection('plats').add({
    nom: String(nom ?? ''),
    description: String(description ?? ''),
    typeMenu: String(typeMenu ?? ''),
    cuisiniers: String(cuisiniers ?? ''),
    quantite: Number(quantite ?? 0),
    prix: Number(prix ?? 0),
    image: image ? String(image) : null,
    dateAjout: new Date().toISOString(),
  });

  revalidatePath('/vente-plats');
  return NextResponse.json({ id: docRef.id }, { status: 201 });
}
