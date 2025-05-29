import { Request, Response } from 'express';
import { FindBooking } from '../../../application/use-cases/FindBooking';
import { FindAllBookings } from '../../../application/use-cases/FindAllBookings';
import { FindBookingsByUserId } from '../../../application/use-cases/FindBookingsByUserId';
import { BookingRepositorySupabase } from '../../../infrastracture/db/repositories/BookingRepositorySupabase';

const bookingRepository = new BookingRepositorySupabase();
const findBooking = new FindBooking(bookingRepository);
const findAllBookings = new FindAllBookings(bookingRepository);
const findBookingsByUserId = new FindBookingsByUserId(bookingRepository);

export const findBookingController = {
  async execute(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const booking = await findBooking.execute(id);
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      res.status(200).json(booking);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async findAll(req: Request, res: Response) {
    try {
      const bookings = await findAllBookings.execute();
      res.status(200).json(bookings);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async findByUserId(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const bookings = await findBookingsByUserId.execute(userId);
      res.status(200).json(bookings);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}; 
