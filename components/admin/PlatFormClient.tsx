'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Plat } from '@/types';
import { uploadImage } from '@/lib/uploadImage';
import { useAdminToast } from '@/components/admin/AdminToast';
import { Button } from '@/components/ui/Button';

type FormState = {
  nom: string;
  typeMenu: string;
  cuisiniers: string;
  description: string;
  prix: string;
  quantite: string;
  imageFile: File | null;
  existingImage: string;
};

const EMPTY: FormState = {
  nom: '', typeMenu: '', cuisiniers: '', description: '',
  prix: '', quantite: '', imageFile: null, existingImage: '',
};

function platToForm(p: Plat): FormState {
  return {
    nom: p.nom, typeMenu: p.typeMenu ?? '', cuisiniers: p.cuisiniers ?? '',
    description: p.description, prix: String(p.prix), quantite: String(p.quantite),
    imageFile: null, existingImage: p.image ?? '',
  };
}

type UploadPhase = 'compressing' | 'uploading' | null;

const CHAMP =
  'w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-base bg-white outline-none transition-colors';

const LABEL = 'block text-base font-bold text-gray-900 mb-1';

const AIDE = 'text-sm text-gray-600 mb-2';

type Props = {
  plat?: Plat;
  venteId: string;
  venteTitre?: string;
};

