# Configuration EmailJS pour les réservations de plats

## 📝 Étapes de configuration

### 1. Créer un compte EmailJS
1. Allez sur [https://www.emailjs.com/](https://www.emailjs.com/)
2. Cliquez sur "Sign Up" (gratuit - 200 emails/mois)
3. Confirmez votre email

### 2. Ajouter un service d'email
1. Dans le dashboard EmailJS, allez dans **"Email Services"**
2. Cliquez sur **"Add New Service"**
3. Choisissez votre fournisseur d'email (Gmail, Outlook, etc.)
4. Suivez les instructions pour connecter votre email
5. Notez le **Service ID** (ex: `service_abc123`)

### 3. Créer un template d'email
1. Allez dans **"Email Templates"**
2. Cliquez sur **"Create New Template"**
3. Donnez-lui un nom : "Réservation Plat"
4. Configurez le template avec les variables suivantes :

#### Template pour confirmation client :
```
Subject: ✅ Confirmation de réservation - {{plat_nom}}

Bonjour {{client_nom}},

Votre réservation a bien été enregistrée !

📋 DÉTAILS DE VOTRE RÉSERVATION :
- Plat : {{plat_nom}}
- Quantité : {{quantite}}
- Date de retrait souhaitée : {{date_retrait}}

📞 VOS COORDONNÉES :
- Email : {{client_email}}
- Téléphone : {{client_telephone}}

💬 Votre message :
{{message}}

---

Nous vous contacterons très prochainement pour confirmer la disponibilité et l'heure de retrait.

Le paiement se fera sur place lors du retrait.

Merci de soutenir l'AAFD ! 💙

---
Association AAFD
Val de Saône
Email : aafd@gmx.fr
```

5. **Sauvegardez le template** et notez le **Template ID** (ex: `template_xyz789`)

### 4. Obtenir votre clé publique
1. Allez dans **"Account"** > **"General"**
2. Dans la section **"API Keys"**, vous trouverez votre **Public Key**
3. Notez cette clé (ex: `xYz-AbC123_dEf456`)

### 5. Configurer votre application

Ouvrez le fichier `.env.local` à la racine du projet et remplacez les valeurs :

```env
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY="votre_cle_publique_ici"
NEXT_PUBLIC_EMAILJS_SERVICE_ID="votre_service_id_ici"
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID="votre_template_id_ici"
```

**Important :** Après avoir modifié `.env.local`, **redémarrez votre serveur de développement** :
```bash
# Arrêtez le serveur (Ctrl+C) puis relancez :
npm run dev
```

### 6. Variables disponibles dans le template

Les variables suivantes sont envoyées depuis le formulaire :

| Variable | Description | Exemple |
|----------|-------------|---------|
| `{{plat_nom}}` | Nom du plat réservé | "Couscous royal" |
| `{{client_nom}}` | Nom du client | "Marie Dupont" |
| `{{client_email}}` | Email du client | "marie@example.com" |
| `{{client_telephone}}` | Téléphone du client | "06 12 34 56 78" |
| `{{quantite}}` | Nombre de plats | "2" |
| `{{date_retrait}}` | Date souhaitée | "2026-01-20" |
| `{{message}}` | Message optionnel | "Allergique aux arachides" |

### 7. Créer un template pour l'association (optionnel)

Pour recevoir une notification à chaque réservation, créez un second template :

**Subject:** 🍽️ Nouvelle réservation de plat

```
Une nouvelle réservation vient d'être effectuée !

CLIENT :
Nom : {{client_nom}}
Email : {{client_email}}
Téléphone : {{client_telephone}}

COMMANDE :
Plat : {{plat_nom}}
Quantité : {{quantite}}
Date de retrait souhaitée : {{date_retrait}}

Message du client :
{{message}}

---
Pensez à contacter le client pour confirmer !
```

Puis ajoutez un second appel `emailjs.send()` dans le code pour notifier l'association.

## 🧪 Tester l'envoi

1. Lancez votre application : `npm run dev`
2. Allez sur la page "Vente de plats"
3. Cliquez sur "Réserver ce plat"
4. Remplissez le formulaire avec un vrai email
5. Vérifiez votre boîte mail pour la confirmation

## 🔒 Sécurité

- La clé publique peut être visible dans le code (c'est normal)
- Ne partagez JAMAIS votre clé privée (Private Key)
- EmailJS gère automatiquement la protection anti-spam
- Limitez les envois si nécessaire dans les paramètres EmailJS

## 📊 Limites gratuites

- **200 emails/mois** (gratuit)
- Si vous dépassez, passez au plan payant ou contactez EmailJS

## 🆘 Problèmes courants

### "User ID is required"
→ Vérifiez que vous avez bien appelé `emailjs.init()` avec votre Public Key

### "Template not found"
→ Vérifiez que le Template ID est correct et que le template est bien sauvegardé

### "Service not found"
→ Vérifiez le Service ID et que le service email est bien connecté

### Les emails n'arrivent pas
→ Vérifiez vos spams/courrier indésirable
→ Vérifiez que le service email est bien configuré dans EmailJS

## 📞 Support

- Documentation EmailJS : [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
- Dashboard : [https://dashboard.emailjs.com/](https://dashboard.emailjs.com/)
