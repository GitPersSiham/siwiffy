import { IBookingRepository } from '../../interface/repositories/IBookinRepository';
import { Booking } from '../../domain/entities/Booking';

export class FindBookingsByUserId {
  constructor(private bookingRepository: IBookingRepository) {}

  async execute(userId: string): Promise<Booking[]> {
    return this.bookingRepository.findByUserId(userId);
  }
} 