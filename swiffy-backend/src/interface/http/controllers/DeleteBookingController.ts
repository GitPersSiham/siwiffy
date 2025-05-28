import { Request, Response } from 'express';
import { CancelBooking } from '../../../application/use-cases/CancelBooking';
import { BookingRepositoryMongo } from '../../../infrastracture/db/repositories/BookingRepositoryMongo';

const bookingRepository = new BookingRepositoryMongo();

class DeleteBookingController {
  private deleteBookingUseCase: CancelBooking;

  constructor() {
    this.deleteBookingUseCase = new CancelBooking(bookingRepository);
    this.execute = this.execute.bind(this);
  }

  async execute(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.deleteBookingUseCase.execute(id);
      res.status(200).json({ 
        message: 'Réservation supprimée avec succès',
        id: id
      });
    } catch (error: any) {
      console.error('Error deleting booking:', error);
      if (error?.message?.includes('not found')) {
        return res.status(404).json({ 
          message: 'Réservation non trouvée',
          error: 'NOT_FOUND'
        });
      }
      res.status(500).json({ 
        message: 'Erreur lors de la suppression de la réservation',
        error: 'INTERNAL_ERROR'
      });
    }
  }
}

export const deleteBookingController = new DeleteBookingController(); 