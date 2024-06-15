/* eslint-disable  */

import moment from 'moment';
import React from 'react';
import { Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import NoDataFound from '../../NoDataFound/NoDataFound';
import BookingSection from './BookingSection';

export default function CustomerBookingView({
  customerBookingsUpcoming,
  fetchBookings,
  customerPastBooking,
  fetchAllBookings,
  selectedStatusForBooking,
  loadMoreUpcmoing,
  setLoadMoreUpcoming,
  loadMorePast,
  setLoadMorePast,
}) {
  const { messages, locale } = useIntl();
  return (
    <>
      {(!customerBookingsUpcoming && !customerPastBooking) ||
      fetchBookings ||
      fetchAllBookings ? (
        <div className="loading"></div>
      ) : (
        <>
          {customerBookingsUpcoming?.map(
            (upComingBook, idex) =>
              idex < loadMoreUpcmoing && (
                <BookingSection
                  id={upComingBook?.id}
                  date={moment(upComingBook?.bookingDate)
                    .locale(locale)
                    .format('DD-MMM-YYYY')}
                  englishDate={moment(upComingBook?.bookingDate)
                    .locale('en')
                    .format('DD-MMM-YYYY')}
                  startTime={moment(upComingBook?.bookingStartTime)
                    .locale(locale)
                    .format('hh:mm a')}
                  number={upComingBook?.noOfServices}
                  total={upComingBook?.totalPriceWithVat}
                  bookingStatus={upComingBook?.bookingStatus}
                  paymentStatus={upComingBook?.lastInvoiceStatusId}
                  locationHome={upComingBook?.isHome}
                  unPaidAmount={upComingBook?.unPaidAmount}
                />
              ),
          )}

          {/* show more if there is upcoming booking */}
          {customerBookingsUpcoming?.length > 0 &&
            loadMoreUpcmoing < customerBookingsUpcoming?.length && (
              <Col xs={12} className="text-center">
                <button
                  type="button"
                  onClick={() => setLoadMoreUpcoming(loadMoreUpcmoing + 10)}
                  className="loadMore"
                >
                  {messages['common.show.more']}
                </button>
              </Col>
            )}

          <div className="view--header">
            {customerBookingsUpcoming?.length > 0 && customerPastBooking?.length > 0 && (
              <div className="mt-5">{messages['customer.booking,past.booking']}</div>
            )}
            {customerPastBooking?.map(
              (upComingBook, idex) =>
                idex < loadMorePast && (
                  <BookingSection
                    id={upComingBook?.id}
                    date={moment(upComingBook?.bookingDate)
                      .locale(locale)
                      .format('DD-MMM-YYYY')}
                    englishDate={moment(upComingBook?.bookingDate)
                      .locale('en')
                      .format('DD-MMM-YYYY')}
                    startTime={moment(upComingBook?.bookingStartTime)
                      .locale(locale)
                      .format('hh:mm a')}
                    number={upComingBook?.noOfServices}
                    total={upComingBook?.totalPriceWithVat}
                    bookingStatus={upComingBook?.bookingStatus}
                    paymentStatus={upComingBook?.lastInvoiceStatusId}
                    locationHome={upComingBook?.isHome}
                    unPaidAmount={upComingBook?.unPaidAmount}
                  />
                ),
            )}
          </div>

          {/* show more if there is past booking */}
          {customerPastBooking?.length > 0 && loadMorePast < customerPastBooking?.length && (
            <Col xs={12} className="text-center">
              <button
                type="button"
                onClick={() => setLoadMorePast(loadMorePast + 10)}
                className="loadMore"
              >
                {messages['common.show.more']}
              </button>
            </Col>
          )}

          {customerBookingsUpcoming?.length === 0 &&
            customerPastBooking?.length === 0 && (
              <NoDataFound
                src="/invoice-no.png"
                title="customer.booking.no.booking.found"
                subTitle="customer.booking.no.booking.found.sub.title"
              />
            )}
        </>
      )}
    </>
  );
}
