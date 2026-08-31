'use client';

import { useEffect, useState } from 'react';

export type ToastTone = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  show: boolean;
  /** Explicite. À défaut, le ton est déduit du texte du message. */
  tone?: ToastTone;
  onClose?: () => void;
}

export default function Toast({ message, show, tone, onClose }: ToastProps) {
  const [visible, setVisible] = useState(show);
  const [prevShow, setPrevShow] = useState(show);

  // Ajustement pendant le rendu plutôt que dans un effet : évite un rendu
  // en cascade à chaque apparition du toast.
  if (prevShow !== show) {
    setPrevShow(show);
    if (show) setVisible(true);
  }

  useEffect(() => {
    if (show) return;
    const t = setTimeout(() => setVisible(false), 300);
    return () => clearTimeout(t);
  }, [show]);

  if (!visible && !show) return null;

  const normalized = message.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const isError = tone
    ? tone === 'error'
    : /(erreur|echec|fail|failed|impossible|probleme)/.test(normalized);
  const isSuccess = tone
    ? tone === 'success'
    : !isError &&
      /(succes|success|effectue|ajoute|modifie|supprime|publie|annule|mis a jour)/.test(normalized);

  return (
    <div
      role="status"
      aria-live="polite"
      style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
      className={`fixed left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-md transition-all duration-300 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div
        className={`rounded-2xl shadow-2xl px-5 py-4 flex items-center gap-4 border-2 ${
          isSuccess
            ? 'bg-green-50 border-green-300'
            : isError
            ? 'bg-red-50 border-red-300'
            : 'bg-blue-50 border-blue-300'
        }`}
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
            isSuccess ? 'bg-green-500' : isError ? 'bg-red-500' : 'bg-blue-500'
          }`}
        >
          {isSuccess ? (
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : isError ? (
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>

        <p
          className={`flex-1 text-sm font-semibold ${
            isSuccess ? 'text-green-800' : isError ? 'text-red-800' : 'text-blue-800'
          }`}
        >
          {message}
        </p>

        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors shrink-0 p-1"
            aria-label="Fermer"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
