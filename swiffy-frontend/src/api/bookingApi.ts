import axios from 'axios';
import { DateTime } from 'luxon';

import { PartialBooking } from '@/hooks/useUpdateBooking';
import { Booking } from '@/types';

const API_URL = `${import.meta.env.VITE_API_URL}/api/bookings`;

interface TimeSlot {
  start: Date;
  end: Date;
}

export const getBookings = async (): Promise<Booking[]> => {
  try {
    const res = await axios.get(API_URL);
    console.log(res, "getBookings")
    if (!res.data || !Array.isArray(res.data)) {
      console.error('Invalid response format:', res.data);
      return [];
    }
    return res.data;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};
// bookingApi.ts
export const createBooking = async (booking: Omit<PartialBooking, 'id'>) => {
  const res = await axios.post(API_URL, booking);
  console.log(res, "creating")
  return res.data;
};

export const updateBooking = async (booking: Booking) => {
  const res = await axios.put(`${API_URL}/${booking.id}`, booking);
  return res.data;
};

export const deleteBooking = async (id: string) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};

export const getBookingByUserId = async (userId: string): Promise<Booking[]> => {
  console.log('getBookingByUserId - Appel API avec userId:', userId);
  try {
    const token = localStorage.getItem('token');
    console.log('Token présent:', !!token);
    
    const response = await axios.get(`${API_URL}/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Réponse API:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur API getBookingByUserId:', error);
    throw error;
  }
};

export type OccupiedSlot = {
  dateStart: string;
  dateEnd: string;
};

export const getOccupiedSlots = async (date: string): Promise<TimeSlot[]> => {
  try {
    // Convertir la date en UTC
    const dateObj = new Date(date);
    const formattedDate = dateObj.toISOString();
    
    console.log('Fetching occupied slots:', {
      originalDate: date,
      dateObj: dateObj.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
      utcDate: formattedDate,
      url: `${API_URL}/slots/occupied?date=${formattedDate}`
    });

    const response = await axios.get(`${API_URL}/slots/occupied`, {
      params: { date: formattedDate }
    });

    console.log('Raw API response:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });

    if (!response.data || !Array.isArray(response.data.occupiedSlots)) {
      console.error('Invalid response format:', response.data);
      return [];
    }

    // Transformer les données reçues en TimeSlot[]
    const slots = response.data.occupiedSlots
      .map((slot: any) => {
        if (!slot.start || !slot.end) {
          console.warn('Invalid slot format:', slot);
          return null;
        }

        try {
          // Convertir les dates en heure locale de Paris
          const startDate = DateTime.fromISO(slot.start).setZone('Europe/Paris').toJSDate();
          const endDate = DateTime.fromISO(slot.end).setZone('Europe/Paris').toJSDate();

          console.log('Converted dates:', {
            originalStart: slot.start,
            originalEnd: slot.end,
            convertedStart: startDate.toISOString(),
            convertedEnd: endDate.toISOString(),
            localStart: startDate.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
            localEnd: endDate.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })
          });

          if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            console.warn('Invalid date conversion:', {
              start: slot.start,
              end: slot.end,
              convertedStart: startDate,
              convertedEnd: endDate
            });
            return null;
          }

          return {
            start: startDate,
            end: endDate
          };
        } catch (error) {
          console.warn('Error parsing dates:', error);
          return null;
        }
      })
      .filter((slot: TimeSlot | null): slot is TimeSlot => slot !== null);

    console.log('Final transformed slots:', slots.map((slot: TimeSlot) => ({
      start: slot.start.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
      end: slot.end.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })
    })));
    
    return slots;
  } catch (error) {
    console.error('Error fetching occupied slots:', error);
    throw error;
  }
};
