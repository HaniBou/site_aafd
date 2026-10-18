import Image from 'next/image';
import Link from 'next/link';
import { getContenuPersonnalise } from '@/lib/firebase/fetchers';
import { PAGES_SITE, champsDePage } from '@/lib/contenuSite';

export const dynamic = 'force-dynamic';

export default async function AdminPagesSitePage() {
  const personnalise = await getContenuPersonnalise();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-0">Pages du site</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Choisissez une page pour modifier ses textes et ses photos.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PAGES_SITE.map(page => {
          const champs = champsDePage(page);
          const nbPhotos = champs.filter(champ => champ.type === 'photo').length;
          const nbTextes = champs.length - nbPhotos;
          const nbModifies = champs.filter(champ => personnalise[champ.cle]).length;
          const premierePhoto = champs.find(champ => champ.type === 'photo');
          const apercu = premierePhoto ? personnalise[premierePhoto.cle] ?? premierePhoto.defaut : null;

          return (
            <Link key={page.id} href={`/admin/pages/${page.id}`}
              className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="relative aspect-[3/1] bg-gray-100">
                {apercu && (
                  <Image src={apercu} alt="" fill className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                )}
              </div>
              <div className="p-4 flex-1">
                <h2 className="text-base font-bold text-gray-900 leading-snug mb-1">{page.nom}</h2>
                <p className="text-sm text-gray-600 mb-2">{page.description}</p>
                <p className="text-xs text-gray-500 mb-0">
                  {nbTextes > 0 && `${nbTextes} texte${nbTextes > 1 ? 's' : ''} · `}
                  {nbPhotos} photo{nbPhotos > 1 ? 's' : ''}
                  {nbModifies > 0 && (
                    <span className="ml-2 inline-block rounded-full bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700">
                      {nbModifies} modifié{nbModifies > 1 ? 's' : ''}
                    </span>
                  )}
                </p>
              </div>
              <div className="border-t border-gray-100 py-3.5 text-center text-sm font-semibold text-blue-600 group-hover:bg-blue-50 transition-colors">
                Modifier
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
