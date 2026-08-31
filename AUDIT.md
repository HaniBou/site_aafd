# Audit de livrabilité — Site AAFD Val de Saône

> Phase 1 (lecture seule) — 30 août 2026
> Aucun fichier source modifié. Seuls des artefacts `.next/` ont été générés (build, Lighthouse).
> Vérifications effectuées : build de production, `tsc --noEmit`, ESLint, serveur de prod local (port 3111), Lighthouse mobile, inspection du bundle client, test d'accès anonyme à Firestore.

---

## 1. Stack détectée

| | |
|---|---|
| **Framework** | Next.js **16.0.10**, App Router, React 19.2.1, TypeScript 5 (strict, `tsc --noEmit` passe) |
| **Bundler** | Turbopack (build par défaut Next 16) |
| **Paquets** | npm (`package-lock.json`) |
| **CSS** | Tailwind **v4** via `@tailwindcss/postcss` + `app/globals.css` (`@theme inline`) |
| **Backend** | Routes API Next (`app/api/**`), runtime `nodejs` sauf `opengraph-image` en `edge` |
| **Base de données** | **Firestore** (projet `aafd-projet`) — double accès : SDK **admin** côté serveur (`lib/firebase/admin.ts`, `lib/firebase/fetchers.ts`) **et** SDK **client** depuis le navigateur (`lib/getPlats.js`, `lib/getActualites.js`, `lib/getTemoignages.js`, `components/ReservationModal.tsx`) |
| **Auth admin** | Firebase Auth (email/mdp) → échange contre un **JWT maison signé HS256** (`jose`) posé en cookie `admin_session` httpOnly / sameSite=strict ; garde globale dans `proxy.ts` (le `middleware.ts` de Next 16) |
| **Images** | Upload → compression canvas → WebP côté navigateur (`lib/imageCompression.ts`) → route serveur → **Cloudinary** (preset unsigned) |
| **Emails** | **Resend** (contact + réservation) |
| **Hébergement prévu** | **Vercel** (`NEXT_PUBLIC_SITE_URL=https://site-aafd.vercel.app`, `.vercel` dans `.gitignore`) |
| **Autres** | `framer-motion` (héros uniquement), `jose`. **`@portabletext/react` et `styled-components` installés mais jamais importés** |

