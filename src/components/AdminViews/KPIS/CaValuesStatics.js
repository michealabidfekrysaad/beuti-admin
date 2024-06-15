import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Header } from 'semantic-ui-react';
import { Table, TableBody, TableCell, TableRow } from '@material-ui/core';

import Loading from 'components/AdminViews/NewBooking/Loading/shimmer';
import { Card } from 'react-bootstrap';
// SUPER ADMIN
export default function CaValuesStatics({
  valuesRes,
  bookingRes,
  gettingBookings,
  gettingValues,
}) {
  //   the numbers is
  //   عدد
  //   القيمة
  //   المتوسط

  const RepeatedCell = () => (
    <TableCell>
      <Header.Content className="text-secondary">
        <FormattedMessage id="closedBookings" />
      </Header.Content>
      <Header.Content className="text-secondary">
        <FormattedMessage id="pendingBookings" />
      </Header.Content>
      <Header.Content className="text-secondary">
        <FormattedMessage id="cancelledBookings" />
      </Header.Content>
      <Header.Content className="text-secondary">
        <FormattedMessage id="confirmedBookings" />
      </Header.Content>
    </TableCell>
  );

  return (
    <>
      <Card className="admin-statistics">
        <Card.Body>
          {gettingBookings || gettingValues ? (
            <>
              <Loading active />
            </>
          ) : (
            bookingRes?.data &&
            valuesRes?.data && (
              <>
                <h1 className="title-primary text-center">
                  <FormattedMessage id="customerApp" />
                </h1>
                <hr />
                <div className="text-center p-5 font-weight-bold">14%</div>
                <Table>
                  <TableBody>
                    <TableRow>
                      <RepeatedCell />
                      <TableCell>
                        <Header.Content className="text-secondary">
                          {bookingRes.data.caSource.closedBookingCount}
                        </Header.Content>
                        <Header.Content className="text-secondary">
                          {bookingRes.data.caSource.pendingBookingCount}
                        </Header.Content>
                        <Header.Content className="text-secondary">
                          {bookingRes.data.caSource.cancelledBookingCount}
                        </Header.Content>
                        <Header.Content className="text-secondary">
                          {bookingRes.data.caSource.confirmedBookingCount}
                        </Header.Content>
                      </TableCell>
                      <TableCell>
                        <Header.Content className="text-secondary">
                          {valuesRes.data.caSource.closedBookingValue}
                        </Header.Content>
                        <Header.Content className="text-secondary">
                          {valuesRes.data.caSource.pendingBookingValue}
                        </Header.Content>
                        <Header.Content className="text-secondary">
                          {valuesRes.data.caSource.cancelledBookingValue}
                        </Header.Content>
                        <Header.Content className="text-secondary">
                          {valuesRes.data.caSource.confimedBookingValue}
                        </Header.Content>
                      </TableCell>
                      <TableCell>
                        <Header.Content className="text-secondary">
                          {valuesRes.data.caSource.closedBookingAverage}
                        </Header.Content>
                        <Header.Content className="text-secondary">
                          {valuesRes.data.caSource.pendingBookingValue}
                        </Header.Content>
                        <Header.Content className="text-secondary">
                          {valuesRes.data.caSource.cancelledBookingAverage}
                        </Header.Content>
                        <Header.Content className="text-secondary">
                          {valuesRes.data.caSource.confimedBookingValue}
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

CaValuesStatics.propTypes = {
  valuesRes: PropTypes.object,
  bookingRes: PropTypes.object,
  gettingBookings: PropTypes.bool,
  gettingValues: PropTypes.bool,
};
