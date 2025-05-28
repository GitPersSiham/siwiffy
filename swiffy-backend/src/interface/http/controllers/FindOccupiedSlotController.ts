import { Request, Response } from 'express';
import { BookingRepositoryMongo } from '../../../infrastracture/db/repositories/BookingRepositoryMongo';
import { Booking } from '../../../domain/entities/Booking';

const bookingRepository = new BookingRepositoryMongo();

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
        return res.status(400).json({ 
          success: false, 
          message: 'Le paramètre date est requis' 
        });
      }

      // Créer la date en UTC
      const targetDate = new Date(date as string);
      if (isNaN(targetDate.getTime())) {
        return res.status(400).json({ 
          success: false, 
          message: 'Format de date invalide' 
        });
      }

      // Ajuster la date pour le fuseau horaire de Paris
      targetDate.setHours(targetDate.getHours() + 2); // Ajustement pour Paris (UTC+2)

      // Récupérer les réservations existantes
      const bookings = await bookingRepository.findByDate(targetDate);
      
      // Générer tous les créneaux possibles
      const allSlots = this.generateTimeSlots(targetDate);
      
      // Convertir les réservations confirmées en créneaux occupés
      const occupiedSlots = bookings
        .filter(booking => booking.status === 'confirmed' || booking.status === 'pending')
        .map(booking => {
          // S'assurer que les dates sont en UTC
          const start = new Date(booking.dateStart);
          const end = new Date(booking.dateEnd);
          
          console.log('Processing booking:', {
            id: booking.id,
            status: booking.status,
            originalStart: booking.dateStart,
            originalEnd: booking.dateEnd,
            convertedStart: start.toISOString(),
            convertedEnd: end.toISOString(),
            localStart: start.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
            localEnd: end.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })
          });

          return {
            start,
            end
          };
        });

      // Formater la réponse avec les créneaux occupés
      const formattedSlots = occupiedSlots.map(slot => {
        const localStart = new Date(slot.start);
        const localEnd = new Date(slot.end);

        return {
          start: slot.start.toISOString(),
          end: slot.end.toISOString(),
          time: localStart.toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit',
            timeZone: 'Europe/Paris'
          })
        };
      });

      console.log('Sending response:', {
        date: targetDate.toLocaleDateString('fr-FR'),
        occupiedSlots: formattedSlots.map(slot => ({
          start: slot.start,
          end: slot.end,
          time: slot.time,
          localStart: new Date(slot.start).toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
          localEnd: new Date(slot.end).toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })
        }))
      });

      res.status(200).json({ 
        success: true, 
        date: targetDate.toLocaleDateString('fr-FR'),
        occupiedSlots: formattedSlots,
        totalOccupied: formattedSlots.length
      });
    } catch (error: any) {
      console.error('Error in findOccupiedSlotController:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur lors de la recherche des créneaux disponibles' 
      });
    }
  }
}

export const findOccupiedSlotController = new FindOccupiedSlotController(); 