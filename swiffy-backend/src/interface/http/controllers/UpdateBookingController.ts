import { Request, Response } from 'express';

import { BookingRepositorySupabase } from '../../../infrastracture/db/repositories/BookingRepositorySupabase';
import { UpdateBooking } from '../../../application/use-cases/updateBooking';

const bookingRepository = new BookingRepositorySupabase();
const updateBooking = new UpdateBooking(bookingRepository);

export const updateBookingController = {
  async execute(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const booking = await updateBooking.execute(id, req.body);
      res.status(200).json(booking);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
};
