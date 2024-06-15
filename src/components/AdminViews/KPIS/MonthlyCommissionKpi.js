/* eslint-disable react/prop-types */
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';

import Loading from 'components/AdminViews/NewBooking/Loading/shimmer';
import { Card } from 'react-bootstrap';
export default function MonthlyCommisionKPI({ response, isLoading }) {
  return (
    <>
      <Card className="admin-statistics">
        <Card.Body>
          {isLoading ? (
            <>
              <Loading active />
            </>
          ) : (
            <>
              <h1 className="title-primary text-center">
                <FormattedMessage id="kpis.commisions" />
              </h1>
              <hr />
              <Table className="mt-5">
                <TableHead>
                  <TableRow>
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
                      <FormattedMessage id="customerApp" />
                    </TableCell>
                    <TableCell>{response?.data?.customerCommission?.count}</TableCell>
                    <TableCell>{response?.data?.customerCommission?.value}</TableCell>
                    <TableCell>
                      {response?.data?.customerCommission?.average.toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="center">
                      <FormattedMessage id="bookingWizardApp" />
                    </TableCell>
                    <TableCell>{response?.data?.bwCommission?.count}</TableCell>
                    <TableCell>{response?.data?.bwCommission?.value}</TableCell>
                    <TableCell>{response?.data?.bwCommission?.average}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </>
          )}
        </Card.Body>
      </Card>
    </>
  );
}
