import { Request, Response } from 'express';
import { DeleteBooking } from '../../../application/use-cases/DeleteBooking';
import { BookingRepositorySupabase } from '../../../infrastracture/db/repositories/BookingRepositorySupabase';

const bookingRepository = new BookingRepositorySupabase();
const deleteBooking = new DeleteBooking(bookingRepository);

export const deleteBookingController = {
  async execute(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await deleteBooking.execute(id);
      res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}; 