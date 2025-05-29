import { Request, Response } from "express";
import { CancelBooking } from "../../../application/use-cases/CancelBooking";
<<<<<<< HEAD
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
=======
import { BookingRepositoryMongo } from "../../../infrastracture/db/repositories/BookingRepositoryMongo";


const bookingRepository = new BookingRepositoryMongo();
const cancelBookingUseCase = new CancelBooking(bookingRepository);

export const cancelBookingController = async (req: Request, res: Response) => {
  try {
    const bookingId = req.params.id;
    await cancelBookingUseCase.execute(bookingId);
    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
>>>>>>> 93f1cf1c6507a9321fb8bce8c590489e59179f21
  }
};
