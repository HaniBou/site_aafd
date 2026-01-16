'use client'

import { useState, FormEvent } from 'react'
import emailjs from '@emailjs/browser'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    sujet: '',
    message: ''
  })
  
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Réinitialise le message de succès/erreur si l'utilisateur modifie un champ
    if (status === 'success' || status === 'error') {
      setStatus('idle')
      setErrorMessage('')
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('sending')
    setErrorMessage('')

    try {
      // Configuration EmailJS pour le formulaire de contact
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID'
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID || 'YOUR_TEMPLATE_ID'
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY'

      // Préparation des données pour le template EmailJS
      const templateParams = {
        from_nom: formData.nom,
        from_prenom: formData.prenom,
        from_email: formData.email,
        from_telephone: formData.telephone,
        sujet: formData.sujet,
        message: formData.message,
        to_email: 'aafd@gmx.fr' // Email de l'association
      }

      await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      )

      setStatus('success')
      // Réinitialiser le formulaire
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        sujet: '',
        message: ''
      })

    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error)
      setStatus('error')
      setErrorMessage('Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.')
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nom et Prénom */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="nom" className="block text-sm font-semibold text-slate-900 mb-2">
              Nom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              placeholder="Votre nom"
            />
          </div>

          <div>
            <label htmlFor="prenom" className="block text-sm font-semibold text-slate-900 mb-2">
              Prénom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="prenom"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              placeholder="Votre prénom"
            />
          </div>
        </div>

        {/* Email et Téléphone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-900 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              placeholder="votre.email@exemple.fr"
            />
          </div>

          <div>
            <label htmlFor="telephone" className="block text-sm font-semibold text-slate-900 mb-2">
              Téléphone
            </label>
            <input
              type="tel"
              id="telephone"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              placeholder="06 12 34 56 78"
            />
          </div>
        </div>

        {/* Sujet */}
        <div>
          <label htmlFor="sujet" className="block text-sm font-semibold text-slate-900 mb-2">
            Sujet <span className="text-red-500">*</span>
          </label>
          <select
            id="sujet"
            name="sujet"
            value={formData.sujet}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
          >
            <option value="">Sélectionnez un sujet</option>
            <option value="demande_aide">Demande d'aide alimentaire</option>
            <option value="benevolat">Proposition de bénévolat</option>
            <option value="don">Don / Partenariat</option>
            <option value="renseignement">Demande de renseignement</option>
            <option value="autre">Autre</option>
          </select>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-semibold text-slate-900 mb-2">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
            placeholder="Décrivez votre demande..."
          />
        </div>

        {/* Bouton d'envoi */}

        {/* Message de succès ou d'erreur juste au-dessus du bouton */}
        {(status === 'success' || status === 'error') && (
          <div className={`mb-4 p-4 rounded-2xl flex items-start border ${status === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <svg
              className={`h-6 w-6 mt-0.5 ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {status === 'success' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              )}
            </svg>
            <div className="ml-4">
              {status === 'success' ? (
                <>
                  <h3 className="text-lg font-semibold text-green-900">Message envoyé avec succès !</h3>
                  <p className="text-green-700 mt-1">Nous vous répondrons dans les plus brefs délais.</p>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-red-900">Erreur d'envoi</h3>
                  <p className="text-red-700 mt-1">{errorMessage}</p>
                </>
              )}
            </div>
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full bg-blue-600 text-white font-semibold py-4 px-8 rounded-xl hover:bg-blue-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {status === 'sending' ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Envoi en cours...
              </>
            ) : (
              <>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Envoyer le message
              </>
            )}
          </button>
        </div>

        {/* Note de confidentialité */}
        <p className="text-sm text-slate-600 text-center">
          Vos données personnelles sont utilisées uniquement pour répondre à votre demande et ne sont jamais partagées.
        </p>
      </form>
    </div>
  )
}
