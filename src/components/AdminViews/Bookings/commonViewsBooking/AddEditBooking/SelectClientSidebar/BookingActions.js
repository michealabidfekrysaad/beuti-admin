/* eslint-disable  */

import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import { useContext } from 'react';
import { BookingContext } from 'providers/BookingProvider';

const BookingActions = ({
  watch,
  price,
  isFrom,
  setAddBookingFlag,
  feesSelected = 0,
}) => {
  const { messages } = useIntl();
  const { setBooking, booking } = useContext(BookingContext);
  return (
    <section className="booking-sidebar__action">
      <Col xs="12" className="booking-sidebar__action-price">
        {watch('bookedServices')?.length > 1 && !price ? (
          messages['booking.flow.price.free']
        ) : (
          <FormattedMessage
            id={isFrom ? 'booking.flow.price.from' : 'booking.flow.price.time'}
            values={{
              price: +price + (booking?.isHomeBooking ? +feesSelected.toFixed(2) : 0),
            }}
          />
        )}
      </Col>
      <Col xs="6" className="px-2">
        <button
          type="submit"
          className="booking-sidebar__action-empty"
          //   disabled={watch('bookedServices')?.length > 1 && !price}
          onClick={() => {
            setAddBookingFlag(true);
            setBooking({ ...booking, checkoutRedirect: true });
          }}
        >
          {messages['booking.flow.express.pay']}
        </button>
      </Col>

      <Col xs="6" className="px-2">
        <button
          type="submit"
          className="booking-sidebar__action-filled"
          onClick={() => {
            setAddBookingFlag(true);
          }}
        >
          {messages['booking.flow.save.appoitment']}
        </button>
      </Col>
    </section>
  );
};

export default BookingActions;
