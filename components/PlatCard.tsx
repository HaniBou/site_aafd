"use client";

import Image from "next/image";
import { useState } from "react";
import type { Plat } from "@/types";

interface PlatCardProps {
  plat: Plat;
  onReserve: (plat: Plat) => void;
  reservationOuverte?: boolean;
  iconFallback?: string;
}

export default function PlatCard({
  plat,
  onReserve,
  reservationOuverte = true,
  iconFallback = "🍽️",
}: PlatCardProps) {
  const [showOverlay, setShowOverlay] = useState(false);

  // Gestion overlay mobile : clic affiche/masque overlay
  const handleImageClick = (e: React.MouseEvent) => {
    // Ne déclenche que sur mobile
    if (window.innerWidth < 768) {
      e.stopPropagation();
      setShowOverlay((v) => !v);
    }
  };

  // Pour desktop : overlay uniquement au hover de l'image (pas toute la carte)
  const [isImageHovered, setIsImageHovered] = useState(false);

  return (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 border border-gray-100 w-full h-full flex flex-col"
    >
      {/* Image + overlay */}
      <div
        className="group relative aspect-[4/3] bg-orange-500 overflow-hidden cursor-pointer"
        onClick={handleImageClick}
        onMouseEnter={() => setIsImageHovered(true)}
        onMouseLeave={() => setIsImageHovered(false)}
      >
        {plat.image && plat.image !== 'none' ? (
          <Image
            src={plat.image}
            alt={plat.nom}
            fill
            className={
              `object-cover transition-transform duration-500 w-full h-full` +
              ` group-hover:scale-110` +
              ` ${showOverlay ? 'blur-sm scale-105' : ''}`
            }
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <span className="text-6xl opacity-90">{iconFallback}</span>
          </div>
        )}
        {/* Overlay description : hover (desktop) ou showOverlay (mobile) */}
        <div
          className={
            `absolute inset-0 flex flex-col justify-center items-center p-6 text-white text-center transition-opacity duration-300 backdrop-blur-sm bg-black/70`
            + ` ${showOverlay || isImageHovered ? 'opacity-100' : 'opacity-0'}`
          }
          style={{ pointerEvents: showOverlay || isImageHovered ? 'auto' : 'none' }}
          onClick={e => {
            // Sur mobile, cliquer l'overlay le masque
            if (window.innerWidth < 768) {
              e.stopPropagation();
              setShowOverlay(false);
            }
          }}
        >
          <p className="text-sm leading-relaxed mb-4">
            {plat.description}
          </p>
          {plat.items && plat.items.length > 0 && (
            <ul className="text-xs space-y-1 border-t border-white/20 pt-2">
              {plat.items.map((item, i) => (
                <li key={i}>• {item}</li>
              ))}
            </ul>
          )}
        </div>
        {/* Affordance : sans elle, personne ne découvre l'overlay */}
        {(plat.description || (plat.items && plat.items.length > 0)) && (
          <span
            className={`absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-sm transition-opacity duration-300 ${
              showOverlay || isImageHovered ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="md:hidden">Voir le détail</span>
            <span className="hidden md:inline">Survolez pour le détail</span>
          </span>
        )}

        {/* Badge disponibilité */}
        <div className="absolute top-4 right-4">
          {!reservationOuverte ? (
            <span className="bg-gray-700 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              Réservations closes
            </span>
          ) : plat.quantite > 0 ? (
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
      <div className="p-3 text-center flex flex-col gap-1">
        {/* Nom du plat */}
        <h3 className="text-gray-900 mb-1 font-bold text-base leading-tight">
          {plat.nom}
        </h3>
        {/* Type de menu en sous-titre si présent */}
        {plat.typeMenu && (
          <p className="text-orange-600 text-sm mb-1 font-semibold">{plat.typeMenu}</p>
        )}
        {/* Cuisiniers */}
        {plat.cuisiniers && (
          <p className="text-gray-700 text-sm italic mb-1">
            concocté par {plat.cuisiniers}
          </p>
        )}
        {/* Prix et quantité */}
        <div className="flex items-center justify-between mt-1 mb-1">
          <div className="text-lg font-bold text-orange-600">
            {plat.prix}€
          </div>
          {reservationOuverte && plat.quantite > 0 && (
            <div className="text-xs text-gray-500">
              <span className="font-semibold text-gray-700">{plat.quantite}</span> restant{plat.quantite > 1 ? 's' : ''}
            </div>
          )}
        </div>
        {/* Bouton réserver (miniature) */}
        <button
          onClick={e => {
            e.stopPropagation();
            onReserve(plat);
          }}
          className={`w-full font-semibold py-2 px-3 rounded-lg text-sm transition-all mt-1 ${
            reservationOuverte && plat.quantite > 0
              ? 'bg-orange-600 text-white hover:bg-orange-700 active:scale-95 shadow-md hover:shadow-lg'
              : 'bg-gray-200 text-gray-600 cursor-not-allowed'
          }`}
          disabled={!reservationOuverte || plat.quantite === 0}
        >
          {!reservationOuverte
            ? 'Réservations closes'
            : plat.quantite > 0
            ? 'Réserver ce plat'
            : 'Non disponible'}
        </button>
      </div>
    </div>
  );
}
