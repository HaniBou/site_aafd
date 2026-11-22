"use client";

import { useState, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Plat, Vente } from "@/types";
import { formatDateHeure } from "@/lib/vente";
import { formatPrix } from "@/lib/commande";
import { Button } from "@/components/ui/Button";

export type LignePanier = { plat: Plat; quantite: number };

type ReservationModalProps = {
  lignes: LignePanier[];
  vente?: Vente | null;
  quantiteMax: (plat: Plat) => number;
  onChangerQuantite: (platId: string, quantite: number) => void;
  // Appele une fois la commande enregistree : le panier peut etre vide.
  onCommandeEnregistree: () => void;
  onClose: () => void;
};

const CHAMP =
  "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all";

export default function ReservationModal({
  lignes,
  vente,
  quantiteMax,
  onChangerQuantite,
  onCommandeEnregistree,
  onClose,
}: ReservationModalProps) {
  const [formData, setFormData] = useState({ nom: "", email: "", telephone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | "warning" | null>(null);
  const [emailError, setEmailError] = useState<string>("");
  const [erreurEnvoi, setErreurEnvoi] = useState<string>("");
  const submittingRef = useRef(false);
  const router = useRouter();

  const total = lignes.reduce((somme, { plat, quantite }) => somme + plat.prix * quantite, 0);
  const commandeEnregistree = submitStatus === "success" || submitStatus === "warning";

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setFormData({ ...formData, email });
    setEmailError(email && !validateEmail(email) ? "Format d'email invalide" : "");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      setEmailError("Veuillez entrer une adresse email valide");
      return;
    }
    if (lignes.length === 0) return;

    if (submittingRef.current) return;
    submittingRef.current = true;
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lignes: lignes.map(({ plat, quantite }) => ({ platId: plat.id, quantite })),
          clientNom: formData.nom,
          clientEmail: formData.email,
          clientTelephone: formData.telephone,
        }),
      });

      const resultat = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(resultat.error || "La commande n'a pas pu être enregistrée.");
      }

      setSubmitStatus(resultat.emailEnvoye ? "success" : "warning");
      onCommandeEnregistree();
    } catch (error) {
      setErreurEnvoi(error instanceof Error ? error.message : "Une erreur est survenue.");
      setSubmitStatus("error");
    } finally {
      // Stock a jour sur la page, que la commande soit passee ou refusee.
      router.refresh();
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-overlay-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reservation-modal-title"
      onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-modal-in">
        <div className="bg-orange-700 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h3 id="reservation-modal-title" className="text-2xl font-bold mb-2">Ma commande</h3>
              {vente?.titre && <p className="text-orange-50">{vente.titre}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer"
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors min-w-11 min-h-11 flex items-center justify-center"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {commandeEnregistree ? (
          <div className="p-6 space-y-4">
            {submitStatus === "success" ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-start gap-3">
                <svg className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-semibold text-emerald-900">Commande confirmée ! ✅</p>
                  <p className="text-sm text-emerald-700 mt-1">Vous allez recevoir un email récapitulatif.</p>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                <svg className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="font-semibold text-yellow-900">Commande enregistrée ✅</p>
                  <p className="text-sm text-yellow-800 mt-1">
                    Votre commande est bien prise en compte. L&apos;email récapitulatif n&apos;a pas pu être envoyé, mais l&apos;association a bien reçu votre commande.
                  </p>
                  <p className="text-sm text-yellow-800 mt-2 font-medium">
                    Nous vous contacterons par téléphone pour confirmer.
                  </p>
                </div>
              </div>
            )}
            <Button variant="primary" size="md" shape="rounded" fullWidth onClick={onClose}>
              Fermer
            </Button>
          </div>
        ) : lignes.length === 0 ? (
          <div className="p-6 space-y-4 text-center">
            <p className="text-gray-700">Votre commande est vide.</p>
            <Button variant="primary" size="md" shape="rounded" fullWidth onClick={onClose}>
              Choisir des plats
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="rounded-lg border border-orange-200 divide-y divide-orange-100">
              {lignes.map(({ plat, quantite }) => (
                <div key={plat.id} className="flex items-center gap-3 p-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm leading-tight">{plat.nom}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{formatPrix(plat.prix)} l&apos;unité</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => onChangerQuantite(plat.id, quantite - 1)}
                      aria-label={quantite === 1 ? `Retirer ${plat.nom}` : `Un ${plat.nom} de moins`}
                      className="min-w-11 min-h-11 rounded-lg border border-gray-200 text-orange-700 text-lg font-bold hover:bg-orange-50 transition-colors"
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-semibold text-gray-900">{quantite}</span>
                    <button
                      type="button"
                      onClick={() => onChangerQuantite(plat.id, quantite + 1)}
                      disabled={quantite >= quantiteMax(plat)}
                      aria-label={`Un ${plat.nom} de plus`}
                      className="min-w-11 min-h-11 rounded-lg border border-gray-200 text-orange-700 text-lg font-bold hover:bg-orange-50 transition-colors disabled:opacity-40 disabled:hover:bg-white"
                    >
                      +
                    </button>
                  </div>
                  <p className="w-16 text-right text-sm font-semibold text-gray-900 shrink-0">
                    {formatPrix(plat.prix * quantite)}
                  </p>
                </div>
              ))}
              <div className="flex items-center justify-between bg-orange-50 p-3 rounded-b-lg">
                <span className="text-sm text-gray-700">Total, à régler sur place au retrait</span>
                <span className="text-lg font-bold text-orange-700">{formatPrix(total)}</span>
              </div>
            </div>

            {vente?.dateRetrait && (
              <div className="rounded-lg bg-gray-50 border border-gray-200 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">Retrait</p>
                <p className="text-sm font-semibold text-gray-900">{formatDateHeure(vente.dateRetrait)}</p>
                {vente.lieuRetrait && <p className="text-sm text-gray-600 mt-0.5">{vente.lieuRetrait}</p>}
              </div>
            )}

            <div>
              <label htmlFor="nom" className="block text-sm font-semibold text-gray-700 mb-2">
                Nom complet *
              </label>
              <input
                type="text"
                id="nom"
                required
                autoComplete="name"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                className={CHAMP}
                placeholder="Votre nom"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={handleEmailChange}
                className={`${CHAMP} ${emailError ? 'border-red-500' : ''}`}
                placeholder="votre@email.com"
              />
              {emailError && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {emailError}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="telephone" className="block text-sm font-semibold text-gray-700 mb-2">
                Téléphone *
              </label>
              <input
                type="tel"
                id="telephone"
                required
                autoComplete="tel"
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                className={CHAMP}
                placeholder="06 12 34 56 78"
              />
            </div>

            {submitStatus === "error" && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3" role="alert">
                <svg className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-semibold text-red-900">Commande non enregistrée</p>
                  <p className="text-sm text-red-700 mt-1">{erreurEnvoi || "Veuillez réessayer ou nous contacter directement."}</p>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                variant="secondary"
                size="md"
                shape="rounded"
                className="flex-1"
                onClick={onClose}
              >
                Continuer mes achats
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                shape="rounded"
                className="flex-1"
                disabled={isSubmitting || !!emailError}
              >
                {isSubmitting ? "Envoi..." : "Commander"}
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center pt-2">
              * Champs obligatoires
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
