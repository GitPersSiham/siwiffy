<<<<<<< HEAD
import { IBookingRepository } from '../../interface/repositories/IBookinRepository';
import { Booking } from '../../domain/entities/Booking';
=======
import { Booking, BookingStatus } from "../../domain/entities/Booking";
import { IBookingRepository } from "../../interface/repositories/IBookinRepository";
>>>>>>> 93f1cf1c6507a9321fb8bce8c590489e59179f21

export class UpdateBooking {
  constructor(private bookingRepository: IBookingRepository) {}

<<<<<<< HEAD
  async execute(id: string, updateData: Partial<Booking>): Promise<Booking | null> {
    const booking = await this.bookingRepository.findById(id);
    if (!booking) {
      throw new Error('Booking not found');
    }

    const updatedBooking = new Booking({
      ...booking,
      ...updateData
    });

    return this.bookingRepository.update(updatedBooking);
=======
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
>>>>>>> 93f1cf1c6507a9321fb8bce8c590489e59179f21
  }
}

