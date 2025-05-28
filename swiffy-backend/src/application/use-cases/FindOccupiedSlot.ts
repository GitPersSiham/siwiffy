import { IBookingRepository } from '../../interface/repositories/IBookinRepository';
import { Booking } from '../../domain/entities/Booking';

export class FindOccupiedSlot {
  constructor(private bookingRepository: IBookingRepository) {}

  async execute(): Promise<Booking[]> {
    return this.bookingRepository.findAll();
  }
} 