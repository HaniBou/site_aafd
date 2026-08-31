import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import { adminDb } from '@/lib/firebase/admin';
import { verifySessionToken, COOKIE_NAME } from '@/lib/auth/session';
import { getTemoignagesAdmin } from '@/lib/firebase/fetchers';

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
    const items = await getTemoignagesAdmin();
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
  const { nom, role, type, contenu, date, image } = body;

  if (!String(nom ?? '').trim() || !String(contenu ?? '').trim()) {
    return NextResponse.json(
      { error: 'Le nom et le témoignage sont obligatoires' },
      { status: 400 },
    );
  }

  const docRef = await adminDb.collection('temoignages').add({
    nom: String(nom).trim(),
    role: String(role ?? ''),
    type: type === 'Benevole' ? 'Benevole' : 'Famille accompagnee',
    contenu: String(contenu).trim(),
    date: date ? String(date) : new Date().toISOString(),
    image: image ? String(image) : 'none',
    uploadedAt: FieldValue.serverTimestamp(),
  });

  revalidatePath('/temoignages');
  return NextResponse.json({ id: docRef.id }, { status: 201 });
}
