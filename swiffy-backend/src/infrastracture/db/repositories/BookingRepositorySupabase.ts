import { Booking } from '../../../domain/entities/Booking';
import { IBookingRepository } from '../../../interface/repositories/IBookinRepository';
import { SupabaseService } from '../../services/supabaseService';
import { toZonedTime } from 'date-fns-tz';

export class BookingRepositorySupabase implements IBookingRepository {
  private readonly TIMEZONE = 'Europe/Paris';
  private readonly OPENING_HOUR = 8;
  private readonly CLOSING_HOUR = 18;
  private supabase;

  constructor() {
    const supabaseService = new SupabaseService();
    this.supabase = supabaseService.getClient();
  }

  private convertToLocalTime(date: Date): Date {
    return toZonedTime(date, this.TIMEZONE);
  }

  private isValidBusinessHour(date: Date): boolean {
    const localTime = this.convertToLocalTime(date);
    const hour = localTime.getHours();
    const minutes = localTime.getMinutes();
    
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

  private mapBookingToEntity(booking: any): Booking {
    console.log('Mapping booking from database:', {
      id: booking.id,
      date_start: booking.date_start,
      date_end: booking.date_end,
      raw_start: new Date(booking.date_start).toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
      raw_end: new Date(booking.date_end).toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })
    });

    // Créer les dates en UTC
    const dateStart = new Date(booking.date_start);
    const dateEnd = new Date(booking.date_end);

    // Ajouter 2 heures pour afficher en heure locale
    dateStart.setHours(dateStart.getHours() + 2);
    dateEnd.setHours(dateEnd.getHours() + 2);

