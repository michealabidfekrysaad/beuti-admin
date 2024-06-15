import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

const initalBookingObject = {
  isHomeBooking: false,
  checkoutRedirect: false,

  bookedServices: [],
  bookedPackages: [],
  isLocationSelected: false,
  latitude: 24.7136,
  longitude: 46.6753,
  cityId: 3,
  addressDescription: '',
};

export const BookingContext = createContext();

const BookingProvider = ({ children }) => {
  const [booking, setBooking] = useState(initalBookingObject);
  return (
    <BookingContext.Provider value={{ booking, setBooking, initalBookingObject }}>
      {children}
    </BookingContext.Provider>
  );
};

BookingProvider.propTypes = {
  children: PropTypes.array,
};

export default BookingProvider;
