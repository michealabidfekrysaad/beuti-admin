/* eslint-disable react/prop-types */

import { Table, TableRow, TableCell, TableBody, TableHead } from '@material-ui/core';

import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import SVG from 'react-inlinesvg';
import Rating from '@material-ui/lab/Rating';
import moment from 'moment';

import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import TableAction from '../../../shared/TableAction';
import TableLoader from '../../../shared/TableLoader';

const CustomersTable = ({ customers, handleSort, customersLoading }) => {
  const { messages, locale } = useIntl();
  const history = useHistory();
  moment.locale(locale);
  return (
    <>
      <section className="beuti-table customerslist">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <button
                  type="button"
                  className="beuti-table__sort"
                  onClick={() => handleSort('name')}
                >
                  {messages['setting.customer.table.Name']}
                  <SVG className="mx-2" src={toAbsoluteUrl('/sort.svg')} />
                </button>
              </TableCell>
              <TableCell>
                <button
                  type="button"
                  className="beuti-table__sort"
                  onClick={() => handleSort('phoneNumber')}
                >
                  {messages['setting.customer.table.phone']}
                  <SVG className="mx-2" src={toAbsoluteUrl('/sort.svg')} />
                </button>
              </TableCell>
              <TableCell>
                <button
                  type="button"
                  className="beuti-table__sort"
                  onClick={() => handleSort('lastClosedBookingDate')}
                >
                  {messages['setting.customer.table.Lastappointment']}
                  <SVG className="mx-2" src={toAbsoluteUrl('/sort.svg')} />
                </button>
              </TableCell>

              <TableCell>
                <button
                  type="button"
                  className="beuti-table__sort"
                  onClick={() => handleSort('upcomingBookingDate')}
                >
                  {messages['setting.customer.table.Upcomingappointment']}
                  <SVG className="mx-2" src={toAbsoluteUrl('/sort.svg')} />
                </button>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {!customersLoading &&
              customers.map((customer) => (
                <TableRow
                  key={customer.id}
                  onClick={() => {
                    history.push(`/settingCustomers/customerProfile/${customer.id}`);
                  }}
                >
                  <TableCell>
                    {' '}
                    <div className="employeetable-name__info">
                      <p>
                        <span>{customer?.name || customer?.registeredName || '-'}</span>
                        {customer?.rate ? (
                          <span className="employeetable-name__info-rate">
                            <Rating
                              name="half-rating-read"
                              defaultValue={0}
                              value={customer.rate / 5}
                              precision={0.1}
                              max={1}
                              readOnly
                            />
                            {customer.rate?.toFixed(1)}
                          </span>
                        ) : (
                          ''
                        )}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{customer.phoneNumber || '-'}</TableCell>
                  <TableCell>
                    {(customer.lastClosedBookingDate &&
                      moment(customer.lastClosedBookingDate).format('D MMM YYYY')) ||
                      '-'}
                  </TableCell>
                  <TableCell>
                    {(customer.upcomingBookingDate &&
                      moment(customer.upcomingBookingDate).format('D MMM YYYY')) ||
                      '-'}
                  </TableCell>

                  <TableCell>
                    <div className="beuti-table__actions">
                      <TableAction
                        name="common.view"
                        onClick={() => {
                          history.push(
                            `/settingCustomers/customerProfile/${customer.id}`,
                          );
                        }}
                      >
                        <div>
                          <i
                            className={`${
                              locale === 'ar' ? 'flaticon2-back' : 'flaticon2-next'
                            }`}
                          ></i>
                        </div>
                      </TableAction>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            {customersLoading && <TableLoader colSpan="5" />}
          </TableBody>
        </Table>
      </section>
    </>
  );
};

export default CustomersTable;
