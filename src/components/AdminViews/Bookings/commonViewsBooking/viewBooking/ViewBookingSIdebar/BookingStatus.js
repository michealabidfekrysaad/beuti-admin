import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
const handleStatus = {
  1: 'confirmed',
  2: 'cancel',
  3: 'compeleted',
  4: 'pending',
  5: 'cancel',
  6: 'noshow',
};
const BookingStatus = ({ status }) => {
  const { messages } = useIntl();
  return (
    <div className={`booking-sidebar--status booking-sidebar--${handleStatus[status]}`}>
      {messages[`booking.sidebar.status.${handleStatus[status]}`]}
    </div>
  );
};

BookingStatus.propTypes = {
  status: PropTypes.number,
};
export default BookingStatus;
