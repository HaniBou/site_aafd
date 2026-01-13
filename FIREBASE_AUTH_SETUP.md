# Configuration Firebase Auth pour l'Administration

## Étapes pour configurer l'authentification admin

### 1. Activer Firebase Authentication

1. Allez sur la [Console Firebase](https://console.firebase.google.com/)
2. Sélectionnez votre projet : **aafd-projet**
3. Dans le menu de gauche, cliquez sur **Authentication**
4. Cliquez sur **Commencer** (si c'est la première fois)
5. Allez dans l'onglet **Sign-in method**
6. Activez **Email/Password** en cliquant dessus puis sur **Activer**

### 2. Créer un compte administrateur

1. Toujours dans **Authentication**, allez dans l'onglet **Users**
2. Cliquez sur **Add user**
3. Entrez un email et un mot de passe pour votre compte admin
   - Exemple : `admin@aafd.fr` avec un mot de passe fort
4. Cliquez sur **Add user**

### 3. Tester la connexion

1. Lancez votre application : `npm run dev`
2. Allez sur `http://localhost:3000/admin`
3. Vous serez redirigé vers `/admin/login`
4. Connectez-vous avec les identifiants que vous avez créés
5. Une fois connecté, vous aurez accès à toutes les pages admin

## Fonctionnalités de sécurité implémentées

✅ **Protection des routes** : Toutes les pages `/admin/*` sont protégées
✅ **Redirection automatique** : Les utilisateurs non connectés sont redirigés vers `/admin/login`
✅ **Déconnexion** : Un bouton de déconnexion est disponible sur toutes les pages admin
✅ **Persistance de session** : La session reste active même après rafraîchissement de la page

## Structure des fichiers créés

```
lib/
  firebase.js                    # Configuration Firebase + export de auth

components/
  AdminProtection.tsx            # Composant pour protéger les routes
  AdminHeader.tsx                # Header avec bouton déconnexion

app/
  admin/
    login/
      page.tsx                   # Page de connexion
    page.tsx                     # Page d'accueil admin (protégée)
    actualites/
      page.tsx                   # Gestion actualités (protégée)
    plats/
      page.tsx                   # Gestion plats (protégée)
    reservations/
      page.tsx                   # Gestion réservations (protégée)
```

## Ajouter d'autres administrateurs

Pour ajouter de nouveaux comptes admin :
1. Retournez dans la Console Firebase > Authentication > Users
2. Cliquez sur **Add user**
3. Entrez l'email et le mot de passe du nouvel admin

## Sécurité Firestore (Recommandé)

Pour sécuriser également votre base de données Firestore :

1. Allez dans **Firestore Database** > **Rules**
2. Ajoutez ces règles pour que seuls les utilisateurs authentifiés puissent modifier les données :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Lecture publique pour tout le monde
    match /{document=**} {
      allow read: if true;
    }
    
    // Écriture uniquement pour les utilisateurs authentifiés
    match /actualites/{actualiteId} {
      allow write: if request.auth != null;
    }
    
    match /plats/{platId} {
      allow write: if request.auth != null;
    }
    
    match /reservations/{reservationId} {
      allow create: if true;  // Les clients peuvent créer des réservations
      allow update, delete: if request.auth != null;  // Seuls les admins peuvent modifier/supprimer
    }
  }
}
```

## Notes importantes

- 🔐 Utilisez toujours des mots de passe forts pour les comptes admin
- 🔄 La session Firebase reste active jusqu'à déconnexion explicite
- 📱 L'authentification fonctionne aussi sur mobile
- ⚡ Les vérifications sont faites côté client ET doivent être sécurisées côté serveur (Firestore Rules)