    console.log('Date conversion:', {
      original: {
        start: booking.date_start,
        end: booking.date_end
      },
      local: {
        start: dateStart.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
        end: dateEnd.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })
      }
    });

    return new Booking({
      id: booking.id,
      userId: booking.user_id,
      packageType: booking.package_type,
      propertyType: booking.property_type,
      date: new Date(booking.date),
      adress: booking.adress,
      duration: booking.duration,
      amount: booking.amount,
      status: booking.status,
      createdAt: new Date(booking.created_at),
      dateStart: dateStart,
      dateEnd: dateEnd,
      options: booking.options
    });
  }

  async findById(id: string): Promise<Booking | null> {
    try {
      const { data, error } = await this.supabase
        .from('bookings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return null;

      return this.mapBookingToEntity(data);
    } catch (error) {
      console.error('Erreur lors de la recherche de la réservation:', error);
      return null;
    }
  }

  async create(booking: Booking): Promise<Booking> {
    try {
      this.validateBookingTimes(booking.dateStart, booking.dateEnd);

      const hasConflict = await this.findConflict(booking.dateStart);
      if (hasConflict) {
        throw new Error('Ce créneau horaire est déjà réservé. Veuillez choisir un autre horaire.');
      }

      // Ajuster les dates pour qu'elles correspondent à l'heure locale souhaitée
      const localDateStart = new Date(booking.dateStart);
      const localDateEnd = new Date(booking.dateEnd);

      // Soustraire 2 heures pour compenser le décalage UTC
      localDateStart.setHours(localDateStart.getHours() - 2);
      localDateEnd.setHours(localDateEnd.getHours() - 2);

      console.log('Creating booking with time conversion:', {
        original: {
          start: booking.dateStart.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
          end: booking.dateEnd.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })
        },
        adjusted: {
          start: localDateStart.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
          end: localDateEnd.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })
        }
      });

      const { data, error } = await this.supabase
        .from('bookings')
        .insert([{
          user_id: booking.userId,
          package_type: booking.packageType,
          property_type: booking.propertyType,
          date: booking.date,
          adress: booking.adress,
          duration: booking.duration,
          amount: booking.amount,
          status: booking.status,
          date_start: localDateStart,
          date_end: localDateEnd,
          options: booking.options
        }])
        .select()
        .single();

      if (error) throw error;

      return this.mapBookingToEntity(data);
    } catch (error) {
      console.error('Erreur lors de la création de la réservation:', error);
      throw error;
    }
  }

  async findByDate(date: Date): Promise<Booking[]> {
    try {
      console.log('Finding bookings for date:', {
        inputDate: date.toISOString(),
        localDate: date.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })
      });
      
      // Créer les dates de début et de fin pour la journée
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      console.log('Search range:', {
        startOfDay: {
          iso: startOfDay.toISOString(),
          local: startOfDay.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })
        },
        endOfDay: {
          iso: endOfDay.toISOString(),
          local: endOfDay.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })
        }
      });

      // Construire la requête pour trouver les créneaux qui se chevauchent
      const query = this.supabase
        .from('bookings')
        .select('*')
        .or(`and(date_start.lte.${endOfDay.toISOString()},date_end.gte.${startOfDay.toISOString()})`)
        .order('date_start', { ascending: true });

      const { data, error } = await query;

      if (error) {
        console.error('Error finding bookings:', error);
        throw error;
      }

      console.log('Raw database response:', data);

      const bookings = data.map((booking: any) => {
        const mappedBooking = new Booking({
          id: booking.id,
          userId: booking.user_id,
          packageType: booking.package_type,
          propertyType: booking.property_type,
          date: new Date(booking.date),
          dateStart: new Date(booking.date_start),
          dateEnd: new Date(booking.date_end),
          status: booking.status,
          adress: booking.adress,
          duration: booking.duration,
          amount: booking.amount,
          options: booking.options || {},
          createdAt: booking.created_at ? new Date(booking.created_at) : new Date()
        });

        console.log('Mapped booking:', {
          id: mappedBooking.id,
          userId: mappedBooking.userId,
          dateStart: mappedBooking.dateStart.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
          dateEnd: mappedBooking.dateEnd.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
          status: mappedBooking.status
        });

        return mappedBooking;
      });

      return bookings;
    } catch (error) {
      console.error('Error in findByDate:', error);
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<Booking[]> {
    try {
      const { data, error } = await this.supabase
        .from('bookings')
        .select('*')
        .eq('user_id', userId)
        .order('date_start', { ascending: false });

      if (error) throw error;

      return data.map(booking => this.mapBookingToEntity(booking));
    } catch (error) {
      console.error('Erreur lors de la recherche des réservations par utilisateur:', error);
      return [];
    }
  }

  async update(booking: Booking): Promise<Booking | null> {
    try {
      this.validateBookingTimes(booking.dateStart, booking.dateEnd);

      const { data, error } = await this.supabase
        .from('bookings')
        .update({
          user_id: booking.userId,
          package_type: booking.packageType,
          property_type: booking.propertyType,
          date: booking.date,
          adress: booking.adress,
          duration: booking.duration,
          amount: booking.amount,
          status: booking.status,
          date_start: booking.dateStart,
          date_end: booking.dateEnd,
          options: booking.options
        })
        .eq('id', booking.id)
        .select()
        .single();

      if (error) throw error;
      if (!data) return null;

      return this.mapBookingToEntity(data);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la réservation:', error);
      return null;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('bookings')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Erreur lors de la suppression de la réservation:', error);
      throw error;
    }
  }

  async findConflict(start: Date): Promise<boolean> {
    try {
      const end = new Date(start);
      end.setHours(end.getHours() + 1);

      const { data, error } = await this.supabase
        .from('bookings')
        .select('id')
        .lte('date_start', end.toISOString())
        .gte('date_end', start.toISOString())
        .limit(1);

      if (error) throw error;

      return data.length > 0;
    } catch (error) {
      console.error('Erreur lors de la recherche de conflit:', error);
      return false;
    }
  }

  async findAvailableSlotsAround(start: Date): Promise<{ start: Date; end: Date }[]> {
    try {
      const end = new Date(start);
      end.setHours(end.getHours() + 1);

      const { data, error } = await this.supabase
        .from('bookings')
        .select('date_start, date_end')
        .or(`date_start.lte.${start.toISOString()},date_end.gte.${end.toISOString()}`)
        .eq('status', 'confirmed');

      if (error) throw error;

      const slots = data.map(booking => ({
        start: new Date(booking.date_start),
        end: new Date(booking.date_end)
      }));

      return slots;
    } catch (error) {
      console.error('Erreur lors de la recherche des créneaux disponibles:', error);
      return [];
    }
  }

  async findAll(): Promise<Booking[]> {
    try {
      console.log('Fetching all bookings...');
      const { data, error } = await this.supabase
        .from('bookings')
        .select('*')
        .order('date_start', { ascending: false });

      if (error) {
        console.error('Error finding bookings:', error);
        throw error;
      }

      console.log('Raw bookings data:', data);

      const bookings = data.map(booking => {
        const mappedBooking = this.mapBookingToEntity(booking);
        console.log('Mapped booking:', {
          id: mappedBooking.id,
          userId: mappedBooking.userId,
          dateStart: mappedBooking.dateStart.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
          dateEnd: mappedBooking.dateEnd.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
          status: mappedBooking.status
        });
        return mappedBooking;
      });

      return bookings;
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }
} 