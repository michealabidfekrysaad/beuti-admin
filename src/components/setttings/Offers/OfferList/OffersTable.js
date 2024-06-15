/* eslint-disable react/prop-types */

import { Table, TableRow, TableCell, TableBody, TableHead } from '@material-ui/core';

import React, { useContext } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import SVG from 'react-inlinesvg';
import moment from 'moment';

import { BranchesContext } from 'providers/BranchesSelections';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import TableAction from '../../../shared/TableAction';
import TableLoader from '../../../shared/TableLoader';

const OffersTable = ({ Offers, handleDelete, handleSort, offersLoading }) => {
  const { messages, locale } = useIntl();
  const history = useHistory();
  moment.locale(locale);

  const { setBranches } = useContext(BranchesContext);
  return (
    <>
      <section className="beuti-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <button
                  type="button"
                  className="beuti-table__sort"
                  onClick={() => handleSort('offerName')}
                >
                  {messages['offers.table.name']}
                  <SVG className="mx-2" src={toAbsoluteUrl('/sort.svg')} />
                </button>
              </TableCell>
              <TableCell align="center">
                <button
                  type="button"
                  className="beuti-table__sort"
                  onClick={() => handleSort('percentage')}
                >
                  {messages['offers.table.discount']}{' '}
                  <SVG className="mx-2" src={toAbsoluteUrl('/sort.svg')} />
                </button>
              </TableCell>
              <TableCell align="center">
                {messages['offers.table.bookingperiod']}{' '}
              </TableCell>
              <TableCell align="center">
                {messages['offers.table.executionperiod']}{' '}
              </TableCell>
              <TableCell align="center">
                <button
                  type="button"
                  className="beuti-table__sort"
                  onClick={() => handleSort('serviceCount')}
                >
                  {messages['offers.table.services']}
                  <SVG className="mx-2" src={toAbsoluteUrl('/sort.svg')} />
                </button>
              </TableCell>
              <TableCell align="center">
                <button
                  type="button"
                  className="beuti-table__sort"
                  onClick={() => handleSort('status')}
                >
                  {messages['offers.table.status']}
                  <SVG className="mx-2" src={toAbsoluteUrl('/sort.svg')} />
                </button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!offersLoading &&
              Offers &&
              Offers.map((offer) => (
                <TableRow key={offer.id}>
                  <TableCell align="center">{offer.offerName || '-'}</TableCell>
                  <TableCell align="center">
                    {offer.percentage ? (
                      <FormattedMessage
                        id="offers.table.discount.perctange"
                        values={{ count: offer.percentage }}
                      />
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell align="center">{`${moment(offer.bookingPeriodFrom).format(
                    'D MMM YYYY',
                  )} - ${moment(offer.bookingPeriodTo).format('D MMM YYYY')}`}</TableCell>

                  <TableCell align="center">{`${moment(offer.executionPeriodFrom).format(
                    'D MMM YYYY',
                  )} - ${moment(offer.executionPeriodTo).format(
                    'D MMM YYYY',
                  )}`}</TableCell>
                  <TableCell align="center">
                    {offer.serviceCount ? (
                      <FormattedMessage
                        id="offers.table.service"
                        values={{ count: offer.serviceCount }}
                      />
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {offer.status === 1 && (
                      <span className="text-warning">
                        {messages['offers.table.status.upcoming']}
                      </span>
                    )}
                    {offer.status === 2 && (
                      <span className="text-success">
                        {messages['offers.table.status.active']}
                      </span>
                    )}
                    {offer.status === 3 && (
                      <span>{messages['offers.table.status.expired']}</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            {offersLoading && <TableLoader colSpan="6" />}
          </TableBody>
        </Table>
      </section>
    </>
  );
};

export default OffersTable;
