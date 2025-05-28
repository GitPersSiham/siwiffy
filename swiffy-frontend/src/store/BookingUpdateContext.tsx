import React, { createContext, useState, useContext } from 'react';

interface BookingUpdateContextType {
  hasUpdated: boolean;
  setHasUpdated: React.Dispatch<React.SetStateAction<boolean>>;
}

const BookingUpdateContext = createContext<
  BookingUpdateContextType | undefined
>(undefined);

export const BookingUpdateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [hasUpdated, setHasUpdated] = useState(false);

  return (
    <BookingUpdateContext.Provider value={{ hasUpdated, setHasUpdated }}>
      {children}
    </BookingUpdateContext.Provider>
  );
};

export const useBookingUpdate = () => {
  const context = useContext(BookingUpdateContext);
  if (!context) {
    throw new Error(
      'useBookingUpdate must be used within a BookingUpdateProvider'
    );
  }
  return context;
};
