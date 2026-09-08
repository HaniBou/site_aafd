import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rateLimit';
import { enregistrerVue } from '@/lib/statistiques';

export const runtime = 'nodejs';

// Les robots exécutent rarement le JavaScript, mais les moteurs de rendu et les
// sondes de supervision, si : sans ce filtre ils gonfleraient le compteur.
const ROBOT =
  /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|whatsapp|telegram|headless|lighthouse|pagespeed|monitor|pingdom|uptime|curl|wget|python-requests|axios|node-fetch|postman/i;

/** Un visiteur consulte rarement plus de 40 pages en 10 minutes. */
const LIMITE = 40;
const FENETRE_MS = 10 * 60 * 1000;

// Le serveur de développement et les déploiements de préversion partagent la
// base Firestore de production : sans ce garde-fou, chaque `npm run dev` et
// chaque preview Vercel gonfleraient les chiffres montrés aux bénévoles.
// STATS_FORCER_COMPTAGE=1 permet de tester le compteur en local.
const COMPTAGE_ACTIF =
  process.env.STATS_FORCER_COMPTAGE === '1' ||
  (process.env.NODE_ENV === 'production' &&
    (process.env.VERCEL_ENV ?? 'production') === 'production');

// Premier segment des pages publiques. Sans cette liste, un appel direct à
// l'API pourrait créer autant de documents que de chemins inventés et noyer la
// liste des pages les plus consultées.
const RACINES = new Set([
  'actualites',
  'contact',
  'mentions-legales',
  'notre-association',
  'nous-rejoindre',
  'nous-soutenir',
  'temoignages',
  'vente-plats',
]);

function cheminValide(valeur: unknown): valeur is string {
  if (typeof valeur !== 'string' || !valeur.startsWith('/') || valeur.length > 200) {
    return false;
  }

  const segments = valeur.split('/').filter(Boolean);
  if (segments.length === 0) return true; // page d'accueil
  if (segments.length > 2) return false;
  if (!RACINES.has(segments[0])) return false;

  // Seules les actualités ont une page de détail. Le slug est normalisé par
  // buildSlug, mais actualiteHref retombe sur l'identifiant Firestore brut
  // quand il manque : les majuscules doivent donc rester acceptées.
  if (segments.length === 2) {
    return segments[0] === 'actualites' && /^[A-Za-z0-9-]{1,80}$/.test(segments[1]);
  }

  return true;
}

export async function POST(request: NextRequest) {
  // Le compteur ne doit jamais casser une page : quoi qu'il arrive on répond
  // 204, et les erreurs restent dans les logs serveur.
  try {
    if (!COMPTAGE_ACTIF) {
      return new NextResponse(null, { status: 204 });
    }

    const agent = request.headers.get('user-agent') ?? '';
    if (!agent || ROBOT.test(agent)) {
      return new NextResponse(null, { status: 204 });
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? '127.0.0.1';
    if (!rateLimit(`stats:${ip}`, LIMITE, FENETRE_MS)) {
      return new NextResponse(null, { status: 204 });
    }

    const { chemin, nouvelleVisite, referent } = await request.json();
    if (!cheminValide(chemin)) {
      return new NextResponse(null, { status: 204 });
    }

    await enregistrerVue(chemin, nouvelleVisite === true, referent);
  } catch (error) {
    console.error('Compteur de visites:', error);
  }

  return new NextResponse(null, { status: 204 });
}
