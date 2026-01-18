# Configuration Cloudinary

Ce guide explique comment configurer Cloudinary pour stocker les images de l'application.

## Étapes de configuration

### 1. Créer un compte Cloudinary

1. Allez sur [cloudinary.com](https://cloudinary.com)
2. Créez un compte gratuit (offre jusqu'à 25 GB de stockage)
3. Connectez-vous à votre dashboard

### 2. Récupérer vos credentials

Dans votre dashboard Cloudinary :

1. **Cloud Name** : Visible en haut du dashboard (ex: `dxxxx`)
2. **Upload Preset** : Vous devez en créer un

### 3. Créer un Upload Preset

Un Upload Preset est nécessaire pour permettre les uploads depuis le frontend :

1. Allez dans **Settings** > **Upload**
2. Scrollez jusqu'à **Upload presets**
3. Cliquez sur **Add upload preset**
4. Configurez :
   - **Preset name** : Donnez un nom (ex: `aafd_images`)
   - **Signing Mode** : Sélectionnez **Unsigned** (important pour les uploads frontend)
   - **Folder** : (optionnel) ex: `aafd/` pour organiser vos images
5. Cliquez sur **Save**

### 4. Configurer les variables d'environnement

1. Créez un fichier `.env.local` à la racine du projet (copier `.env.local.example`)
2. Ajoutez vos credentials Cloudinary :

```bash
# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=votre_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=votre_upload_preset
```

**Exemple :**
```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dxxxx1234
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=aafd_images
```

### 5. Redémarrer le serveur

```bash
npm run dev
```

## Comment ça marche ?

### Upload d'image

Quand vous ajoutez une actualité ou un plat avec une image :

1. L'image est d'abord uploadée vers Cloudinary
2. Cloudinary retourne une URL sécurisée (HTTPS)
3. Cette URL est sauvegardée dans Firestore avec les autres données
4. L'image est servie directement depuis Cloudinary (CDN rapide)

### Avantages

- ✅ **CDN mondial** : Images servies rapidement partout dans le monde
- ✅ **Optimisation automatique** : Compression et formats modernes (WebP)
- ✅ **Transformations** : Redimensionnement, crop, etc. via URL
- ✅ **Gratuit** : 25 GB de stockage, 25 GB de bande passante/mois
- ✅ **Sécurisé** : HTTPS par défaut

### Structure du code

```
lib/
  uploadToCloudinary.js    # Fonction helper pour uploader vers Cloudinary
  uploadActualite.js       # Sauvegarde dans Firestore (avec URL Cloudinary)
  uploadPlat.js            # Sauvegarde dans Firestore (avec URL Cloudinary)

app/admin/
  actualites/page.tsx      # Formulaire qui utilise uploadToCloudinary
  plats/page.tsx           # Formulaire qui utilise uploadToCloudinary
```

## Dépannage

### Erreur "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME non configuré"

→ Vérifiez que `.env.local` contient bien vos credentials et redémarrez le serveur

### Erreur "Upload preset not found"

→ Vérifiez que l'upload preset existe dans Cloudinary et qu'il est en mode **Unsigned**

### Images non affichées

→ Vérifiez que l'URL dans Firestore commence par `https://res.cloudinary.com/`

## Gestion des images

### Voir vos images

1. Connectez-vous à Cloudinary
2. Allez dans **Media Library**
3. Vous verrez toutes vos images uploadées

### Supprimer des images

Les images restent dans Cloudinary même si vous supprimez l'actualité/plat dans Firebase.
Pour les supprimer, allez dans la Media Library de Cloudinary.

### Transformation d'images

Vous pouvez transformer les images via l'URL. Exemple :

```
Original: https://res.cloudinary.com/demo/image/upload/sample.jpg
Thumbnail (300px): https://res.cloudinary.com/demo/image/upload/w_300/sample.jpg
```

## Limites du plan gratuit

- 25 GB de stockage
- 25 GB de bande passante/mois
- 25 crédits de transformation/mois

Pour la plupart des associations, c'est largement suffisant !
