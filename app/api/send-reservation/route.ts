import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { rateLimit } from '@/lib/rateLimit';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? '127.0.0.1';
  if (!rateLimit(ip, 5, 10 * 60 * 1000)) {
    return NextResponse.json(
      { error: 'Trop de tentatives. Réessayez dans quelques minutes.' },
      { status: 429 }
    );
  }

  try {
    const { platNom, clientNom, clientEmail, clientTelephone, quantite, message } = await request.json();

    // Validation des données
    if (!platNom || !clientNom || !clientEmail || !quantite) {
      return NextResponse.json(
        { error: 'Tous les champs requis doivent être remplis' },
        { status: 400 }
      );
    }

    // ÉTAPE 1: Vérifier d'abord l'email du CLIENT (prioritaire)
    let clientEmailResult;
    try {
      clientEmailResult = await resend.emails.send({
        from: 'AAFD <onboarding@resend.dev>',
        to: [clientEmail],
        subject: `Confirmation de réservation - ${platNom}`,
        html: `
          <div style="font-family: system-ui, -apple-system, sans-serif, Arial; font-size: 14px; color: #333; line-height: 1.6; padding: 20px; background-color: #fafafa;">
            <div style="max-width: 560px; margin: 0 auto; background-color: #fff">
              <div style="border-top: 4px solid #ea580c; padding: 32px 32px 24px">
                <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 600; color: #111">AAFD</h1>
                <p style="margin: 0; color: #666; font-size: 13px">Association d'Aide aux Familles en Difficulté</p>
              </div>
              <div style="padding: 0 32px 32px">
                <p style="margin: 0 0 24px; color: #666">Bonjour <strong style="color: #111">${clientNom}</strong>,</p>
                <p style="margin: 0 0 32px; color: #666">Votre réservation a bien été enregistrée. Nous vous contacterons rapidement pour confirmer la disponibilité et l'heure de retrait.</p>
                <div style="border-top: 1px solid #e5e5e5; padding-top: 24px; margin-bottom: 24px">
                  <p style="margin: 0 0 16px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #999">Résumé de la réservation</p>
                  <table style="width: 100%; border-collapse: collapse">
                    <tr><td style="padding: 8px 0; color: #999; font-size: 14px">Plat</td><td style="padding: 8px 0; text-align: right; color: #111; font-weight: 500">${platNom}</td></tr>
                    <tr><td style="padding: 8px 0; color: #999; font-size: 14px">Quantité</td><td style="padding: 8px 0; text-align: right; color: #111; font-weight: 500">${quantite}</td></tr>
                  </table>
                </div>
                ${message && message !== 'Aucun message' ? `<div style="border-top: 1px solid #e5e5e5; padding-top: 24px; margin-bottom: 32px"><p style="margin: 0 0 12px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #999">Votre message</p><p style="margin: 0; color: #666; font-style: italic">${message}</p></div>` : ''}
                <div style="background-color: #f9fafb; padding: 20px; margin-bottom: 24px">
                  <p style="margin: 0 0 12px; font-size: 14px; color: #666">Le paiement se fait sur place lors du retrait. Lieu : Val de Saône (adresse communiquée par téléphone).</p>
                  <p style="margin: 0; font-size: 14px; color: #666">Merci de soutenir l'AAFD.</p>
                </div>
              </div>
              <div style="border-top: 1px solid #e5e5e5; padding: 24px 32px; background-color: #fafafa">
                <p style="margin: 0 0 8px; font-size: 13px; color: #999">Des questions ?</p>
                <p style="margin: 0; font-size: 13px"><a href="mailto:aafd@gmx.fr" style="color: #ea580c; text-decoration: none">aafd@gmx.fr</a></p>
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
          return NextResponse.json(
            { error: 'Configuration email incorrecte. Contactez l\'administrateur.', emailEnvoye: false },
            { status: 403 }
          );
        }
        
        return NextResponse.json(
          { error: 'Adresse email client invalide. Veuillez vérifier votre email.', emailEnvoye: false },
          { status: 400 }
        );
      }
    } catch (clientError: any) {
      console.error('Erreur lors de l\'envoi au client:', clientError);
      
      if (clientError.message?.includes('403') || clientError.statusCode === 403) {
        return NextResponse.json(
          { error: 'Configuration email incorrecte. Contactez l\'administrateur.', emailEnvoye: false },
          { status: 403 }
        );
      }
      
      return NextResponse.json(
        { error: 'Adresse email client invalide. Veuillez vérifier votre email.', emailEnvoye: false },
        { status: 400 }
      );
    }

    // ÉTAPE 2: Email client OK → Envoyer à l'association
    const { data, error } = await resend.emails.send({
      from: 'AAFD Réservations <onboarding@resend.dev>',
      to: ['aafd@gmx.fr'],
      replyTo: clientEmail,
      subject: `[Réservation] ${platNom} - ${clientNom}`,
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
                  <tr><td style="padding: 8px 0; color: #999; font-size: 14px">Plat</td><td style="padding: 8px 0; text-align: right; color: #111; font-weight: 500">${platNom}</td></tr>
                  <tr><td style="padding: 8px 0; color: #999; font-size: 14px">Quantité</td><td style="padding: 8px 0; text-align: right; color: #111; font-weight: 500">${quantite}</td></tr>
                </table>
              </div>
              <div style="border-top: 1px solid #e5e5e5; padding-top: 24px; margin-bottom: 24px">
                <p style="margin: 0 0 16px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #999">Coordonnées du client</p>
                <table style="width: 100%; border-collapse: collapse">
                  <tr><td style="padding: 8px 0; color: #999; font-size: 14px">Nom</td><td style="padding: 8px 0; text-align: right; color: #111; font-weight: 500">${clientNom}</td></tr>
                  <tr><td style="padding: 8px 0; color: #999; font-size: 14px">Email</td><td style="padding: 8px 0; text-align: right; color: #111">${clientEmail}</td></tr>
                  <tr><td style="padding: 8px 0; color: #999; font-size: 14px">Téléphone</td><td style="padding: 8px 0; text-align: right; color: #111">${clientTelephone}</td></tr>
                </table>
              </div>
              ${message ? `<div style="border-top: 1px solid #e5e5e5; padding-top: 24px; margin-bottom: 32px"><p style="margin: 0 0 12px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #999">Message du client</p><p style="margin: 0; color: #111; white-space: pre-wrap">${message}</p></div>` : ''}
              <div style="background-color: #f9fafb; padding: 20px; margin-bottom: 24px">
                <p style="margin: 0; font-size: 14px; color: #666">💡 Répondez directement à cet email pour contacter le client.</p>
              </div>
            </div>
            <div style="border-top: 1px solid #e5e5e5; padding: 24px 32px; background-color: #fafafa">
              <p style="margin: 0 0 8px; font-size: 13px; color: #999">Réservation effectuée depuis le site web</p>
              <p style="margin: 0; font-size: 13px"><a href="https://www.aafd-valdesaone.fr/vente-plats" style="color: #ea580c; text-decoration: none">www.aafd-valdesaone.fr</a></p>
            </div>
          </div>
          <div style="max-width: 560px; margin: 16px auto; text-align: center"><p style="margin: 0; color: #999; font-size: 11px">Association AAFD — Val de Saône</p></div>
        </div>
      `,
    });

    if (error) {
      console.error('Erreur Resend (association):', error);
      
      if (error.message?.includes('403') || error.statusCode === 403) {
        return NextResponse.json(
          { error: 'Configuration email incorrecte. Contactez l\'administrateur.', emailEnvoye: false },
          { status: 403 }
        );
      }
      
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi de l\'email à l\'association', emailEnvoye: false },
        { status: 500 }
      );
    }

    // ÉTAPE 3: Les deux emails sont envoyés avec succès
    return NextResponse.json(
      { success: true, emailEnvoye: true, messageId: data?.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'envoi', emailEnvoye: false },
      { status: 500 }
    );
  }
}
