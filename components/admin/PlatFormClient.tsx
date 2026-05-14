'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Plat } from '@/types';
import { uploadImage } from '@/lib/uploadImage';

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

export default function PlatFormClient({ plat }: { plat?: Plat }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const isEditing = !!plat;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      let imageUrl = form.existingImage || 'none';

      if (form.imageFile) {
        imageUrl = await uploadImage(form.imageFile, (phase, percent) => {
          setUploadPhase(phase);
          setUploadProgress(percent);
        });
        setUploadPhase(null);
      }

      const body = {
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

      router.push('/admin/plats');
      router.refresh();
    } catch (err) {
      setUploadPhase(null);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setBusy(false);
    }
  };

  const imageSrc = previewUrl ?? (form.existingImage && form.existingImage !== 'none' ? form.existingImage : null);
  const isUploading = uploadPhase !== null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 sticky top-14 z-30">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <Link href="/admin/plats"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour aux plats
          </Link>
          <h1 className="text-sm font-bold text-gray-900">
            {isEditing ? `Modifier "${plat!.nom}"` : 'Nouveau plat'}
          </h1>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 py-8 space-y-6">

        {/* Error */}
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

        {/* Image section */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Preview */}
          {imageSrc && (
            <div className="relative w-full h-56 bg-gray-100">
              <Image src={imageSrc} alt="Aperçu" fill className="object-cover" sizes="(max-width: 672px) 100vw, 672px" />
              {previewUrl && (
                <div className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                  Nouvelle photo
                </div>
              )}
            </div>
          )}

          {/* Upload zone */}
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
                <svg className="animate-spin h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
              <span className="text-sm font-semibold text-orange-600">
                {isUploading
                  ? uploadPhase === 'compressing' ? 'Compression…' : `Envoi en cours…`
                  : imageSrc ? 'Changer la photo' : 'Ajouter une photo *'}
              </span>
              {!isUploading && (
                <span className="text-xs text-gray-400">JPG, PNG, WebP — max 10 Mo</span>
              )}
            </button>

            {/* Progress bar */}
            {isUploading && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-gray-500">
                    {uploadPhase === 'compressing'
                      ? 'Optimisation de la photo…'
                      : `Envoi vers le serveur — ${uploadProgress}%`}
                  </span>
                  {uploadPhase === 'uploading' && (
                    <span className="text-xs font-bold text-orange-600">{uploadProgress}%</span>
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

        {/* Fields */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Informations</p>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nom du plat *</label>
            <input
              type="text"
              value={form.nom}
              onChange={e => setForm({ ...form, nom: e.target.value })}
              placeholder="Ex : Couscous royal, Tajine d'agneau…"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm bg-gray-50 focus:bg-white outline-none transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Type de menu</label>
              <input
                type="text"
                value={form.typeMenu}
                onChange={e => setForm({ ...form, typeMenu: e.target.value })}
                placeholder="Ex : Menu congolais…"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm bg-gray-50 focus:bg-white outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Cuisinier(s)</label>
              <input
                type="text"
                value={form.cuisiniers}
                onChange={e => setForm({ ...form, cuisiniers: e.target.value })}
                placeholder="Ex : Marie, Jean…"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm bg-gray-50 focus:bg-white outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description *</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={4}
              placeholder="Décrivez le plat : ingrédients, accompagnements, allergènes…"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm bg-gray-50 focus:bg-white outline-none transition-colors resize-none"
              required
            />
          </div>
        </div>

        {/* Price & Quantity */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Prix & Stock</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Prix (€) *</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.50"
                  min="0"
                  value={form.prix}
                  onChange={e => setForm({ ...form, prix: e.target.value })}
                  placeholder="12.50"
                  className="w-full pl-4 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm bg-gray-50 focus:bg-white outline-none transition-colors [appearance:textfield]"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">€</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Quantité disponible *</label>
              <input
                type="number"
                min="0"
                value={form.quantite}
                onChange={e => setForm({ ...form, quantite: e.target.value })}
                placeholder="20"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm bg-gray-50 focus:bg-white outline-none transition-colors [appearance:textfield]"
                required
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3 pb-8">
          <Link
            href="/admin/plats"
            className="flex-1 py-3.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-center"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={busy || isUploading}
            className="flex-[2] bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white py-3.5 rounded-xl text-sm font-bold transition-colors disabled:opacity-60 flex items-center justify-center gap-2 shadow-md"
          >
            {busy && !isUploading && (
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {isUploading
              ? 'Upload en cours…'
              : busy
              ? 'Enregistrement…'
              : isEditing
              ? 'Enregistrer les modifications'
              : 'Ajouter le plat'}
          </button>
        </div>
      </form>
    </div>
  );
}
