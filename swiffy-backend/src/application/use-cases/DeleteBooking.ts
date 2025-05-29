import { IBookingRepository } from '../../interface/repositories/IBookinRepository';

export class DeleteBooking {
  constructor(private bookingRepository: IBookingRepository) {}

  async execute(id: string): Promise<void> {
    await this.bookingRepository.delete(id);
  }
} 