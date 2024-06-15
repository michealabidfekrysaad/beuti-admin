/* eslint-disable  */

import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Col } from 'react-bootstrap';
import {
  eventStatusClassServiceList,
  statusColorBackgroundForWord,
  statusColorForWord,
} from 'functions/statusColor';
import moment from 'moment';
import { useIntl } from 'react-intl';

export default function BookingSection({
  id,
  date,
  englishDate,
  startTime,
  number,
  total,
  bookingStatus,
  paymentStatus,
  locationHome,
  unPaidAmount,
}) {
  const { locale, messages } = useIntl();
  const history = useHistory();
  const location = useLocation();

  const displayTodayOrDate = (date) => {
    if (
      moment(englishDate)
        .locale('en')
        .format('DD-MMM-YYYY') ===
      moment()
        .locale('en')
        .format('DD-MMM-YYYY')
    ) {
      return (
        <div className="booking-data_holder-date_today">{messages['common.today']}</div>
      );
    }
    return (
      <>
        <div className="booking-data_holder-date_day">{date?.split('-')[0]}</div>
        <div className="booking-data_holder-date_rest">{date?.split('-')[1]}</div>
        <div className="booking-data_holder-date_rest">{date?.split('-')[2]}</div>
      </>
    );
  };
  const returnStatusName = (bookingStatus) => {
    if (bookingStatus === 1) {
      return 'calendar.status.Confirmed';
    }
    if (bookingStatus === 2) {
      return 'calendar.status.Canceled';
    }
    if (bookingStatus === 3) {
      return 'calendar.status.Completed';
    }
    if (bookingStatus === 4) {
      return 'calendar.status.Pending';
    }
    if (bookingStatus === 5) {
      return 'calendar.status.Canceled';
    }
    if (bookingStatus === 6) {
      return 'calendar.status.NoShow';
    }
    if (bookingStatus === 7) {
      return 'calendar.status.reserveCustomer';
    }
    return '';
  };

  const returnPaymentStatusName = (paymentStatus) => {
    if (paymentStatus === 1) {
      return 'setting.customer.invoice.table.part.paid';
    }
    if (paymentStatus === 2) {
      return 'setting.customer.invoice.paid';
    }
    if (paymentStatus === 3) {
      return 'setting.customer.invoice.part.refunded';
    }
    if (paymentStatus === 4) {
      return 'setting.customer.invoice.refunded';
    }
    if (paymentStatus === 5) {
      return 'setting.customer.invoice.unpaid';
    }
    return 'setting.customer.invoice.table.part.paid';
  };

  return (
    <Col
      xs={12}
      key={id}
      className={`booking-data booking-data${eventStatusClassServiceList(bookingStatus)}`}
      onClick={() => {
        history.push({
          pathname: `/booking/view/${id}`,
          state: { prevPath: location.pathname },
        });
      }}
    >
      <div className="booking-data_holder">
        <div className="booking-data_holder-date">{displayTodayOrDate(date)}</div>
        <div className="booking-data_holder-time">
          <div className="booking-data_holder-time_start">
            {messages['customer.booking,start.time']}
          </div>
          <div className="booking-data_holder-time_info">{startTime}</div>
        </div>
        <div className="booking-data_holder-status">
          <div
            className="booking-data_holder-status_section"
            style={{
              color: `${statusColorForWord(bookingStatus)}`,
              background: `${statusColorBackgroundForWord(bookingStatus)}`,
            }}
          >
            {messages[returnStatusName(bookingStatus)]}
          </div>
          <div className="booking-data_holder-time_info">
            {locationHome
              ? messages['booking.calendar.home.booking']
              : messages['booking.calendar.salon.booking']}
          </div>
        </div>
        <div className="booking-data_holder-time">
          <div className="booking-data_holder-time_start">
            {messages['customer.booking,services']}
          </div>
          <div className="booking-data_holder-time_info">
            {number} {messages['customer.booking,services']}
          </div>
        </div>
        <div className="booking-data_holder-time">
          <div className="booking-data_holder-time_start">{messages['common.sum']}</div>
          <div className="booking-data_holder-time_info">
            {total} {messages['common.sar.full']}
          </div>
        </div>
        <div className="booking-data_holder-time">
          <div className="booking-data_holder-time_start">
            {messages['customer.booking,payment']}
          </div>
          <div className="booking-data_holder-time_info">
            {messages[returnPaymentStatusName(paymentStatus)]}
          </div>
        </div>
        {paymentStatus === 1 && unPaidAmount > 0 && (
          <div className="booking-data_holder-un--paid">
            <div className="booking-data_holder-un--paid-title">
              {messages['booking.sidebar.status.unpaid']}
            </div>
            <div className="booking-data_holder-un--paid-info">
              {unPaidAmount} {messages['common.sar.full']}
            </div>
          </div>
        )}
      </div>
      <div className="booking-data_arrow">
        <i className={`flaticon2-${locale === 'ar' ? 'back' : 'next'}`}></i>
      </div>
    </Col>
  );
}
