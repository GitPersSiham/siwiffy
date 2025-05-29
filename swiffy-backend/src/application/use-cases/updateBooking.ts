import { IBookingRepository } from '../../interface/repositories/IBookinRepository';
import { Booking } from '../../domain/entities/Booking';

export class UpdateBooking {
  constructor(private bookingRepository: IBookingRepository) {}

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
  }
}

