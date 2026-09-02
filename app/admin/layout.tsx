import type { Metadata } from 'next';
import AdminNav from '@/components/admin/AdminNav';
import { AdminToastProvider } from '@/components/admin/AdminToast';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Pas de wrapper autour d'AdminNav : un parent haut de 64 px bornerait
          son `sticky` et la barre se décrocherait au premier scroll.
          Le masquage à l'impression est porté par le <nav> lui-même. */}
      <AdminNav />
      <AdminToastProvider>{children}</AdminToastProvider>
    </div>
  );
}
