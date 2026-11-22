import { Resend } from 'resend';
import { escapeHtml } from '@/lib/escapeHtml';
import { formatDateHeure } from '@/lib/vente';
import { formatPrix, nombrePortions } from '@/lib/commande';
import { MAIL_FROM, SITE_DOMAIN, SITE_URL } from '@/lib/siteConfig';
import { getContenuSite } from '@/lib/firebase/fetchers';
import type { LigneCommande } from '@/types';

const resend = new Resend(process.env.RESEND_API_KEY);

export type ReservationEmailPayload = {
  lignes: LigneCommande[];
  total: number;
  clientNom: string;
  clientEmail: string;
  clientTelephone: string;
  venteTitre?: string;
  dateRetrait?: string;
  lieuRetrait?: string;
};

export type ReservationEmailResult = { ok: true } | { ok: false; error: string };

const CELLULE = 'padding: 8px 0; font-size: 14px';

// Tableau Plat / Quantite / Prix de la commande, avec le total.
function tableauCommande(lignes: LigneCommande[], total: number): string {
  const rangees = lignes
    .map(ligne => {
      const prix = ligne.prixUnitaire !== undefined ? formatPrix(ligne.prixUnitaire * ligne.quantite) : '';
      return `<tr>
        <td style="${CELLULE}; color: #111; font-weight: 500">${escapeHtml(ligne.platNom)}</td>
        <td style="${CELLULE}; color: #666; text-align: center; white-space: nowrap">× ${ligne.quantite}</td>
        <td style="${CELLULE}; color: #111; text-align: right; white-space: nowrap">${prix}</td>
      </tr>`;
    })
    .join('');

  return `<table style="width: 100%; border-collapse: collapse">
    ${rangees}
    <tr>
      <td style="${CELLULE}; border-top: 1px solid #e5e5e5; color: #111; font-weight: 600">Total</td>
      <td style="${CELLULE}; border-top: 1px solid #e5e5e5; color: #666; text-align: center; white-space: nowrap">${nombrePortions(lignes)}</td>
      <td style="${CELLULE}; border-top: 1px solid #e5e5e5; color: #ea580c; font-weight: 700; text-align: right; white-space: nowrap">${formatPrix(total)}</td>
    </tr>
  </table>`;
}

export async function sendReservationEmails({
  lignes,
  total,
  clientNom,
  clientEmail,
  clientTelephone,
  venteTitre,
  dateRetrait,
  lieuRetrait,
}: ReservationEmailPayload): Promise<ReservationEmailResult> {
  try {
  const safe = {
    clientNom: escapeHtml(clientNom),
    clientEmail: escapeHtml(clientEmail),
    clientTelephone: escapeHtml(clientTelephone),
    venteTitre: escapeHtml(venteTitre),
    dateRetrait: escapeHtml(formatDateHeure(dateRetrait)),
    lieuRetrait: escapeHtml(lieuRetrait),
  };
  const sujetNom = String(clientNom).replace(/\s+/g, ' ').slice(0, 100);
  const portions = nombrePortions(lignes);
  const sujetPortions = `${portions} plat${portions > 1 ? 's' : ''}`;
  const tableau = tableauCommande(lignes, total);

  const aRetrait = Boolean(safe.dateRetrait || safe.lieuRetrait);
  const { contact_email: emailAsso } = await getContenuSite();

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

  let clientEmailResult;
  try {
    clientEmailResult = await resend.emails.send({
      from: MAIL_FROM.general,
      to: [clientEmail],
      subject: `Confirmation de votre commande - ${sujetPortions}`,
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
                  ? "Votre commande a bien été enregistrée. Voici où et quand venir la récupérer."
                  : "Votre commande a bien été enregistrée. Nous vous contacterons rapidement pour confirmer l'heure de retrait."
              }</p>
              ${blocRetrait}
              <div style="border-top: 1px solid #e5e5e5; padding-top: 24px; margin-bottom: 24px">
                <p style="margin: 0 0 16px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #999">Votre commande${safe.venteTitre ? ` — ${safe.venteTitre}` : ''}</p>
                ${tableau}
              </div>
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
              <p style="margin: 0; font-size: 13px"><a href="mailto:${emailAsso}" style="color: #ea580c; text-decoration: none">${emailAsso}</a></p>
            </div>
          </div>
          <div style="max-width: 560px; margin: 16px auto; text-align: center"><p style="margin: 0; color: #999; font-size: 11px">Association AAFD — Val de Saône</p></div>
        </div>
      `,
    });

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

  const { error } = await resend.emails.send({
    from: MAIL_FROM.reservations,
    to: [emailAsso],
    replyTo: clientEmail,
    subject: `[Commande] ${sujetNom} - ${sujetPortions}`,
    html: `
      <div style="font-family: system-ui, -apple-system, sans-serif, Arial; font-size: 14px; color: #333; line-height: 1.6; padding: 20px; background-color: #fafafa;">
        <div style="max-width: 560px; margin: 0 auto; background-color: #fff">
          <div style="border-top: 4px solid #ea580c; padding: 32px 32px 24px">
            <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 600; color: #111">AAFD</h1>
            <p style="margin: 0; color: #666; font-size: 13px">Association d'Aide aux Familles en Difficulté</p>
          </div>
          <div style="padding: 0 32px 32px">
            <p style="margin: 0 0 24px; font-size: 18px; font-weight: 600; color: #111">Nouvelle commande</p>
            <p style="margin: 0 0 32px; color: #666">Une nouvelle commande a été passée depuis le site web.</p>
            <div style="border-top: 1px solid #e5e5e5; padding-top: 24px; margin-bottom: 24px">
              <p style="margin: 0 0 16px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #999">Plats commandés</p>
              ${tableau}
            </div>
            ${lignesRetrait.trim() ? `<div style="border-top: 1px solid #e5e5e5; padding-top: 24px; margin-bottom: 24px">
              <table style="width: 100%; border-collapse: collapse">${lignesRetrait}</table>
            </div>` : ''}
            <div style="border-top: 1px solid #e5e5e5; padding-top: 24px; margin-bottom: 24px">
              <p style="margin: 0 0 16px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #999">Coordonnées du client</p>
              <table style="width: 100%; border-collapse: collapse">
                <tr><td style="padding: 8px 0; color: #999; font-size: 14px">Nom</td><td style="padding: 8px 0; text-align: right; color: #111; font-weight: 500">${safe.clientNom}</td></tr>
                <tr><td style="padding: 8px 0; color: #999; font-size: 14px">Email</td><td style="padding: 8px 0; text-align: right; color: #111">${safe.clientEmail}</td></tr>
                <tr><td style="padding: 8px 0; color: #999; font-size: 14px">Téléphone</td><td style="padding: 8px 0; text-align: right; color: #111">${safe.clientTelephone}</td></tr>
              </table>
            </div>
            <div style="background-color: #f9fafb; padding: 20px; margin-bottom: 24px">
              <p style="margin: 0; font-size: 14px; color: #666">💡 Répondez directement à cet email pour contacter le client.</p>
            </div>
          </div>
          <div style="border-top: 1px solid #e5e5e5; padding: 24px 32px; background-color: #fafafa">
            <p style="margin: 0 0 8px; font-size: 13px; color: #999">Commande passée depuis le site web</p>
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
