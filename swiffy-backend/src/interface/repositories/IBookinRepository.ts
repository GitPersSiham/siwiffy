import { Booking } from '../../domain/entities/Booking';
<<<<<<< HEAD
=======
import { BookingModel } from '../../infrastracture/db/models/BookingModel';
>>>>>>> 93f1cf1c6507a9321fb8bce8c590489e59179f21

export interface IBookingRepository {
  create(booking: Booking): Promise<Booking>;
  findByDate(date: Date): Promise<Booking[]>;
  findByUserId(userId: string): Promise<Booking[]>;
<<<<<<< HEAD
=======
  findByIdUser(id: string): Promise<Booking | null>;
>>>>>>> 93f1cf1c6507a9321fb8bce8c590489e59179f21
  findById(id: string): Promise<Booking | null>;
  update(booking: Booking): Promise<Booking | null>;
  findAll(): Promise<Booking[]>;
  delete(id: string): Promise<void>;
  findConflict(start: Date): Promise<boolean>;
  findAvailableSlotsAround(start: Date): Promise<{ start: Date; end: Date }[]>;
}
