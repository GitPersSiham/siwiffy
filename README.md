# 🧼 Swiffy – Plateforme de réservation de ménage à domicile

Swiffy est une application web permettant aux particuliers de réserver des prestations de ménage à domicile, selon des forfaits, types de logement, créneaux horaires, et avec paiement sécurisé en ligne.

---

## 🚀 Fonctionnalités principales

- Choix d’un **forfait** (Simple, Confort, Suprême, Mensuel)
- Sélection du **type de logement** (Studio, T1, T2, T3, T4)
- **Calendrier dynamique** avec gestion intelligente des créneaux (UTC / heure locale)
- **Synchronisation Google Calendar**
- Paiement sécurisé via **Stripe**
- Gestion des **annulations jusqu'à 3h avant**
- Envoi automatique d’**e-mails de confirmation**

---

## 🛠️ Stack technique

### 🔹 Frontend

- **React.js** avec **Vite**
- **TypeScript**
- **Tailwind CSS** pour le design responsive
- **date-fns-tz** pour la gestion des fuseaux horaires

### 🔹 Backend

- **Node.js** avec **Express**
- **TypeScript**
- **Supabase** comme base de données (PostgreSQL + API)
- **Google Calendar API** pour synchronisation des rendez-vous
- **Stripe API** pour la gestion des paiements

---

## 🗃️ Lancement 
🔹 Backend
cd backend
npm install
npm run start

🔹 Frontend
cd frontend
npm install
npm run dev


🌐 Déploiement
✅ Frontend : déployé sur Vercel
Branche déployée : master

Commandes Vercel :

Build command : npm run build

Output directory : dist

✅ Backend : à héberger séparément (Render, Railway, Supabase Functions...)

🔐 Variables d'environnement

🔹 .env du frontend

VITE_STRIPE_PUBLIC_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxx

VITE_API_URL=http://localhost:5000

VITE_SUPABASE_URL=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  

VITE_SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxxxxxxxxxxx

🔹 .env du backend

PORT=5000

JWT_SECRET="une_chaine_ultra_secret"

STRIPE_SECRET_KEY=xxxxxxxxxxxxxxxxxxxxx

CLIENT_URL=http://localhost:5173

SUPABASE_URL=https://xxxxxxxxxxxxxx.supabase.co

SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

SUPABASE_SERVICE_ROLE_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx


🧪 TODO (améliorations futures)

Interface admin pour voir toutes les réservations

Système de notifications SMS

Facturation PDF automatique

Application mobile (React Native ?)


