/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-unused-expressions */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CallAPI } from 'utils/API/APIConfig';
import {
  GET_CHECKOUT_BOOKING,
  PAYMENT_METHOD_GET,
  ADD_CHECKOUT_BOOKING,
  CHECKOUT_BOOKING_UPDATED,
  CHECKOUT_EXPECTED_AMOUNTS,
} from 'utils/API/EndPoints/BookingEP';
import { EMP_GET_ODATA } from 'utils/API/EndPoints/EmployeeEP';
import ClientItem from '../../commonViewsBooking/AddEditBooking/SelectClientSidebar/ClientItem';
import ViewBookingActions from '../../commonViewsBooking/viewBooking/ViewBookingSIdebar/ViewBookingActions';
import PaymentModal from './PaymentModal';
import ItemsBookingDisplay from './ItemsBookingDisplay/ItemsBookingDisplay';
import PaymentMethods from './PaymentMethods/PaymentMethods';
import PaymentChoosenDisplayed from './PaymentChoosenDisplayed/PaymentChoosenDisplayed';
import EditBookingItems from './EditBookingItems/EditBookingItems';
import { ModalCheckoutUnpaid } from './ModalCheckoutUnpaid/ModalCheckoutUnpaid';
import { ModalCancelCheckout } from './ModalCancelCheckout/ModalCancelCheckout';

