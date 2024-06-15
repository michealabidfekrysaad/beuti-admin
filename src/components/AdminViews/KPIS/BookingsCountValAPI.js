import React, { useState, useEffect } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import { Header } from 'semantic-ui-react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';

import useAPI, { get } from 'hooks/useAPI';
import Loading from 'components/AdminViews/NewBooking/Loading/shimmer';
import { Card } from 'react-bootstrap';
import moment from 'moment';
// SUPER ADMIN
export default function BookingsCountValueKPI() {
  const { locale } = useIntl();
  const [date, setDate] = useState(new Date());
  const onChange = (event, data) => setDate(new Date(data.value.setHours(3, 0, 0, 0)));
  const {
    response: bookingRes,
    setRecall: getBookings,
    isLoading: gettingBookings,
  } = useAPI(
    get,
    `Booking/GetSPBookingsCount?bookingDate=${moment(date).format('YYYY-MM-DD')}`,
  );
  const { response: valuesRes, setRecall: getVals, isLoading: gettingValues } = useAPI(
    get,
    `Booking/GetSPBookingsValue?bookingDate=${moment(date).format('YYYY-MM-DD')}`,
  );

  useEffect(() => {
    getVals(true);
    getBookings(true);
  }, [date]);

  const RepeatedCell = () => (
    <TableCell>
      <Header.Content>
        <FormattedMessage id="closedBookings" />
      </Header.Content>
      <Header.Content>
        <FormattedMessage id="pendingBookings" />
      </Header.Content>
      <Header.Content>
        <FormattedMessage id="cancelledBookings" />
      </Header.Content>
      <Header.Content>
        <FormattedMessage id="confirmedBookings" />
      </Header.Content>
    </TableCell>
  );

  return (
    <>
      <Card className="h-100">
        <Card.Header className="border-bottom-0 pb-0">
          <div className="title">
            {' '}
            <FormattedMessage id="serviceDetails.bookings" />
          </div>
        </Card.Header>

        <Card.Body>
          <SemanticDatepicker
            locale="en-US"
            pointing={locale === 'ar' ? 'right' : 'left'}
            type="basic"
            size="tiny"
            value={new Date(date)}
            onChange={onChange}
            clearable={false}
            datePickerOnly
          />
          {gettingBookings || gettingValues ? (
            <>
              <Loading active />
            </>
          ) : (
            bookingRes &&
            bookingRes.data &&
            valuesRes &&
            valuesRes.data && (
              <>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell>
                        <FormattedMessage id="theCount" />
                      </TableCell>
                      <TableCell>
                        <FormattedMessage id="theValue" />
                      </TableCell>
                      <TableCell>
                        <FormattedMessage id="theAverage" />
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    <TableRow>
                      <TableCell align="center">
                        <Header as="h4" image>
                          <Header.Content>
                            <FormattedMessage id="customerApp" />
                          </Header.Content>
                        </Header>
                      </TableCell>
                      <RepeatedCell />
                      <TableCell>
                        <Header.Content>
                          {bookingRes.data.caSource.closedBookingCount}
                        </Header.Content>
                        <Header.Content>
                          {bookingRes.data.caSource.pendingBookingCount}
                        </Header.Content>
                        <Header.Content>
                          {bookingRes.data.caSource.cancelledBookingCount}
                        </Header.Content>
                        <Header.Content>
                          {bookingRes.data.caSource.confirmedBookingCount}
                        </Header.Content>
                      </TableCell>
                      <TableCell>
                        <Header.Content>
                          {valuesRes.data.caSource.closedBookingValue}
                        </Header.Content>
                        <Header.Content>
                          {valuesRes.data.caSource.pendingBookingValue}
                        </Header.Content>
                        <Header.Content>
                          {valuesRes.data.caSource.cancelledBookingValue}
                        </Header.Content>
                        <Header.Content>
                          {valuesRes.data.caSource.confimedBookingValue}
                        </Header.Content>
                      </TableCell>
                      <TableCell>
                        <Header.Content>
                          {valuesRes.data.caSource.closedBookingAverage}
                        </Header.Content>
                        <Header.Content>
                          {valuesRes.data.caSource.pendingBookingValue}
                        </Header.Content>
                        <Header.Content>
                          {valuesRes.data.caSource.cancelledBookingAverage}
                        </Header.Content>
                        <Header.Content>
                          {valuesRes.data.caSource.confimedBookingValue}
                        </Header.Content>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="center">
                        <Header as="h4" image>
                          <Header.Content>
                            <FormattedMessage id="serviceProvidersApp" />
                          </Header.Content>
                        </Header>
                      </TableCell>
                      <RepeatedCell />
                      <TableCell>
                        <Header.Content>
                          {bookingRes.data.spSource.closedBookingCount}
                        </Header.Content>
                        <Header.Content>
                          {bookingRes.data.spSource.pendingBookingCount}
                        </Header.Content>
                        <Header.Content>
                          {bookingRes.data.spSource.cancelledBookingCount}
                        </Header.Content>
                        <Header.Content>
                          {bookingRes.data.spSource.confirmedBookingCount}
                        </Header.Content>
                      </TableCell>
                      <TableCell>
                        <Header.Content>
                          {valuesRes.data.spSource.closedBookingValue}
                        </Header.Content>
                        <Header.Content>
                          {valuesRes.data.spSource.pendingBookingAverage}
                        </Header.Content>
                        <Header.Content>
                          {valuesRes.data.spSource.cancelledBookingValue}
                        </Header.Content>
                        <Header.Content>
                          {valuesRes.data.spSource.confimedBookingValue}
                        </Header.Content>
                      </TableCell>
                      <TableCell>
                        <Header.Content>
                          {valuesRes.data.spSource.closedBookingAverage}
                        </Header.Content>
                        <Header.Content>
                          {valuesRes.data.spSource.pendingBookingValue}
                        </Header.Content>
                        <Header.Content>
                          {valuesRes.data.spSource.cancelledBookingAverage}
                        </Header.Content>
                        <Header.Content>
                          {valuesRes.data.spSource.confimedBookingAverage}
                        </Header.Content>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="center">
                        <Header as="h4" image>
                          <Header.Content>
                            <FormattedMessage id="bookingWizardApp" />
                          </Header.Content>
                        </Header>
                      </TableCell>
                      <RepeatedCell />
                      <TableCell>
                        <Header.Content>
                          {bookingRes.data.bwSource.closedBookingCount}
                        </Header.Content>
                        <Header.Content>
                          {bookingRes.data.bwSource.pendingBookingCount}
                        </Header.Content>
                        <Header.Content>
                          {bookingRes.data.bwSource.cancelledBookingCount}
                        </Header.Content>
                        <Header.Content>
                          {bookingRes.data.bwSource.confirmedBookingCount}
                        </Header.Content>
                      </TableCell>
                      <TableCell>
                        <Header.Content>
                          {valuesRes.data.bwSource.closedBookingValue}
                        </Header.Content>
                        <Header.Content>
                          {valuesRes.data.bwSource.pendingBookingValue}
                        </Header.Content>
                        <Header.Content>
                          {valuesRes.data.bwSource.cancelledBookingValue}
                        </Header.Content>
                        <Header.Content>
                          {valuesRes.data.bwSource.confimedBookingValue}
                        </Header.Content>
                      </TableCell>
                      <TableCell>
                        <Header.Content>
                          {valuesRes.data.bwSource.closedBookingAverage}
                        </Header.Content>
                        <Header.Content>
                          {valuesRes.data.bwSource.pendingBookingAverage}
                        </Header.Content>
                        <Header.Content>
                          {valuesRes.data.bwSource.cancelledBookingAverage}
                        </Header.Content>
                        <Header.Content>
                          {valuesRes.data.bwSource.confimedBookingAverage}
                        </Header.Content>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </>
            )
          )}
        </Card.Body>
      </Card>
    </>
  );
}
