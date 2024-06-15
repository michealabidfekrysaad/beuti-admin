/* eslint-disable  */

import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import SVG from 'react-inlinesvg';
import { BookingContext } from 'providers/BookingProvider';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import ClientItem from './ClientItem';
import { AddCustomerModal } from './AddClientModal';
import { useIntl } from 'react-intl';
import { CircularProgress } from '@material-ui/core';
const SearchResult = ({
  clients,
  setSearchFoucs,
  clientLoading,
  seNewClient,
  setAddBookingFlag = () => {},
  searchValue = '',
  setSalesData = () => {},
  salesData = false,
  isPOS = false,
}) => {
  const { messages } = useIntl();
  const [openAddCustomerModal, setOpenAddCustomerModal] = useState(false);
  const { booking, setBooking } = useContext(BookingContext);

  return (
    <section className="booking-sidebar__clients-result--allClients" role="button">
      <div className="addclient">
        <button
          type="button"
          className="addclient-button"
          onClick={() => {
            setAddBookingFlag(false);
            setOpenAddCustomerModal(true);
          }}
        >
          <SVG src={toAbsoluteUrl('/plus.svg')} />{' '}
          <span> {messages['booking.sidebar.create.customer']}</span>
        </button>
      </div>
      {clients?.length ? (
        clients?.map((client) => (
          <ClientItem
            key={client?.id}
            client={client}
            onClick={(clientData) => {
              setBooking({
                ...booking,
                brandCustomerId: clientData.id,
                customer: clientData,
              });
              setSalesData({
                ...salesData,
                brandCustomerId: clientData.id,
                customer: clientData,
              });
              setSearchFoucs(false);
            }}
          />
        ))
      ) : (
        <section className="client-loading">
          {clientLoading ? (
            <CircularProgress size={24} className="mx-auto" color="secondary" />
          ) : (
            <div>
              {
                messages[
                  `${
                    salesData
                      ? 'booking.sidebar.no.client.found.sale'
                      : 'booking.sidebar.no.client.found'
                  }`
                ]
              }
            </div>
          )}
        </section>
      )}
      <AddCustomerModal
        openModal={!!openAddCustomerModal}
        setSearchFoucs={setSearchFoucs}
        setOpenModal={setOpenAddCustomerModal}
        seNewClient={seNewClient}
        searchValue={searchValue}
        setSalesData={setSalesData}
        salesData={salesData}
        isPOS={isPOS}
      />
    </section>
  );
};

SearchResult.propTypes = {
  clients: PropTypes.array,
  setSearchFoucs: PropTypes.func,
  clientLoading: PropTypes.bool,
  searchValue: PropTypes.string,
  isPOS: PropTypes.bool,
};

export default SearchResult;
