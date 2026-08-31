# Site AAFD Val de Saône

Site vitrine et back-office de l'**Association d'Aide aux Familles en Difficulté** (Val de Saône) :
présentation de l'association, actualités, témoignages, vente de plats cuisinés avec réservation
en ligne, et une administration protégée pour gérer tout le contenu.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript strict |
| CSS | Tailwind CSS v4 (`app/globals.css`) |
| Base de données | Firestore (SDK admin côté serveur uniquement) |
| Auth admin | Firebase Auth (email/mot de passe) → JWT HS256 en cookie httpOnly |
| Images | Compression navigateur (WebP) → route serveur → Cloudinary |
| Emails | Resend |
| Hébergement | Vercel |

## Installation

```bash
git clone <url-du-dépôt>
cd site_aafd
npm install
cp .env.example .env.local   # puis remplir les valeurs
npm run dev                  # http://localhost:3000
```

## Variables d'environnement

Toutes les variables sont décrites dans [`.env.example`](.env.example). Résumé :

| Variable | Rôle |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL publique du site (canonical, sitemap, liens des emails) |
| `NEXT_PUBLIC_FIREBASE_*` | Configuration Firebase côté client (clés publiques, utilisées pour le login admin) |
| `FIREBASE_PROJECT_ID` / `FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY` | Compte de service Firebase — **secret** |
| `ADMIN_SESSION_SECRET` | Clé de signature du cookie de session admin, 32 caractères minimum — **secret** |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` / `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Upload d'images (preset unsigned) |
| `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Suppression des images — **secret** |
| `RESEND_API_KEY` | Envoi des emails — **secret** |

Générer le secret de session :

```bash
openssl rand -base64 32
```

L'application **refuse de démarrer** si les variables Firebase Admin ou `ADMIN_SESSION_SECRET`
sont absentes : c'est volontaire, une configuration incomplète rendrait les sessions admin forgeables.

## Configuration des services

### Firebase

1. Console Firebase → **Authentication** → activer **Email/Password**.
2. **Authentication → Users → Add user** : créer le compte administrateur.
3. **Paramètres du projet → Comptes de service → Générer une clé privée** : renseigner
   `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`.
4. Déployer les règles Firestore versionnées dans ce dépôt :

   ```bash
   npx firebase-tools deploy --only firestore:rules
   ```

   Ces règles ferment **tout** accès direct depuis le navigateur (`allow read, write: if false`).
   C'est normal : le site lit et écrit exclusivement via le SDK admin côté serveur, qui n'est
   pas soumis aux règles. Voir [`firestore.rules`](firestore.rules).

Détails dans [`FIREBASE_AUTH_SETUP.md`](FIREBASE_AUTH_SETUP.md).

### Cloudinary

Créer un **upload preset unsigned** et renseigner `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`.
Détails dans [`docs/CLOUDINARY_SETUP.md`](docs/CLOUDINARY_SETUP.md).

### Resend

**Un domaine vérifié est obligatoire.** Avec le domaine de test `resend.dev`, Resend n'accepte
d'envoyer que vers l'adresse propriétaire du compte : toute réservation d'un visiteur tiers
échouerait. Vérifier le domaine dans Resend, puis ajuster `CONTACT_EMAIL` et `MAIL_FROM` dans
[`lib/siteConfig.ts`](lib/siteConfig.ts).

## Administration

- Accès : `/admin` (redirection automatique vers `/admin/login`).
- Gestion des plats, actualités, témoignages et réservations (avec vue impression et export).
- Interface pensée pour mobile.

La protection est **serveur** : `proxy.ts` (middleware) garde `/admin/:path*`, et chaque route
API admin revérifie la session indépendamment.

## Scripts

```bash
npm run dev     # serveur de développement
npm run build   # build de production
npm run start   # serveur de production
npm run lint    # ESLint
npx tsc --noEmit  # vérification des types

# Recalcule les slugs des actualités (aperçu, puis application)
node --env-file=.env.local scripts/backfill-slugs.mjs
node --env-file=.env.local scripts/backfill-slugs.mjs --write
```

## URLs des actualités

Les articles sont servis sur `/actualites/<slug>`, le slug étant dérivé du titre et rendu unique
(`-2`, `-3`… en cas de doublon). Il est recalculé à chaque modification du titre. Les anciennes
URLs `/actualites/<id-firestore>` sont redirigées en permanence (308) vers le slug.

## Déploiement (Vercel)

1. Importer le dépôt dans Vercel (framework détecté automatiquement).
2. Déclarer toutes les variables de `.env.example` dans **Settings → Environment Variables**.
3. Renseigner `NEXT_PUBLIC_SITE_URL` avec le domaine final.
4. Déployer les règles Firestore (voir plus haut) — elles ne sont pas déployées par Vercel.

Les pages de liste publiques sont régénérées toutes les 60 secondes (`export const revalidate = 60`) :
une modification faite dans l'admin apparaît en ligne au bout d'une minute au plus. Le détail d'une
actualité est rendu à la demande, sans cache, pour que `notFound()` renvoie bien un vrai 404.

## Structure

```
app/
  (site)/           pages publiques
    actualites/[slug]/  détail d'un article (URL parlante)
  admin/            back-office
  api/
    reservations/   création de réservation (transaction serveur)
    send-contact/   email du formulaire de contact
    send-reservation/ emails de confirmation
    admin/          CRUD protégé + upload
components/         composants UI
lib/
  firebase/         admin.ts (serveur), client.ts (auth login), fetchers.ts (lectures)
  siteConfig.ts     coordonnées, domaine, expéditeurs email
  slug.ts           génération des URLs d'articles
scripts/            scripts de maintenance ponctuels
firestore.rules     règles Firestore versionnées
proxy.ts            middleware de garde des routes /admin
```

## À compléter avant mise en ligne

- Numéro de téléphone (`CONTACT_PHONE` dans `lib/siteConfig.ts`)
- Mentions légales : adresse, numéro RNA/SIRET, nom de la présidente
- Photos des tuiles « Photo à venir » sur la page Témoignages
- Compte Instagram à confirmer (`INSTAGRAM_URL` dans `lib/siteConfig.ts`)
