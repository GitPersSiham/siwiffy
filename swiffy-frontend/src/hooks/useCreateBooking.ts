import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PartialBooking } from "./useUpdateBooking";
import { createBooking } from "@/api/bookingApi";
import moment from 'moment-timezone';

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  const convertToLocal = (utcDate: string): string => {
    // Convertir la date UTC en heure locale
    return moment.utc(utcDate).tz('Europe/Paris').format();
  };

  return useMutation({
    mutationFn: async (booking: Omit<PartialBooking, 'id'>) => {
      // Convertir les dates UTC en locales pour l'affichage
      const localBooking = {
        ...booking,
        dateStart: booking.dateStart ? convertToLocal(booking.dateStart) : undefined,
        dateEnd: booking.dateEnd ? convertToLocal(booking.dateEnd) : undefined
      };

      console.log('Original booking data:', {
        utc: {
          start: booking.dateStart,
          end: booking.dateEnd
        },
        local: {
          start: localBooking.dateStart,
          end: localBooking.dateEnd,
          startTime: moment.utc(booking.dateStart).tz('Europe/Paris').format('HH:mm'),
          endTime: moment.utc(booking.dateEnd).tz('Europe/Paris').format('HH:mm')
        }
      });

      // Envoyer les dates UTC au backend
      const result = await createBooking(booking);
      console.log('Booking creation result:', {
        ...result,
        localStart: moment.utc(result.dateStart).tz('Europe/Paris').format('HH:mm'),
        localEnd: moment.utc(result.dateEnd).tz('Europe/Paris').format('HH:mm')
      });
      return result;
    },
    onSuccess: (data) => {
      console.log('Booking created successfully:', {
        ...data,
        localStart: moment.utc(data.dateStart).tz('Europe/Paris').format('HH:mm'),
        localEnd: moment.utc(data.dateEnd).tz('Europe/Paris').format('HH:mm')
      });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error: any) => {
      console.error('Error creating booking:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
    }
  });
};

