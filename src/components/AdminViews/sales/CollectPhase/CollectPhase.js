/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import { CallAPI } from 'utils/API/APIConfig';
import {
  CHECKOUT_EXPECTED_AMOUNTS,
  PAYMENT_METHOD_GET,
} from 'utils/API/EndPoints/BookingEP';
import { toast } from 'react-toastify';
import PaymentMethods from 'components/AdminViews/Bookings/views/CheckoutFlow/PaymentMethods/PaymentMethods';
import AddPaymentModal from './AddPaymentModal';
import SideBarCart from '../SideBarCart/SideBarCart';
import { salesItemIds } from '../Helper/ViewsEnum';

export default function CollectPhase({
  setCollectPhase,
  setSearchFoucs,
  searchFoucs,
  setSalesData,
  salesData,
  toPayAmount,
  setToPayAmount,
  refetchAddBoookingCheckout,
  isPOS,
}) {
  const { messages, locale } = useIntl();
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [selectedPayMethod, setSelectedPayMethod] = useState(null);
  const [flagUpdateCheckout, setFlagUpdateCheckout] = useState({
    price: false,
    item: false,
  });
  const { data: paymentMethods, isFetching: fetchPAymentMethods } = CallAPI({
    name: 'SpAllPAymentMethods',
    url: PAYMENT_METHOD_GET,
    refetchOnWindowFocus: false,
    baseURL: !isPOS
      ? `${process.env.REACT_APP_DOMAIN}1`
      : `${process.env.REACT_APP_POS_URL}/api/v1`,
    enabled: true,
    select: (data) => data.data.data.list,
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });

  /* -------------------------------------------------------------------------- */
  /*                    get expected amount for payment boxes                   */
  /* -------------------------------------------------------------------------- */
  const { data: expectedAmountToPay, refetch: refetchExpectedAmountToPay } = CallAPI({
    name: ['expectedAmountsForModal', toPayAmount],
    url: CHECKOUT_EXPECTED_AMOUNTS,
    refetchOnWindowFocus: false,
    baseURL: !isPOS
      ? `${process.env.REACT_APP_DOMAIN}1`
      : `${process.env.REACT_APP_POS_URL}/api/v1`,
    enabled: !!toPayAmount,
    retry: false,
    query: {
      toBePaidAmount: toPayAmount,
    },
    select: (data) => data?.data?.data,
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });

  //   Api used for checkout again for saved sales data from BE
  //   const {
  //     error,
  //     data: checkoutDataBooking,
  //     isFetching: fetchGetCheckoutBooking,
  //   } = CallAPI({
  //     name: 'getcheckoutBooking',
  //     url: GET_CHECKOUT_BOOKING,
  //     refetchOnWindowFocus: false,
  //     enabled: true,
  //     retry: false,
  //     query: {
  //       bookingId,
  //     },
  //     onSuccess: (res) => {
  //       setNewServicesData(res?.services);
  //       setNewPackagesData(res?.packages);
  //       setAddedSelectedPayMethod(res?.paidAmounts);
  //       setToPayAmount(res?.toBePaid);
  //     },
  //     select: (data) => data?.data?.data,
  //     onError: (err) => toast.error(err?.response?.data?.error?.message),
  //   });

  return (
    <>
      <header className="sales-views__header">
        <div
          className="sales-views__header-title"
          onClick={() => {
            if (!salesData?.prevSale) {
              setCollectPhase(false);
            }
          }}
        >
          {!salesData?.prevSale && (
            <SVG
              className={`${locale === 'ar' ? 'collect-phase_rotate--arrow' : ''}`}
              src={toAbsoluteUrl('/full-arrow.svg')}
            />
          )}
          <span className="mx-2">{messages['checkout.select.payment']}</span>
        </div>
      </header>
      <div className="sales-views__data">
        {fetchPAymentMethods ? (
          <div className="loading"></div>
        ) : (
          <PaymentMethods
            paymentMethods={paymentMethods}
            setOpenPaymentModal={setOpenPaymentModal}
            setSelectedPayMethod={setSelectedPayMethod}
            toPayAmount={toPayAmount}
            addedSelectedPayMethod={salesData?.paymentMethodAmounts}
          />
        )}
      </div>
      {searchFoucs && (
        <div className="layout-booking" onClick={() => setSearchFoucs(false)} />
      )}

      <AddPaymentModal
        open={openPaymentModal}
        setOpen={setOpenPaymentModal}
        toPayAmount={toPayAmount}
        expectedAmountToPay={expectedAmountToPay}
        selectedPayMethod={selectedPayMethod}
        setSalesData={setSalesData}
        salesData={salesData}
        setFlagUpdateCheckout={setFlagUpdateCheckout}
        flagUpdateCheckout={flagUpdateCheckout}
        refetchAddBoookingCheckout={refetchAddBoookingCheckout}
      />
    </>
  );
}
