import LoginForm from '@/components/admin/LoginForm';

export const metadata = {
  title: 'Espace bénévoles',
  robots: { index: false, follow: false },
};

function safeNext(value: string | string[] | undefined): string {
  if (typeof value !== 'string') return '/admin';
  if (!value.startsWith('/admin') || value.startsWith('//')) return '/admin';
  return value;
}

export default async function AdminLogin({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { next } = await searchParams;
  return <LoginForm next={safeNext(next)} />;
}
