import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PartialBooking } from "./useUpdateBooking";
import { createBooking } from "@/api/bookingApi";

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (booking: Omit<PartialBooking, 'id'>) => {
      console.log('Creating booking with data:', booking);
      const result = await createBooking(booking);
      console.log('Booking creation result:', result);
      return result;
    },
    onSuccess: (data) => {
      console.log('Booking created successfully:', data);
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

