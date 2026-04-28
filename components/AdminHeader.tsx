'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function AdminHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const isAdminHome = pathname === '/admin';

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/admin/login');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto mb-6 md:mb-8 flex flex-wrap justify-between items-center gap-3 px-4 md:px-6 py-3 md:py-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center gap-3 md:gap-6">
        <Link 
          href="/admin" 
          className="flex items-center gap-1.5 md:gap-2 text-gray-700 hover:text-indigo-600 transition-colors"
          title="Accueil"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="font-medium text-sm md:text-base">Accueil</span>
        </Link>
        
        {!isAdminHome && (
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 md:gap-2 text-gray-700 hover:text-indigo-600 transition-colors"
            title="Retour"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium text-sm md:text-base">Retour</span>
          </button>
        )}
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-1.5 md:gap-2 text-gray-700 hover:text-red-600 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span className="font-medium text-sm md:text-base">Déconnexion</span>
      </button>
    </div>
  );
}
