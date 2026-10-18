import { notFound } from 'next/navigation';
import { getContenuPersonnalise } from '@/lib/firebase/fetchers';
import { trouverPage } from '@/lib/contenuSite';
import PageContenuForm from '@/components/admin/PageContenuForm';

export const dynamic = 'force-dynamic';

export default async function ModifierPageSitePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!trouverPage(id)) notFound();
  const personnalise = await getContenuPersonnalise();
  return <PageContenuForm pageId={id} personnalise={personnalise} />;
}
