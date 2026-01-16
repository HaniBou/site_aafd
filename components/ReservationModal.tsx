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
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | "warning" | null>(null);
  const [emailError, setEmailError] = useState<string>("");
  const [emailWarning, setEmailWarning] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null);

  // Fonction de validation d'email
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
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Validation finale de l'email avant envoi
    if (!validateEmail(formData.email)) {
      setEmailError("Veuillez entrer une adresse email valide");
      setIsSubmitting(false);
      return;
    }

    try {
      // 1. Vérifier et décrémenter la quantité dans Firestore
      await updatePlatQuantite(plat!.id, formData.quantite);

      // 2. Envoyer l'email de confirmation d'abord
      let emailSent = false;
      let emailErrorMessage = "";
      
      try {
        emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!);

        const templateParams = {
          plat_nom: plat?.nom,
          client_nom: formData.nom,
          client_email: formData.email,
          client_telephone: formData.telephone,
          quantite: formData.quantite,
          message: formData.message || "Aucun message"
        };

        const response = await emailjs.send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
          templateParams
        );

        // Vérifier la réponse d'EmailJS
        if (response.status === 200) {
          emailSent = true;
        } else {
          emailErrorMessage = `Erreur d'envoi (code ${response.status})`;
        }
      } catch (emailError: any) {
        console.error("Erreur EmailJS:", emailError);
        emailErrorMessage = emailError?.text || "Email invalide ou erreur de serveur";
      }

      // 3. Enregistrer la réservation dans Firestore avec le statut d'email
      await createReservation({
        platId: plat!.id,
        platNom: plat!.nom,
        clientNom: formData.nom,
        clientEmail: formData.email,
        clientTelephone: formData.telephone,
        quantite: formData.quantite,
        message: formData.message || "",
        emailEnvoye: emailSent,
        emailErreur: emailErrorMessage || null,
      });

      setSubmitStatus("success");
      
      // Si l'email n'a pas pu être envoyé, afficher un avertissement
      if (!emailSent) {
        setSubmitStatus("warning");
        setEmailWarning(emailErrorMessage);
      }
      
      // Fermer le modal et rafraîchir la page après 4 secondes
      setTimeout(() => {
        window.location.reload(); // Pour mettre à jour les quantités affichées
      }, 4000);
    } catch (error) {
      console.error("Erreur lors de la réservation:", error);
      setSubmitStatus("error");
      // En cas d'erreur, la quantité n'est normalement pas décrémentée
      // ou sera remise si l'erreur se produit après la décrémentation
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
                <p className="font-semibold text-yellow-900">Réservation enregistrée ⚠️</p>
                <p className="text-sm text-yellow-800 mt-1">
                  Votre réservation est bien prise en compte, mais l'email de confirmation n'a pas pu être envoyé.
                </p>
                <p className="text-xs text-yellow-700 mt-2">
                  Raison : {emailWarning}
                </p>
                <p className="text-sm text-yellow-800 mt-2 font-medium">
                  💡 L'association vous contactera par téléphone pour confirmer.
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
                <p className="font-semibold text-red-900">Erreur d'envoi ❌</p>
                <p className="text-sm text-red-700 mt-1">Veuillez réessayer ou nous contacter directement.</p>
              </div>
            </div>
          )}

          {/* Boutons */}
          {submitStatus !== "success" && submitStatus !== "warning" && (
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
                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
