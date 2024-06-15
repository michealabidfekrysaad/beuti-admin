import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';
import ClientItem from '../AddEditBooking/SelectClientSidebar/ClientItem';
import BookingStatus from './ViewBookingSIdebar/BookingStatus';
import PaymentStatus from './ViewBookingSIdebar/PaymentStatus';
import PaidAndUnPaidAmount from './ViewBookingSIdebar/PaidAndUnPaidAmount';
import ViewBookingActions from './ViewBookingSIdebar/ViewBookingActions';
const paymentStatus = {
  // Refunded: 3,
  // NotPaid: 4,
  // PartiallyPaid: 5,
  // FullyPaid: 6,
  partiallyPaid: 1,
  paid: 2,
  partiallyRefunded: 3,
  fullyRefunded: 4,
  notPaid: 5,
};
const handlePaymentText = (messages, paymentStatusId, bookingStatus, actionsHash) => {
  if (bookingStatus === 2 && !actionsHash[2])
    return messages['booking.sidebar.noInvoice'];
  if (paymentStatusId === paymentStatus.paid)
    return messages['booking.sidebar.status.paid'];
  if (paymentStatusId === paymentStatus.notPaid)
    return messages['booking.sidebar.status.unpaid'];
  if (paymentStatusId === paymentStatus.partiallyPaid)
    return messages['booking.sidebar.status.partially'];
  if (paymentStatusId === paymentStatus.fullyRefunded)
    return messages['booking.sidebar.status.refund'];
  return null;
};
export default function ViewBookingSidebar({
  BookingDetails,
  actionHashMap,
  getBookingDataCall,
  inoviceImg,
}) {
  const { messages } = useIntl();
  const location = useLocation();
  const [openInvoice, setOpenInvoice] = useState(false);
  //   open invoice auto when come from checkout page
  useEffect(() => {
    if (
      location &&
      (location?.state?.prevPath?.includes('checkout') ||
        location?.state?.prevPath?.includes('sales'))
    ) {
      setOpenInvoice(true);
    }
  }, []);

  return (
    <>
      <section className="booking-sidebar__clients">
        <ClientItem
          client={{
            name:
              BookingDetails?.customerName || messages['booking.sidebar.status.walkin'],
            phoneNumber: BookingDetails?.customerMobile,
          }}
          readOnly
        />
        <BookingStatus status={BookingDetails?.bookingStatusId} />
        <div className="booking-sidebar__inovice">
          <PaymentStatus
            actionHashMap={actionHashMap}
            BookingDetails={BookingDetails}
            setOpenInvoice={setOpenInvoice}
            bookingPaymentStatus={handlePaymentText(
              messages,
              BookingDetails?.lastInvoiceStatusId,
              BookingDetails?.bookingStatusId,
              actionHashMap,
            )}
          />
          <PaidAndUnPaidAmount BookingDetails={BookingDetails} />
        </div>
      </section>
      <section>
        <ViewBookingActions
          BookingDetails={BookingDetails}
          actionHashMap={actionHashMap}
          getBookingDataCall={getBookingDataCall}
          inoviceImg={inoviceImg}
          openInvoice={inoviceImg && openInvoice}
          setOpenInvoice={setOpenInvoice}
          bookingPaymentStatus={handlePaymentText(
            messages,
            BookingDetails?.lastInvoiceStatusId,
            BookingDetails?.bookingStatusId,
            actionHashMap,
          )}
        />
      </section>
    </>
  );
}
ViewBookingSidebar.propTypes = {
  BookingDetails: PropTypes.object,
  actionHashMap: PropTypes.object,
  getBookingDataCall: PropTypes.func,
  inoviceImg: PropTypes.string,
};
