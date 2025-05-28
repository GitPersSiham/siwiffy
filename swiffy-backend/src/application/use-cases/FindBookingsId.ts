import { IBookingRepository } from '../../interface/repositories/IBookinRepository';
import { Booking } from '../../domain/entities/Booking';

export class FindBookingsId {
  constructor(private bookingRepository: IBookingRepository) {}

  async execute(id: string): Promise<Booking | null> {
    return this.bookingRepository.findById(id);
  }
} 