import { Request, Response } from "express";
import { CancelBooking } from "../../../application/use-cases/CancelBooking";
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
  }
};
