import { Request, Response } from "express";
import { CancelBooking } from "../../../application/use-cases/CancelBooking";
import { BookingRepositorySupabase } from "../../../infrastracture/db/repositories/BookingRepositorySupabase";

const bookingRepository = new BookingRepositorySupabase();
const cancelBooking = new CancelBooking(bookingRepository);

export const cancelBookingController = {
  async execute(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const booking = await cancelBooking.execute(id);
      res.status(200).json(booking);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
};
