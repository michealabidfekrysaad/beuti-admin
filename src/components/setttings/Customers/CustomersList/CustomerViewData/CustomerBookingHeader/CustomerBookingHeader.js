/* eslint-disable  */

import React from 'react';
import { useIntl } from 'react-intl';
import CustomerBookingDD from '../CustomerBookingView/CustomerBookingDD';

export default function CustomerBookingHeader({
  fetchBookings,
  fetchAllBookings,
  customerBookingsUpcoming,
  selectedStatusForBooking,
  customerPastBooking,
  loadMoreUpcmoing,
  setSelectedStatusForBooking,
  loadMorePast,
}) {
  const { messages } = useIntl();
  return (
    <div className="d-flex align-items-center justify-content-between">
      <div>
        {!fetchBookings &&
          !fetchAllBookings &&
          customerBookingsUpcoming?.length > 0 &&
          messages['customer.booking,upcoming.booking']}

        {!fetchAllBookings &&
          !fetchBookings &&
          customerBookingsUpcoming?.length === 0 &&
          customerPastBooking?.length > 0 &&
          messages['customer.booking,past.booking']}
      </div>
      <div>
        <CustomerBookingDD
          setSelectedStatus={setSelectedStatusForBooking}
          selectedStatus={selectedStatusForBooking}
        />
      </div>
    </div>
  );
}
