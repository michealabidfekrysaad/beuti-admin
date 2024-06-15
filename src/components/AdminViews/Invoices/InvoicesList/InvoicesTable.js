/* eslint-disable react/prop-types */
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  CircularProgress,
} from '@material-ui/core';
import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import moment from 'moment';
import TableLoader from 'components/shared/TableLoader';
import BeutiButton from 'Shared/inputs/BeutiButton';
import { useHistory } from 'react-router-dom';
import TableAction from '../../../shared/TableAction';

const handleStatus = {
  // 1: 'text-warning',
  2: 'text-success',
  3: 'text-secondary',
  4: 'text-secondary',
  5: 'text-danger',
};
const VouchersTable = ({
  vouchers,
  vouchersLoading,
  setSelectedInvoice,
  getInvoiceLoader,
  setOpenPaymentDetails,
}) => {
  const { messages, locale } = useIntl();
  const history = useHistory();
  moment.locale(locale);
  return (
    <>
      <section className="beuti-table customerslist">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">{messages['Invoice.id']}</TableCell>
              <TableCell align="center">{messages['Invoice.date']}</TableCell>
              <TableCell align="center">{messages['Invoice.client']} </TableCell>
              <TableCell align="center">{messages['Invoice.totalprice']} </TableCell>
              <TableCell align="center">{messages['offers.table.status']}</TableCell>
              <TableCell />
              <TableCell />

              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {!vouchersLoading &&
              vouchers.map((voucher) => (
                <TableRow
                  key={voucher.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedInvoice(voucher);
                  }}
                >
                  <TableCell align="center">{voucher.invoiceNumber}</TableCell>
                  <TableCell align="center">
                    {moment(voucher.createdDate).format('D MMM YYYY, hh:mma')}
                  </TableCell>
                  <TableCell
                    className={`${voucher.customerId ? 'link-customer' : ''}`}
                    align="center"
                    onClick={(e) => {
                      if (voucher.customerId) {
                        e.stopPropagation();
                        history.push(
                          `/settingCustomers/customerProfile/${voucher.customerId}?invoices=true`,
                        );
                      }
                    }}
                  >
                    {voucher.customerName}
                  </TableCell>

                  <TableCell align="center">
                    <FormattedMessage
                      id="vouchers.new.value.price"
                      values={{ price: voucher.priceWithVat }}
                    />
                  </TableCell>

                  <TableCell
                    align="center"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (voucher.statusId === 1) {
                        setOpenPaymentDetails({
                          paymentDetails: voucher.paymentDetails,
                          remainingAmount: voucher.remainingAmount,
                        });
                      }
                    }}
                  >
                    {handleStatus[voucher.statusId] && (
                      <span className={handleStatus[voucher.statusId]}>
                        {voucher.statusName}
                      </span>
                    )}
                    {voucher.statusId === 1 && (
                      <>
                        <span className="remaningamount">
                          {messages['Invoice.remaining']}
                        </span>
                      </>
                    )}
                  </TableCell>
                  <TableCell align="left">
                    {voucher.statusId === 1 && (
                      <FormattedMessage
                        id="vouchers.new.value.price"
                        values={{ price: voucher.remainingAmount }}
                      />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {(voucher.statusId === 1 || voucher.statusId === 5) && (
                      <BeutiButton
                        text={messages['booking.sidebar.status.checkout']}
                        onClick={() => {
                          if (+voucher.bookingId === 0) {
                            return history.push(`/sales/new/${voucher.checkOutId}`);
                          }
                          return history.push(`/sale/checkout/${voucher.bookingId}`);
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="beuti-table__actions">
                      <TableAction name="common.view">
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
            {vouchersLoading && <TableLoader colSpan="8" />}
          </TableBody>
          {getInvoiceLoader && (
            <div className="fullviewloader">
              <CircularProgress size={24} className="mx-auto" color="secondary" />
            </div>
          )}
        </Table>
      </section>
    </>
  );
};

export default VouchersTable;
