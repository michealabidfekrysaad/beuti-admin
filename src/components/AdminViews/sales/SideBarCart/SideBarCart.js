/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Col } from 'react-bootstrap';
import SearchClient from 'components/AdminViews/Bookings/commonViewsBooking/AddEditBooking/SelectClientSidebar/SearchClients';
import EmptyOrSelectedClient from 'components/AdminViews/Bookings/commonViewsBooking/AddEditBooking/SelectClientSidebar/EmptyOrSelectedClient';
import { CUSTOMER_ODATA_EP } from 'utils/API/EndPoints/CustomerEP';
import { CallAPI } from 'utils/API/APIConfig';
import SearchResult from 'components/AdminViews/Bookings/commonViewsBooking/AddEditBooking/SelectClientSidebar/SearchResult';
import EmptyData from '../EmptyData/EmptyData';
import SelectedItemCart from './SelectedItemCart';

export default function SideBarCart({
  setSearchFoucs,
  searchFoucs,
  setSalesData,
  salesData,
  setCollectPhase,
  couponValueForBooking,
  collectPhase,
  toPayAmount,
  openCheckoutUnpaidClicked,
  setOpenCheckoutUnpaidClicked,
  refetchAddBoookingCheckout,
  fetchingNewCheckout,
  setOpenCancelSaleModal,
  openCancelSaleModal,
  fetchingGetCheckout,
  setBookingSelectedInTheCart,
  isPOS,
}) {
  const { messages } = useIntl();
  const [searchValue, setSearchValue] = useState('');
  const [newClient, seNewClient] = useState(false);

  const { data: allClients, isFetching: clientLoading } = CallAPI({
    name: ['getAllClientsforSale', searchValue],
    url: CUSTOMER_ODATA_EP,
    baseURL: !isPOS
      ? `${process.env.REACT_APP_ODOMAIN}`
      : `${process.env.REACT_APP_POS_URL}/odata`,
    enabled: true,
    refetchOnWindowFocus: false,
    query: {
      $filter: `contains(name,'${searchValue}') or contains(phoneNumber,'${searchValue}') or contains(registeredName,'${searchValue}')`,
    },
    select: (data) => data.data.data.list,
  });
  return (
    <section className="booking-sidebar">
      <section className="booking-sidebar__clients">
        {!salesData?.brandCustomerId && (
          <div className="booking-sidebar__clients-search">
            <SearchClient
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              handleFoucs={setSearchFoucs}
            />
          </div>
        )}
        <div
          className={`${searchFoucs ? 'booking-sidebar__clients-result' : 'height-auto'}`}
        >
          {!searchFoucs && (
            <EmptyOrSelectedClient
              booking={salesData}
              setBooking={setSalesData}
              allClients={allClients}
              newClient={newClient}
              seNewClient={seNewClient}
              salesPage={salesData}
            />
          )}
          {searchFoucs && !salesData?.brandCustomerId && (
            <SearchResult
              clients={allClients}
              setSearchFoucs={setSearchFoucs}
              clientLoading={clientLoading}
              seNewClient={seNewClient}
              searchValue={searchValue}
              setSalesData={setSalesData}
              salesData={salesData}
              isPOS={isPOS}
            />
          )}
        </div>
        {!searchFoucs && (
          <section className="sales-details">
            {salesData?.itemsSelected?.length ? (
              fetchingGetCheckout ? (
                <div className="loading mt-5"></div>
              ) : (
                <SelectedItemCart
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
                  setBookingSelectedInTheCart={setBookingSelectedInTheCart}
                  isPOS={isPOS}
                />
              )
            ) : (
              <Col xs="12" className="mt-4">
                <EmptyData
                  image="/cart.svg"
                  title={messages['empty.cart']}
                  subTitle={messages['empty.cart.sub.title']}
                />
              </Col>
            )}
          </section>
        )}
      </section>
    </section>
  );
}
