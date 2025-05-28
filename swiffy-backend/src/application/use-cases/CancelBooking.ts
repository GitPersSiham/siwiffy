import { Booking } from "../../domain/entities/Booking";
import { IBookingRepository } from "../../interface/repositories/IBookinRepository";


export class CancelBooking {
  constructor(private bookingRepository: IBookingRepository) {}

  async execute(id: string): Promise<void> {
    const booking = await this.bookingRepository.findById(id);

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.status === "cancelled") {
      throw new Error("Booking already cancelled");
    }

   
    booking.status = 'cancelled' ;
    await this.bookingRepository.delete(id);
  }

}
