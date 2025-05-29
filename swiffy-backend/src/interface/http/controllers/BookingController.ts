import { Request, Response } from 'express';
import { CreateBooking } from '../../../application/use-cases/CreateBooking';
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
