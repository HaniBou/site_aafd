'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Temoignage } from '@/types';
import { uploadImage } from '@/lib/uploadImage';
import { useAdminToast } from '@/components/admin/AdminToast';
import { Button } from '@/components/ui/Button';

type FormState = {
  nom: string;
  role: string;
  type: string;
  contenu: string;
  date: string;
  imageFile: File | null;
  existingImage: string;
};

const today = () => new Date().toISOString().split('T')[0];

const EMPTY: FormState = {
  nom: '', role: '', type: '', contenu: '', date: today(),
  imageFile: null, existingImage: '',
};

function temoToForm(t: Temoignage): FormState {
  return {
    nom: t.nom,
    role: t.role ?? '',
    type: t.type,
    contenu: t.contenu,
    date: t.date ? new Date(t.date).toISOString().split('T')[0] : today(),
    imageFile: null,
    existingImage: t.image ?? '',
  };
}

type UploadPhase = 'compressing' | 'uploading' | null;

export default function TemoignageFormClient({ temoignage }: { temoignage?: Temoignage }) {
  const router = useRouter();
  const notify = useAdminToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const isEditing = !!temoignage;

  const [form, setForm] = useState<FormState>(temoignage ? temoToForm(temoignage) : EMPTY);
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
    if (!form.nom.trim()) return 'Le nom est obligatoire.';
    if (!form.type) return 'Le type de témoignage est obligatoire.';
    if (!form.date) return 'La date est obligatoire.';
    if (!form.contenu.trim()) return 'Le témoignage est obligatoire.';
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
        nom: form.nom,
        role: form.role,
        type: form.type,
        contenu: form.contenu,
        date: new Date(form.date).toISOString(),
        image: imageUrl,
      };

      const res = await fetch(
        isEditing ? `/api/admin/temoignages/${temoignage!.id}` : '/api/admin/temoignages',
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
          ? 'Témoignage modifié avec succès'
          : 'Témoignage ajouté avec succès',
        'success',
      );
      router.push('/admin/temoignages');
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
          <Button href="/admin/temoignages" variant="ghost" size="sm" shape="rounded"
            className="shrink-0 -ml-1" aria-label="Retour aux témoignages">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Retour</span>
          </Button>

          <span className="w-px h-5 bg-gray-200 shrink-0" aria-hidden="true" />

          <h1 className="text-sm font-bold text-gray-900 truncate min-w-0 mb-0 leading-none">
            {isEditing ? `Modifier « ${temoignage!.nom} »` : 'Nouveau témoignage'}
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

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Type de témoignage *</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'Famille accompagnee', label: 'Famille accompagnée', icon: '🏠' },
              { value: 'Benevole', label: 'Bénévole', icon: '🤝' },
            ].map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm({ ...form, type: opt.value })}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  form.type === opt.value
                    ? 'border-emerald-400 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                }`}
              >
                <span className="text-2xl">{opt.icon}</span>
                <span className={`text-xs font-semibold ${form.type === opt.value ? 'text-emerald-700' : 'text-gray-600'}`}>
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
          {!form.type && (
            <p className="text-xs text-red-500 mt-2">Veuillez choisir un type</p>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {imageSrc && (
            <div className="relative w-full h-40 bg-gray-100">
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
              className={`w-full border-2 border-dashed rounded-xl py-5 flex flex-col items-center gap-2 transition-colors ${
                isUploading
                  ? 'border-emerald-200 bg-emerald-50 cursor-wait'
                  : imageSrc
                  ? 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'
                  : 'border-gray-200 hover:border-emerald-200 hover:bg-emerald-50'
              }`}
            >
              {isUploading ? (
                <svg className="animate-spin h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
              <span className="text-sm font-semibold text-gray-600">
                {isUploading
                  ? uploadPhase === 'compressing' ? 'Compression…' : 'Envoi en cours…'
                  : imageSrc ? 'Changer la photo' : 'Ajouter une photo (optionnel)'}
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
                    <span className="text-xs font-bold text-emerald-600">{uploadProgress}%</span>
                  )}
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-200 ${
                      uploadPhase === 'compressing'
                        ? 'bg-gray-300 animate-pulse'
                        : 'bg-gradient-to-r from-emerald-400 to-teal-500'
                    }`}
                    style={uploadPhase === 'uploading' ? { width: `${uploadProgress}%` } : { width: '40%' }}
                  />
                </div>
              </div>
            )}

            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={e => setForm({ ...form, imageFile: e.target.files?.[0] ?? null })} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Informations</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nom" className="block text-sm font-semibold text-gray-700 mb-1.5">Nom *</label>
              <input id="nom" type="text" value={form.nom}
                onChange={e => setForm({ ...form, nom: e.target.value })}
                placeholder="Ex : Marie D."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base bg-gray-50 focus:bg-white outline-none transition-colors"
                required />
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-1.5">Date *</label>
              <input id="date" type="date" value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base bg-gray-50 focus:bg-white outline-none transition-colors"
                required />
            </div>
          </div>

          <div>
            <label htmlFor="role-fonction" className="block text-sm font-semibold text-gray-700 mb-1.5">Rôle / Fonction</label>
            <input id="role-fonction" type="text" value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
              placeholder="Ex : Bénévole depuis 3 ans, Mère de famille…"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base bg-gray-50 focus:bg-white outline-none transition-colors" />
          </div>

          <div>
            <label htmlFor="temoignage" className="block text-sm font-semibold text-gray-700 mb-1.5">Témoignage *</label>
            <textarea id="temoignage" value={form.contenu}
              onChange={e => setForm({ ...form, contenu: e.target.value })}
              rows={6} placeholder="Le texte du témoignage tel qu'il apparaîtra sur le site…"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base bg-gray-50 focus:bg-white outline-none transition-colors resize-none"
              required />
          </div>
        </div>

        <div className="flex gap-3 pb-8">
          <Button href="/admin/temoignages" variant="secondary" size="sm" shape="rounded" className="flex-1">
            Annuler
          </Button>
          <Button type="submit" variant="success" size="sm" shape="rounded" className="flex-[2]"
            disabled={busy || isUploading || !form.type}>
            {busy && !isUploading && (
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {isUploading ? 'Upload en cours…' : busy ? 'Enregistrement…' : isEditing ? 'Enregistrer les modifications' : 'Ajouter le témoignage'}
          </Button>
        </div>
      </form>
    </div>
  );
}
