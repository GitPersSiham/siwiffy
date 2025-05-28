import { deleteBooking } from '@/api/bookingApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';


export const useDeleteBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};
