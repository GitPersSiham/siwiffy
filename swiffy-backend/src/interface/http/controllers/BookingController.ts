import { Request, Response } from 'express';
import { CreateBooking } from '../../../application/use-cases/CreateBooking';
<<<<<<< HEAD
import { BookingRepositorySupabase } from '../../../infrastracture/db/repositories/BookingRepositorySupabase';

const bookingRepository = new BookingRepositorySupabase();
const createBooking = new CreateBooking(bookingRepository);

export const bookingController = {
  async execute(req: Request, res: Response) {
    try {
      const booking = await createBooking.execute(req.body);
      res.status(201).json(booking);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
};
=======
import { BookingRepositoryMongo } from '../../../infrastracture/db/repositories/BookingRepositoryMongo';

const bookingRepository = new BookingRepositoryMongo();

class BookingController {
  private createBookingUseCase: CreateBooking;

  constructor() {
    this.createBookingUseCase = new CreateBooking(bookingRepository);
    this.execute = this.execute.bind(this);
  }

  async execute(req: Request, res: Response) {
    try {
      const booking = await this.createBookingUseCase.execute(req.body);
      res.status(201).json(booking);
    } catch (error: any) {
      console.error('Error creating booking:', error);
      
      // Gestion spécifique des erreurs
      if (error.message.includes('déjà une réservation') || error.message.includes('déjà réservé')) {
        return res.status(409).json({ 
          message: error.message,
          error: 'CONFLICT'
        });
      }
      
      if (error.message.includes('horaires doivent être entre') || 
          error.message.includes('ne sont possibles qu\'entre') ||
          error.message.includes('doit se terminer avant')) {
        return res.status(400).json({ 
          message: error.message,
          error: 'INVALID_TIME'
        });
      }

      if (error.message.includes('durée de la réservation')) {
        return res.status(400).json({ 
          message: error.message,
          error: 'INVALID_DURATION'
        });
      }

      res.status(500).json({ 
        message: 'Error creating booking',
        error: 'INTERNAL_ERROR'
      });
    }
  }
}

export const bookingController = new BookingController();
>>>>>>> 93f1cf1c6507a9321fb8bce8c590489e59179f21
