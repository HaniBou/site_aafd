import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken, COOKIE_NAME } from '@/lib/auth/session';
import { deleteCloudinaryImage } from '@/lib/cloudinary';

export const runtime = 'nodejs';

function startsWith(bytes: Uint8Array, signature: number[], offset = 0): boolean {
  return signature.every((byte, i) => bytes[offset + i] === byte);
}

function isSupportedImage(bytes: Uint8Array): boolean {
  if (bytes.length < 12) return false;

  const jpeg = startsWith(bytes, [0xff, 0xd8, 0xff]);
  const png = startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const gif = startsWith(bytes, [0x47, 0x49, 0x46, 0x38]);
  const webp =
    startsWith(bytes, [0x52, 0x49, 0x46, 0x46]) && // "RIFF"
    startsWith(bytes, [0x57, 0x45, 0x42, 0x50], 8); // "WEBP"

  return jpeg || png || gif || webp;
}

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

  // Doit rester aligné avec la limite annoncée dans les formulaires admin.
  const MAX_SIZE = 10 * 1024 * 1024; // 10 Mo
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'Fichier trop volumineux (max 10 Mo)' }, { status: 400 });
  }

  // file.type vient du navigateur et est falsifiable : on vérifie la signature
  // réelle du fichier (magic bytes).
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!isSupportedImage(bytes)) {
    return NextResponse.json(
      { error: 'Seules les images JPEG, PNG, WebP et GIF sont acceptées' },
      { status: 400 },
    );
  }

  const uploadForm = new FormData();
  uploadForm.append('file', new Blob([bytes]), 'image');
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

// Appelé par les formulaires admin quand l'enregistrement échoue après un
// upload réussi : sans ça, l'image resterait orpheline sur Cloudinary.
export async function DELETE(request: NextRequest) {
  try {
    await checkSession();
  } catch {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { url } = (await request.json().catch(() => ({}))) as { url?: string };

  if (!url || !url.startsWith('https://res.cloudinary.com/')) {
    return NextResponse.json({ error: 'URL invalide' }, { status: 400 });
  }

  await deleteCloudinaryImage(url);
  return NextResponse.json({ success: true });
}
