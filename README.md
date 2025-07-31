# 🧼 Swiffy – Plateforme de réservation de ménage à domicile

Swiffy est une application web permettant aux particuliers de réserver des prestations de ménage à domicile, selon des forfaits, types de logement, créneaux horaires, et avec paiement sécurisé en ligne.

---

## 🚀 Fonctionnalités principales

- Choix d’un **forfait** (Simple, Confort, Suprême, Mensuel)
- Sélection du **type de logement** (Studio, T1, T2, T3, T4)
- **Calendrier dynamique** avec gestion intelligente des créneaux (UTC / heure locale)
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


✅ Déploiement
🔹 Frontend (hébergé sur Vercel)
Branche déployée : master

Build command : npm run build

Output directory : dist

URL locale : http://localhost:5173

🔹 Backend (hébergé séparément : Render, Railway, etc.)
Port par défaut : 5000

URL locale : http://localhost:5000

⚠️ Doit autoriser les CORS depuis le frontend via CLIENT_URL

🔐 Variables d’environnement.

🔹 .env – Frontend 

- VITE_API_URL=http://localhost:5000
- VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxx
- VITE_SUPABASE_URL=https://xxxxxxxxxxxxxxxx.supabase.co
- VITE_SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.
 
🔹 .env – Backend 

- PORT=5000
- CLIENT_URL=http://localhost:5173
- JWT_SECRET="une_chaine_ultra_secrète"
- STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
- SUPABASE_URL=https://xxxxxxxxxxxxxxxx.supabase.co
- SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
- SUPABASE_SERVICE_ROLE_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.

🧪 Améliorations prévues (Roadmap)

🛠️ Interface admin : affichage, filtrage et modification des réservations

📩 Notifications SMS : rappel automatique des créneaux par SMS (ex. via Twilio)

📄 Facturation PDF : génération automatique d’une facture téléchargeable

📱 Application mobile : version React Native pour Android & iOS

🔄 Synchronisation bidirectionnelle Google Calendar : modifications visibles en temps réel
