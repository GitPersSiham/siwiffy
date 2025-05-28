import mongoose, { Schema, Document } from 'mongoose';
import { Booking } from '../../../domain/entities/Booking';

export interface IBooking extends Document {
  userId: string;
  packageType: string;
  propertyType: string;
  date: Date;
  adress: string;
  duration: number;
  amount: number;
  status: string;
  createdAt: Date;
  dateStart: Date;
  dateEnd: Date;
  options: Record<string, boolean>;
}

const BookingSchema: Schema = new Schema({
  userId: { type: String, required: true },
  packageType: { type: String, required: true },
  propertyType: { type: String, required: true },
  date: { type: Date, required: true },
  adress: { type: String, required: true },
  duration: { type: Number, required: true },
  amount: { type: Number, required: true },
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  dateStart: { type: Date, required: true },
  dateEnd: { type: Date, required: true },
  options: { type: Map, of: Boolean, required: true }
});

export const BookingModel = mongoose.model<IBooking>('Booking', BookingSchema);
