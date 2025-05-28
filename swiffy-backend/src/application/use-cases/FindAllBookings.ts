import { IBookingRepository } from '../../interface/repositories/IBookinRepository';
import { Booking } from '../../domain/entities/Booking';

export class FindAllBookings {
  constructor(private bookingRepository: IBookingRepository) {}

  async execute(): Promise<Booking[]> {
    return this.bookingRepository.findAll();
  }
} 