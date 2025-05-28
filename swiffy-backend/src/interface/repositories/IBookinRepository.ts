import { Booking } from '../../domain/entities/Booking';
import { BookingModel } from '../../infrastracture/db/models/BookingModel';

export interface IBookingRepository {
  create(booking: Booking): Promise<Booking>;
  findByDate(date: Date): Promise<Booking[]>;
  findByUserId(userId: string): Promise<Booking[]>;
  findByIdUser(id: string): Promise<Booking | null>;
  findById(id: string): Promise<Booking | null>;
  update(booking: Booking): Promise<Booking | null>;
  findAll(): Promise<Booking[]>;
  delete(id: string): Promise<void>;
  findConflict(start: Date): Promise<boolean>;
  findAvailableSlotsAround(start: Date): Promise<{ start: Date; end: Date }[]>;
}
