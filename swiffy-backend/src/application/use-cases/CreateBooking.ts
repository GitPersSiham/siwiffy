// backend/src/application/use-cases/booking/create-booking.ts

import { Booking, BookingProps } from '../../domain/entities/Booking';
import { IBookingRepository } from '../../interface/repositories/IBookinRepository';
import { toZonedTime } from 'date-fns-tz';

export class CreateBooking {
  constructor(private readonly bookingRepository: IBookingRepository) {}

  private isValidWorkingHour(date: Date): boolean {
    // Convertir l'heure UTC en heure locale (Paris)
    const localTime = toZonedTime(date, 'Europe/Paris');
    const hour = localTime.getHours();
    console.log('Heure locale (Paris):', hour);
    return hour >= 8 && hour < 18;
  }

  async execute(bookingData: Omit<BookingProps, 'id' | 'createdAt'>): Promise<Booking> {
    console.log('CreateBooking - Données reçues:', {
      dateStart: bookingData.dateStart,
      dateEnd: bookingData.dateEnd,
      duration: bookingData.duration
    });

    // Créer des objets Date à partir des chaînes UTC reçues
    const startDateUTC = new Date(bookingData.dateStart);
    const endDateUTC = new Date(bookingData.dateEnd);

    // Calculer la durée réelle en heures
    const durationInHours = (endDateUTC.getTime() - startDateUTC.getTime()) / (1000 * 60 * 60);

    console.log('CreateBooking - Dates:', {
      startDate: startDateUTC.toISOString(),
      endDate: endDateUTC.toISOString(),
      durationCalculée: durationInHours,
      durationDemandée: bookingData.duration
    });

    // Vérifier l'heure de début
    if (!this.isValidWorkingHour(startDateUTC)) {
      throw new Error(`Les réservations ne sont possibles qu'entre 8h00 et 18h00 (heure de Paris). Heure de début: ${toZonedTime(startDateUTC, 'Europe/Paris').toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}`);
    }

    // Vérifier l'heure de fin
    if (!this.isValidWorkingHour(endDateUTC)) {
      throw new Error(`La réservation doit se terminer avant 18h00 (heure de Paris). Heure de fin: ${toZonedTime(endDateUTC, 'Europe/Paris').toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}`);
    }

    // Vérifier que la durée correspond
    if (Math.abs(durationInHours - bookingData.duration) > 0.01) {
      throw new Error(`La durée de la réservation (${durationInHours.toFixed(1)} heures) ne correspond pas à la durée spécifiée (${bookingData.duration} heures). Veuillez ajuster les dates de début et de fin.`);
    }

    // Vérification des conflits
    const hasConflict = await this.bookingRepository.findConflict(startDateUTC);
    if (hasConflict) {
      throw new Error('Il y a déjà une réservation pour cette période');
    }

    // Création de la réservation
    const bookingProps: BookingProps = {
      ...bookingData,
      dateStart: startDateUTC,
      dateEnd: endDateUTC,
      createdAt: new Date(),
      status: 'pending',
      id: '', // L'ID sera généré par Supabase
    };

    const booking = new Booking(bookingProps);

    console.log('CreateBooking - Réservation créée:', {
      id: booking.id,
      dateStart: booking.dateStart.toISOString(),
      dateEnd: booking.dateEnd.toISOString(),
      duration: booking.duration
    });

    return this.bookingRepository.create(booking);
  }
}