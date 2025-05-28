import { Request, Response } from 'express';
import { BookingRepositoryMongo } from '../../../infrastracture/db/repositories/BookingRepositoryMongo';

const bookingRepository = new BookingRepositoryMongo();

export const updateBookingController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Trouver la réservation existante
    const booking = await bookingRepository.findByIdUser(id);
    if (!booking) {
      res.status(404).json({ error: 'Réservation non trouvée' });
      return;
    }

    // Mettre à jour uniquement les champs fournis
    if (updateData.status) {
      booking.status = updateData.status;
    }
    if (updateData.packageType) booking.packageType = updateData.packageType;
    if (updateData.propertyType) booking.propertyType = updateData.propertyType;
    if (updateData.dateStart) booking.dateStart = new Date(updateData.dateStart);
    if (updateData.dateEnd) booking.dateEnd = new Date(updateData.dateEnd);
    if (updateData.duration) booking.duration = updateData.duration;
    if (updateData.adress) booking.adress = updateData.adress;
    if (updateData.amount) booking.amount = updateData.amount;
    if (updateData.options) booking.options = updateData.options;

    // Utiliser le repository pour effectuer la mise à jour dans la base de données
    const updatedBooking = await bookingRepository.update(booking);
    
    if (!updatedBooking) {
      res.status(500).json({ error: 'Erreur lors de la mise à jour de la réservation' });
      return;
    }

    // Retourner la réservation mise à jour
    res.status(200).json(updatedBooking);
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour de la réservation:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};