Build de production : **succès (exit 0)**, 27 pages générées, un seul warning (`edge runtime` sur l'OG image).

---

## 2. Rapport par gravité

### 🔴 BLOQUANT

#### B1 — Les données personnelles des réservations sont lisibles publiquement sur Internet

**Fichiers** : règles Firestore (absentes du repo) + `lib/getPlats.js`, `lib/getActualites.js`, `lib/getTemoignages.js`, `components/ActualiteDetailClient.tsx`

Vérifié en direct, sans aucune authentification, avec la seule clé publique présente dans le bundle :

```
GET firestore.googleapis.com/v1/projects/aafd-projet/databases/(default)/documents/reservations
→ HTTP 200 — 3 documents, champs clientEmail + clientTelephone exposés
```

`temoignages`, `actualites` et `plats` répondent également 200.

**Cause** : aucun fichier `firestore.rules` versionné (règles probablement restées en mode test), et les pages publiques lisent Firestore depuis le navigateur — ce qui *impose* des règles de lecture ouvertes. Fuite de données nominatives (RGPD) + risque de scraping.

**Correctif** :
1. Versionner `firestore.rules` — `reservations` : `allow read, write: if false` (le SDK admin ignore les règles) ; `plats` / `actualites` / `temoignages` : `allow read: if true; allow write: if false`.
2. Faire passer les lectures publiques par le serveur — `lib/firebase/fetchers.ts` fait déjà exactement ça.

#### B2 — N'importe qui peut créer des réservations et modifier le stock

**Fichier** : `components/ReservationModal.tsx:69-95`

La transaction (`runTransaction` : décrément de `plats.quantite` + création du document `reservations`) s'exécute **dans le navigateur**. Pour qu'elle fonctionne, les règles doivent autoriser l'écriture anonyme sur `plats` et `reservations` : un tiers peut donc mettre tous les stocks à zéro, forger des réservations, ou remplir la base. À confirmer dans la console Firebase, mais le flux ne peut pas fonctionner autrement.

**Correctif** : route `POST /api/reservations` (runtime nodejs, SDK admin, rate-limit comme `send-contact`) ; le modal ne fait plus qu'un `fetch`.

#### B3 — Le formulaire de réservation se bloque définitivement après une saisie d'email refusée

**Fichier** : `components/ReservationModal.tsx:56-65`

`submittingRef.current = true` est posé ligne 57, mais le `return` ligne 64 (email invalide) sort **avant** le `try/finally` qui le remet à `false`. L'utilisateur corrige son email, le bouton se réactive… et le clic ne fait plus rien. Reproductible avec `test@localhost` (accepté par le navigateur, refusé par la regex ligne 39).

**Correctif** : déplacer la validation avant `submittingRef.current = true`, ou remettre le flag à `false` avant chaque `return`.

#### B4 — L'overlay du modal de réservation est noir opaque

**Fichier** : `components/ReservationModal.tsx:141` — `bg-black bg-opacity-50`

`bg-opacity-*` a été **supprimé en Tailwind v4**. Vérifié dans le CSS compilé : `.bg-opacity-50` → 0 occurrence, `.bg-black` s'applique seul. Le fond est donc 100 % noir. Seul endroit concerné (les autres modales utilisent `bg-black/50`, correct).

**Correctif** : `bg-black/50`.

#### B5 — Les emails ne partiront pas en production

**Fichiers** : `app/api/send-reservation/route.ts:31` et `:102`, `app/api/send-contact/route.ts:29` et `:153`

L'expéditeur est `onboarding@resend.dev`, le domaine de test de Resend : il n'autorise l'envoi **que vers l'adresse propriétaire du compte**. Toute réservation d'un visiteur tiers échouera en 403 dès l'étape 1 — et comme l'étape 2 est conditionnée à l'étape 1, **l'association ne recevra même pas la notification**. Le client verra systématiquement le bandeau jaune « L'email de confirmation n'a pas pu être envoyé ».

De plus le destinataire est codé en dur sur `bounouahani1@gmail.com` (`send-reservation/route.ts:59` et `:103`) au lieu de `aafd@gmx.fr` utilisé partout ailleurs.

**Correctif** : vérifier un domaine chez Resend (ou un sous-domaine type `mail.aafd-valdesaone.fr`), puis `from: 'AAFD <contact@…>'` et destinataire via `process.env.CONTACT_EMAIL`.

#### B6 — Le README décrit un autre projet

**Fichier** : `README.md`

Parle de **Sanity CMS**, d'un `/studio`, de pages `/nous-connaitre`, `/notre-action` qui n'existent pas. Aucune mention de Firebase, Cloudinary, Resend, du `.env`, ni de l'accès admin. Un tiers ne peut pas reprendre le projet.

**Correctif** : réécriture complète (installation, variables, lancement, déploiement Vercel, création du compte admin, accès `/admin`).

#### B7 — Si `ADMIN_SESSION_SECRET` manque en production, les sessions admin deviennent forgeables

**Fichiers** : `lib/auth/session.ts:6-8` et `proxy.ts:7-9`

`new TextEncoder().encode(process.env.ADMIN_SESSION_SECRET!)` : si la variable est absente, la clé HMAC devient littéralement la chaîne `"undefined"` — aucune erreur levée, et n'importe qui peut signer un cookie admin valide. `lib/firebase/admin.ts` fait le bon contrôle (throw explicite), pas ces deux fichiers.

**Correctif** : `if (!process.env.ADMIN_SESSION_SECRET) throw new Error(...)` dans les deux fichiers.

---

### 🟠 IMPORTANT

#### I1 — Contenus invisibles pour Google et écran « vide » au chargement

`components/VentePlatsPageClient.tsx:24-30`, `components/ActualitesPageClient.tsx:35-44`, `components/TemoignagesPageClient.tsx:37-51`

Les pages sont statiques (`○` au build) mais les données arrivent par `useEffect` : le HTML servi ne contient **aucun plat, aucune actualité, aucun témoignage**. Effet SEO direct, et effet visuel : `plats.length === 0` étant vrai pendant le chargement, la page affiche **« Aucun plat disponible pour le moment »** puis les plats apparaissent.

#### I2 — Aucun état d'erreur réseau sur ces trois pages

Mêmes fichiers. `VentePlatsPageClient` et `ActualitesPageClient` n'ont pas de `try/catch` (rejet non géré → page définitivement vide) ; `TemoignagesPageClient` catch mais se contente d'un `console.error`. Il faut trois états distincts : chargement / vide / erreur.

#### I3 — Injection HTML dans les emails

`app/api/send-reservation/route.ts:42-51` et `:126-131`, `app/api/send-contact/route.ts:77-99`

`${clientNom}`, `${message}`, `${sujet}` sont interpolés bruts dans le HTML des emails. Un visiteur peut injecter des balises/liens dans le mail reçu par l'association (phishing, pixel espion).

Le site lui-même est sain : **aucun `dangerouslySetInnerHTML` dans tout le projet**.

**Correctif** : fonction `escapeHtml()` appliquée à chaque champ interpolé.

#### I4 — ESLint échoue : 16 erreurs, 5 warnings

`npm run lint` (le build Next 16 ne lint plus, l'erreur ne remonterait donc qu'en CI) :

- `app/admin/login/page.tsx:120` — `<a href="/">` au lieu de `<Link>`
- `app/api/send-reservation/route.ts:84` et `components/ReservationModal.tsx:128` — `any`
- `components/FloatingDonButton.tsx:16` et `components/Toast.tsx:16` — `setState` synchrone dans un effet (rendus en cascade)
- Apostrophes non échappées : `ContactForm` ×2, `ReservationModal` ×3, `ActuFormClient` ×1
- `components/PlatCard.tsx:2` — `useEffect` importé et inutilisé

#### I5 — Validation d'upload basée sur le type déclaré par le client

`app/api/admin/upload/route.ts:28`

`file.type.startsWith('image/')` provient de l'en-tête envoyé par le navigateur, falsifiable. Pas de lecture des magic bytes. Risque limité (Cloudinary re-valide, destination non exécutable, nom de fichier forcé à `image.webp` dans `lib/uploadImage.ts:19`), mais l'endpoint sert de proxy d'upload gratuit.

Incohérence associée : limite serveur **5 Mo** (`upload/route.ts:32`) alors que l'UI annonce **10 Mo** (`components/admin/PlatFormClient.tsx:186`) — un gros fichier échoue après la compression, sans message clair.

À noter : le preset Cloudinary est **unsigned** — quiconque connaît `dtawbzeoy` + `aafd_images` peut uploader directement. Ces valeurs ne sont pas dans le bundle client (vérifié) mais restent publiques par nature.

#### I6 — Zoom iOS au focus des champs (font-size < 16 px)

`text-sm` (14 px) sur les inputs de `app/admin/login/page.tsx:73` et `:90`, `components/admin/PlatFormClient.tsx` (5 champs), `components/admin/ActuFormClient.tsx` (4), `components/admin/TemoignageFormClient.tsx` (4). Safari zoome à chaque focus.

Les formulaires publics (contact, réservation) sont corrects (16 px hérités).

#### I7 — Cibles tactiles trop petites dans l'admin

Boutons icône `w-8 h-8` = 32 px : `components/admin/PlatList.tsx:124-139` et équivalents dans `ActuList`, `TemoignageList`. Sous les 44×44 px recommandés. Les barres « Modifier / Supprimer » en bas de carte compensent partiellement.

#### I8 — Pas de gestion des safe areas iOS

Aucune occurrence de `env(safe-area-inset-*)` dans le projet. Le bouton flottant de don (`components/FloatingDonButton.tsx:49`, `bottom-14`) et les toasts (`bottom-6`) peuvent passer sous la barre d'outils Safari. Le bouton est masqué en mobile via `hidden md:block` (`app/(site)/layout.tsx:11`), l'impact réel porte surtout sur les toasts admin.

#### I9 — Menu mobile : accessibilité incomplète

`components/MobileMenu.tsx:66-89` — pas d'`aria-expanded` / `aria-controls`, `aria-label="Toggle menu"` en anglais et invariable, pas de fermeture à `Échap`, pas de piège au focus (le focus continue derrière le panneau ouvert). Le scroll d'arrière-plan n'est pas bloqué, mais le menu est un dépliant inline et non un overlay plein écran : acceptable en l'état.

#### I10 — 404 « molles » sur les actualités

`app/(site)/actualites/[id]/page.tsx` + `components/ActualiteDetailClient.tsx:75-79`

Vérifié : `/actualites/inexistant-123` renvoie **HTTP 200** avec « Actualité introuvable ». Google indexe la page. Le `<h1>` de la page est d'ailleurs « Actualités » (le `PageHero`), le titre réel de l'article étant en `<h2>`.

**Correctif** : charger l'article côté serveur (`getActualiteByIdAdmin` est déjà appelé dans `generateMetadata`) et appeler `notFound()`.

#### I11 — Lien mort dans le footer

`components/Footer.tsx:11` — `href="#top"` : aucun élément `id="top"` n'existe dans le projet. Lighthouse le signale aussi en `label-content-name-mismatch` (aria-label « Remonter en haut de la page » vs texte visible « AAFD Val de Saône »).

#### I12 — Labels de formulaire non reliés aux champs (admin)

`components/admin/PlatFormClient.tsx:236`, `:249`, `:259`, `:271`, `:289`, `:305` — `<label>` sans `htmlFor`, `<input>` sans `id`. Idem `ActuFormClient` et `TemoignageFormClient`. Les formulaires publics sont corrects.

#### I13 — Contrastes insuffisants

Lighthouse : a11y **94** sur l'accueil, **96** sur `/vente-plats` (24 éléments en échec). Principaux motifs : blanc sur `bg-orange-500` (≈ 3,0:1, sous le 4,5:1 AA), badges de catégorie, `text-gray-400` sur blanc, `text-white/80` sur photo.

> Point à arbitrer : touche à l'identité visuelle (assombrir en `orange-600/700` ou assumer le non-respect AA sur ces éléments).

#### I14 — Variables d'environnement non documentées

Pas de `.env.example`. `.env.local` contient de vraies clés (clé privée Firebase, `RESEND_API_KEY`, `CLOUDINARY_API_SECRET`, `ADMIN_SESSION_SECRET`) — **l'historique Git a été vérifié : ce fichier n'a jamais été commité**, c'est propre. Restent : le fichier est à transmettre hors dépôt, et `NEXT_PUBLIC_SITE_URL` pointe encore sur `site-aafd.vercel.app`. Quatre variables EmailJS (`NEXT_PUBLIC_EMAILJS_*`) ne sont plus utilisées nulle part.

---

### 🟡 COSMÉTIQUE / NETTOYAGE

#### C1 — Performance mobile

Lighthouse, serveur de production local, profil mobile :

| Page | Perf | FCP | LCP | CLS | TBT |
|---|---|---|---|---|---|
| `/` | **62** | 5,1 s | **7,8 s** | 0 | 0 ms |
| `/vente-plats` | **76** | 1,1 s | **7,7 s** | 0 | 50 ms |

Bonne nouvelle : **CLS = 0** et TBT quasi nul. Poids accueil : **419 Ko transférés** (JS + CSS + polices, compressés) / 1,25 Mo non compressés, + l'image du héros. Autres scores accueil : **a11y 94, best-practices 100, SEO 100**.

**Les 3 leviers, par ordre de gain :**

1. **Le LCP est le `<h1>` du héros, masqué par framer-motion** — `components/MainHero.tsx:43-52` (`initial={{opacity:0}}` + `delay: 0.3` + `duration: 0.9`). Le titre n'apparaît qu'après téléchargement + hydratation de React et de framer-motion. Rendre le h1 visible d'emblée (animation CSS pure, ou pas d'animation d'entrée sur le LCP) ferait tomber le LCP de plusieurs secondes. Directement lié à la contrainte de Phase 3 « rien ne doit retarder l'affichage du contenu principal ».
2. **Deux polices Geist préchargées et jamais affichées** — `app/layout.tsx:5-13` charge `Geist` + `Geist_Mono`, mais `app/globals.css:22-29` impose `DINSchriftRegular` partout. Vérifié dans le HTML : 2 `<link rel="preload">` woff2 = **52 Ko** téléchargés pour rien, en concurrence avec l'image LCP. La DIN, elle, est en `.otf` (24 Ko, non préchargée) → FOUT au premier rendu. Correctif : supprimer Geist, convertir la DIN en woff2, la précharger.
3. **~370 Ko (non compressés) de SDK Firebase sur toutes les pages publiques** — chunks identifiés : Firestore 251 Ko + Firebase App/Auth 118 Ko, à cause des lectures client de I1. Basculer ces lectures côté serveur supprime ce coût *et* règle B1/B2 d'un même geste. Lighthouse signale 112 Ko de JS inutilisé.

Divers : `app/opengraph-image.tsx` en `runtime = 'edge'` désactive la génération statique (seul warning du build) ; `app/favicon.ico` fait 73 Ko.

#### C2 — Fichiers lourds inutiles

- `screenshot.png` — **1,5 Mo**, commité
- `public/images/aaff_logo.png` — **1,1 Mo**, jamais référencé (c'est `test-logo.webp` qui est utilisé)
- `public/{next,vercel,file,globe,window}.svg` — gabarit Next par défaut

#### C3 — Code mort

**Composants jamais importés** : `AdminProtection.tsx`, `AdminHeader.tsx`, `StickyBar.tsx` + `StickyBar.module.css`, `PlatModal.tsx`, `ActualiteModal.tsx`, `TemoignageModal.tsx`.

**Fichiers `lib/` jamais importés** : `createReservation.js`, `annulerReservation.js`, `updatePlatQuantite.js`, `uploadPlat.js`, `uploadActualite.js`, `uploadTemoignage.js`, `uploadToCloudinary.js`, `getReservations.js`. Les 3 seuls `console.log` du projet sont dans ces fichiers morts.

**Dépendances inutilisées** : `@portabletext/react`, `styled-components`.

**Doublon** : deux initialisations Firebase client coexistent — `lib/firebase.js` (pages publiques) et `lib/firebase/client.ts` (login + AdminNav).

#### C4 — Classes CSS sans effet

- `components/PlatCard.tsx:59` — `group-hover:scale-110` sans `group` sur un parent
- `.animate-fadeIn` défini dans `app/globals.css:151` et jamais utilisé
- `cursor-pointer` sur la carte entière (`PlatCard.tsx:43`) alors qu'elle n'est pas cliquable

`flex-shrink-0` et `bg-gradient-to-*` (syntaxe v3) sont en revanche **toujours compilés par Tailwind v4** — vérifié dans le CSS de sortie, rien à faire.

#### C5 — Contenu provisoire à remplacer avant mise en ligne

*(liste seulement, le contenu n'est pas à réécrire)*

- Téléphone `06 12 34 56 78` — `components/Footer.tsx:83`, `app/(site)/mentions-legales/page.tsx:42`
- Mentions légales : `[Adresse à compléter]`, `[Numéro RNA/SIRET]`, `[Prénom Nom, Présidente]`
- 6 tuiles « Photo à venir » — `components/TemoignagesPageClient.tsx:170-188`
- Compte Instagram `@aafd_asso` à confirmer

---

## 3. Réponses aux questions explicites

### L'authentification admin est-elle vérifiée côté serveur ?

**Oui, et correctement.** `proxy.ts` garde `/admin/:path*` (vérifié : `/admin` renvoie bien un 307 vers `/admin/login`), **et** chacune des 8 routes API admin refait un `checkSession()` indépendant (upload, plats, plats/[id], actualites, actualites/[id], temoignages, temoignages/[id], reservations, reservations/[id]).

Cookie `httpOnly` + `sameSite: 'strict'` → protection CSRF correcte. Aucun secret serveur dans le bundle client (vérifié chunk par chunk : seule la clé API Firebase publique y figure, ce qui est normal).

Le composant `AdminProtection.tsx` (protection client seule) existe encore mais **n'est plus utilisé nulle part** — c'est bien la version serveur qui est active. Seul angle mort : **B7**.

### L'admin est-elle utilisable sur mobile ?

**Oui, elle est même clairement conçue en mobile-first** : listes en cartes empilées (jamais de tableau), formulaires pleine largeur, barres d'action collantes, nav compacte avec libellés masqués en `sm:`, modales de confirmation centrées.

Réserves : zoom iOS au focus (I6), boutons icône à 32 px (I7), vue impression réservée au desktop (normal). Rien ne justifie de la passer en desktop-only.

### Liens morts / routes cassées

Toutes les routes répondent 200 (`/`, `/actualites`, `/vente-plats`, `/temoignages`, `/contact`, `/notre-association`, `/nous-rejoindre`, `/nous-soutenir`, `/mentions-legales`, `/robots.txt`, `/sitemap.xml`), la 404 générique fonctionne, aucun `target="_blank"` sans `rel="noopener"` (8/8 corrects).

Deux anomalies : le `#top` du footer (I11) et le soft-404 des actualités (I10).

**`/nous-soutenir` n'est atteignable que depuis le footer** — absente de la nav principale et du menu mobile, alors que c'est la page de dons.

### SEO

Excellent socle : `lang="fr"`, titres avec template, descriptions, Open Graph + Twitter card + image OG générée, canonical, `robots.ts`, `sitemap.ts` dynamique, `noindex` sur `/admin` et les mentions légales, favicon. Lighthouse **SEO 100 / Best-practices 100**. Le seul vrai frein est I1 (contenus absents du HTML).

---

## 4. Faiblesses UX repérées (signalées, non corrigées)

- **`PageHero` en `h-[100svh]` sur *toutes* les pages** (`components/PageHero.tsx:22`) : sur mobile, chaque page s'ouvre sur une photo plein écran, le contenu commence sous la ligne de flottaison. Un héros de 55-65 vh sur les pages internes réduirait le scroll obligatoire.
- **Parcours d'ajout d'un plat** : globalement bon (compression + barre de progression en deux phases, aperçu, bouton désactivé). Trois frictions : aucune confirmation après enregistrement (redirection sèche vers la liste — le toast existe déjà pour les réservations) ; le fichier est envoyé **avant** validation des autres champs (si le nom manque, l'upload est perdu) ; un abandon en cours d'upload laisse une image orpheline sur Cloudinary.
- **Après une réservation réussie, `window.location.reload()` au bout de 4 s** (`components/ReservationModal.tsx:126`) : rechargement complet inattendu, message de confirmation coupé.
- **Hiérarchie visuelle du modal de réservation** : bandeau orange en dégradé + 5 champs + 3 variantes de messages d'état, pas de récapitulatif de prix total.
- **`PlatCard`** : la description n'est accessible qu'au survol / tap de l'image, sans aucune affordance visuelle — beaucoup de visiteurs ne la verront jamais.
- **Densité de l'accueil** : les libellés des cartes ne sont pas hiérarchisés (`h3` mélangés à des `div` en `text-[16px]`) ; Lighthouse relève d'ailleurs un `heading-order` cassé.
- **Note pour la Phase 3** : le site n'est pas totalement dépourvu d'animations — `framer-motion` anime déjà les deux héros (ligne, titre, description, flèche de scroll en boucle infinie). Ce sont justement ces animations qui pénalisent le LCP. Le plan de Phase 3 devra les reprendre plutôt que les ignorer, et l'ajout de `framer-motion` sur d'autres composants est à éviter (125 Ko) — un IntersectionObserver + CSS suffira.

---

## 5. Plan de correction proposé (Phase 2, en attente de validation)

| Lot | Contenu | Vérification |
|---|---|---|
| **Lot 1 — Sécurité** | B1 + B2 : `firestore.rules` versionnées, lectures publiques côté serveur, route `POST /api/reservations` | Build + test d'accès anonyme Firestore (doit renvoyer 403) |
| **Lot 2 — Bugs visibles** | B3 (formulaire bloqué), B4 (overlay opaque), B5 (emails) | Build + parcours de réservation complet |
| **Lot 3 — Livraison** | B6 (README), B7 (garde du secret), I14 (`.env.example`) | Build |
| **Lots suivants** | Importants (I1-I13) puis cosmétiques (C1-C5), à cadencer | Build après chaque lot |

**Deux points nécessitent un arbitrage avant intervention :**

1. **Basculer les lectures publiques côté serveur** (B1 / I1 / C1-levier 3) — changement d'architecture, mais il règle à lui seul la fuite de données, le SEO absent, les états de chargement et ~370 Ko de JS. Aucun impact visuel.
2. **Le contraste blanc-sur-orange** (I13) touche à l'identité visuelle : assombrir l'orange des boutons (`orange-600/700`) ou assumer le non-respect du AA sur ces éléments.
