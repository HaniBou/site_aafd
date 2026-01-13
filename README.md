# Site AAFD - Pages Institutionnelles

Site Next.js avec Sanity CMS pour les pages institutionnelles d'une association.

## 🏗️ Architecture

**Pages statiques** codées en Next.js + **contenu éditable** via Sanity Studio.

### Principe

- Les pages (`/nous-connaitre`, `/notre-action`, etc.) sont **codées en dur**
- Seul le **contenu** (textes, images, stats) est **éditable via Sanity**
- Design inspiré de sites associatifs modernes (type Habitat & Humanisme)

## 🚀 Installation

```bash
npm install
npm run dev
```

- Site : http://localhost:3000
- Studio : http://localhost:3000/studio

## 📄 Pages disponibles

- `/` - Page d'accueil avec liens vers les 4 pages
- `/nous-connaitre` - Présentation de l'association
- `/notre-action` - Actions menées
- `/nous-soutenir` - Comment soutenir
- `/nous-rejoindre` - Comment rejoindre

## 🎨 Structure d'une page

Chaque page peut contenir :

### 1. Section Hero (1 par page)
Bannière en haut de page avec :
- Titre principal
- Sous-titre
- Image de fond
- Bouton CTA optionnel

### 2. Sections de contenu (plusieurs possibles)
Blocs texte + image :
- Titre de section
- Contenu riche (paragraphes, listes, liens)
- Image optionnelle (gauche ou droite)
- Alternance fond blanc/gris

### 3. Chiffres clés (1 par page)
Section avec statistiques :
- Jusqu'à 6 chiffres
- Affichage moderne sur fond bleu

## 🗂️ Schemas Sanity

### `heroSection`
```typescript
{
  page: 'nous-connaitre' | 'notre-action' | 'nous-soutenir' | 'nous-rejoindre'
  title: string
  subtitle: text
  backgroundImage: image
  ctaText: string (optionnel)
  ctaLink: string (optionnel)
}
```

### `contentSection`
```typescript
{
  page: string
  sectionId: string (unique, ex: "mission", "histoire")
  title: string
  content: blockContent
  image: image (optionnel)
  imagePosition: 'left' | 'right'
}
```

### `stats`
```typescript
{
  page: string
  title: string
  stats: [{
    number: string
    label: string
    icon: string (optionnel)
  }]
}
```

## 📝 Éditer le contenu

### Via Sanity Studio

1. Accédez à `/studio`
2. Créez vos sections :
   - **Section Hero** : Bannière de page
   - **Section de contenu** : Blocs texte/image
   - **Chiffres clés** : Statistiques
3. **Publiez** (important !)
4. Le site se met à jour automatiquement

### Exemple : Page "Nous connaître"

```
Hero:
  Page: nous-connaitre
  Titre: "Habitat & Humanisme, bâtisseur de liens"
  Sous-titre: "En 2025, l'association célèbre 40 années..."
  
Section 1:
  Page: nous-connaitre
  ID: histoire
  Titre: "Notre histoire"
  Contenu: [texte]
  Image: [photo]
  Position: gauche

Section 2:
  Page: nous-connaitre
  ID: mission  
  Titre: "Notre mission"
  Contenu: [texte]
  Image: [photo]
  Position: droite

Stats:
  Page: nous-connaitre
  Stats:
    - 40 | années d'engagement
    - 1000+ | personnes accompagnées
    - 85% | de satisfaction
```

## 🎨 Design et styles

### Couleurs

- **Bleu principal** : `#1e40af` (blue-700)
- **Bleu foncé** : `#1e3a8a` (blue-900)  
- **Orange accent** : `#f97316` (orange-500)

Modifiables dans `app/globals.css`.

### Composants

- `HeroSection` : Bannière avec image de fond
- `ContentSection` : Texte + image côte à côte
- `Stats` : Affichage de statistiques
- `PortableTextContent` : Rendu du contenu riche

### Responsive

- Mobile-first avec Tailwind CSS
- Breakpoints : sm (640px), md (768px), lg (1024px)
- Grilles adaptatives

## 🔧 Structure du code

```
app/
├── page.tsx                    # Page d'accueil
├── nous-connaitre/page.tsx     # Page statique 1
├── notre-action/page.tsx       # Page statique 2
├── nous-soutenir/page.tsx      # Page statique 3
├── nous-rejoindre/page.tsx     # Page statique 4
└── studio/                     # Sanity Studio

components/
├── HeroSection.tsx             # Composant Hero
├── ContentSection.tsx          # Composant Section
├── Stats.tsx                   # Composant Stats
└── PortableTextContent.tsx     # Rendu Portable Text

sanity/
├── schemaTypes/
│   ├── heroSectionType.ts      # Schema Hero
│   ├── contentSectionType.ts   # Schema Section
│   └── statsType.ts            # Schema Stats
└── lib/
    ├── client.ts               # Client Sanity
    └── queries.ts              # Queries GROQ
```

## 🔄 Workflow de développement

### Ajouter une nouvelle section à une page

1. **Créer dans le Studio** :
   - Type : "Section de contenu"
   - Page : choisir la page
   - Identifiant unique
   - Contenu + image
   - Publier

2. **La section apparaît automatiquement** sur la page

### Modifier le design d'une page

Les pages sont dans `app/[nom-page]/page.tsx`.

Exemple pour ajouter une section personnalisée :

```tsx
// app/nous-connaitre/page.tsx
export default async function Page() {
  const sections = await client.fetch(...)
  
  return (
    <main>
      <HeroSection {...hero} />
      {sections.map(section => ...)}
      
      {/* Votre section custom */}
      <section className="py-24">
        <h2>Section personnalisée</h2>
      </section>
      
      <Stats {...stats} />
    </main>
  )
}
```

## 📊 Performance

- **SSG** : Pages pré-générées au build
- **ISR** : Revalidation toutes les heures (3600s)
- **Images optimisées** : Next.js Image + Sanity CDN
- **Tailwind CSS** : CSS minimal

## 🚀 Déploiement

### Vercel (recommandé)

```bash
npm i -g vercel
vercel
```

Les variables d'environnement seront détectées automatiquement.

### Autre hébergement

```bash
npm run build
npm start
```

## 📚 Documentation

- `GUIDE_CONTENU.md` : Guide pour les bénévoles
- Ce README : Documentation technique

## 🆘 Support

### Le contenu ne s'affiche pas
1. Vérifiez que c'est publié (pas en brouillon)
2. Actualisez le cache : Ctrl+F5
3. Vérifiez la page sélectionnée dans Sanity

### Erreur de build
```bash
rm -rf .next
npm run build
```

### Images qui ne chargent pas
- Vérifiez le format (JPG/PNG)
- Réduisez la taille (< 2 Mo)

## 🔐 Sécurité

- Accès lecture publique au contenu
- Authentification Sanity pour l'édition
- Pas de token exposé côté client

## 📄 Licence

Développé pour l'Association AAFD - 2025
