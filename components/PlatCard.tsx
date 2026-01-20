import Image from "next/image";
import { useState, useEffect } from "react";

type Plat = {
  id: string;
  nom: string;
  description: string;
  quantite: number;
  prix: number;
  image?: string;
  dateAjout: string;
};

interface PlatCardProps {
  plat: Plat;
  onReserve: (plat: Plat) => void;
  iconFallback?: string;
}

export default function PlatCard({ plat, onReserve, iconFallback = "🍽️" }: PlatCardProps) {
  const [showImageModal, setShowImageModal] = useState(false);

  // Bloquer le scroll de la page quand la modal est ouverte
  useEffect(() => {
    if (showImageModal) {
      document.body.style.overflow = 'hidden';
      // Cacher le bouton flottant don
      const floatingButton = document.getElementById('floating-don-button');
      if (floatingButton) {
        floatingButton.style.opacity = '0';
        floatingButton.style.pointerEvents = 'none';
      }
    } else {
      document.body.style.overflow = 'unset';
      // Réafficher le bouton flottant don
      const floatingButton = document.getElementById('floating-don-button');
      if (floatingButton) {
        floatingButton.style.opacity = '';
        floatingButton.style.pointerEvents = '';
      }
    }
    
    // Cleanup : remettre le scroll et le bouton quand le composant est démonté
    return () => {
      document.body.style.overflow = 'unset';
      const floatingButton = document.getElementById('floating-don-button');
      if (floatingButton) {
        floatingButton.style.opacity = '';
        floatingButton.style.pointerEvents = '';
      }
    };
  }, [showImageModal]);

  return (
    <>
      <div 
        className="group bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 border border-gray-100 w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] max-w-sm cursor-pointer"
        onClick={() => setShowImageModal(true)}
      >
        {/* Image */}
        <div className="relative h-48 bg-gradient-to-br from-orange-400 to-red-500 overflow-hidden">
        {plat.image && plat.image !== 'none' ? (
          <Image
            src={plat.image}
            alt={plat.nom}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <span className="text-6xl opacity-90">{iconFallback}</span>
          </div>
        )}
        
        {/* Badge disponibilité */}
        <div className="absolute top-4 right-4">
          {plat.quantite > 0 ? (
            <span className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              ✓ Disponible
            </span>
          ) : (
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              Épuisé
            </span>
          )}
        </div>
      </div>

      {/* Contenu */}
      <div className="p-4">
        {/* Nom du plat */}
        <h3 className="text-gray-900 mb-2">
          {plat.nom}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {plat.description}
        </p>

        {/* Prix et quantité */}
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-orange-600">
            {plat.prix}€
          </div>
          {plat.quantite > 0 && (
            <div className="text-sm text-gray-500">
              <span className="font-semibold text-gray-700">{plat.quantite}</span> restant{plat.quantite > 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>
    </div>

      {/* Modal détail du plat */}
      {showImageModal && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div 
            className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Bouton fermer */}
            <button 
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image */}
            <div className="relative h-80 bg-gradient-to-br from-orange-400 to-red-500">
              {plat.image && plat.image !== 'none' ? (
                <Image
                  src={plat.image}
                  alt={plat.nom}
                  fill
                  className="object-cover"
                  sizes="800px"
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <span className="text-9xl opacity-90">{iconFallback}</span>
                </div>
              )}
              
              {/* Badge disponibilité */}
              <div className="absolute top-4 left-4">
                {plat.quantite > 0 ? (
                  <span className="bg-green-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                    ✓ Disponible ({plat.quantite} restant{plat.quantite > 1 ? 's' : ''})
                  </span>
                ) : (
                  <span className="bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                    Épuisé
                  </span>
                )}
              </div>
            </div>

            {/* Contenu */}
            <div className="p-6">
              {/* Titre et prix */}
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-gray-900">{plat.nom}</h2>
                <div className="text-3xl font-bold text-orange-600 ml-4">
                  {plat.prix}€
                </div>
              </div>

              {/* Description complète */}
              <div className="mb-6">
                <h3 className="text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed text-justify">
                  {plat.description}
                </p>
              </div>

              {/* Bouton réserver */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowImageModal(false);
                  onReserve(plat);
                }}
                className={`w-full font-semibold py-3 px-6 rounded-lg transition-all ${
                  plat.quantite > 0
                    ? 'bg-orange-500 text-white hover:bg-orange-600 active:scale-95 shadow-md hover:shadow-lg'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                disabled={plat.quantite === 0}
              >
                {plat.quantite > 0 ? 'Réserver ce plat' : 'Non disponible'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