export default function CheckoutView() {
  const { bookingId } = useParams();
  const history = useHistory();
  const location = useLocation();
  const { messages, locale } = useIntl();
  const [actionHashMap, setActionsHashMap] = useState({});
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [addedSelectedPayMethod, setAddedSelectedPayMethod] = useState([]);
  const [newServicesData, setNewServicesData] = useState([]);
  const [newPackagesData, setNewPackagesData] = useState([]);
  const [toPayAmount, setToPayAmount] = useState(0);
  const [selectedPayMethod, setSelectedPayMethod] = useState(null);
  const [flagUpdateCheckout, setFlagUpdateCheckout] = useState({
    price: false,
    item: false,
  });
  const [openEditItemModal, setOpenEditItemModal] = useState(false);
  const [EditedItemClicked, setEditedItemClicked] = useState({
    item: null,
    serviceorNot: true,
  });
  const [openCheckoutUnpaidClicked, setOpenCheckoutUnpaidClicked] = useState(false);
  const [openCheckoutCancel, setOpenCheckoutCancel] = useState(false);

  const { data: allEmp } = CallAPI({
    name: 'getAllEmpForEditItem',
    url: EMP_GET_ODATA,
    baseURL: process.env.REACT_APP_ODOMAIN,
    refetchOnWindowFocus: false,
    enabled: true,
    select: (data) =>
      data.data.data.list?.map((d) => ({ ...d, text: d?.name, key: d?.id })),
  });

  const { data: BookingDetails, refetch: getBookingDataCall } = CallAPI({
    name: 'getAllBookData',
    url: 'Booking/GetBookingDetailsBySP',
    refetchOnWindowFocus: false,
    query: {
      bookingId,
    },
    select: (data) => data?.data?.data,
    onSuccess: (res) => {
      setActionsHashMap(() => {
        const actionHash = {};
        for (const index in res?.actions) {
          !actionHash[res.actions[index]] && (actionHash[res.actions[index]] = index);
        }
        return actionHash;
      });
    },
    enabled: true,
  });

  const { data: paymentMethods, isFetching: fetchPAymentMethods } = CallAPI({
    name: 'allPaymentMethodForSP',
    url: PAYMENT_METHOD_GET,
    refetchOnWindowFocus: false,
    enabled: true,
    select: (data) => data.data.data.list,
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });

  const {
    error,
    data: checkoutDataBooking,
    isFetching: fetchGetCheckoutBooking,
  } = CallAPI({
    name: 'getcheckoutBooking',
    url: GET_CHECKOUT_BOOKING,
    refetchOnWindowFocus: false,
    enabled: true,
    retry: false,
    query: {
      bookingId,
    },
    onSuccess: (res) => {
      setNewServicesData(res?.services);
      setNewPackagesData(res?.packages);
      setAddedSelectedPayMethod(res?.paidAmounts);
      setToPayAmount(res?.toBePaid);
    },
    select: (data) => data?.data?.data,
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });
  /* -------------------------------------------------------------------------- */
  /*               display the changed made by the user  to screen              */
  /* -------------------------------------------------------------------------- */
  const {
    data: breakDownRes,
    refetch: refetchBreakDown,
    isFetching: fetchBreakDownRes,
  } = CallAPI({
    name: 'getUpdatedBooking',
    url: CHECKOUT_BOOKING_UPDATED,
    refetchOnWindowFocus: false,
    enabled: false,
    cacheTime: 0,
    retry: false,
    method: 'post',
    body: {
      ...checkoutDataBooking,
      services: newServicesData,
      packages: newPackagesData,
      paidAmounts: addedSelectedPayMethod,
    },
    onSuccess: (res) => {
      setNewServicesData(res?.services);
      setNewPackagesData(res?.packages);
      setAddedSelectedPayMethod(res?.paidAmounts);
      setToPayAmount(res?.toBePaid);
    },
    select: (data) => data?.data?.data,
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });
  /* -------------------------------------------------------------------------- */
  /*                    get expected amount for payment boxes                   */
  /* -------------------------------------------------------------------------- */
  const { data: expectedAmountToPay, refetch: refetchExpectedAmountToPay } = CallAPI({
    name: ['getUpdatedBooking', toPayAmount],
    url: CHECKOUT_EXPECTED_AMOUNTS,
    refetchOnWindowFocus: false,
    enabled: !!toPayAmount,
    retry: false,
    query: {
      toBePaidAmount: toPayAmount,
    },
    select: (data) => data?.data?.data,
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });
  /* -------------------------------------------------------------------------- */
  /*                        add the new booking checkout                        */
  /* -------------------------------------------------------------------------- */
  const { data: addCheckoutBooking, refetch: refetchAddBoookingCheckout } = CallAPI({
    name: 'addCheckoutBooking',
    url: ADD_CHECKOUT_BOOKING,
    method: 'post',
    refetchOnWindowFocus: false,
    retry: false,
    body: {
      bookingId,
      ...(breakDownRes || checkoutDataBooking),
      paymentMethodAmounts:
        breakDownRes?.paidAmounts?.filter((data) => !data?.isSaved) ||
        checkoutDataBooking?.paidAmounts?.filter((data) => !data?.isSaved),
      services:
        breakDownRes?.services?.map((ser) => ({
          ...ser,
          itemPriceWithoutVat: ser?.priceWithoutVat,
        })) ||
        checkoutDataBooking?.services?.map((ser) => ({
          ...ser,
          itemPriceWithoutVat: ser?.priceWithoutVat,
        })),
    },
    onSuccess: (res) => {
      if (res?.bookingId) {
        history.push({
          pathname: `/booking/view/${res?.bookingId}`,
          state: { prevPath: location.pathname },
        });
      }
    },
    select: (data) => data?.data?.data,
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });

  const deleteAddedPaymentMethod = (id) => {
    setAddedSelectedPayMethod(addedSelectedPayMethod?.filter((meth) => meth?.id !== id));
    setFlagUpdateCheckout({ ...flagUpdateCheckout, price: true });
  };
  useEffect(() => {
    if (flagUpdateCheckout?.item || flagUpdateCheckout?.price) {
      setFlagUpdateCheckout({ item: false, price: false });
      refetchBreakDown();
    }
  }, [flagUpdateCheckout?.item, flagUpdateCheckout?.price]);

  return !fetchPAymentMethods ? (
    <Row className="checkout">
      <Col lg={12} className="checkout-title">
        <FormattedMessage id="checkout.select.payment" />
      </Col>
      <Col xs={12}>
        <Row>
          <Col lg={8}>
            <PaymentMethods
              paymentMethods={paymentMethods}
              setOpenPaymentModal={setOpenPaymentModal}
              setSelectedPayMethod={setSelectedPayMethod}
              toPayAmount={toPayAmount}
              addedSelectedPayMethod={addedSelectedPayMethod}
            />
          </Col>
          <Col xs={4}>
            <section className="booking-sidebar">
              <section className="clients">
                <ClientItem
                  client={{
                    name:
                      BookingDetails?.customerName ||
                      messages['booking.sidebar.status.walkin'],
                    phoneNumber: BookingDetails?.customerMobile,
                  }}
                  readOnly
                />
                <section className="checkout-details">
                  <Col xs={12} className="checkout-details_item px-0">
                    <FormattedMessage id="checkout.booking.items" />
                  </Col>

                  <ItemsBookingDisplay
                    setEditedItemClicked={setEditedItemClicked}
                    setOpenEditItemModal={setOpenEditItemModal}
                    breakDownRes={breakDownRes || checkoutDataBooking}
                  />
                </section>
              </section>
              {!error?.response?.data?.error?.message && (
                <section>
                  <PaymentChoosenDisplayed
                    checkoutDataBooking={checkoutDataBooking}
                    deleteAddedPaymentMethod={deleteAddedPaymentMethod}
                    breakDownRes={breakDownRes || checkoutDataBooking}
                  />

                  <ViewBookingActions
                    BookingDetails="checkout"
                    actionHashMap={actionHashMap}
                    getBookingDataCall={getBookingDataCall}
                    showPrice={false}
                    addedSelectedPayMethod={addedSelectedPayMethod}
                    toPayAmount={toPayAmount}
                    setOpenCheckoutUnpaidClicked={setOpenCheckoutUnpaidClicked}
                    refetchAddBoookingCheckout={refetchAddBoookingCheckout}
                    setOpenCheckoutCancel={setOpenCheckoutCancel}
                    fetchBreakDownRes={fetchBreakDownRes}
                    fetchGetCheckoutBooking={fetchGetCheckoutBooking}
                    setOpenInvoice={() => {}}
                  />
                </section>
              )}
            </section>
          </Col>
        </Row>
      </Col>

      <PaymentModal
        open={openPaymentModal}
        setOpen={setOpenPaymentModal}
        toPayAmount={toPayAmount}
        expectedAmountToPay={expectedAmountToPay}
        selectedPayMethod={selectedPayMethod}
        setAddedSelectedPayMethod={setAddedSelectedPayMethod}
        addedSelectedPayMethod={addedSelectedPayMethod}
        setFlagUpdateCheckout={setFlagUpdateCheckout}
        flagUpdateCheckout={flagUpdateCheckout}
      />

      <EditBookingItems
        setOpen={setOpenEditItemModal}
        open={openEditItemModal}
        EditedItemClicked={EditedItemClicked}
        allEmp={allEmp}
        setNewServicesData={setNewServicesData}
        setNewPackagesData={setNewPackagesData}
        newServicesData={newServicesData}
        newPackagesData={newPackagesData}
        setFlagUpdateCheckout={setFlagUpdateCheckout}
        flagUpdateCheckout={flagUpdateCheckout}
        breakDownRes={breakDownRes || checkoutDataBooking}
      />

      <ModalCheckoutUnpaid
        openModal={openCheckoutUnpaidClicked}
        setOpenModal={setOpenCheckoutUnpaidClicked}
        toPayAmount={toPayAmount}
        refetchAddBoookingCheckout={refetchAddBoookingCheckout}
      />

      <ModalCancelCheckout
        openCheckoutCancel={openCheckoutCancel}
        setOpenCheckoutCancel={setOpenCheckoutCancel}
        bookingId={bookingId}
      />
    </Row>
  ) : (
    <div className="loading"></div>
  );
}
