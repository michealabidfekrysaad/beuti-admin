/* eslint-disable  */

import React from 'react';
import { useIntl } from 'react-intl';
import CustomerBookingDD from './CustomerBookingView/CustomerBookingDD';
import CustomerBookingView from './CustomerBookingView/CustomerBookingView';
import CustomerInvoiceDD from './CustomerInoiveView/CustomerInvoiceDD';
import CustomerInvoiceView from './CustomerInoiveView/CustomerInvoiceView';
import CustomerViewHeaders from './CustomerViewHeaders';

export default function CustomerViewData({
  activeCustomerView,
  allCustomerViews,
  customerInoicesRes,
  callInvoices,
  selectedStatus,
  setSelectedStatus,
  fetchInvoices,
  customerBookingsUpcoming,
  fetchBookings,
  customerPastBooking,
  fetchAllBookings,
  selectedStatusForBooking,
  setSelectedStatusForBooking,
  loadMoreUpcmoing,
  setLoadMoreUpcoming,
  loadMorePast,
  setLoadMorePast,
}) {
  const { messages } = useIntl();
  return (
    <>
      <div className="view--header">
        <CustomerViewHeaders
          activeCustomerView={activeCustomerView}
          allCustomerViews={allCustomerViews}
          fetchBookings={fetchBookings}
          customerBookingsUpcoming={customerBookingsUpcoming}
          selectedStatusForBooking={selectedStatusForBooking}
          fetchAllBookings={fetchAllBookings}
          loadMoreUpcmoing={loadMoreUpcmoing}
          customerPastBooking={customerPastBooking}
          setSelectedStatusForBooking={setSelectedStatusForBooking}
          setSelectedStatus={setSelectedStatus}
          selectedStatus={selectedStatus}
          loadMorePast={loadMorePast}
          customerInoicesRes={customerInoicesRes}
        />
      </div>

      {activeCustomerView === allCustomerViews?.booking && (
        <CustomerBookingView
          customerBookingsUpcoming={customerBookingsUpcoming}
          fetchBookings={fetchBookings}
          customerPastBooking={customerPastBooking}
          fetchAllBookings={fetchAllBookings}
          selectedStatusForBooking={selectedStatusForBooking}
          loadMoreUpcmoing={loadMoreUpcmoing}
          setLoadMoreUpcoming={setLoadMoreUpcoming}
          loadMorePast={loadMorePast}
          setLoadMorePast={setLoadMorePast}
        />
      )}
      {activeCustomerView === allCustomerViews?.invoices && (
        <CustomerInvoiceView
          customerInoicesRes={customerInoicesRes}
          fetchInvoices={fetchInvoices}
          callInvoices={callInvoices}
          selectedStatus={selectedStatus}
        />
      )}
    </>
  );
}
