/* eslint-disable  */

import React from 'react';
import { useIntl } from 'react-intl';
import CustomerBookingDD from './CustomerBookingView/CustomerBookingDD';
import CustomerInvoiceDD from './CustomerInoiveView/CustomerInvoiceDD';
import CustomerBookingHeader from './CustomerBookingHeader/CustomerBookingHeader';
import CustomerInvoiceHeader from './CustomerInvoiceHeader/CustomerInvoiceHeader';

export default function CustomerViewHeaders({
  activeCustomerView,
  allCustomerViews,
  fetchBookings,
  customerBookingsUpcoming,
  selectedStatusForBooking,
  fetchAllBookings,
  loadMoreUpcmoing,
  customerPastBooking,
  setSelectedStatusForBooking,
  setSelectedStatus,
  selectedStatus,
  loadMorePast,
  customerInoicesRes,
}) {
  const { messages } = useIntl();
  return (
    <>
      {activeCustomerView === allCustomerViews?.booking && (
        <CustomerBookingHeader
          fetchBookings={fetchBookings}
          fetchAllBookings={fetchAllBookings}
          customerBookingsUpcoming={customerBookingsUpcoming}
          selectedStatusForBooking={selectedStatusForBooking}
          customerPastBooking={customerPastBooking}
          loadMoreUpcmoing={loadMoreUpcmoing}
          setSelectedStatusForBooking={setSelectedStatusForBooking}
          loadMorePast={loadMorePast}
        />
      )}
      {activeCustomerView === allCustomerViews?.invoices && (
        <CustomerInvoiceHeader
          customerInoicesRes={customerInoicesRes}
          setSelectedStatus={setSelectedStatus}
          selectedStatus={selectedStatus}
        />
      )}
    </>
  );
}
