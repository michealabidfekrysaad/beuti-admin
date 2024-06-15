/* eslint-disable no-plusplus */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Col, Row } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import { CallAPI } from 'utils/API/APIConfig';
import { toast } from 'react-toastify';
import { SP_VAT } from 'utils/API/EndPoints/ServiceProviderEP';
import CustomeItem from './CustomItem/CustomItem';
import ConfirmedBooking from './ConfirmedBooking/ConfirmedBooking';
import QuickSale from './QuickSales/QuickSales';
import { salesItemIds, salesViews } from '../Helper/ViewsEnum';
import Services from './Services/Services';
import SideBarCart from '../SideBarCart/SideBarCart';
import ProductsList from './Products/ProductsList';
import CollectPhase from '../CollectPhase/CollectPhase';
import { PayloadCreator } from './QuickSales/Helper/AddQuickSalePayload.Helper';
const tabs = [
  {
    id: salesViews.quickSale,
  },
  {
    id: salesViews.confirmedBooking,
  },
  {
    id: salesViews.products,
  },
  {
    id: salesViews.services,
  },
];
export default function SalesViews({
  selectedsaleView,
  setSelectedSaleView,
  salesData,
  setSalesData,
  setCollectPhase,
  collectPhase,
  setSubTotalPriceForSale,
  subTotalPriceForSale,
  setOpenAddEditQuickSale,
  isPOS,
}) {
  const history = useHistory();
  const { checkoutId } = useParams();
  const [openCustomItem, setOpenCustomItem] = useState(false);
  const [searchFoucs, setSearchFoucs] = useState('');
  const [toPayAmount, setToPayAmount] = useState(
    salesData?.calculations?.total -
      (salesData?.calculations?.sumBookingPaidAmounts || 0)?.toFixed(2),
  );
  const [changePricesOfBooking, setChangePriceOfBooking] = useState(false);
  const [openCheckoutUnpaidClicked, setOpenCheckoutUnpaidClicked] = useState(false);
  const [openCancelSaleModal, setOpenCancelSaleModal] = useState(false);
  const [couponValueForBooking, setCouponValueForBooking] = useState(0);
  const [bookingSelectedinTheCart, setBookingSelectedInTheCart] = useState({});
  const [selectedTimeBooking, setSelectedTimeBooking] = useState(
    history?.location?.state?.filter ? history?.location?.state?.filter : 0,
  );
  const { messages } = useIntl();

  CallAPI({
    name: 'vatOfServiceProvider',
    url: SP_VAT,
    enabled: true,
    refetchOnWindowFocus: false,
    baseURL: !isPOS
      ? `${process.env.REACT_APP_DOMAIN}1`
      : `${process.env.REACT_APP_POS_URL}/api/v1`,
    onSuccess: (res) => {
      if (res || +res === 0) {
        setSalesData({
          ...salesData,
          calculations: {
            ...salesData?.calculations,
            vatPercentage: res,
          },
        });
      }
    },
    onError: (err) => toast.error(err?.response?.data?.error?.message),
    select: (res) => +res?.data?.data?.vatValue / 100,
  });

  /* -------------------------------------------------------------------------- */
  /*                        add the new booking checkout                        */
  /* -------------------------------------------------------------------------- */
  const {
    data: addCheckoutBooking,
    refetch: refetchAddBoookingCheckout,
    isFetching: fetchingNewCheckout,
  } = CallAPI({
    name: 'addCheckoutForSale',
    url: 'sale/Add',
    method: 'post',
    baseURL: !isPOS
      ? `${process.env.REACT_APP_DOMAIN}1`
      : `${process.env.REACT_APP_POS_URL}/api/v1`,
    refetchOnWindowFocus: false,
    retry: false,
    body: {
      ...new PayloadCreator(salesData.itemsSelected).getPayload(),
      brandCustomerId: salesData?.customer?.id,
      paymentMethodAmounts: salesData?.paymentMethodAmounts?.map((method) => ({
        paymentMethodId: method.paymentMethodId,
        amount: method.amount,
      })),
      totalPriceWithVAT: salesData?.calculations?.total,
    },
    onSuccess: (res) => {
      setSalesData({
        itemsSelected: [],
        calculations: {
          ...salesData?.calculations,
          subtotal: 0,
          vat: 0,
          bookingVat: 0,
          total: 0,
        },
        paymentMethodAmounts: [],
      });
      setCollectPhase(false);
      if (res?.bookingId) {
        return history.push({
          pathname: `/booking/view/${res?.bookingId}`,
          state: { prevPath: history?.location.pathname },
        });
      }
      return history.push({
        pathname: `/sales/invoicesList/0?${res?.invoiceUniqueKey}`,
        state: {
          prevPath: history?.location.pathname,
          invoiceUniqueKey: res?.invoiceUniqueKey,
        },
      });
    },
    select: (data) => data?.data?.data,
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });
  /* -------------------------------------------------------------------------- */
  /*             get the  checkout details for make another payments            */
  /* -------------------------------------------------------------------------- */
  const {
    data: getCheckoutDetails,
    refetch: refetchGetCheckout,
    isFetching: fetchingGetCheckout,
  } = CallAPI({
    name: 'getCheckoutSale',
    url: 'CheckOut/GetCheckOutDetails',
    baseURL: !isPOS
      ? `${process.env.REACT_APP_DOMAIN}1`
      : `${process.env.REACT_APP_POS_URL}/api/v1`,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!checkoutId,
    query: {
      checkoutId,
    },
    onSuccess: (res) => {
      setSalesData({
        ...salesData,
        itemsSelected: [
          ...res?.packages?.map((d) => ({
            name: d?.name,
            price: d?.priceWithoutVAT,
            identify: salesItemIds?.packages,
            quantity: d?.quantity || 1,
          })),
          ...res?.services?.map((d) => ({
            name: d?.name,
            price: d?.priceWithoutVAT,
            identify: salesItemIds?.services,
            quantity: d?.quantity || 1,
            employeeName: d?.employeeName,
            duration: d?.duration,
            // need the duration  from BE
          })),
          ...res?.customItems?.map((d) => ({
            name: d?.name,
            price: d?.priceWithoutVAT,
            identify: salesItemIds?.customItems,
            quantity: d?.quantity || 1,
          })),
          ...res?.products?.map((d) => ({
            name: d?.name,
            price: d?.priceWithoutVAT,
            identify: salesItemIds?.products,
            quantity: d?.quantity || 1,
            freeQuantity: d?.freeQuantity || 0,
          })),
        ],
        calculations: {
          ...salesData?.calculations,
          total: res?.totalAmountWithVat || 1000,
          subtotal: res?.totalAmountWithOutVat,
          vat: res?.vatAmount,
          bookingVat: 0,
          sumBookingPaidAmounts: 0,
        },
        brandCustomerId: res?.customer?.id || '',
        customer: {
          id: res?.customer?.id,
          name: res?.customer?.name,
          registeredName: res?.customer?.name,
          phoneNumber: res?.customer?.phone,
        },
        paymentMethodAmounts: res?.paymentDetails,
        prevSale: true,
      });
      setCollectPhase(true);
    },
    select: (data) => ({
      ...data?.data?.data,
      packages: data?.data?.data?.packages ? data?.data?.data?.packages : [],
      services: data?.data?.data?.services ? data?.data?.data?.services : [],
      products: data?.data?.data?.products ? data?.data?.data?.products : [],
      customItems: data?.data?.data?.customItems ? data?.data?.data?.customItems : [],
    }),
    onError: (err) => {
      toast.error(err?.response?.error?.message || err?.response?.status);
    },
  });
  /* -------------------------------------------------------------------------- */
  /*               return to initial state if move from sales page              */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (!checkoutId) {
      setCollectPhase(false);
      setSalesData({
        itemsSelected: [],
        calculations: {
          ...salesData?.calculations,
          subtotal: 0,
          vat: 0,
          bookingVat: 0,
          total: 0,
          sumBookingPaidAmounts: 0,
        },
        paymentMethodAmounts: [],
        prevSale: false,
      });
    }
  }, [checkoutId]);

  useEffect(() => {
    let quantityOfPackagesSavedInBE = 0;
    let quantityOfPackBookingCart = 0;

    const priceOfBookingSavedInBE = +(bookingSelectedinTheCart?.priceWithVAt || 0);

    const sumOfServicesPricesSavedInBE =
      bookingSelectedinTheCart?.services?.reduce(
        (prev, current) => +prev + +current?.price,
        0,
      ) || 0;

    const sumOfPackagesPriceSavedInBE =
      bookingSelectedinTheCart?.packages?.reduce(
        (prev, current) => +prev + +current?.price * (current?.quantity || 1),
        0,
      ) || 0;

    if (bookingSelectedinTheCart?.packages) {
      quantityOfPackagesSavedInBE = bookingSelectedinTheCart?.packages[0]?.quantity || 1;
      quantityOfPackBookingCart = +(
        salesData?.itemsSelected?.find(
          (d) => d?.identify === salesItemIds?.confirmedBooking,
        )?.packages[0]?.quantity || 1
      );
    }

    const sumPricesOfServicesInsideBooking =
      +salesData?.itemsSelected
        ?.find((d) => d?.identify === salesItemIds?.confirmedBooking)
        ?.services?.reduce((prev, current) => +prev + +current?.price, 0) || 0;

    const sumPricesOfPackagesInsideBooking =
      +salesData?.itemsSelected
        ?.find((d) => d?.identify === salesItemIds?.confirmedBooking)
        ?.packages?.reduce(
          (prev, current) => +prev + +current?.price * (current?.quantity || 1),
          0,
        ) || 0;

    const calculateCouponValueBooking =
      (sumPricesOfServicesInsideBooking + sumPricesOfPackagesInsideBooking) *
      (salesData?.itemsSelected?.find(
        (d) => d?.identify === salesItemIds?.confirmedBooking,
      )?.copounPercentage / 100 || 0);

    const cityFeesForBookings =
      salesData?.itemsSelected?.find(
        (d) => d?.identify === salesItemIds?.confirmedBooking,
      )?.cityFees || 0;

    setCouponValueForBooking(calculateCouponValueBooking);

    const totalBookingCalculations =
      sumPricesOfServicesInsideBooking +
      sumPricesOfPackagesInsideBooking -
      (salesData?.itemsSelected?.find(
        (d) => d?.identify === salesItemIds?.confirmedBooking,
      )?.voucherValue || 0) -
      +calculateCouponValueBooking +
      +cityFeesForBookings;

    const bookingCalculationwithVat =
      totalBookingCalculations +
      +(
        salesData?.itemsSelected?.find(
          (d) => d?.identify === salesItemIds?.confirmedBooking,
        )?.vAtAmount || 0
      );

    const calculateTotalPricesItemWithoutConfirmedBookings =
      +salesData?.itemsSelected
        ?.filter((d) => d?.identify !== salesItemIds?.confirmedBooking)
        ?.reduce(
          (prev, current) =>
            +prev +
            +current?.price * (current?.quantity - +(current?.freequantity || 0) || 1),
          0,
        ) || 0;

    setSubTotalPriceForSale(
      +calculateTotalPricesItemWithoutConfirmedBookings + +totalBookingCalculations,
    );

    // when  enter collect phase and go back remove payment methods if addnew item to cart
    if (
      +calculateTotalPricesItemWithoutConfirmedBookings + +totalBookingCalculations !==
        salesData?.calculations?.subtotal &&
      !collectPhase
    ) {
      setSalesData({ ...salesData, paymentMethodAmounts: [] });
    }

    setChangePriceOfBooking(
      priceOfBookingSavedInBE !== bookingCalculationwithVat ||
        sumOfServicesPricesSavedInBE !== sumPricesOfServicesInsideBooking ||
        sumOfPackagesPriceSavedInBE !== sumPricesOfPackagesInsideBooking ||
        quantityOfPackagesSavedInBE !== quantityOfPackBookingCart,
    );
  }, [salesData?.itemsSelected]);

  const handleOldBookingPayment = (total) => {
    if (total > bookingSelectedinTheCart?.sumBookingPaidAmounts) {
      return bookingSelectedinTheCart?.sumBookingPaidAmounts;
    }
    return total;
  };

  useEffect(() => {
    if (+subTotalPriceForSale >= 0 && !checkoutId) {
      const pricesOfItemswithoutConfirmedBooking =
        +salesData?.itemsSelected
          ?.filter((d) => d?.identify !== salesItemIds?.confirmedBooking)
          ?.reduce(
            (prev, current) =>
              +prev +
              +current?.price * (current?.quantity - +(current?.freequantity || 0) || 1),
            0,
          ) || 0;

      setSalesData({
        ...salesData,
        calculations: {
          ...salesData?.calculations,
          subtotal: +subTotalPriceForSale?.truncNumNotRound(),
          vat: !changePricesOfBooking
            ? +(
                pricesOfItemswithoutConfirmedBooking *
                salesData?.calculations?.vatPercentage
              )?.truncNumNotRound()
            : +(
                subTotalPriceForSale * salesData?.calculations?.vatPercentage
              )?.truncNumNotRound(),
          bookingVat: !changePricesOfBooking
            ? +(
                salesData?.itemsSelected?.find(
                  (d) => d?.identify === salesItemIds?.confirmedBooking,
                )?.vAtAmount || 0
              )
            : 0,
          total: !changePricesOfBooking
            ? +(
                pricesOfItemswithoutConfirmedBooking +
                pricesOfItemswithoutConfirmedBooking *
                  salesData?.calculations?.vatPercentage
              )?.truncNumNotRound() +
              +subTotalPriceForSale?.truncNumNotRound() -
              +pricesOfItemswithoutConfirmedBooking?.truncNumNotRound() +
              +(
                salesData?.itemsSelected?.find(
                  (d) => d?.identify === salesItemIds?.confirmedBooking,
                )?.vAtAmount || 0
              )?.truncNumNotRound()
            : +(
                +subTotalPriceForSale +
                +subTotalPriceForSale * salesData?.calculations?.vatPercentage
              )?.truncNumNotRound(),

          sumBookingPaidAmounts: !changePricesOfBooking
            ? bookingSelectedinTheCart?.sumBookingPaidAmounts || 0
            : handleOldBookingPayment(
                +(
                  subTotalPriceForSale +
                  subTotalPriceForSale * salesData?.calculations?.vatPercentage
                )?.truncNumNotRound(),
              ),
        },
      });
    }
  }, [subTotalPriceForSale, changePricesOfBooking]);

  /* -------------------------------------------------------------------------- */
  /*    reduce  the amount added or paid online of booking from to pay amount   */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    const sumPaymentMethodChoosen = salesData?.paymentMethodAmounts
      ?.map((data) => data?.amount)
      .reduce((a, b) => a + b, 0);
    setToPayAmount(
      +salesData?.calculations?.total -
        sumPaymentMethodChoosen -
        (salesData?.calculations?.sumBookingPaidAmounts || 0),
    );
  }, [
    salesData?.paymentMethodAmounts,
    salesData?.paymentMethodAmounts
      ?.map((data) => data?.amount)
      .reduce((a, b) => a + b, 0),
    salesData?.itemsSelected,
    salesData?.calculations?.total,
  ]);

  return (
    <div className={`sales ${collectPhase ? 'collect-phase' : ''}`}>
      <div className="sales-views">
        {!collectPhase ? (
          <>
            <header className="sales-views__header">
              <div className="sales-views__header-title">{messages['new.sale']}</div>
              <div className="sales-views__navigation">
                <div className="sales-views__navigation-content">
                  {tabs?.map((view) => (
                    <button
                      className={`sales-views__navigation-content__item ${selectedsaleView ===
                        view?.id && 'active-view'}`}
                      type="button"
                      key={view?.id}
                      onClick={() => setSelectedSaleView(view?.id)}
                    >
                      {messages[view?.id]}
                    </button>
                  ))}
                </div>
                <div>
                  <button
                    className="sales-views__navigation-custom"
                    type="button"
                    onClick={() => setOpenCustomItem(true)}
                  >
                    <i className="flaticon2-plus"></i>
                    {messages['custom.item']}
                  </button>
                </div>
              </div>
            </header>
            <div className="sales-views__data">
              <Row>
                <Col xs="12">
                  {selectedsaleView === salesViews.quickSale && (
                    <QuickSale
                      setSalesData={setSalesData}
                      salesData={salesData}
                      setOpenAddEditQuickSale={setOpenAddEditQuickSale}
                      isPOS={isPOS}
                    />
                  )}
                  {selectedsaleView === salesViews.confirmedBooking && (
                    <ConfirmedBooking
                      setSalesData={setSalesData}
                      salesData={salesData}
                      selectedTime={selectedTimeBooking}
                      setSelectedTime={setSelectedTimeBooking}
                      setBookingSelectedInTheCart={setBookingSelectedInTheCart}
                      isPOS={isPOS}
                    />
                  )}
                  {selectedsaleView === salesViews.products && (
                    <ProductsList
                      setSalesData={setSalesData}
                      salesData={salesData}
                      isPOS={isPOS}
                    />
                  )}
                  {selectedsaleView === salesViews.services && (
                    <Services
                      setSalesData={setSalesData}
                      salesData={salesData}
                      isPOS={isPOS}
                    />
                  )}
                </Col>
              </Row>
            </div>
          </>
        ) : (
          <CollectPhase
            setCollectPhase={setCollectPhase}
            setSearchFoucs={setSearchFoucs}
            searchFoucs={searchFoucs}
            setSalesData={setSalesData}
            salesData={salesData}
            toPayAmount={toPayAmount}
            setToPayAmount={setToPayAmount}
            refetchAddBoookingCheckout={refetchAddBoookingCheckout}
            isPOS={isPOS}
          />
        )}
        <CustomeItem
          open={openCustomItem}
          setOpen={setOpenCustomItem}
          setSalesData={setSalesData}
          salesData={salesData}
        />
      </div>
      <SideBarCart
        setSearchFoucs={setSearchFoucs}
        searchFoucs={searchFoucs}
        setSalesData={setSalesData}
        salesData={salesData}
        setCollectPhase={setCollectPhase}
        couponValueForBooking={couponValueForBooking}
        collectPhase={collectPhase}
        toPayAmount={toPayAmount}
        openCheckoutUnpaidClicked={openCheckoutUnpaidClicked}
        setOpenCheckoutUnpaidClicked={setOpenCheckoutUnpaidClicked}
        refetchAddBoookingCheckout={refetchAddBoookingCheckout}
        fetchingNewCheckout={fetchingNewCheckout}
        setOpenCancelSaleModal={setOpenCancelSaleModal}
        openCancelSaleModal={openCancelSaleModal}
        fetchingGetCheckout={fetchingGetCheckout}
        setBookingSelectedInTheCart={setBookingSelectedInTheCart}
        isPOS={isPOS}
      />
      {searchFoucs && (
        <div className="layout-booking" onClick={() => setSearchFoucs(false)} />
      )}
      {checkoutId && fetchingGetCheckout && (
        <div className="cart--overlay">
          <div className="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
    </div>
  );
}

SalesViews.propTypes = {
  selectedsaleView: PropTypes.number,
  setSelectedSaleView: PropTypes.func,
  setOpenAddEditQuickSale: PropTypes.func,
  salesData: PropTypes.object,
  setSalesData: PropTypes.func,
  setCollectPhase: PropTypes.func,
  collectPhase: PropTypes.bool,
  setSubTotalPriceForSale: PropTypes.func,
  subTotalPriceForSale: PropTypes?.number,
  isPOS: PropTypes?.bool,
};
