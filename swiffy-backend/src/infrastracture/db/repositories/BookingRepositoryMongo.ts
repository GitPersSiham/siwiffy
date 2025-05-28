import mongoose, { Types } from 'mongoose';
import { Booking } from '../../../domain/entities/Booking';
import { IBookingRepository } from '../../../interface/repositories/IBookinRepository';
import { BookingModel, IBooking } from '../models/BookingModel';
import { toZonedTime, format } from 'date-fns-tz';

import { User } from '../../../domain/entities/User';

export class BookingRepositoryMongo implements IBookingRepository {
  private readonly TIMEZONE = 'Europe/Paris';
  private readonly OPENING_HOUR = 8;
  private readonly CLOSING_HOUR = 18;

  private convertToLocalTime(date: Date): Date {
    return toZonedTime(date, this.TIMEZONE);
  }

  private convertToUTC(date: Date): Date {
    const localDate = new Date(date);
    const utcDate = new Date(localDate.getTime() - (localDate.getTimezoneOffset() * 60000));
    return utcDate;
  }

  private isValidBusinessHour(date: Date): boolean {
    const localTime = this.convertToLocalTime(date);
    const hour = localTime.getHours();
    const minutes = localTime.getMinutes();
    
    // Convertir en minutes depuis minuit pour une comparaison plus précise
    const timeInMinutes = hour * 60 + minutes;
    const openingTimeInMinutes = this.OPENING_HOUR * 60;
    const closingTimeInMinutes = this.CLOSING_HOUR * 60;
    
    return timeInMinutes >= openingTimeInMinutes && timeInMinutes < closingTimeInMinutes;
  }

  private validateBookingTimes(dateStart: Date, dateEnd: Date): void {
    if (!this.isValidBusinessHour(dateStart) || !this.isValidBusinessHour(dateEnd)) {
      throw new Error(`Les horaires doivent être entre ${this.OPENING_HOUR}h00 et ${this.CLOSING_HOUR}h00 (heure de Paris)`);
    }
  }

  private mapBookingToEntity(booking: IBooking): Booking {
    return new Booking({
      id: booking.id.toString(),
      userId: booking.userId,
      packageType: booking.packageType,
      propertyType: booking.propertyType,
      date: booking.date,
      adress: booking.adress,
      duration: booking.duration,
      amount: booking.amount,
      status: booking.status,
      createdAt: booking.createdAt,
      dateStart: booking.dateStart,
      dateEnd: booking.dateEnd,
      options: booking.options
    });
  }

  async findById(id: string): Promise<Booking | null> {
    try {
      const booking = await BookingModel.findById(id).exec();
      if (!booking) return null;
      return this.mapBookingToEntity(booking);
    } catch (error) {
      console.error('Erreur lors de la recherche de la réservation:', error);
      return null;
    }
  }

  async create(booking: Booking): Promise<Booking> {
    try {
      // Validation des horaires en heure locale
      this.validateBookingTimes(booking.dateStart, booking.dateEnd);

      // Vérifier s'il y a un conflit de réservation
      const hasConflict = await this.findConflict(booking.dateStart);
      if (hasConflict) {
        throw new Error('Ce créneau horaire est déjà réservé. Veuillez choisir un autre horaire.');
      }

      console.log('Création de réservation avec les dates:', {
        dateStart: booking.dateStart.toISOString(),
        dateEnd: booking.dateEnd.toISOString()
      });

      const bookingDoc = new BookingModel({
        userId: booking.userId,
        packageType: booking.packageType,
        propertyType: booking.propertyType,
        date: booking.date,
        adress: booking.adress,
        duration: booking.duration,
        amount: booking.amount,
        status: booking.status,
        createdAt: booking.createdAt,
        dateStart: booking.dateStart,
        dateEnd: booking.dateEnd,
        options: booking.options
      });

      const savedBooking = await bookingDoc.save();
      console.log('Réservation créée avec succès:', {
        id: savedBooking._id,
        dateStart: savedBooking.dateStart.toISOString(),
        dateEnd: savedBooking.dateEnd.toISOString()
      });

      return this.mapBookingToEntity(savedBooking);
    } catch (error) {
      console.error('Erreur lors de la création de la réservation:', error);
      throw error;
    }
  }

