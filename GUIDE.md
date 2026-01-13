# Guide d'utilisation - AAFD Val de Saône

## 🎯 Comment fonctionne le site

Le site a une **structure fixe** avec header et navigation, mais le **contenu des pages est éditable** via Sanity Studio.

### Pages du site

- `/` - **Page d'accueil** (contenu fixe avec infos de base)
- `/nous-connaitre` - Présentation de l'association (contenu éditable)
- `/notre-action` - Actions menées (contenu éditable)
- `/nous-soutenir` - Comment soutenir (contenu éditable)
- `/nous-rejoindre` - Comment rejoindre (contenu éditable)

Le header avec menu et le footer sont présents sur toutes les pages.

## 🎨 Éditer le contenu des pages

### 1. Accéder à Sanity Studio

Allez sur **http://localhost:3000/studio** (ou votre URL de production + `/studio`)

### 2. Types de contenu disponibles

#### **Section Hero** 
La grande bannière en haut de chaque page.

**Créer un Hero :**
1. Cliquez sur "Section Hero" → "Create"
2. **Page** : Choisissez la page (nous-connaitre, notre-action, nous-soutenir, nous-rejoindre)
3. **Titre principal** : Le grand titre affiché (ex: "Nous connaître")
4. **Sous-titre** : Description en dessous (optionnel)
5. **Image de fond** : Grande photo de fond (recommandé : 1920x1080px)
6. **Texte du bouton** : Texte du call-to-action (optionnel, ex: "Nous soutenir")
7. **Lien du bouton** : URL du bouton (optionnel, ex: "/nous-soutenir")
8. **Publish** ✅

#### **Section de contenu**
Blocs de texte avec image optionnelle.

**Créer une section :**
1. Cliquez sur "Section de contenu" → "Create"
2. **Page** : Choisissez la page
3. **Identifiant** : Nom unique (ex: "notre-histoire", "notre-mission")
4. **Titre** : Titre de la section (ex: "Notre histoire")
5. **Contenu** : Texte avec formatage (gras, listes, liens...)
6. **Image** : Photo optionnelle (recommandé : 800x600px)
7. **Position de l'image** : Gauche ou Droite
8. **Publish** ✅

#### **Chiffres clés**
Statistiques importantes à mettre en avant.

**Créer des stats :**
1. Cliquez sur "Chiffres clés" → "Create"
2. **Page** : Choisissez la page
3. **Titre** : "Nos chiffres clés" (ou autre)
4. **Statistiques** : Ajoutez vos chiffres
   - Cliquez sur "Add item"
   - **Chiffre** : "15", "150+", "85%"...
   - **Libellé** : Description (ex: "années d'expérience")
   - Répétez pour chaque stat (max 6)
5. **Publish** ✅

### 3. Exemple : Page "Nous connaître"

**Hero de la page :**
```
Page: nous-connaitre
Titre: Association d'Aide aux Familles en Difficulté
Sous-titre: Depuis 17 ans, nous accompagnons des familles réfugiées...
Image: [Votre belle photo]
```

**Section 1 - Notre histoire :**
```
Page: nous-connaitre
Identifiant: histoire
Titre: Notre histoire
Contenu: [Histoire de l'association depuis 17 ans...]
Image: [Photo de l'association]
Position: gauche
```

**Section 2 - Notre mission :**
```
Page: nous-connaitre
Identifiant: mission
Titre: Ce que nous faisons
Contenu: [Description des actions...]
Image: [Photo d'une activité]
Position: droite
```

**Chiffres clés :**
```
Page: nous-connaitre
Stats:
  - 15 | années d'expérience
  - 150 | repas vendus par mois
  - 10 | nationalités accompagnées
```

## 📝 Conseils pour le contenu

### Textes
- **Restez concis** : paragraphes courts et faciles à lire
- **Utilisez le gras** pour les mots importants
- **Créez des listes** pour énumérer des points
- **Ajoutez des liens** vers d'autres pages ou sites

### Images
- **Taille recommandée Hero** : 1920x1080px (paysage)
- **Taille recommandée Section** : 800x600px
- **Format** : JPG ou PNG
- **Poids** : < 500 Ko (compressez si nécessaire)
- **Toujours ajouter** un texte alternatif pour l'accessibilité

### Ordre des sections
Les sections apparaissent dans l'ordre de création. Pour réorganiser :
1. Notez l'ordre souhaité
2. Supprimez les sections
3. Recréez-les dans le bon ordre

## ⚠️ Points importants

### Toujours publier !
- Après création/modification, cliquez sur **"Publish"**
- Les brouillons ne sont pas visibles sur le site public
- Vérifiez que le statut est "Published" (vert)

### Une seule de chaque par page
- **1 Hero** par page maximum
- **Plusieurs Sections** possibles
- **1 bloc Stats** par page maximum

### Identifiants uniques
- Chaque section doit avoir un identifiant différent
- Exemple : "histoire", "mission", "valeurs", "equipe"

## 🔄 Workflow recommandé

1. **Planifiez** : Listez les sections de votre page
2. **Créez le Hero** : Grande bannière d'abord
3. **Créez les sections** : Une par une, dans l'ordre
4. **Ajoutez les stats** : En dernier
5. **Publiez** : N'oubliez pas !
6. **Vérifiez** : Allez sur la page du site
7. **Ajustez** : Modifiez si besoin

## 🆘 Problèmes courants

**Mon contenu ne s'affiche pas**
- ✅ Avez-vous bien publié ? (bouton "Publish")
- ✅ Avez-vous choisi la bonne page ?
- ✅ Actualisez votre navigateur (Ctrl+F5 ou Cmd+R)

**Mon image ne s'affiche pas**
- ✅ Format JPG ou PNG uniquement
- ✅ Taille < 2 Mo
- ✅ Rechargez l'image

**L'ordre de mes sections est mauvais**
- Les sections s'affichent dans l'ordre de création
- Pour changer : supprimez et recréez dans le bon ordre

**J'ai deux heros sur ma page**
- Il ne doit y avoir qu'un seul hero par page
- Supprimez le doublon dans Sanity Studio

## 📞 Contact technique

Pour toute question : aafd@gmx.fr

---

**Le contenu de la page d'accueil est fixe** (codé en dur avec les infos de base).  
**Les 4 autres pages sont éditables** via ce système.
