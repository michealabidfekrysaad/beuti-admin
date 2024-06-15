import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

// This Provider To Share Booking Date Between Queue View Calender And Booking Details
export const BookingDateContext = createContext();

const BookingDateProvider = ({ children }) => {
  moment.locale('en');
  const [selectedDate, setSelectedDate] = useState({
    start: moment(new Date()).format('YYYY-MM-DD'),
    end: moment(new Date()).format('YYYY-MM-DD'),
  });
  return (
    <BookingDateContext.Provider value={{ selectedDate, setSelectedDate }}>
      {children}
    </BookingDateContext.Provider>
  );
};
BookingDateProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export default BookingDateProvider;
