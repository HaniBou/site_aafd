"use client";

import { useState, useEffect } from "react";
import getPlats from "@/lib/getPlats";
import ReservationModal from "@/components/ReservationModal";

type Plat = {
  id: string;
  nom: string;
  description: string;
  quantite: number;
  image?: string;
  dateAjout: string;
};

export default function VentePlatsPage() {
  const [plats, setPlats] = useState<Plat[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlat, setSelectedPlat] = useState<Plat | null>(null);

  useEffect(() => {
    async function fetchData() {
      const data = await getPlats();
      setPlats(data);
    }
    fetchData();
  }, []);

  const openModal = (plat: Plat) => {
    setSelectedPlat(plat);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPlat(null);
  };

  // Icônes aléatoires pour les plats
  const platIcons = ["🍝", "🥘", "🍰", "🍲", "🥗", "🍛", "🍕", "🥙"];
  const getRandomIcon = (index: number) => platIcons[index % platIcons.length];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-orange-600 py-20 md:py-28 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-700 opacity-90"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-6 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-semibold">Réservation en ligne</span>
          </div>
          <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            Nos Plats Cuisinés 🍲
          </h1>
          <p className="mx-auto max-w-3xl text-xl md:text-2xl leading-relaxed text-orange-100">
            Des plats préparés avec amour pour soutenir nos actions solidaires
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Une cuisine qui a du cœur
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed mb-4">
            Nos bénévoles préparent régulièrement des plats faits maison que vous pouvez réserver. 
            En achetant nos plats, vous soutenez directement les actions de l&apos;AAFD auprès des familles en difficulté.
          </p>
          <p className="text-lg text-gray-600">
            💙 Tous les bénéfices sont reversés à l&apos;association
          </p>
        </div>
      </section>

      {/* Plats disponibles */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Nos Plats du Moment
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez nos spécialités préparées avec des produits frais
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {plats.map((plat, index) => (
              <div key={plat.id} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:scale-105">
                <div className="h-48 bg-gradient-to-br from-red-400 to-orange-500 flex items-center justify-center">
                  <span className="text-8xl">{getRandomIcon(index)}</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-2xl font-bold text-gray-900">{plat.nom}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {plat.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm mb-4">
                    {plat.quantite > 0 ? (
                      <span className="text-green-600 font-semibold flex items-center gap-1">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {plat.quantite} disponible{plat.quantite > 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">Épuisé</span>
                    )}
                  </div>
                  <button 
                    onClick={() => openModal(plat)}
                    className={`w-full font-semibold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg ${
                      plat.quantite > 0
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={plat.quantite === 0}
                  >
                    {plat.quantite > 0 ? 'Réserver ce plat' : 'Non disponible'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {plats.length === 0 && (
            <div className="text-center py-16">
              <p className="text-2xl text-gray-500 mb-4">
                Aucun plat disponible pour le moment
              </p>
              <p className="text-lg text-gray-400">
                Revenez bientôt pour découvrir nos nouvelles spécialités !
              </p>
            </div>
          )}

          <div className="mt-12 text-center">
            <p className="text-lg text-gray-600 mb-6">
              Les plats proposés varient selon la saison et les événements. 
              <br />
              Contactez-nous pour connaître les disponibilités actuelles !
            </p>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-16 bg-blue-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-4xl md:text-5xl font-bold text-gray-900 mb-12">
            Comment ça marche ?
          </h2>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {/* Étape 1 */}
            <div className="text-center">
              <div className="mx-auto w-20 h-20 rounded-full bg-orange-600 flex items-center justify-center mb-4 shadow-lg">
                <span className="text-4xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Choisissez votre plat</h3>
              <p className="text-gray-700 leading-relaxed">
                Parcourez nos plats disponibles et cliquez sur "Réserver ce plat"
              </p>
            </div>

            {/* Étape 2 */}
            <div className="text-center">
              <div className="mx-auto w-20 h-20 rounded-full bg-orange-600 flex items-center justify-center mb-4 shadow-lg">
                <span className="text-4xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Réservez en ligne</h3>
              <p className="text-gray-700 leading-relaxed">
                Remplissez le formulaire avec vos coordonnées
              </p>
            </div>

            {/* Étape 3 */}
            <div className="text-center">
              <div className="mx-auto w-20 h-20 rounded-full bg-orange-600 flex items-center justify-center mb-4 shadow-lg">
                <span className="text-4xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Venez retirer</h3>
              <p className="text-gray-700 leading-relaxed">
                Récupérez votre plat à la date convenue et réglez sur place
              </p>
            </div>
          </div>

          <div className="mt-12 max-w-3xl mx-auto bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              📍 Lieu de retrait
            </h3>
            <p className="text-lg text-gray-700 text-center mb-4">
              Les plats sont à retirer à notre local associatif
            </p>
            <p className="text-center text-gray-600">
              <strong>Adresse :</strong> Val de Saône (précisions communiquées lors de la réservation)
            </p>
          </div>
        </div>
      </section>

      {/* Modal de réservation */}
      <ReservationModal 
        isOpen={isModalOpen}
        plat={selectedPlat}
        onClose={closeModal}
      />

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-br from-orange-600 to-red-600 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Une question sur nos plats ?
          </h2>
          <p className="text-xl md:text-2xl text-orange-100 mb-8">
            N&apos;hésitez pas à nous contacter pour plus d&apos;informations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:aafd@gmx.fr"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-white text-orange-600 px-8 py-4 text-lg font-semibold hover:bg-orange-50 transition-colors shadow-lg"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Nous contacter
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-orange-800 text-white px-8 py-4 text-lg font-semibold hover:bg-orange-900 transition-colors shadow-lg"
            >
              Voir les coordonnées
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
