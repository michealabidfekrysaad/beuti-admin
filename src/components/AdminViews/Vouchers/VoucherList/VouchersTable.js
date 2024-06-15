/* eslint-disable react/prop-types */
import { Table, TableRow, TableCell, TableBody, TableHead } from '@material-ui/core';
import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import TableLoader from 'components/shared/TableLoader';
import TableAction from '../../../shared/TableAction';

const VouchersTable = ({ vouchers, vouchersLoading }) => {
  const { messages, locale } = useIntl();
  const history = useHistory();
  moment.locale(locale);

  return (
    <>
      <section className="beuti-table customerslist">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">{messages['voucher.Code']}</TableCell>
              <TableCell align="center">{messages['voucher.Value']}</TableCell>
              <TableCell align="center">{messages['offers.input.start']} </TableCell>
              <TableCell align="center">{messages['offers.input.end']} </TableCell>
              <TableCell align="center">{messages['offers.table.status']}</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {!vouchersLoading &&
              vouchers.map((voucher) => (
                <TableRow
                  key={voucher.id}
                  onClick={() => {
                    history.push(`/voucherList/viewVoucher/${voucher.id}`);
                  }}
                >
                  <TableCell align="center">{voucher.code}</TableCell>
                  <TableCell align="center">
                    <FormattedMessage
                      id="vouchers.new.value.price"
                      values={{ price: voucher.value }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    {moment(voucher.startDate).format('D MMM YYYY')}
                  </TableCell>

                  <TableCell align="center">
                    {moment(voucher.expirationDate).format('D MMM YYYY')}
                  </TableCell>

                  <TableCell align="center">
                    {voucher.status === 1 && (
                      <span className="text-warning">
                        {messages['offers.table.status.upcoming']}
                      </span>
                    )}
                    {voucher.status === 2 && (
                      <span className="text-success">
                        {messages['offers.table.status.active']}
                      </span>
                    )}
                    {voucher.status === 3 && (
                      <span className="text-danger">
                        {messages['offers.table.status.expired']}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="beuti-table__actions">
                      <TableAction
                        name="common.view"
                        onClick={() => {
                          history.push(`/voucherList/viewVoucher/${voucher.id}`);
                        }}
                      >
                        <div>
                          <i
                            className={`${
                              locale === 'ar'
                                ? 'flaticon2-back arrow-move'
                                : 'flaticon2-next arrow-move'
                            }`}
                          ></i>
                        </div>
                      </TableAction>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            {vouchersLoading && <TableLoader colSpan="6" />}
          </TableBody>
        </Table>
      </section>
    </>
  );
};

export default VouchersTable;
