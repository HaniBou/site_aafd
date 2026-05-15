"use client";

import { useState, useEffect } from "react";
import getPlats from "@/lib/getPlats";
import ReservationModal from "@/components/ReservationModal";
import { PageHero } from "@/components/PageHero";
import PlatCard from "@/components/PlatCard";

type Plat = {
  id: string;
  nom: string;
  description: string;
  quantite: number;
  prix: number;
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
      <PageHero
        title="Nos Plats Cuisinés"
        description="Nos bénévoles préparent régulièrement des plats faits maison que vous pouvez réserver. 
            En achetant nos plats, vous soutenez directement les actions de l&apos;AAFD"
        imageSrc="/images/hero_plats.webp"
        imageAlt="Nos plats cuisinés"
        accentColor="bg-orange-400"
      />

      {/* Introduction
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-gray-900">
            Une cuisine qui a du cœur
          </h2>
          <p className="text-body-large text-gray-700 mb-4">
            Nos bénévoles préparent régulièrement des plats faits maison que vous pouvez réserver. 
            En achetant nos plats, vous soutenez directement les actions de l&apos;AAFD auprès des familles en difficulté.
          </p>
          <p className="text-lg text-gray-600">
            💙 Tous les bénéfices sont reversés à l&apos;association
          </p>
        </div>
      </section> */}

      {/* Plats disponibles */}
      <section className="py-16 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-gray-900">
              Nos Plats du Moment
            </h2>
            <p className="text-body-large text-gray-600">
              Découvrez nos spécialités préparées avec des produits frais
            </p>
          </div>

          <div className="flex flex-wrap gap-8 justify-center">
            {plats.map((plat, index) => (
              <PlatCard 
                key={plat.id}
                plat={plat}
                onReserve={openModal}
                iconFallback={platIcons[index % platIcons.length]}
              />
            ))}
          </div>

          {plats.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-gray-500 mb-4">
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
      <section className="py-16 bg-primary/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900 mb-12 sm:text-4xl">
            Comment ça marche ?
          </h2>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {/* Étape 1 */}
            <div className="text-center">
              <div className="mx-auto w-20 h-20 rounded-full bg-orange-600 flex items-center justify-center mb-4 shadow-lg">
                <span className="text-4xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Choisissez votre plat</h3>
              <p className="text-gray-700 leading-relaxed">
                Parcourez nos plats disponibles et cliquez sur "Réserver ce plat"
              </p>
            </div>

            {/* Étape 2 */}
            <div className="text-center">
              <div className="mx-auto w-20 h-20 rounded-full bg-orange-600 flex items-center justify-center mb-4 shadow-lg">
                <span className="text-4xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Réservez en ligne</h3>
              <p className="text-gray-700 leading-relaxed">
                Remplissez le formulaire avec vos coordonnées
              </p>
            </div>

            {/* Étape 3 */}
            <div className="text-center">
              <div className="mx-auto w-20 h-20 rounded-full bg-orange-600 flex items-center justify-center mb-4 shadow-lg">
                <span className="text-4xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Venez retirer</h3>
              <p className="text-gray-700 leading-relaxed">
                Récupérez votre plat à la date convenue et réglez sur place
              </p>
            </div>
          </div>

          <div className="mt-12 max-w-3xl mx-auto bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
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
      <section className="py-16 bg-blue-900 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2>
            Une question sur nos plats ?
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-8">
            N&apos;hésitez pas à nous contacter pour plus d&apos;informations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-3 rounded-full border-2 border-white px-8 py-4 text-lg font-semibold text-white hover:bg-white hover:text-blue-900 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Nous contacter
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
