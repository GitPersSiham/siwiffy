/*mport { Booking } from '@/types/Bookings';
import { create } from 'zustand';

interface BookingState {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  updateBooking: (booking: Booking) => void;
  deleteBooking: (id: string) => void;
  setBookings: (bookings: Booking[]) => void;
  getBookingsByUserId :(userId : string ) => void;

}

export const useBookingStore = create<BookingState>((set) => ({
  bookings: [],
  addBooking: (booking) => set((state) => ({ bookings: [...state.bookings, booking] })),
  updateBooking: (updated) =>
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === updated.id ? updated : b
      ),
    })),

  deleteBooking: (id) =>
    set((state) => ({
      bookings: state.bookings.filter((b) => b.id !== id),
    })),

  setBookings: (bookings) => set(() => ({ bookings })),
  getBookingsByUserId: (userId) =>
    set((state) => ({
      bookings: state.bookings.filter((b) => b.id !== userId),
    })),

}));
*/