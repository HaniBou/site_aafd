import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from '@/lib/firebase/admin';
import { requireSession } from '@/lib/auth/requireSession';
import { deleteCloudinaryImage } from '@/lib/cloudinary';
import { champsDePage, erreurTexte, trouverPage } from '@/lib/contenuSite';

export const runtime = 'nodejs';

// Enregistre les textes et photos modifies d'une page. Une valeur null (ou
// egale a l'originale) remet l'element d'origine.
export async function PUT(request: NextRequest) {
  try {
    await requireSession();
  } catch {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { page: pageId, valeurs } = (await request.json().catch(() => ({}))) as {
    page?: string;
    valeurs?: Record<string, unknown>;
  };

  const page = pageId ? trouverPage(pageId) : undefined;
  if (!page || !valeurs || typeof valeurs !== 'object') {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
  }

  const champs = new Map(champsDePage(page).map(champ => [champ.cle as string, champ]));
  const photos: Record<string, string | FieldValue> = {};
  const textes: Record<string, string | FieldValue> = {};

  for (const [cle, brut] of Object.entries(valeurs)) {
    const champ = champs.get(cle);
    if (!champ) {
      return NextResponse.json({ error: `Élément inconnu : ${cle}` }, { status: 400 });
    }

    if (champ.type === 'photo') {
      if (brut !== null && (typeof brut !== 'string' || !brut.startsWith('https://res.cloudinary.com/'))) {
        return NextResponse.json({ error: `Photo invalide : ${champ.nom}` }, { status: 400 });
      }
      photos[cle] = brut ?? FieldValue.delete();
      continue;
    }

    if (brut !== null && typeof brut !== 'string') {
      return NextResponse.json({ error: `Texte invalide : ${champ.nom}` }, { status: 400 });
    }
    const texte = brut?.trim() ?? null;
    const erreur = texte === null ? null : erreurTexte(champ, texte);
    if (erreur) {
      return NextResponse.json({ error: `« ${champ.nom} » : ${erreur}` }, { status: 400 });
    }
    textes[cle] = texte === null || texte === champ.defaut ? FieldValue.delete() : texte;
  }

  const config = adminDb.collection('config');
  const photosRef = config.doc('photosSite');
  const anciennesPhotos = Object.keys(photos).length > 0
    ? ((await photosRef.get()).data() ?? {})
    : {};

  const batch = adminDb.batch();
  if (Object.keys(photos).length > 0) batch.set(photosRef, photos, { merge: true });
  if (Object.keys(textes).length > 0) batch.set(config.doc('textesSite'), textes, { merge: true });
  await batch.commit();

  // Les photos remplacees ne servent plus nulle part : on les retire de Cloudinary.
  for (const [cle, nouvelle] of Object.entries(photos)) {
    const ancienne = anciennesPhotos[cle] as string | undefined;
    if (ancienne && ancienne !== nouvelle) await deleteCloudinaryImage(ancienne);
  }

  revalidatePath(page.chemin);
  // Les coordonnees apparaissent aussi dans le pied de page de tout le site.
  if (page.id === 'contact') revalidatePath('/', 'layout');
  if (page.id === 'actualites') revalidatePath('/actualites/[slug]', 'page');
  revalidatePath('/admin/pages');
  return NextResponse.json({ success: true });
}
