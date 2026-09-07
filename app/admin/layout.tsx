import type { Metadata } from 'next';
import AdminNav from '@/components/admin/AdminNav';
import { AdminToastProvider } from '@/components/admin/AdminToast';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <AdminToastProvider>{children}</AdminToastProvider>
    </div>
  );
}
