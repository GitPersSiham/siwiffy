import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import cors from 'cors';
import bookingRoutes from './interface/http/routes/booking.routes';
import userRoutes from './interface/http/routes/userRoute';

import { connectToDatabase } from './infrastracture/db/mongo';
import mongoose from 'mongoose';
import authRoutes from './interface/http/routes/authRoutes';
import calendarRoutes from './interface/http/routes/caldendarRoutes';

import packageRoutes from './interface/http/routes/packages';
import { paymentRoutes } from './interface/http/routes/paymentRoutes';

const app = express();
app.use(cors());
app.use(express.json());

// Connexion à la base de données
connectToDatabase();

// Routes
app.use('/api/bookings', bookingRoutes);
app.use('/api', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/packages', packageRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB is connected');
});
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});
