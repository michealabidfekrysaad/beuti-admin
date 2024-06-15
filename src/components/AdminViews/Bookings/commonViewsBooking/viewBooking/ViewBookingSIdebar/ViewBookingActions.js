/* eslint-disable  */

import React from 'react';
import { Col } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import PendingActions from './ViewBookingActions/PendingActions';
import ConfirmedAction from './ViewBookingActions/ConfirmedActions';
import NoShowActions from './ViewBookingActions/NoShowActions';
import CanceledActions from './ViewBookingActions/CanceledActions';
import NoShowPemaActions from './ViewBookingActions/NoShowPermActions';
import CompeletedActions from './ViewBookingActions/CompeletedActions';
import { CallAPI } from '../../../../../../utils/API/APIConfig';
import { ConfirmationModal } from 'components/shared/ConfirmationModal';
import { useState } from 'react';
import CheckoutActions from './ViewBookingActions/CheckoutActions';
import InoviceDetails from './InoviceDetail';
import { useHistory } from 'react-router-dom';

const BookingStatus = {
  Confirmed: 1,
  Compeleted: 3,
  Cancelled: 2,
  Pending: 4,
  PaymentCancelled: 5,
  NoShow: 6,
};
const ViewBookingActions = ({
  actionHashMap,
  BookingDetails,
  getBookingDataCall,
  inoviceImg,
  bookingPaymentStatus,
  openInvoice,
  setOpenInvoice,
  showPrice = 'true',
  addedSelectedPayMethod = [],
  toPayAmount = 0,
  setOpenCheckoutUnpaidClicked = () => {},
  refetchAddBoookingCheckout = () => {},
  setOpenCheckoutCancel = () => {},
  fetchGetCheckoutBooking = () => {},
  fetchBreakDownRes = () => {},
}) => {
  const history = useHistory();
  const [openUnDontShowModal, setOpenUnDontShowModal] = useState(false);
  const [openDontShowModal, setOpenDontShowModal] = useState(false);
  const [opeConfirmBookingModal, setOpenConfirmBookingModal] = useState(false);
  const [opeCancelBookingModal, setOpenCancelBookingModal] = useState(false);

  const redirectToCheckout = () => {
    history.push(`/sale/checkout/${BookingDetails?.bookingId}`);
  };

  const redirectToEditBooking = () => {
    history.push(`/booking/bookingFlow/${BookingDetails?.bookingId}`);
  };

  const { refetch: confirmBookingCall } = CallAPI({
    name: 'confirmedBooking',
    url: 'Booking/ConfrimBooking',
    method: 'put',
    query: {
      bookingId: BookingDetails?.bookingId,
    },
    onSuccess: (data) => data && getBookingDataCall(true),
  });
  const { refetch: cancelBookingCall } = CallAPI({
    name: 'cancelBooking',
    url: 'Booking/SPCancelBooking',
    method: 'put',
    query: {
      bookingId: BookingDetails?.bookingId,
    },
    onSuccess: (data) => data && getBookingDataCall(true),
  });
  const { refetch: dontShowBookingCall } = CallAPI({
    name: 'bookingAsNowShow',
    url: 'Booking/SetBookingAsNoShow',
    method: 'put',
    query: {
      bookingId: BookingDetails?.bookingId,
    },
    onSuccess: (data) => data && getBookingDataCall(true),
  });
  const { refetch: unDoShowBookingCall } = CallAPI({
    name: 'undonoshowBooking',
    url: 'Booking/undonoshow',
    method: 'put',
    query: {
      bookingId: BookingDetails?.bookingId,
    },
    onSuccess: (data) => data && getBookingDataCall(true),
  });
  const { refetch: refundBookingCall } = CallAPI({
    name: 'refundBooking',
    url: 'Booking/NoShowCustomerRefund',
    method: 'put',
    query: {
      bookingId: BookingDetails?.bookingId,
    },
    onSuccess: (data) => data && getBookingDataCall(true),
  });
  return (
    <section className="booking-sidebar__action">
      {showPrice && (
        <Col xs="12" className="booking-sidebar__action-price">
          <FormattedMessage
            id="booking.flow.price.time"
            values={{ price: BookingDetails?.totalPrice }}
          />
        </Col>
      )}
      {BookingStatus.Confirmed === BookingDetails?.bookingStatusId && (
        <ConfirmedAction
          actionHashMap={actionHashMap}
          cancelBookingCall={setOpenCancelBookingModal}
          setOpenDontShowModal={setOpenDontShowModal}
          setOpenUnDontShowModal={setOpenUnDontShowModal}
          setOpenInvoice={setOpenInvoice}
          redirectToCheckout={redirectToCheckout}
          redirectToEditBooking={redirectToEditBooking}
        />
      )}
      {BookingStatus.Compeleted === BookingDetails?.bookingStatusId && (
        <CompeletedActions
          actionHashMap={actionHashMap}
          setOpenInvoice={setOpenInvoice}
          redirectToCheckout={redirectToCheckout}
          showCheckoutBtn={BookingDetails?.lastInvoiceStatusId === 1}
        />
      )}
      {BookingStatus.Cancelled === BookingDetails?.bookingStatusId && (
        <CanceledActions
          actionHashMap={actionHashMap}
          BookingDetails={BookingDetails}
          setOpenInvoice={setOpenInvoice}
        />
      )}
      {BookingStatus.Pending === BookingDetails?.bookingStatusId && (
        <PendingActions
          actionHashMap={actionHashMap}
          cancelBookingCall={setOpenCancelBookingModal}
          confirmBookingCall={setOpenConfirmBookingModal}
          setOpenDontShowModal={setOpenDontShowModal}
          setOpenUnDontShowModal={setOpenUnDontShowModal}
          setOpenInvoice={setOpenInvoice}
          redirectToEditBooking={redirectToEditBooking}
        />
      )}
      {BookingStatus.NoShow === BookingDetails?.bookingStatusId &&
        BookingDetails?.isPermenantNoShow && (
          <NoShowPemaActions
            actionHashMap={actionHashMap}
            setOpenRefundModal={setOpenRefundModal}
            setOpenInvoice={setOpenInvoice}
          />
        )}
      {BookingStatus.NoShow === BookingDetails?.bookingStatusId &&
        !BookingDetails?.isPermenantNoShow && (
          <NoShowActions
            setOpenInvoice={setOpenInvoice}
            actionHashMap={actionHashMap}
            setOpenUnDontShowModal={setOpenUnDontShowModal}
          />
        )}
      {'checkout' === BookingDetails && (
        <CheckoutActions
          actionHashMap={actionHashMap}
          cancelBookingCall={setOpenCancelBookingModal}
          setOpenDontShowModal={setOpenDontShowModal}
          setOpenUnDontShowModal={setOpenUnDontShowModal}
          addedSelectedPayMethod={addedSelectedPayMethod}
          toPayAmount={toPayAmount}
          setOpenCheckoutUnpaidClicked={setOpenCheckoutUnpaidClicked}
          refetchAddBoookingCheckout={refetchAddBoookingCheckout}
          setOpenCheckoutCancel={setOpenCheckoutCancel}
          fetchBreakDownRes={fetchBreakDownRes}
          fetchGetCheckoutBooking={fetchGetCheckoutBooking}
          setOpenInvoice={setOpenInvoice}
        />
      )}

      <ConfirmationModal
        setPayload={dontShowBookingCall}
        openModal={openDontShowModal}
        setOpenModal={setOpenDontShowModal}
        title="booking.details.noshow.title"
        message="booking.details.noshow.description"
      />
      <ConfirmationModal
        setPayload={unDoShowBookingCall}
        openModal={openUnDontShowModal}
        setOpenModal={setOpenUnDontShowModal}
        title="booking.details.unnoshow.title"
        message="booking.details.unnoshow.description"
      />

      <ConfirmationModal
        setPayload={confirmBookingCall}
        openModal={opeConfirmBookingModal}
        setOpenModal={setOpenConfirmBookingModal}
        title="booking.confirm.title"
        message="booking.confirm.description"
      />
      <ConfirmationModal
        setPayload={cancelBookingCall}
        openModal={opeCancelBookingModal}
        setOpenModal={setOpenCancelBookingModal}
        title="booking.cancel.title"
        message="booking.cancel.description"
      />
      {openInvoice && (
        <div className="layout-booking" onClick={() => setOpenInvoice(false)} />
      )}
      <InoviceDetails
        actionHashMap={actionHashMap}
        open={openInvoice}
        inoviceImg={inoviceImg}
        onClose={setOpenInvoice}
        canRefund={!!actionHashMap[9]}
        bookingPaymentStatus={bookingPaymentStatus}
        callBackAfterRefund={() => getBookingDataCall(true)}
        callBackAfterClose={() => null}
        paidAmount={BookingDetails?.totalPrice}
        onlinePaid={BookingDetails?.onlinePaidAmount}
        checkoutId={BookingDetails?.checkOutId}
      />
    </section>
  );
};

export default ViewBookingActions;
ViewBookingActions.propTypes = {
  actionHashMap: PropTypes.object,
  BookingDetails: PropTypes.object,
  getBookingDataCall: PropTypes.func,
  inoviceImg: PropTypes.string,
  openInvoice: PropTypes.bool,
  setOpenInvoice: PropTypes.func,
  bookingPaymentStatus: PropTypes.string,
};
