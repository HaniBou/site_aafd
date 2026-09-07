'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Actualite } from '@/types';
import { uploadImage } from '@/lib/uploadImage';
import { useAdminToast } from '@/components/admin/AdminToast';

type FormState = {
  title: string;
  content: string;
  category: string;
  date: string;
  aLaUne: boolean;
  imageFile: File | null;
  existingImage: string;
};

const today = () => new Date().toISOString().split('T')[0];

const EMPTY: FormState = {
  title: '', content: '', category: '', date: today(),
  aLaUne: false, imageFile: null, existingImage: '',
};

function actuToForm(a: Actualite): FormState {
  return {
    title: a.title,
    content: a.content,
    category: a.category,
    date: a.date ? new Date(a.date).toISOString().split('T')[0] : today(),
    aLaUne: a.aLaUne ?? false,
    imageFile: null,
    existingImage: a.image ?? '',
  };
}

const CATEGORIES = ['Actualité', 'Vente', 'Événement', 'Annonce', 'Autre'];
type UploadPhase = 'compressing' | 'uploading' | null;

export default function ActuFormClient({ actualite }: { actualite?: Actualite }) {
  const router = useRouter();
  const notify = useAdminToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const isEditing = !!actualite;

  const [form, setForm] = useState<FormState>(actualite ? actuToForm(actualite) : EMPTY);
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
    if (!form.title.trim()) return 'Le titre est obligatoire.';
    if (!form.category) return 'La catégorie est obligatoire.';
    if (!form.date) return 'La date est obligatoire.';
    if (!form.content.trim()) return 'Le contenu est obligatoire.';
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
        title: form.title,
        content: form.content,
        category: form.category,
        date: new Date(form.date).toISOString(),
        image: imageUrl,
        aLaUne: form.aLaUne,
      };

      const res = await fetch(
        isEditing ? `/api/admin/actualites/${actualite!.id}` : '/api/admin/actualites',
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
        isEditing
          ? 'Actualité modifiée avec succès'
          : 'Actualité ajoutée avec succès',
        'success',
      );
      router.push('/admin/actualites');
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
          <Link href="/admin/actualites"
            aria-label="Retour aux actualités"
            className="flex items-center gap-1.5 shrink-0 -ml-1 px-2 py-1.5 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Retour</span>
          </Link>

          <span className="w-px h-5 bg-gray-200 shrink-0" aria-hidden="true" />

          <h1 className="text-sm font-bold text-gray-900 truncate min-w-0 mb-0 leading-none">
            {isEditing ? `Modifier « ${actualite!.title} »` : 'Nouvelle actualité'}
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
            <div className="relative w-full h-48 bg-gray-100">
              <Image src={imageSrc} alt="Aperçu" fill className="object-cover" sizes="(max-width: 672px) 100vw, 672px" />
              {previewUrl && (
                <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                  Nouvelle image
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
                  ? 'border-blue-200 bg-blue-50 cursor-wait'
                  : imageSrc
                  ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  : 'border-blue-300 bg-blue-50 hover:border-blue-400'
              }`}
            >
              {isUploading ? (
                <svg className="animate-spin h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
              <span className="text-sm font-semibold text-blue-600">
                {isUploading
                  ? uploadPhase === 'compressing' ? 'Compression…' : 'Envoi en cours…'
                  : imageSrc ? "Changer l'image" : 'Ajouter une image *'}
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
                      ? "Optimisation de l'image…"
                      : `Envoi vers le serveur — ${uploadProgress}%`}
                  </span>
                  {uploadPhase === 'uploading' && (
                    <span className="text-xs font-bold text-blue-600">{uploadProgress}%</span>
                  )}
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-200 ${
                      uploadPhase === 'compressing'
                        ? 'bg-gray-300 animate-pulse'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                    }`}
                    style={uploadPhase === 'uploading' ? { width: `${uploadProgress}%` } : { width: '40%' }}
                  />
                </div>
              </div>
            )}

            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={e => setForm({ ...form, imageFile: e.target.files?.[0] ?? null })}
              required={!isEditing && !form.existingImage} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Informations</p>

          <div>
            <label htmlFor="titre" className="block text-sm font-semibold text-gray-700 mb-1.5">Titre *</label>
            <input id="titre" type="text" value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Ex : Distribution alimentaire du 15 juin"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-gray-50 focus:bg-white outline-none transition-colors"
              required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="categorie" className="block text-sm font-semibold text-gray-700 mb-1.5">Catégorie *</label>
              <select id="categorie" value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-gray-50 focus:bg-white outline-none transition-colors"
                required>
                <option value="">Choisir…</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-1.5">Date *</label>
              <input id="date" type="date" value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-gray-50 focus:bg-white outline-none transition-colors"
                required />
            </div>
          </div>

          <div>
            <label htmlFor="contenu" className="block text-sm font-semibold text-gray-700 mb-1.5">Contenu *</label>
            <textarea id="contenu" value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value })}
              rows={6} placeholder="Décrivez l'actualité en détail…"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-gray-50 focus:bg-white outline-none transition-colors resize-none"
              required />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <button type="button"
            onClick={() => setForm({ ...form, aLaUne: !form.aLaUne })}
            className={`w-full flex items-center gap-4 rounded-xl p-3 transition-colors text-left ${
              form.aLaUne ? 'bg-orange-50' : 'hover:bg-gray-50'
            }`}>
            <div className={`relative w-12 h-6 rounded-full transition-colors shrink-0 ${form.aLaUne ? 'bg-orange-500' : 'bg-gray-200'}`}>
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.aLaUne ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">Mettre à la une</p>
              <p className="text-xs text-gray-500 mt-0.5">S&apos;affiche en premier et mis en avant sur le site</p>
            </div>
            {form.aLaUne && (
              <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2.5 py-1 rounded-full shrink-0">
                Activé
              </span>
            )}
          </button>
        </div>

        <div className="flex gap-3 pb-8">
          <Link href="/admin/actualites"
            className="flex-1 py-3.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-center">
            Annuler
          </Link>
          <button type="submit" disabled={busy || isUploading}
            className="flex-[2] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 rounded-xl text-sm font-bold transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-md">
            {busy && !isUploading && (
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {isUploading ? "Upload en cours…" : busy ? 'Enregistrement…' : isEditing ? 'Enregistrer les modifications' : "Publier l'actualité"}
          </button>
        </div>
      </form>
    </div>
  );
}
