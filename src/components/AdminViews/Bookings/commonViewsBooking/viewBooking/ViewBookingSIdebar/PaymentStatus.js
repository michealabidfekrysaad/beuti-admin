import React from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

const PaymentStatus = ({
  actionHashMap,
  BookingDetails,
  bookingPaymentStatus,
  setOpenInvoice,
}) => {
  const { messages } = useIntl();

  return (
    <section className="paymentStatus">
      <h2 className="paymentStatus-title">{bookingPaymentStatus}</h2>
      {BookingDetails?.bookingStatusId === 4 && (
        <p className="paymentStatus-description">
          {messages['booking.sidebar.status.confirmed.description']}
        </p>
      )}
      {!!BookingDetails?.noShowMessage && (
        <p className="paymentStatus-description">{BookingDetails?.noShowMessage}</p>
      )}
      {!actionHashMap[2] && BookingDetails?.bookingStatusId !== 2 && (
        <p className="paymentStatus-description">
          {messages['booking.sidebar.noInvoice']}
        </p>
      )}
      {!!actionHashMap[2] && (
        <div className="paymentStatus-inovice">
          {messages['booking.sidebar.invoice']}
          <button type="button" onClick={() => setOpenInvoice(true)}>
            #{BookingDetails?.serviceProviderInvoiceId}
          </button>
        </div>
      )}
    </section>
  );
};
PaymentStatus.propTypes = {
  actionHashMap: PropTypes.object,
  BookingDetails: PropTypes.object,
  bookingPaymentStatus: PropTypes.string,
  setOpenInvoice: PropTypes.func,
};

export default PaymentStatus;