  async findByDate(date: Date): Promise<Booking[]> {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      console.log('Searching bookings between:', {
        start: startOfDay.toISOString(),
        end: endOfDay.toISOString()
      });

      const bookings = await BookingModel.find({
        dateStart: { $gte: startOfDay, $lte: endOfDay }
      }).exec();

      return bookings.map(booking => this.mapBookingToEntity(booking));
    } catch (error) {
      console.error('Erreur lors de la recherche des réservations par date:', error);
      return [];
    }
  }

  async findByUserId(userId: string): Promise<Booking[]> {
    try {
      console.log('Recherche des réservations pour userId:', userId);
      
      // Vérifier si l'ID est valide
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.error('ID utilisateur invalide:', userId);
        return [];
      }

      const bookings = await BookingModel.find({ 
        userId: new mongoose.Types.ObjectId(userId) 
      }).sort({ dateStart: -1 }).exec();

      console.log('Réservations trouvées:', bookings.length);
      bookings.forEach(booking => {
        console.log('Réservation:', {
          id: booking._id,
          dateStart: booking.dateStart.toISOString(),
          dateEnd: booking.dateEnd.toISOString(),
          packageType: booking.packageType,
          propertyType: booking.propertyType,
          adress: booking.adress,
          amount: booking.amount,
          options: booking.options
        });
      });

      return bookings.map(booking => this.mapBookingToEntity(booking));
    } catch (error) {
      console.error('Erreur lors de la recherche des réservations par utilisateur:', error);
      return [];
    }
  }

  async findByIdUser(id: string): Promise<Booking | null> {
    try {
      const booking = await BookingModel.findById(id).exec();
      if (!booking) return null;
      return this.mapBookingToEntity(booking);
    } catch (error) {
      console.error('Erreur lors de la recherche de la réservation:', error);
      return null;
    }
  }

  async update(booking: Booking): Promise<Booking | null> {
    try {
      // Validation des horaires en heure locale
      this.validateBookingTimes(booking.dateStart, booking.dateEnd);

      const updatedBooking = await BookingModel.findByIdAndUpdate(
        booking.id,
        {
          userId: new mongoose.Types.ObjectId(booking.userId),
          packageType: booking.packageType,
          propertyType: booking.propertyType,
          date: booking.date,
          adress: booking.adress,
          duration: booking.duration,
          amount: booking.amount,
          status: booking.status,
          dateStart: booking.dateStart,
          dateEnd: booking.dateEnd,
          options: booking.options
        },
        { new: true }
      ).exec();

      if (!updatedBooking) return null;
      return this.mapBookingToEntity(updatedBooking);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la réservation:', error);
      return null;
    }
  }

  async findAll(): Promise<Booking[]> {
    try {
      const bookings = await BookingModel.find().exec();
      return bookings.map(booking => this.mapBookingToEntity(booking));
    } catch (error) {
      console.error('Erreur lors de la récupération des réservations:', error);
      return [];
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await BookingModel.findByIdAndDelete(id).exec();
    } catch (error) {
      console.error('Erreur lors de la suppression de la réservation:', error);
      throw error;
    }
  }

  async findConflict(start: Date): Promise<boolean> {
    try {
      // Calculer la fin du créneau (1 heure après le début)
      const end = new Date(start);
      end.setHours(end.getHours() + 1);

      const conflict = await BookingModel.findOne({
        $or: [
          // Vérifie si le nouveau créneau chevauche un créneau existant
          {
            $and: [
              { dateStart: { $lte: end } },
              { dateEnd: { $gte: start } }
            ]
          }
        ]
      }).exec();

      return !!conflict;
    } catch (error) {
      console.error('Erreur lors de la recherche de conflit:', error);
      return false;
    }
  }

  async findAvailableSlotsAround(start: Date): Promise<{ start: Date; end: Date }[]> {
    try {
      const end = new Date(start);
      end.setHours(end.getHours() + 1);

      // Convertir les dates de recherche en UTC
      const utcStart = this.convertToUTC(start);
      const utcEnd = this.convertToUTC(end);

      const conflicts = await BookingModel.find({
        $or: [
          { dateStart: { $lt: utcEnd, $gt: utcStart } },
          { dateEnd: { $lt: utcEnd, $gt: utcStart } }
        ]
      }).exec();

      const slots: { start: Date; end: Date }[] = [];
      let currentStart = new Date(start);
      currentStart.setHours(this.OPENING_HOUR, 0, 0, 0);
      const dayEnd = new Date(start);
      dayEnd.setHours(this.CLOSING_HOUR, 0, 0, 0);

      while (currentStart < dayEnd) {
        const currentEnd = new Date(currentStart);
        currentEnd.setHours(currentEnd.getHours() + 1);

        const hasConflict = conflicts.some(conflict => {
          const conflictStart = this.convertToLocalTime(conflict.dateStart);
          const conflictEnd = this.convertToLocalTime(conflict.dateEnd);
          return (
            (currentStart >= conflictStart && currentStart < conflictEnd) ||
            (currentEnd > conflictStart && currentEnd <= conflictEnd)
          );
        });

        if (!hasConflict) {
          slots.push({ 
            start: this.convertToLocalTime(new Date(currentStart)), 
            end: this.convertToLocalTime(new Date(currentEnd))
          });
        }

        currentStart.setHours(currentStart.getHours() + 1);
      }

      return slots;
    } catch (error) {
      console.error('Erreur lors de la recherche des créneaux disponibles:', error);
      return [];
    }
  }
}
