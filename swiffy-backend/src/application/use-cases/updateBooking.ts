import { Booking, BookingStatus } from "../../domain/entities/Booking";
import { IBookingRepository } from "../../interface/repositories/IBookinRepository";

export class UpdateBooking {
  constructor(private bookingRepository: IBookingRepository) {}

  async execute(input: { id: string; status: BookingStatus }): Promise<void> {
    const booking = await this.bookingRepository.findByIdUser(input.id);

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.status === "cancelled") {
      throw new Error("Booking already cancelled");
    }

    booking.status = 'cancelled';
    await this.bookingRepository.update(booking);
  }
}

