// app/admin/page.tsx
'use client';

import Link from "next/link";
import AdminProtection from "@/components/AdminProtection";
import AdminHeader from "@/components/AdminHeader";

export default function AdminHome() {
  return (
    <AdminProtection>
      <main className="min-h-screen bg-gray-50 px-4 py-6 md:p-8">
        <AdminHeader />
        
        {/* Header simple */}
        <div className="max-w-7xl mx-auto mb-6 md:mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Tableau de bord
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              Gérez votre contenu et vos paramètres
            </p>
          </div>
        </div>

      {/* Boutons principaux */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Link
          href="/admin/actualites"
          className="group bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-indigo-300 transition-all"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
            Actualités
          </h2>
          <p className="text-sm text-gray-600">
            Publier des nouvelles et des événements
          </p>
        </Link>

        <Link
          href="/admin/plats"
          className="group bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-indigo-300 transition-all"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
            Vente de plats
          </h2>
          <p className="text-sm text-gray-600">
            Gérer les plats à vendre
          </p>
        </Link>

        <Link
          href="/admin/temoignages"
          className="group bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-indigo-300 transition-all"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
            Témoignages
          </h2>
          <p className="text-sm text-gray-600">
            Gérer les témoignages
          </p>
        </Link>

        <Link
          href="/admin/reservations"
          className="group bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-indigo-300 transition-all"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
            Réservations
          </h2>
          <p className="text-sm text-gray-600">
            Consulter les commandes de plats
          </p>
        </Link>
      </div>

      {/* Guide d'utilisation */}
      <div className="max-w-7xl mx-auto mt-12">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm border-2 border-blue-200 p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-blue-500 rounded-full p-3 flex-shrink-0">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Guide d'utilisation
              </h2>
              <p className="text-gray-700 text-lg">
                Comment gérer votre site facilement
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Actualités */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-blue-100 text-blue-700 font-bold text-lg rounded-full w-10 h-10 flex items-center justify-center">1</span>
                <h3 className="text-xl font-bold text-gray-900">Publier une actualité</h3>
              </div>
              <ol className="space-y-3 text-gray-700 text-base">
                <li className="flex gap-2">
                  <span className="text-blue-500 font-bold">→</span>
                  <span>Cliquez sur <strong>"Actualités"</strong></span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-500 font-bold">→</span>
                  <span>Cliquez sur <strong>"Nouvelle actualité"</strong></span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-500 font-bold">→</span>
                  <span>Remplissez le titre et le contenu</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-500 font-bold">→</span>
                  <span>Choisissez une catégorie (Actualité, Vente, etc.)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-500 font-bold">→</span>
                  <span>Ajoutez une image (obligatoire)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-500 font-bold">→</span>
                  <span>Cliquez sur <strong>"Ajouter"</strong></span>
                </li>
              </ol>
            </div>

            {/* Plats */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-orange-100 text-orange-700 font-bold text-lg rounded-full w-10 h-10 flex items-center justify-center">2</span>
                <h3 className="text-xl font-bold text-gray-900">Ajouter un plat</h3>
              </div>
              <ol className="space-y-3 text-gray-700 text-base">
                <li className="flex gap-2">
                  <span className="text-orange-500 font-bold">→</span>
                  <span>Cliquez sur <strong>"Vente de plats"</strong></span>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange-500 font-bold">→</span>
                  <span>Cliquez sur <strong>"Nouveau plat"</strong></span>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange-500 font-bold">→</span>
                  <span>Remplissez le nom, la description</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange-500 font-bold">→</span>
                  <span>Indiquez le prix et la quantité</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange-500 font-bold">→</span>
                  <span>Ajoutez une photo du plat</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange-500 font-bold">→</span>
                  <span>Cliquez sur <strong>"Ajouter"</strong></span>
                </li>
              </ol>
            </div>

            {/* Modifier */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-green-100 text-green-700 font-bold text-lg rounded-full w-10 h-10 flex items-center justify-center">3</span>
                <h3 className="text-xl font-bold text-gray-900">Modifier un contenu</h3>
              </div>
              <ol className="space-y-3 text-gray-700 text-base">
                <li className="flex gap-2">
                  <span className="text-green-500 font-bold">→</span>
                  <span>Trouvez l'élément dans la liste</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-500 font-bold">→</span>
                  <span>Cliquez sur le bouton <strong>"✏️ Modifier"</strong></span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-500 font-bold">→</span>
                  <span>Modifiez les informations</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-500 font-bold">→</span>
                  <span>Changez l'image si besoin (optionnel)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-500 font-bold">→</span>
                  <span>Cliquez sur <strong>"Modifier"</strong> pour enregistrer</span>
                </li>
              </ol>
            </div>

            {/* Supprimer */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-red-100 text-red-700 font-bold text-lg rounded-full w-10 h-10 flex items-center justify-center">4</span>
                <h3 className="text-xl font-bold text-gray-900">Supprimer un contenu</h3>
              </div>
              <ol className="space-y-3 text-gray-700 text-base">
                <li className="flex gap-2">
                  <span className="text-red-500 font-bold">→</span>
                  <span>Trouvez l'élément dans la liste</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500 font-bold">→</span>
                  <span>Cliquez sur le bouton <strong>"🗑️ Supprimer"</strong></span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500 font-bold">→</span>
                  <span>Une notification apparaît pour confirmer</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500 font-bold">⚠️</span>
                  <span><strong>Attention :</strong> La suppression est définitive !</span>
                </li>
              </ol>
            </div>

            {/* Réservations */}
            <div className="bg-white rounded-lg p-6 shadow-sm md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-purple-100 text-purple-700 font-bold text-lg rounded-full w-10 h-10 flex items-center justify-center">5</span>
                <h3 className="text-xl font-bold text-gray-900">Gérer les réservations</h3>
              </div>
              <ol className="space-y-3 text-gray-700 text-base">
                <li className="flex gap-2">
                  <span className="text-purple-500 font-bold">→</span>
                  <span>Cliquez sur <strong>"Réservations"</strong> dans le tableau de bord</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-500 font-bold">→</span>
                  <span>Les réservations sont <strong>groupées par plat</strong> avec le total pour chaque</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-500 font-bold">→</span>
                  <span>Le <strong>total général</strong> s'affiche en haut à droite</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-500 font-bold">→</span>
                  <span>Cliquez sur <strong>"Télécharger CSV"</strong> pour obtenir la liste complète</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-500 font-bold">→</span>
                  <span>Ouvrez le fichier CSV avec <strong>Excel</strong> ou LibreOffice</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-500 font-bold">→</span>
                  <span>Imprimez depuis Excel pour avoir la liste papier</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-500 font-bold">→</span>
                  <span>Cliquez sur <strong>"Annuler"</strong> pour supprimer une réservation (remet en stock)</span>
                </li>
              </ol>
            </div>
          </div>

          {/* Conseils */}
          <div className="mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
            <div className="flex gap-3">
              <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="font-bold text-gray-900 text-lg mb-2">💡 Conseils pratiques</h4>
                <ul className="space-y-2 text-gray-700 text-base">
                  <li>• <strong>Taille des images :</strong> Privilégiez des images de moins de 200 Ko pour un chargement rapide</li>
                  <li>• <strong>Sauts de ligne :</strong> Appuyez sur <strong>Entrée</strong> pour créer des paragraphes dans vos textes</li>
                  <li>• <strong>Vérification :</strong> Après publication, consultez la page du site pour vérifier la mise en forme (espacement, sauts de ligne...) et modifiez si nécessaire</li>
                  <li>• Un message vert confirme que votre action a réussi</li>
                  <li>• Si vous voyez un message rouge, réessayez ou contactez le support</li>
                  <li>• N'hésitez pas à modifier plusieurs fois jusqu'à être satisfait du résultat</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bouton retour vers le site */}
      <div className="max-w-7xl mx-auto mt-8">
        <Link
          href="/"
          className="inline-block text-gray-600 hover:text-indigo-600 font-medium text-sm transition-colors"
        >
          ← Retour au site
        </Link>
      </div>
      </main>
    </AdminProtection>
  );
}
