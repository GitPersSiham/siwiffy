import { Request, Response } from 'express';
import { BookingRepositorySupabase } from '../../../infrastracture/db/repositories/BookingRepositorySupabase';
import { Booking } from '../../../domain/entities/Booking';

const bookingRepository = new BookingRepositorySupabase();

class FindOccupiedSlotController {
  private readonly OPENING_HOUR = 8;
  private readonly CLOSING_HOUR = 18;

  constructor() {
    this.execute = this.execute.bind(this);
    this.generateTimeSlots = this.generateTimeSlots.bind(this);
  }

  private generateTimeSlots(date: Date): { start: Date; end: Date }[] {
    const slots: { start: Date; end: Date }[] = [];
    const currentDate = new Date(date);
    currentDate.setHours(this.OPENING_HOUR, 0, 0, 0);

    while (currentDate.getHours() < this.CLOSING_HOUR) {
      const slotStart = new Date(currentDate);
      const slotEnd = new Date(currentDate);
      slotEnd.setHours(slotEnd.getHours() + 1);
      
      slots.push({ start: new Date(slotStart), end: new Date(slotEnd) });
      currentDate.setHours(currentDate.getHours() + 1);
    }

    return slots;
  }

  async execute(req: Request, res: Response) {
    try {
      const { date } = req.query;
      
      if (!date) {
        return res.status(400).json({ error: 'Date is required' });
      }

      const searchDate = new Date(date as string);
      console.log('Finding occupied slots for date:', {
        inputDate: date,
        parsedDate: searchDate.toISOString(),
        localDate: searchDate.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })
      });

      // Récupérer toutes les réservations pour la date
      const bookings = await bookingRepository.findByDate(searchDate);
      console.log('Found bookings:', bookings.map(booking => ({
        id: booking.id,
        userId: booking.userId,
        dateStart: booking.dateStart.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
        dateEnd: booking.dateEnd.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
        status: booking.status
      })));
      
      // Filtrer les réservations confirmées ou en attente
      const occupiedSlots = bookings
        .filter((booking: Booking) => {
          const isValid = booking.status === 'confirmed' || booking.status === 'pending';
          console.log('Booking status check:', {
            id: booking.id,
            status: booking.status,
            isValid
          });
          return isValid;
        })
        .map((booking: Booking) => {
          console.log('Processing booking:', {
            id: booking.id,
            start: booking.dateStart.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
            end: booking.dateEnd.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
            status: booking.status
          });
          return {
            start: booking.dateStart,
            end: booking.dateEnd,
            status: booking.status
          };
        });

      console.log('Occupied slots:', occupiedSlots.map(slot => ({
        start: slot.start.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
        end: slot.end.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
        status: slot.status
      })));

      const formattedSlots = occupiedSlots.map((slot: { start: Date; end: Date; status: string }) => {
        const formattedSlot = {
          start: slot.start.toISOString(),
          end: slot.end.toISOString(),
          status: slot.status
        };
        console.log('Formatted slot:', {
          ...formattedSlot,
          localStart: slot.start.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
          localEnd: slot.end.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })
        });
        return formattedSlot;
      });

      console.log('Sending response with slots:', formattedSlots);

      res.status(200).json({
        date: date,
        occupiedSlots: formattedSlots
      });
    } catch (error: any) {
      console.error('Error in FindOccupiedSlotController:', error);
      res.status(400).json({ error: error.message });
    }
  }
}

export const findOccupiedSlotController = new FindOccupiedSlotController(); 