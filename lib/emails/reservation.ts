import { Resend } from 'resend';
import { escapeHtml } from '@/lib/escapeHtml';
import { formatDateHeure } from '@/lib/vente';
import { CONTACT_EMAIL, MAIL_FROM, SITE_DOMAIN, SITE_URL } from '@/lib/siteConfig';

const resend = new Resend(process.env.RESEND_API_KEY);

export type ReservationEmailPayload = {
  platNom: string;
  clientNom: string;
  clientEmail: string;
  clientTelephone: string;
  quantite: number;
  message?: string;
  venteTitre?: string;
  dateRetrait?: string;
  lieuRetrait?: string;
};

export type ReservationEmailResult = { ok: true } | { ok: false; error: string };

// Envoie d'abord la confirmation au client, puis la notification à l'association :
// si le premier envoi échoue, le second n'a pas lieu d'être.
export async function sendReservationEmails({
  platNom,
  clientNom,
  clientEmail,
  clientTelephone,
  quantite,
  message,
  venteTitre,
  dateRetrait,
  lieuRetrait,
}: ReservationEmailPayload): Promise<ReservationEmailResult> {
  try {
  // Champs échappés : ils sont interpolés dans le HTML des emails.
  const safe = {
    platNom: escapeHtml(platNom),
    clientNom: escapeHtml(clientNom),
    clientEmail: escapeHtml(clientEmail),
    clientTelephone: escapeHtml(clientTelephone),
    quantite: escapeHtml(quantite),
    message: escapeHtml(message),
    venteTitre: escapeHtml(venteTitre),
    dateRetrait: escapeHtml(formatDateHeure(dateRetrait)),
    lieuRetrait: escapeHtml(lieuRetrait),
  };
  const sujetPlat = String(platNom).replace(/\s+/g, ' ').slice(0, 100);
  const sujetNom = String(clientNom).replace(/\s+/g, ' ').slice(0, 100);

  const aRetrait = Boolean(safe.dateRetrait || safe.lieuRetrait);

  const blocRetrait = aRetrait
    ? `<div style="border-left: 3px solid #ea580c; background-color: #fff7ed; padding: 16px 20px; margin: 0 0 24px">
         <p style="margin: 0 0 6px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #9a3412">Retrait de votre commande</p>
         ${safe.dateRetrait ? `<p style="margin: 0; font-size: 16px; font-weight: 600; color: #111">${safe.dateRetrait}</p>` : ''}
         ${safe.lieuRetrait ? `<p style="margin: 4px 0 0; color: #666">${safe.lieuRetrait}</p>` : ''}
       </div>`
    : '';

  const lignesRetrait = `
    ${safe.venteTitre ? `<tr><td style="padding: 8px 0; color: #999; font-size: 14px">Vente</td><td style="padding: 8px 0; text-align: right; color: #111; font-weight: 500">${safe.venteTitre}</td></tr>` : ''}
    ${safe.dateRetrait ? `<tr><td style="padding: 8px 0; color: #999; font-size: 14px">Retrait</td><td style="padding: 8px 0; text-align: right; color: #111; font-weight: 500">${safe.dateRetrait}</td></tr>` : ''}
    ${safe.lieuRetrait ? `<tr><td style="padding: 8px 0; color: #999; font-size: 14px">Lieu</td><td style="padding: 8px 0; text-align: right; color: #111; font-weight: 500">${safe.lieuRetrait}</td></tr>` : ''}
  `;

  // ÉTAPE 1: Vérifier d'abord l'email du CLIENT (prioritaire)
  let clientEmailResult;
  try {
    clientEmailResult = await resend.emails.send({
      from: MAIL_FROM.general,
      to: [clientEmail],
      subject: `Confirmation de réservation - ${sujetPlat}`,
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif, Arial; font-size: 14px; color: #333; line-height: 1.6; padding: 20px; background-color: #fafafa;">
          <div style="max-width: 560px; margin: 0 auto; background-color: #fff">
            <div style="border-top: 4px solid #ea580c; padding: 32px 32px 24px">
              <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 600; color: #111">AAFD</h1>
              <p style="margin: 0; color: #666; font-size: 13px">Association d'Aide aux Familles en Difficulté</p>
            </div>
            <div style="padding: 0 32px 32px">
              <p style="margin: 0 0 24px; color: #666">Bonjour <strong style="color: #111">${safe.clientNom}</strong>,</p>
              <p style="margin: 0 0 24px; color: #666">${
                aRetrait
                  ? "Votre réservation a bien été enregistrée. Voici où et quand venir la récupérer."
                  : "Votre réservation a bien été enregistrée. Nous vous contacterons rapidement pour confirmer la disponibilité et l'heure de retrait."
              }</p>
              ${blocRetrait}
              <div style="border-top: 1px solid #e5e5e5; padding-top: 24px; margin-bottom: 24px">
                <p style="margin: 0 0 16px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #999">Résumé de la réservation</p>
                <table style="width: 100%; border-collapse: collapse">
                  <tr><td style="padding: 8px 0; color: #999; font-size: 14px">Plat</td><td style="padding: 8px 0; text-align: right; color: #111; font-weight: 500">${safe.platNom}</td></tr>
                  <tr><td style="padding: 8px 0; color: #999; font-size: 14px">Quantité</td><td style="padding: 8px 0; text-align: right; color: #111; font-weight: 500">${safe.quantite}</td></tr>
                  ${safe.venteTitre ? `<tr><td style="padding: 8px 0; color: #999; font-size: 14px">Vente</td><td style="padding: 8px 0; text-align: right; color: #111; font-weight: 500">${safe.venteTitre}</td></tr>` : ''}
                </table>
              </div>
              ${message && message !== 'Aucun message' ? `<div style="border-top: 1px solid #e5e5e5; padding-top: 24px; margin-bottom: 32px"><p style="margin: 0 0 12px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #999">Votre message</p><p style="margin: 0; color: #666; font-style: italic">${safe.message}</p></div>` : ''}
              <div style="background-color: #f9fafb; padding: 20px; margin-bottom: 24px">
                <p style="margin: 0 0 12px; font-size: 14px; color: #666">${
                  aRetrait
                    ? 'Le paiement se fait sur place, au moment du retrait.'
                    : 'Le paiement se fait sur place lors du retrait. Lieu : Val de Saône (adresse communiquée par téléphone).'
                }</p>
                <p style="margin: 0; font-size: 14px; color: #666">Merci de soutenir l'AAFD.</p>
              </div>
            </div>
            <div style="border-top: 1px solid #e5e5e5; padding: 24px 32px; background-color: #fafafa">
              <p style="margin: 0 0 8px; font-size: 13px; color: #999">Des questions ?</p>
              <p style="margin: 0; font-size: 13px"><a href="mailto:${CONTACT_EMAIL}" style="color: #ea580c; text-decoration: none">${CONTACT_EMAIL}</a></p>
            </div>
          </div>
          <div style="max-width: 560px; margin: 16px auto; text-align: center"><p style="margin: 0; color: #999; font-size: 11px">Association AAFD — Val de Saône</p></div>
        </div>
      `,
    });

    // Vérifier si l'email au client a échoué
    if (clientEmailResult.error) {
      const error = clientEmailResult.error;
      console.error('Erreur email client:', error);
      
      if (error.message?.includes('403') || error.statusCode === 403) {
        return { ok: false as const, error: 'Configuration email incorrecte. Contactez l\'administrateur.' };
      }
      
      return { ok: false as const, error: 'Adresse email client invalide. Veuillez vérifier votre email.' };
    }
  } catch (clientError) {
    console.error('Erreur lors de l\'envoi au client:', clientError);
    
    const statusCode = (clientError as { statusCode?: number })?.statusCode;
    const errMessage = clientError instanceof Error ? clientError.message : '';
    if (errMessage.includes('403') || statusCode === 403) {
      return { ok: false as const, error: 'Configuration email incorrecte. Contactez l\'administrateur.' };
    }
    
    return { ok: false as const, error: 'Adresse email client invalide. Veuillez vérifier votre email.' };
  }

  // ÉTAPE 2: Email client OK → Envoyer à l'association
  const { error } = await resend.emails.send({
    from: MAIL_FROM.reservations,
    to: [CONTACT_EMAIL],
    replyTo: clientEmail,
    subject: `[Réservation] ${sujetPlat} - ${sujetNom}`,
    html: `
      <div style="font-family: system-ui, -apple-system, sans-serif, Arial; font-size: 14px; color: #333; line-height: 1.6; padding: 20px; background-color: #fafafa;">
        <div style="max-width: 560px; margin: 0 auto; background-color: #fff">
          <div style="border-top: 4px solid #ea580c; padding: 32px 32px 24px">
            <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 600; color: #111">AAFD</h1>
            <p style="margin: 0; color: #666; font-size: 13px">Association d'Aide aux Familles en Difficulté</p>
          </div>
          <div style="padding: 0 32px 32px">
            <p style="margin: 0 0 24px; font-size: 18px; font-weight: 600; color: #111">Nouvelle réservation</p>
            <p style="margin: 0 0 32px; color: #666">Une nouvelle réservation a été effectuée depuis le site web.</p>
            <div style="border-top: 1px solid #e5e5e5; padding-top: 24px; margin-bottom: 24px">
              <p style="margin: 0 0 16px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #999">Résumé de la réservation</p>
              <table style="width: 100%; border-collapse: collapse">
                <tr><td style="padding: 8px 0; color: #999; font-size: 14px">Plat</td><td style="padding: 8px 0; text-align: right; color: #111; font-weight: 500">${safe.platNom}</td></tr>
                <tr><td style="padding: 8px 0; color: #999; font-size: 14px">Quantité</td><td style="padding: 8px 0; text-align: right; color: #111; font-weight: 500">${safe.quantite}</td></tr>
                ${lignesRetrait}
              </table>
            </div>
            <div style="border-top: 1px solid #e5e5e5; padding-top: 24px; margin-bottom: 24px">
              <p style="margin: 0 0 16px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #999">Coordonnées du client</p>
              <table style="width: 100%; border-collapse: collapse">
                <tr><td style="padding: 8px 0; color: #999; font-size: 14px">Nom</td><td style="padding: 8px 0; text-align: right; color: #111; font-weight: 500">${safe.clientNom}</td></tr>
                <tr><td style="padding: 8px 0; color: #999; font-size: 14px">Email</td><td style="padding: 8px 0; text-align: right; color: #111">${safe.clientEmail}</td></tr>
                <tr><td style="padding: 8px 0; color: #999; font-size: 14px">Téléphone</td><td style="padding: 8px 0; text-align: right; color: #111">${safe.clientTelephone}</td></tr>
              </table>
            </div>
            ${message ? `<div style="border-top: 1px solid #e5e5e5; padding-top: 24px; margin-bottom: 32px"><p style="margin: 0 0 12px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #999">Message du client</p><p style="margin: 0; color: #111; white-space: pre-wrap">${safe.message}</p></div>` : ''}
            <div style="background-color: #f9fafb; padding: 20px; margin-bottom: 24px">
              <p style="margin: 0; font-size: 14px; color: #666">💡 Répondez directement à cet email pour contacter le client.</p>
            </div>
          </div>
          <div style="border-top: 1px solid #e5e5e5; padding: 24px 32px; background-color: #fafafa">
            <p style="margin: 0 0 8px; font-size: 13px; color: #999">Réservation effectuée depuis le site web</p>
            <p style="margin: 0; font-size: 13px"><a href="${SITE_URL}/vente-plats" style="color: #ea580c; text-decoration: none">${SITE_DOMAIN}</a></p>
          </div>
        </div>
        <div style="max-width: 560px; margin: 16px auto; text-align: center"><p style="margin: 0; color: #999; font-size: 11px">Association AAFD — Val de Saône</p></div>
      </div>
    `,
  });

  if (error) {
    console.error('Erreur Resend (association):', error);
    
    if (error.message?.includes('403') || error.statusCode === 403) {
      return { ok: false as const, error: 'Configuration email incorrecte. Contactez l\'administrateur.' };
    }
    
    return { ok: false as const, error: 'Erreur lors de l\'envoi de l\'email à l\'association' };
  }

    return { ok: true as const };
  } catch (error) {
    console.error('[reservation] envoi des emails', error);
    return { ok: false as const, error: "Erreur serveur lors de l'envoi" };
  }
}
