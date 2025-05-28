
import { useQuery } from '@tanstack/react-query';
import { getBookingByUserId } from '@/api/bookingApi';

export const useBookingsByUserId = (userId: string) => {
  console.log('useBookingsByUserId - userId reçu:', userId);
  
  return useQuery({
    queryKey: ['bookings', userId],
    queryFn: async () => {
      console.log('Fetching bookings pour userId:', userId);
      try {
        const result = await getBookingByUserId(userId);
        console.log('Résultat de la requête:', result);
        return result;
      } catch (error) {
        console.error('Erreur lors de la récupération des réservations:', error);
        throw error;
      }
    },
    enabled: !!userId,
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 30000, // 30 secondes
    gcTime: 60000, // 1 minute
  });
};
