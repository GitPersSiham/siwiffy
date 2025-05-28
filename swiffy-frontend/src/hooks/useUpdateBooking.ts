import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Booking } from "@/types";

export type PartialBooking = Partial<Booking> & { id: string };

export const useUpdateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updatedBooking: PartialBooking) =>
      axios.put(`${import.meta.env.VITE_API_URL}/api/bookings/${updatedBooking.id}`, updatedBooking),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }),
  });
};
