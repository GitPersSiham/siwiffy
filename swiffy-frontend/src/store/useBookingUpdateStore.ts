import { create } from 'zustand';

interface BookingUpdateState {
  hasUpdated: boolean;
  setHasUpdated: (value: boolean) => void;
}

export const useBookingUpdateStore = create<BookingUpdateState>((set) => ({
  hasUpdated: false,
  setHasUpdated: (value: boolean) => set({ hasUpdated: value }),
})); 