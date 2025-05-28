
import { getBookings } from '@/api/bookingApi';
import { useQuery } from '@tanstack/react-query';


export const useBooking = (id: string) => {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: () => getBookings(),
    enabled: !!id, // ne déclenche pas la requête si id est vide
  });
};



