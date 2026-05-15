import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken, COOKIE_NAME } from '@/lib/auth/session';

export const runtime = 'nodejs';

async function checkSession() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) throw new Error('Unauthorized');
  await verifySessionToken(token);
}

export async function POST(request: NextRequest) {
  try {
    await checkSession();
  } catch {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'Aucun fichier' }, { status: 400 });
  }

  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Seules les images sont acceptées' }, { status: 400 });
  }

  const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'Fichier trop volumineux (max 5 Mo)' }, { status: 400 });
  }

  const uploadForm = new FormData();
  uploadForm.append('file', file);
  uploadForm.append(
    'upload_preset',
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
  );

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: uploadForm },
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error('[upload] Cloudinary error', error);
    return NextResponse.json(
      { error: (error as { error?: { message?: string } }).error?.message ?? 'Upload failed' },
      { status: 500 },
    );
  }

  const data = (await response.json()) as { secure_url: string };
  return NextResponse.json({ url: data.secure_url });
}
