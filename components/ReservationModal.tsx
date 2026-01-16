"use client";

import { useState, useRef, FormEvent } from "react";
import emailjs from "@emailjs/browser";
import createReservation from "@/lib/createReservation";
import updatePlatQuantite from "@/lib/updatePlatQuantite";

type Plat = {
  id: string;
  nom: string;
  description: string;
  quantite: number;
  image?: string;
  dateAjout: string;
};

type ReservationModalProps = {
  isOpen: boolean;
  plat: Plat | null;
  onClose: () => void;
};

export default function ReservationModal({ isOpen, plat, onClose }: ReservationModalProps) {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    quantite: 1,
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // 1. Vérifier et décrémenter la quantité dans Firestore
      await updatePlatQuantite(plat!.id, formData.quantite);

      // 2. Enregistrer la réservation dans Firestore
      await createReservation({
        platId: plat!.id,
        platNom: plat!.nom,
        clientNom: formData.nom,
        clientEmail: formData.email,
        clientTelephone: formData.telephone,
        quantite: formData.quantite,
        message: formData.message || "",
      });

      // 3. Envoyer l'email de confirmation
      emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!);

      const templateParams = {
        plat_nom: plat?.nom,
        client_nom: formData.nom,
        client_email: formData.email,
        client_telephone: formData.telephone,
        quantite: formData.quantite,
        message: formData.message || "Aucun message"
      };

      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        templateParams
      );

      setSubmitStatus("success");
      
      // Fermer le modal et rafraîchir la page après 3 secondes
      setTimeout(() => {
        window.location.reload(); // Pour mettre à jour les quantités affichées
      }, 3000);
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !plat) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* En-tête du modal */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold mb-2">Réserver</h3>
              <p className="text-orange-100">{plat.nom}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Formulaire */}
        <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nom */}
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

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              placeholder="votre@email.com"
            />
          </div>

          {/* Téléphone */}
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

          {/* Quantité */}
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

          {/* Message optionnel */}
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

          {/* Message de statut */}
          {submitStatus === "success" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <svg className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-green-900">Réservation envoyée ! ✅</p>
                <p className="text-sm text-green-700 mt-1">Vous recevrez un email de confirmation sous peu.</p>
              </div>
            </div>
          )}

          {submitStatus === "error" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <svg className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-red-900">Erreur d'envoi ❌</p>
                <p className="text-sm text-red-700 mt-1">Veuillez réessayer ou nous contacter directement.</p>
              </div>
            </div>
          )}

          {/* Boutons */}
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
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Envoi..." : "Confirmer"}
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center pt-2">
            * Champs obligatoires
          </p>
        </form>
      </div>
    </div>
  );
}
