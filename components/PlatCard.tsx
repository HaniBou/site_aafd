"use client";

import Image from "next/image";
import { useState } from "react";
import type { Plat } from "@/types";
import { Button } from "@/components/ui/Button";

interface PlatCardProps {
  plat: Plat;
  // Quantite de ce plat dans la commande en cours, et maximum autorise.
  quantiteCommandee: number;
  quantiteMax: number;
  onChangerQuantite: (quantite: number) => void;
  reservationOuverte?: boolean;
  iconFallback?: string;
}

export default function PlatCard({
  plat,
  quantiteCommandee,
  quantiteMax,
  onChangerQuantite,
  reservationOuverte = true,
  iconFallback = "🍽️",
}: PlatCardProps) {
  const [showOverlay, setShowOverlay] = useState(false);

  const handleImageClick = (e: React.MouseEvent) => {
    if (window.innerWidth < 768) {
      e.stopPropagation();
      setShowOverlay((v) => !v);
    }
  };

  const [isImageHovered, setIsImageHovered] = useState(false);

  return (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 border border-gray-100 w-full h-full flex flex-col"
    >
      <div
        className="group relative aspect-[4/3] bg-orange-700 overflow-hidden cursor-pointer"
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
        <div
          className={
            `absolute inset-0 flex flex-col justify-center items-center p-6 text-white text-center transition-opacity duration-300 backdrop-blur-sm bg-black/70`
            + ` ${showOverlay || isImageHovered ? 'opacity-100' : 'opacity-0'}`
          }
          style={{ pointerEvents: showOverlay || isImageHovered ? 'auto' : 'none' }}
          onClick={e => {
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

        <div className="absolute top-4 right-4">
          {!reservationOuverte ? (
            <span className="bg-gray-700 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              Réservations closes
            </span>
          ) : plat.quantite > 0 ? (
            <span className="bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              ✓ Disponible
            </span>
          ) : (
            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              Épuisé
            </span>
          )}
        </div>
      </div>
      <div className="p-3 text-center flex flex-col gap-1">
        <h3 className="text-gray-900 mb-1 font-bold text-base leading-tight">
          {plat.nom}
        </h3>
        {plat.typeMenu && (
          <p className="text-orange-700 text-sm mb-1 font-semibold">{plat.typeMenu}</p>
        )}
        {plat.cuisiniers && (
          <p className="text-gray-700 text-sm italic mb-1">
            concocté par {plat.cuisiniers}
          </p>
        )}
        <div className="flex items-center justify-between mt-1 mb-1">
          <div className="text-lg font-bold text-orange-700">
            {plat.prix}€
          </div>
          {reservationOuverte && plat.quantite > 0 && (
            <div className="text-xs text-gray-500">
              <span className="font-semibold text-gray-700">{plat.quantite}</span> restant{plat.quantite > 1 ? 's' : ''}
            </div>
          )}
        </div>
        {reservationOuverte && quantiteCommandee > 0 ? (
          <div className="mt-1">
            <div className="flex items-center justify-between gap-2 rounded-xl border-2 border-orange-700 bg-orange-50 p-1">
              <button
                type="button"
                onClick={() => onChangerQuantite(quantiteCommandee - 1)}
                aria-label={quantiteCommandee === 1 ? `Retirer ${plat.nom} de la commande` : `Un ${plat.nom} de moins`}
                className="min-w-11 min-h-11 rounded-lg bg-white text-orange-700 text-xl font-bold hover:bg-orange-100 transition-colors"
              >
                −
              </button>
              <span className="text-sm font-semibold text-orange-900" aria-live="polite">
                {quantiteCommandee} dans ma commande
              </span>
              <button
                type="button"
                onClick={() => onChangerQuantite(quantiteCommandee + 1)}
                disabled={quantiteCommandee >= quantiteMax}
                aria-label={`Un ${plat.nom} de plus`}
                className="min-w-11 min-h-11 rounded-lg bg-white text-orange-700 text-xl font-bold hover:bg-orange-100 transition-colors disabled:opacity-40 disabled:hover:bg-white"
              >
                +
              </button>
            </div>
            {quantiteCommandee >= quantiteMax && (
              <p className="mt-1 text-xs text-gray-500">
                {plat.quantite > quantiteMax
                  ? `${quantiteMax} maximum par commande`
                  : 'Plus de portions disponibles'}
              </p>
            )}
          </div>
        ) : (
          <Button
            variant="primary"
            size="sm"
            shape="rounded"
            fullWidth
            className="mt-1"
            onClick={e => {
              e.stopPropagation();
              onChangerQuantite(1);
            }}
            disabled={!reservationOuverte || plat.quantite === 0}
          >
            {!reservationOuverte
              ? 'Réservations closes'
              : plat.quantite > 0
              ? 'Ajouter à ma commande'
              : 'Non disponible'}
          </Button>
        )}
      </div>
    </div>
  );
}
