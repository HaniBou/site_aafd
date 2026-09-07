"use client";

import { useState, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Plat, Vente } from "@/types";
import { formatDateHeure } from "@/lib/vente";

type ReservationModalProps = {
  isOpen: boolean;
  plat: Plat | null;
  vente?: Vente | null;
  onClose: () => void;
};

export default function ReservationModal({ isOpen, plat, vente, onClose }: ReservationModalProps) {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    quantite: 1,
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | "warning" | null>(null);
  const [emailError, setEmailError] = useState<string>("");
  const [emailWarning, setEmailWarning] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null);
  const submittingRef = useRef(false);
  const router = useRouter();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setFormData({ ...formData, email });
    
    if (email && !validateEmail(email)) {
      setEmailError("Format d'email invalide");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      setEmailError("Veuillez entrer une adresse email valide");
      return;
    }

    if (submittingRef.current) return;
    submittingRef.current = true;
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platId: plat!.id,
          clientNom: formData.nom,
          clientEmail: formData.email,
          clientTelephone: formData.telephone,
          quantite: formData.quantite,
          message: formData.message || "",
        }),
      });

      const reservation = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(reservation.error || "La réservation n'a pas pu être enregistrée.");
      }

      setSubmitStatus(reservation.emailEnvoye ? "success" : "warning");

      router.refresh();
    } catch (error) {
      setEmailWarning(error instanceof Error ? error.message : "Une erreur est survenue.");
      setSubmitStatus("error");
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !plat) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-overlay-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reservation-modal-title"
      onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-modal-in">
        <div className="bg-orange-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h3 id="reservation-modal-title" className="text-2xl font-bold mb-2">Réserver</h3>
              <p className="text-orange-50">{plat.nom}</p>
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

        <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="nom" className="block text-sm font-semibold text-gray-700 mb-2">
              Nom complet *
            </label>
            <input
              type="text"
              id="nom"
              required
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
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
              value={formData.email}
              onChange={handleEmailChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                emailError ? 'border-red-500' : 'border-gray-300'
              }`}
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
              value={formData.telephone}
              onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              placeholder="06 12 34 56 78"
            />
          </div>

          <div>
            <label htmlFor="quantite" className="block text-sm font-semibold text-gray-700 mb-2">
              Quantité *
            </label>
            <select
              id="quantite"
              required
              value={formData.quantite}
              onChange={(e) => setFormData({ ...formData, quantite: parseInt(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            >
              {Array.from({ length: Math.min(plat.quantite, 10) }, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          {typeof plat.prix === "number" && (
            <div className="rounded-lg bg-orange-50 border border-orange-200 p-4">
              <div className="flex items-center justify-between text-sm text-gray-700">
                <span>
                  {formData.quantite} × {plat.prix.toFixed(2)} €
                </span>
                <span className="text-lg font-bold text-orange-700">
                  {(plat.prix * formData.quantite).toFixed(2)} €
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-600">
                À régler sur place au moment du retrait.
              </p>
            </div>
          )}

          {vente?.dateRetrait && (
            <div className="rounded-lg bg-gray-50 border border-gray-200 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">Retrait</p>
              <p className="text-sm font-semibold text-gray-900">{formatDateHeure(vente.dateRetrait)}</p>
              {vente.lieuRetrait && <p className="text-sm text-gray-600 mt-0.5">{vente.lieuRetrait}</p>}
            </div>
          )}

          <div>
            <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
              Message (optionnel)
            </label>
            <textarea
              id="message"
              rows={3}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
              placeholder="Précisions, allergies, demandes particulières..."
            />
          </div>

          {submitStatus === "success" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <svg className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-green-900">Réservation confirmée ! ✅</p>
                <p className="text-sm text-green-700 mt-1">Vous recevrez un email de confirmation sous peu.</p>
              </div>
            </div>
          )}

          {submitStatus === "warning" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
              <svg className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="font-semibold text-yellow-900">Réservation enregistrée ✅</p>
                <p className="text-sm text-yellow-800 mt-1">
                  Votre réservation est bien prise en compte. L&apos;email de confirmation n&apos;a pas pu être envoyé, mais l&apos;association a bien reçu votre demande.
                </p>
                <p className="text-sm text-yellow-800 mt-2 font-medium">
                  Nous vous contacterons par téléphone pour confirmer.
                </p>
              </div>
            </div>
          )}

          {submitStatus === "error" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <svg className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-red-900">Réservation impossible ❌</p>
                <p className="text-sm text-red-700 mt-1">{emailWarning || "Veuillez réessayer ou nous contacter directement."}</p>
              </div>
            </div>
          )}

          {submitStatus === "success" || submitStatus === "warning" ? (
            <div className="pt-4">
              <button
                type="button"
                onClick={onClose}
                className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors shadow-md"
              >
                Fermer
              </button>
            </div>
          ) : (
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !!emailError}
                className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Envoi..." : "Confirmer"}
              </button>
            </div>
          )}

          <p className="text-xs text-gray-500 text-center pt-2">
            * Champs obligatoires
          </p>
        </form>
      </div>
    </div>
  );
}
