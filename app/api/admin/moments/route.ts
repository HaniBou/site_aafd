import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import { adminDb } from '@/lib/firebase/admin';
import { verifySessionToken, COOKIE_NAME } from '@/lib/auth/session';
import { getMomentsAdmin } from '@/lib/firebase/fetchers';

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
    const items = await getMomentsAdmin();
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
  const { titre, image, date } = body as {
    titre?: string;
    image?: string;
    date?: string;
  };

  if (!titre?.trim()) {
    return NextResponse.json({ error: 'Le titre est obligatoire' }, { status: 400 });
  }

  if (!image || image === 'none') {
    return NextResponse.json({ error: 'La photo est obligatoire' }, { status: 400 });
  }

  const docRef = await adminDb.collection('moments').add({
    titre: String(titre).trim(),
    image: String(image),
    date: date ? String(date) : new Date().toISOString(),
    uploadedAt: FieldValue.serverTimestamp(),
  });

  revalidatePath('/temoignages');
  return NextResponse.json({ id: docRef.id }, { status: 201 });
}
