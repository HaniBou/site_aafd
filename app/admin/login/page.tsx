import LoginForm from '@/components/admin/LoginForm';

export const metadata = {
  title: 'Espace bénévoles',
  robots: { index: false, follow: false },
};

/** Empêche qu'un lien forgé nous renvoie ailleurs que dans l'administration. */
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
  // Lu côté serveur plutôt qu'avec useSearchParams : le formulaire arrive alors
  // dans le HTML initial, sans écran blanc le temps que le JavaScript se charge.
  const { next } = await searchParams;
  return <LoginForm next={safeNext(next)} />;
}
