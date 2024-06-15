/* eslint-disable  */

import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { BookingContext } from 'providers/BookingProvider';
import BookingActions from './SelectClientSidebar/BookingActions';
import SearchClient from './SelectClientSidebar/SearchClients';
import EmptyOrSelectedClient from './SelectClientSidebar/EmptyOrSelectedClient';
import { CallAPI } from '../../../../../utils/API/APIConfig';
import { CUSTOMER_ODATA_EP } from '../../../../../utils/API/EndPoints/CustomerEP';
import SearchResult from './SelectClientSidebar/SearchResult';

export default function SelectClientSidebar({
  searchFoucs,
  setSearchFoucs,
  watch,
  feesSelected = 0,
  setAddBookingFlag = () => {},
}) {
  const [searchValue, setSearchValue] = useState('');
  const { booking, setBooking } = useContext(BookingContext);
  const [price, setPrice] = useState(0);
  const [isFrom, setIsFrom] = useState(0);
  const [newClient, seNewClient] = useState(false);

  const { data: allClients, isFetching: clientLoading } = CallAPI({
    name: ['getAllClients', searchValue],
    url: CUSTOMER_ODATA_EP,
    baseURL: process.env.REACT_APP_ODOMAIN,
    enabled: true,
    refetchOnWindowFocus: false,
    query: {
      $filter: `contains(name,'${searchValue}') or contains(phoneNumber,'${searchValue}') or contains(registeredName,'${searchValue}')`,
    },
    select: (data) => data.data.data.list,
  });

  useEffect(() => {
    if (watch) {
      const subscription = watch((input, { name }) => {
        if (name.includes('bookedServices')) {
          setIsFrom(input?.bookedServices.some((ele) => ele.isPriceFrom));
          const flatAllPackages = input.bookedServices.reduce((prev, current) => {
            return +prev + (+current.priceWithVat || 0);
          }, 0);
          if (+flatAllPackages > 0) {
            return setPrice(flatAllPackages.toFixed(2));
          }
          return setPrice(flatAllPackages);
        }
      });
      return () => subscription.unsubscribe();
    }
    return null;
  }, [watch]);

  return (
    <>
      <section className="booking-sidebar__clients">
        {!booking.brandCustomerId && (
          <div className="booking-sidebar__clients-search">
            <SearchClient
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              handleFoucs={setSearchFoucs}
            />
          </div>
        )}
        <div className="booking-sidebar__clients-result">
          {!searchFoucs && (
            <EmptyOrSelectedClient
              booking={booking}
              setBooking={setBooking}
              allClients={allClients}
              newClient={newClient}
              seNewClient={seNewClient}
            />
          )}
          {searchFoucs && !booking.brandCustomerId && (
            <SearchResult
              clients={allClients}
              setSearchFoucs={setSearchFoucs}
              clientLoading={clientLoading}
              seNewClient={seNewClient}
              setAddBookingFlag={setAddBookingFlag}
              searchValue={searchValue}
            />
          )}
        </div>
        {!searchFoucs && (
          <section>
            <BookingActions
              watch={watch}
              price={price}
              isFrom={isFrom}
              feesSelected={feesSelected}
              setAddBookingFlag={setAddBookingFlag}
            />
          </section>
        )}
      </section>
    </>
  );
}
SelectClientSidebar.propTypes = {
  searchFoucs: PropTypes.bool,
  setSearchFoucs: PropTypes.func,
  watch: PropTypes.func,
};
