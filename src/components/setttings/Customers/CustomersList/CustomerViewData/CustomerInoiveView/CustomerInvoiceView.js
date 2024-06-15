/* eslint-disable  */

import React, { useState } from 'react';
import NoDataFound from '../../NoDataFound/NoDataFound';
import { Table, TableRow, TableCell, TableBody, TableHead } from '@material-ui/core';
import { FormattedMessage, useIntl } from 'react-intl';
import moment from 'moment';
import InoviceDetails from 'components/AdminViews/Bookings/commonViewsBooking/viewBooking/ViewBookingSIdebar/InoviceDetail';
import PaymentDetails from './PaymentDetails';

export default function CustomerInvoiceView({
  customerInoicesRes,
  fetchInvoices,
  selectedStatus,
  callInvoices,
}) {
  const { messages, locale } = useIntl();
  const [openInvoice, setOpenInvoice] = useState(false);
  const [paymentStatusId, setPaymentStatusId] = useState(1);
  const [invoiceImg, setInvoiceImg] = useState(false);
  const [openPaymentDetails, setOpenPaymentDetails] = useState(false);
  const [invoiceForPaymentModal, setInvoiceForPaymentModal] = useState({});
  const [selectedInvoice, setSelectedInvoice] = useState({});
  console.log(selectedInvoice);
  const tableCells = [
    'setting.customer.invoice.table.invoice',
    'common.branchname',
    'setting.customer.invoice.table.createdOn',
    'setting.customer.invoice.table.total',
    'setting.customer.invoice.table.Payment',
    '',
  ];
  const returnStatusTypeForInvoice = (typeId, remainAmount) => {
    if (typeId === 2) {
      return (
        <div className="invoice-status">
          <div className="d-flex">
            <span className="invoice-status--paid">
              {messages['setting.customer.invoice.paid']}
            </span>
            {remainAmount > 0 && (
              <span className={`${locale === 'ar' ? 'pr-5' : 'pl-5'} remaining`}>
                <FormattedMessage
                  id="setting.customer.remaining.sar"
                  values={{
                    amount: remainAmount,
                  }}
                />
              </span>
            )}
          </div>
        </div>
      );
    }
    if (typeId === 1) {
      return (
        <div className="invoice-status">
          <div className="d-flex">
            <span className="invoice-status--partial">
              {messages['setting.customer.invoice.table.part.paid']}
            </span>
            {remainAmount > 0 && (
              <span className={`${locale === 'ar' ? 'pr-5' : 'pl-5'} remaining`}>
                <FormattedMessage
                  id="setting.customer.remaining.sar"
                  values={{
                    amount: remainAmount,
                  }}
                />
              </span>
            )}
          </div>
        </div>
      );
    }
    if (typeId === 4) {
      return (
        <div className="invoice-status">
          <div className="d-flex">
            <span className="invoice-status--refund ">
              {messages['setting.customer.invoice.refunded']}
            </span>
            {remainAmount > 0 && (
              <span className={`${locale === 'ar' ? 'pr-5' : 'pl-5'} remaining`}>
                <FormattedMessage
                  id="setting.customer.remaining.sar"
                  values={{
                    amount: remainAmount,
                  }}
                />
              </span>
            )}
          </div>
        </div>
      );
    }
    if (typeId === 5) {
      return (
        <div className="invoice-status">
          <div className="d-flex">
            <span className="invoice-status--un-paid">
              {messages['setting.customer.invoice.unpaid']}{' '}
            </span>
            {remainAmount > 0 && (
              <span className={`${locale === 'ar' ? 'pr-5' : 'pl-5'} remaining`}>
                <FormattedMessage
                  id="setting.customer.remaining.sar"
                  values={{
                    amount: remainAmount,
                  }}
                />
              </span>
            )}
          </div>
        </div>
      );
    }
    return null;
  };
  const handlePaymentText = (messages, paymentStatusId) => {
    if (paymentStatusId === 1) return messages['booking.sidebar.status.partially'];
    if (paymentStatusId === 2) return messages['booking.sidebar.status.paid'];
    if (paymentStatusId === 4) return messages['booking.sidebar.status.refund'];
    if (paymentStatusId === 5) return messages['booking.sidebar.status.unpaid'];
    return null;
  };

  return (
    <div>
      {fetchInvoices ? (
        <div className="loading"></div>
      ) : customerInoicesRes?.length && !fetchInvoices ? (
        <section className="beuti-table invoice-table">
          <Table>
            <TableHead>
              <TableRow>
                {tableCells?.map((cell) => (
                  <TableCell>{messages[cell]}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {customerInoicesRes &&
                customerInoicesRes.map((invoice) => (
                  <TableRow
                    className="invoice-table__row"
                    key={invoice?.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenInvoice(true);
                      setPaymentStatusId(invoice?.invoiceStatusType);
                      setInvoiceImg(invoice?.invoiceImage);
                      setSelectedInvoice(invoice);
                    }}
                  >
                    <TableCell>
                      {locale === 'en' && '#'}
                      {invoice?.invoiceNumber}
                      {locale !== 'en' && '#'}
                    </TableCell>
                    <TableCell>{invoice?.spName}</TableCell>
                    <TableCell>
                      {moment(invoice?.transactionDateTime)
                        .locale(locale)
                        .format('DD MMM YYYY - hh:mm')}
                    </TableCell>
                    <TableCell>
                      {invoice?.bookingAmount} {messages['currency']}
                    </TableCell>
                    <TableCell
                      onClick={(e) => {
                        if (invoice?.invoiceStatusType === 1) {
                          e.stopPropagation();
                          setOpenPaymentDetails(true);
                          setInvoiceForPaymentModal(invoice);
                        }
                      }}
                    >
                      {returnStatusTypeForInvoice(
                        invoice?.invoiceStatusType,
                        invoice?.remainingAmount,
                      )}
                    </TableCell>
                    <TableCell>
                      <i
                        className={`${
                          locale !== 'ar'
                            ? 'flaticon2-right-arrow'
                            : 'flaticon2-left-arrow'
                        }`}
                      ></i>
                    </TableCell>
                  </TableRow>
                ))}
              {customerInoicesRes?.length === 0 && (
                <TableRow className="invoice-table__row">
                  <TableCell colspan={5} className="text-center">
                    {messages['setting.customer.no.invoice.title']}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </section>
      ) : (
        <NoDataFound
          src="/invoice-no.png"
          title="setting.customer.no.invoice.title"
          subTitle="setting.customer.no.invoice.sub.title"
        />
      )}
      <InoviceDetails
        onClose={setOpenInvoice}
        open={openInvoice}
        inoviceImg={invoiceImg}
        bookingPaymentStatus={handlePaymentText(messages, paymentStatusId)}
        canRefund={selectedInvoice.canRefund}
        paidAmount={selectedInvoice.paidAmount}
        onlinePaid={selectedInvoice.onlinePaidAmount}
        checkoutId={selectedInvoice?.id}
        callBackAfterRefund={() => callInvoices()}
        callBackAfterClose={() => setSelectedInvoice({})}
      />
      <PaymentDetails
        openModal={openPaymentDetails}
        setOpenModal={setOpenPaymentDetails}
        invoiceForPaymentModal={invoiceForPaymentModal}
      />
    </div>
  );
}
