import { Router, RequestHandler } from 'express';
import { bookingController } from '../controllers/BookingController';
import { cancelBookingController } from '../controllers/CancelBookingController';
import { updateBookingController } from '../controllers/UpdateBookingController';
import { findBookingController } from '../controllers/FindBookingController';
import { deleteBookingController } from '../controllers/DeleteBookingController';
import { findOccupiedSlotController } from '../controllers/FindOccupiedSlotController';

const router = Router();

// Route pour créer une réservation
router.post('/', bookingController.execute as RequestHandler);

// Route pour récupérer toutes les réservations
router.get('/', findBookingController.findAll as RequestHandler);

// Route pour récupérer les réservations d'un utilisateur
router.get('/user/:userId', findBookingController.findByUserId as RequestHandler);

// Route pour récupérer une réservation spécifique
router.get('/:id', findBookingController.execute as RequestHandler);

// Route pour mettre à jour une réservation
router.put('/:id', updateBookingController.execute as RequestHandler);

// Route pour supprimer une réservation
router.delete('/:id', deleteBookingController.execute as RequestHandler);

// Route pour annuler une réservation
router.post('/:id/cancel', cancelBookingController.execute as RequestHandler);

// Route pour récupérer les créneaux occupés
router.get('/slots/occupied', findOccupiedSlotController.execute as RequestHandler);

export default router;
