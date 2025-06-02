import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import cors from 'cors';
import bookingRoutes from './interface/http/routes/booking.routes';
import userRoutes from './interface/http/routes/userRoute';
import authRoutes from './interface/http/routes/authRoutes';
import packageRoutes from './interface/http/routes/packages';
import { paymentRoutes } from './interface/http/routes/paymentRoutes';
import { SupabaseService } from './infrastracture/services/supabaseService';

const app = express();

// Configuration CORS
const allowedOrigins = [
  'https://siwiffy-app-new-ras6.vercel.app',
];

// Fonction dynamique pour autoriser toutes les previews
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // autorise les outils locaux
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());

// Initialisation de Supabase
const supabaseService = new SupabaseService();
console.log('✅ Supabase service initialized');

// Routes
app.use('/api/bookings', bookingRoutes);
app.use('/api', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/packages', packageRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
