import { useQuery } from "@tanstack/react-query";
import { getBookings } from "@/api/bookingApi";

export const useBookings = () => {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: getBookings,
  });
};
