'use client';

import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { Button } from '@/components/ui/Button';

const SECTION_LABELS: [string, string][] = [
  ['/admin/actualites', 'Actualités'],
  ['/admin/ventes', 'Ventes de plats'],
  ['/admin/plats', 'Ventes de plats'],
  ['/admin/temoignages', 'Témoignages'],
  ['/admin/moments', 'Moments partagés'],
  ['/admin/reservations', 'Réservations'],
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/admin/login') return null;

  const isHome = pathname === '/admin';
  const sectionLabel =
    SECTION_LABELS.find(([prefixe]) => pathname.startsWith(prefixe))?.[1] ?? 'Administration';

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    await signOut(auth).catch(() => {});
    router.push('/admin/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 print:hidden">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        <div className="flex items-center gap-2 min-w-0">
          {!isHome ? (
            <>
              <Button href="/admin" variant="ghost" size="sm" shape="rounded" className="shrink-0 -ml-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="hidden sm:inline">Accueil</span>
              </Button>
              <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-base font-semibold text-gray-900 truncate">{sectionLabel}</span>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <span className="text-base font-bold text-gray-900">Administration AAFD</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            href="/"
            variant="secondary"
            size="sm"
            shape="rounded"
            className="hidden sm:inline-flex"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Voir le site
          </Button>

          <Button
            variant="secondary"
            size="sm"
            shape="rounded"
            onClick={handleLogout}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden sm:inline">Déconnexion</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
