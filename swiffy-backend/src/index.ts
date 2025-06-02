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
app.use(cors({
  origin: [
    'https://swiffy-r5ddrm79j-lahoualisiham91-gmailcoms-projects.vercel.app',
    'http://localhost:5173' // Pour le développement local
  ],
  credentials: true
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
