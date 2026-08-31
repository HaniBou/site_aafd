import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { rateLimit } from '@/lib/rateLimit';
import { escapeHtml } from '@/lib/escapeHtml';
import { CONTACT_EMAIL, MAIL_FROM, SITE_DOMAIN, SITE_URL } from '@/lib/siteConfig';

export const runtime = 'nodejs';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? '127.0.0.1';
  if (!rateLimit(ip, 3, 10 * 60 * 1000)) {
    return NextResponse.json(
      { error: 'Trop de tentatives. Réessayez dans quelques minutes.' },
      { status: 429 }
    );
  }

  try {
    const { nom, prenom, email, telephone, sujet, message } = await request.json();

    // Validation des données
    if (!nom || !prenom || !email || !sujet || !message) {
      return NextResponse.json(
        { error: 'Tous les champs requis doivent être remplis' },
        { status: 400 }
      );
    }

    // Champs échappés : ils sont interpolés dans le HTML des emails.
    const safe = {
      nom: escapeHtml(nom),
      prenom: escapeHtml(prenom),
      email: escapeHtml(email),
      telephone: escapeHtml(telephone),
      sujet: escapeHtml(sujet),
      message: escapeHtml(message),
    };
    const subjetHeader = String(sujet).replace(/[\r\n]+/g, ' ').slice(0, 150);

    // Envoi de l'email
    const { data, error } = await resend.emails.send({
      from: MAIL_FROM.contact,
      to: [CONTACT_EMAIL],
      replyTo: email, // L'email du contact pour faciliter la réponse
      subject: `[Contact AAFD] ${subjetHeader}`,
      html: `
        <div
          style="
            font-family: system-ui, -apple-system, sans-serif, Arial;
            font-size: 14px;
            color: #333;
            line-height: 1.6;
            padding: 20px;
            background-color: #fafafa;
          "
        >
          <div style="max-width: 560px; margin: 0 auto; background-color: #fff">
            
            <!-- En-tête simple -->
            <div style="border-top: 4px solid #ea580c; padding: 32px 32px 24px">
              <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 600; color: #111">
                AAFD
              </h1>
              <p style="margin: 0; color: #666; font-size: 13px">
                Association d'Aide aux Familles en Difficulté
              </p>
            </div>

            <!-- Contenu principal -->
            <div style="padding: 0 32px 32px">
              
              <!-- Titre -->
              <p style="margin: 0 0 24px; font-size: 18px; font-weight: 600; color: #111">
                Nouveau message de contact
              </p>
              
              <p style="margin: 0 0 32px; color: #666">
                Un nouveau message a été envoyé depuis le formulaire de contact du site web.
              </p>

              <!-- Informations contact -->
              <div style="border-top: 1px solid #e5e5e5; padding-top: 24px; margin-bottom: 24px">
                <p style="margin: 0 0 16px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #999">
                  Coordonnées de l'expéditeur
                </p>
                
                <table style="width: 100%; border-collapse: collapse">
                  <tr>
                    <td style="padding: 8px 0; color: #999; font-size: 14px">Nom</td>
                    <td style="padding: 8px 0; text-align: right; color: #111; font-weight: 500">${safe.prenom} ${safe.nom}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #999; font-size: 14px">Email</td>
                    <td style="padding: 8px 0; text-align: right; color: #111">${safe.email}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #999; font-size: 14px">Téléphone</td>
                    <td style="padding: 8px 0; text-align: right; color: #111">${safe.telephone || 'Non renseigné'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #999; font-size: 14px">Sujet</td>
                    <td style="padding: 8px 0; text-align: right; color: #111; font-weight: 500">${safe.sujet}</td>
                  </tr>
                </table>
              </div>

              <!-- Message -->
              <div style="border-top: 1px solid #e5e5e5; padding-top: 24px; margin-bottom: 32px">
                <p style="margin: 0 0 12px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #999">
                  Message
                </p>
                <p style="margin: 0; color: #111; white-space: pre-wrap">${safe.message}</p>
              </div>

              <!-- Information pratique -->
              <div style="background-color: #f9fafb; padding: 20px; margin-bottom: 24px">
                <p style="margin: 0; font-size: 14px; color: #666">
                  💡 Répondez directement à cet email pour contacter l'expéditeur.
                </p>
              </div>

            </div>

            <!-- Footer -->
            <div style="border-top: 1px solid #e5e5e5; padding: 24px 32px; background-color: #fafafa">
              <p style="margin: 0 0 8px; font-size: 13px; color: #999">
                Message envoyé depuis le formulaire de contact
              </p>
              <p style="margin: 0; font-size: 13px">
                <a href="${SITE_URL}/contact" style="color: #ea580c; text-decoration: none">${SITE_DOMAIN}</a>
              </p>
            </div>

          </div>

          <!-- Mention légale -->
          <div style="max-width: 560px; margin: 16px auto; text-align: center">
            <p style="margin: 0; color: #999; font-size: 11px">
              Association AAFD — Val de Saône
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Erreur Resend:', error);
      
      // Gestion spécifique du code 403
      if (error.message?.includes('403') || error.statusCode === 403) {
        return NextResponse.json(
          { error: 'Configuration email incorrecte. Contactez l\'administrateur.' },
          { status: 403 }
        );
      }
      
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi du message' },
        { status: 500 }
      );
    }

    // Envoyer un accusé de réception au client
    try {
      await resend.emails.send({
        from: MAIL_FROM.general,
        to: [email],
        subject: 'Nous avons bien reçu votre message',
        html: `
          <div
            style="
              font-family: system-ui, -apple-system, sans-serif, Arial;
              font-size: 14px;
              color: #333;
              line-height: 1.6;
              padding: 20px;
              background-color: #fafafa;
            "
          >
            <div style="max-width: 560px; margin: 0 auto; background-color: #fff">
              
              <!-- En-tête simple -->
              <div style="border-top: 4px solid #ea580c; padding: 32px 32px 24px">
                <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 600; color: #111">
                  AAFD
                </h1>
                <p style="margin: 0; color: #666; font-size: 13px">
                  Association d'Aide aux Familles en Difficulté
                </p>
              </div>

              <!-- Contenu principal -->
              <div style="padding: 0 32px 32px">
                
                <!-- Message -->
                <p style="margin: 0 0 24px; color: #666">
                  Bonjour <strong style="color: #111">${safe.prenom} ${safe.nom}</strong>,
                </p>
                
                <p style="margin: 0 0 32px; color: #666">
                  Nous avons bien reçu votre message concernant : <strong style="color: #111">${safe.sujet}</strong>
                </p>

                <p style="margin: 0 0 32px; color: #666">
                  Notre équipe vous répondra dans les plus brefs délais.
                </p>

                <!-- Récapitulatif -->
                <div style="border-top: 1px solid #e5e5e5; padding-top: 24px; margin-bottom: 24px">
                  <p style="margin: 0 0 16px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #999">
                    Récapitulatif de votre demande
                  </p>
                  
                  <table style="width: 100%; border-collapse: collapse">
                    <tr>
                      <td style="padding: 8px 0; color: #999; font-size: 14px">Sujet</td>
                      <td style="padding: 8px 0; text-align: right; color: #111; font-weight: 500">${safe.sujet}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #999; font-size: 14px">Email de contact</td>
                      <td style="padding: 8px 0; text-align: right; color: #111">${safe.email}</td>
                    </tr>
                    ${telephone ? `
                    <tr>
                      <td style="padding: 8px 0; color: #999; font-size: 14px">Téléphone</td>
                      <td style="padding: 8px 0; text-align: right; color: #111">${safe.telephone}</td>
                    </tr>
                    ` : ''}
                  </table>
                </div>

                <!-- Message envoyé -->
                <div style="border-top: 1px solid #e5e5e5; padding-top: 24px; margin-bottom: 32px">
                  <p style="margin: 0 0 12px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #999">
                    Votre message
                  </p>
                  <p style="margin: 0; color: #666; font-style: italic; white-space: pre-wrap">${safe.message}</p>
                </div>

                <!-- Informations pratiques -->
                <div style="background-color: #f9fafb; padding: 20px; margin-bottom: 24px">
                  <p style="margin: 0 0 12px; font-size: 14px; color: #666">
                    En attendant notre réponse, vous pouvez également :
                  </p>
                  <p style="margin: 0; font-size: 14px; color: #666">
                    📧 Nous écrire directement à <a href="mailto:${CONTACT_EMAIL}" style="color: #ea580c; text-decoration: none">${CONTACT_EMAIL}</a>
                  </p>
                </div>

              </div>

              <!-- Footer -->
              <div style="border-top: 1px solid #e5e5e5; padding: 24px 32px; background-color: #fafafa">
                <p style="margin: 0 0 8px; font-size: 13px; color: #999">
                  Merci de nous avoir contactés
                </p>
                <p style="margin: 0; font-size: 13px">
                  <a href="${SITE_URL}" style="color: #ea580c; text-decoration: none">${SITE_DOMAIN}</a>
                </p>
              </div>

            </div>

            <!-- Mention légale -->
            <div style="max-width: 560px; margin: 16px auto; text-align: center">
              <p style="margin: 0; color: #999; font-size: 11px">
                Association AAFD — Val de Saône
              </p>
            </div>
          </div>
        `,
      });
    } catch (confirmationError) {
      console.error('Erreur email confirmation:', confirmationError);
      // On ne fait pas échouer la requête si l'email de confirmation échoue
    }

    return NextResponse.json(
      { success: true, messageId: data?.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'envoi du message' },
      { status: 500 }
    );
  }
}