export default function PlatFormClient({ plat, venteId, venteTitre }: Props) {
  const router = useRouter();
  const notify = useAdminToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const isEditing = !!plat;
  const retour = `/admin/ventes/${venteId}`;

  const [form, setForm] = useState<FormState>(plat ? platToForm(plat) : EMPTY);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadPhase, setUploadPhase] = useState<UploadPhase>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!form.imageFile) { setPreviewUrl(null); return; }
    const url = URL.createObjectURL(form.imageFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [form.imageFile]);

  const validate = (): string | null => {
    if (!form.nom.trim()) return 'Le nom du plat est obligatoire.';
    if (!form.description.trim()) return 'La description est obligatoire.';
    const prix = parseFloat(form.prix);
    if (!Number.isFinite(prix) || prix < 0) return 'Le prix doit être un nombre positif.';
    const quantite = parseInt(form.quantite, 10);
    if (!Number.isInteger(quantite) || quantite < 0) return 'La quantité doit être un entier positif.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const invalid = validate();
    if (invalid) {
      setError(invalid);
      return;
    }

    setBusy(true);
    setError(null);

    let uploadedUrl: string | null = null;

    try {
      let imageUrl = form.existingImage || 'none';

      if (form.imageFile) {
        imageUrl = await uploadImage(form.imageFile, (phase, percent) => {
          setUploadPhase(phase);
          setUploadProgress(percent);
        });
        uploadedUrl = imageUrl;
        setUploadPhase(null);
      }

      const body = {
        venteId,
        nom: form.nom,
        typeMenu: form.typeMenu,
        cuisiniers: form.cuisiniers,
        description: form.description,
        prix: parseFloat(form.prix),
        quantite: parseInt(form.quantite, 10),
        image: imageUrl,
      };

      const res = await fetch(
        isEditing ? `/api/admin/plats/${plat!.id}` : '/api/admin/plats',
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        },
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(data.error ?? 'Erreur serveur');
      }

      notify(
        isEditing ? 'Plat modifié avec succès' : 'Plat ajouté avec succès',
        'success',
      );
      router.push(retour);
      router.refresh();
    } catch (err) {
      if (uploadedUrl) {
        await fetch('/api/admin/upload', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: uploadedUrl }),
        }).catch(() => {});
      }
      setUploadPhase(null);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setBusy(false);
    }
  };

  const imageSrc = previewUrl ?? (form.existingImage && form.existingImage !== 'none' ? form.existingImage : null);
  const isUploading = uploadPhase !== null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-14 z-30">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <Button
            href={retour}
            variant="ghost"
            size="sm"
            shape="rounded"
            className="shrink-0 -ml-1"
            aria-label="Retour à la vente"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Retour</span>
          </Button>

          <span className="w-px h-5 bg-gray-200 shrink-0" aria-hidden="true" />

          <h1 className="text-sm font-bold text-gray-900 truncate min-w-0 mb-0 leading-none">
            {isEditing ? `Modifier « ${plat!.nom} »` : 'Nouveau plat'}
            {venteTitre && (
              <span className="font-medium text-gray-500"> — {venteTitre}</span>
            )}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 py-8 space-y-6">

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3">
            <svg className="h-5 w-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-red-800">Une erreur est survenue</p>
              <p className="text-sm text-red-600 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {imageSrc && (
            <div className="relative w-full h-56 bg-gray-100">
              <Image src={imageSrc} alt="Aperçu" fill className="object-cover" sizes="(max-width: 672px) 100vw, 672px" />
              {previewUrl && (
                <div className="absolute top-3 left-3 bg-emerald-700 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                  Nouvelle photo
                </div>
              )}
            </div>
          )}

          <div className="p-4">
            <button
              type="button"
              onClick={() => !isUploading && fileRef.current?.click()}
              disabled={isUploading}
              className={`w-full border-2 border-dashed rounded-xl py-6 flex flex-col items-center gap-2 transition-colors ${
                isUploading
                  ? 'border-orange-200 bg-orange-50 cursor-wait'
                  : imageSrc
                  ? 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                  : 'border-orange-300 bg-orange-50 hover:border-orange-400'
              }`}
            >
              {isUploading ? (
                <svg className="animate-spin h-6 w-6 text-orange-700" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
              <span className="text-sm font-semibold text-orange-700">
                {isUploading
                  ? uploadPhase === 'compressing' ? 'Compression…' : `Envoi en cours…`
                  : imageSrc ? 'Changer la photo' : 'Ajouter une photo *'}
              </span>
              {!isUploading && (
                <span className="text-xs text-gray-500">JPG, PNG, WebP — max 10 Mo</span>
              )}
            </button>

            {isUploading && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-gray-500">
                    {uploadPhase === 'compressing'
                      ? 'Optimisation de la photo…'
                      : `Envoi vers le serveur — ${uploadProgress}%`}
                  </span>
                  {uploadPhase === 'uploading' && (
                    <span className="text-xs font-bold text-orange-700">{uploadProgress}%</span>
                  )}
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-200 ${
                      uploadPhase === 'compressing'
                        ? 'bg-gray-300 animate-pulse'
                        : 'bg-gradient-to-r from-orange-400 to-orange-500'
                    }`}
                    style={
                      uploadPhase === 'uploading'
                        ? { width: `${uploadProgress}%` }
                        : { width: '40%' }
                    }
                  />
                </div>
              </div>
            )}

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => setForm({ ...form, imageFile: e.target.files?.[0] ?? null })}
              required={!isEditing && !form.existingImage}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-5">
          <p className="text-base font-bold text-gray-900 pb-1 border-b border-gray-100">Le plat</p>

          <div>
            <label htmlFor="nom-du-plat" className={LABEL}>
              Nom du plat <span className="text-orange-700">*</span>
            </label>
            <p className={AIDE}>Le nom affiché en gros sur la carte du plat.</p>
            <input id="nom-du-plat"
              type="text"
              value={form.nom}
              onChange={e => setForm({ ...form, nom: e.target.value })}
              placeholder="Couscous royal"
              className={CHAMP}
              required
            />
          </div>

          <div>
            <label htmlFor="type-de-menu" className={LABEL}>Type de menu</label>
            <p className={AIDE}>Facultatif. Affiché en petit sous le nom du plat.</p>
            <input id="type-de-menu"
              type="text"
              value={form.typeMenu}
              onChange={e => setForm({ ...form, typeMenu: e.target.value })}
              placeholder="Menu congolais"
              className={CHAMP}
            />
          </div>

          <div>
            <label htmlFor="cuisinier-s" className={LABEL}>Qui l&apos;a cuisiné</label>
            <p className={AIDE}>Facultatif. Le site affichera « concocté par… ».</p>
            <input id="cuisinier-s"
              type="text"
              value={form.cuisiniers}
              onChange={e => setForm({ ...form, cuisiniers: e.target.value })}
              placeholder="Marie et Jean"
              className={CHAMP}
            />
          </div>

          <div>
            <label htmlFor="description" className={LABEL}>
              Description <span className="text-orange-700">*</span>
            </label>
            <p className={AIDE}>
              Les ingrédients, les accompagnements, et surtout les allergènes. Ce texte apparaît
              quand le visiteur passe sur la photo.
            </p>
            <textarea id="description"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={4}
              placeholder="Semoule, légumes, poulet et merguez. Contient du gluten."
              className={`${CHAMP} resize-none`}
              required
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-5">
          <p className="text-base font-bold text-gray-900 pb-1 border-b border-gray-100">Prix et nombre de parts</p>

          <div>
            <label htmlFor="prix" className={LABEL}>
              Prix d&apos;une part <span className="text-orange-700">*</span>
            </label>
            <p className={AIDE}>En euros. Utilisez un point pour les centimes : 12.50</p>
            <div className="relative max-w-[12rem]">
              <input id="prix"
                type="number"
                step="0.50"
                min="0"
                inputMode="decimal"
                value={form.prix}
                onChange={e => setForm({ ...form, prix: e.target.value })}
                placeholder="12.50"
                className={`${CHAMP} pr-9 [appearance:textfield]`}
                required
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-base font-semibold">€</span>
            </div>
          </div>

          <div>
            <label htmlFor="quantite-disponible" className={LABEL}>
              Nombre de parts à vendre <span className="text-orange-700">*</span>
            </label>
            <p className={AIDE}>
              Combien de parts vous pouvez préparer. Le site les décompte tout seul à chaque
              réservation, et affiche « Épuisé » quand il n&apos;en reste plus.
            </p>
            <input id="quantite-disponible"
              type="number"
              min="0"
              inputMode="numeric"
              value={form.quantite}
              onChange={e => setForm({ ...form, quantite: e.target.value })}
              placeholder="20"
              className={`${CHAMP} max-w-[12rem] [appearance:textfield]`}
              required
            />
          </div>
        </div>

        <div className="pb-8">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            shape="rounded"
            fullWidth
            disabled={busy || isUploading}
          >
            {busy && !isUploading && (
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {isUploading
              ? 'Envoi de la photo en cours…'
              : busy
              ? 'Enregistrement…'
              : isEditing
              ? 'Enregistrer les modifications'
              : 'Ajouter ce plat à la vente'}
          </Button>

          <Button
            href={retour}
            variant="secondary"
            size="lg"
            shape="rounded"
            fullWidth
            className="mt-3"
          >
            Annuler et revenir en arrière
          </Button>
        </div>
      </form>
    </div>
  );
}
