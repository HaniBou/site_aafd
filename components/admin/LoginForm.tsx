'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';

function getErrorMessage(code: string): string {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return "L'adresse e-mail ou le mot de passe ne correspond pas. Vérifiez qu'il n'y a pas d'espace en trop, puis réessayez.";
    case 'auth/invalid-email':
      return "Cette adresse e-mail n'a pas le bon format. Elle doit ressembler à prenom@exemple.fr";
    case 'auth/too-many-requests':
      return 'Trop de tentatives de connexion. Patientez quelques minutes avant de réessayer.';
    case 'auth/network-request-failed':
      return 'La connexion internet semble interrompue. Vérifiez votre connexion et réessayez.';
    default:
      return "La connexion n'a pas fonctionné. Réessayez dans un instant.";
  }
}

const FIELD_CLASS =
  'w-full px-4 py-3.5 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition disabled:bg-gray-50';

export default function LoginForm({ next = '/admin' }: { next?: string }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNotice('');
    setLoading(true);

    try {
      const { user } = await signInWithEmailAndPassword(auth, email.trim(), password);
      const idToken = await user.getIdToken();

      const res = await fetch('/api/admin/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken, remember }),
      });

      if (!res.ok) throw new Error('session');

      router.push(next);
      router.refresh();
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      setError(getErrorMessage(code));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNotice('');
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      if (code === 'auth/invalid-email' || code === 'auth/too-many-requests') {
        setError(getErrorMessage(code));
        setLoading(false);
        return;
      }
    }

    setNotice(
      `Si un compte existe avec l'adresse ${email.trim()}, un e-mail vient d'être envoyé. ` +
        "Ouvrez votre boîte mail et cliquez sur le lien qu'il contient pour choisir un nouveau mot de passe. " +
        "Pensez à regarder dans les courriers indésirables (spam) s'il n'arrive pas.",
    );
    setResetMode(false);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 w-full max-w-lg">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Espace bénévoles</h1>
          <p className="text-base text-gray-600">
            {resetMode
              ? 'Indiquez votre adresse e-mail : nous vous enverrons un lien pour choisir un nouveau mot de passe.'
              : 'Connectez-vous pour gérer le contenu du site.'}
          </p>
        </div>

        {notice && (
          <div className="mb-6 bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
            <p className="text-emerald-900 text-base leading-relaxed">{notice}</p>
          </div>
        )}

        <form onSubmit={resetMode ? handleReset : handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-base font-semibold text-gray-800 mb-2">
              Adresse e-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={FIELD_CLASS}
              placeholder="prenom@exemple.fr"
              required
              disabled={loading}
              autoComplete="email"
              autoFocus
              inputMode="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
            />
          </div>

          {!resetMode && (
            <div>
              <label htmlFor="password" className="block text-base font-semibold text-gray-800 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={`${FIELD_CLASS} pr-14`}
                  placeholder="Votre mot de passe"
                  required
                  disabled={loading}
                  autoComplete="current-password"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  aria-pressed={showPassword}
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-gray-500 hover:text-indigo-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Cliquez sur l&apos;œil pour vérifier ce que vous avez tapé.
              </p>
            </div>
          )}

          {!resetMode && (
            <label className="flex items-start gap-3 cursor-pointer py-2 select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                disabled={loading}
                className="mt-0.5 w-6 h-6 rounded border-2 border-gray-300 text-indigo-600 focus:ring-4 focus:ring-indigo-200 cursor-pointer"
              />
              <span className="text-base text-gray-800 leading-snug">
                Rester connecté sur cet ordinateur
                <span className="block text-sm text-gray-500">
                  À décocher si vous utilisez un ordinateur partagé ou emprunté.
                </span>
              </span>
            </label>
          )}

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4" role="alert">
              <p className="text-red-800 text-base leading-relaxed">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-xl text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && (
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {loading
              ? 'Un instant…'
              : resetMode
                ? 'Envoyer le lien par e-mail'
                : 'Se connecter'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              setResetMode(v => !v);
              setError('');
              setNotice('');
            }}
            className="text-base text-indigo-700 hover:text-indigo-900 underline underline-offset-4 py-2 text-left"
          >
            {resetMode ? '← Revenir à la connexion' : "J'ai oublié mon mot de passe"}
          </button>

          <Link
            href="/"
            className="text-base text-gray-600 hover:text-indigo-700 transition-colors py-2"
          >
            Retour au site
          </Link>
        </div>
      </div>
    </main>
  );
}
