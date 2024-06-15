/* eslint-disable  */

import React, { useContext, useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { BranchesContext } from 'providers/BranchesSelections';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import BeutiPagination from 'components/shared/BeutiPagination';
import InoviceDetails from 'components/AdminViews/Bookings/commonViewsBooking/viewBooking/ViewBookingSIdebar/InoviceDetail';
import SearchInput from 'components/shared/searchInput';
import RangeDateSelect from 'Shared/inputs/RangeDateSelect';
import moment from 'moment';
import { toADayFormat } from 'functions/MomentHandlers';
import { CallAPI } from '../../../utils/API/APIConfig';

import InvoicesTable from './InvoicesList/InvoicesTable';
import NoOInvoicesYet from './InvoicesList/NoInvoicesYet';
import './Invoices.scss';
import CustomerInvoiceDD from '../../setttings/Customers/CustomersList/CustomerViewData/CustomerInoiveView/CustomerInvoiceDD';
import PaymentDetails from '../../setttings/Customers/CustomersList/CustomerViewData/CustomerInoiveView/PaymentDetails';
import { downloadAsCSV } from '../../../functions/DownloadHelper';
import BeutiButton from '../../../Shared/inputs/BeutiButton';
const handlePaymentText = (messages, paymentStatusId) => {
  if (paymentStatusId === 1) return messages['booking.sidebar.status.partially'];
  if (paymentStatusId === 2) return messages['booking.sidebar.status.paid'];
  if (paymentStatusId === 3) return messages['booking.sidebar.status.paid'];
  if (paymentStatusId === 4) return messages['booking.sidebar.status.refund'];
  if (paymentStatusId === 5) return messages['booking.sidebar.status.unpaid'];
  return null;
};
const InvoicessList = () => {
  moment.locale('en');
  const { messages } = useIntl();
  const { page } = useParams();
  const history = useHistory();
  const location = useLocation();
  const { branches } = useContext(BranchesContext);
  const [filtedInvoices, setFiltedInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState({});
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [openPaymentDetails, setOpenPaymentDetails] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({});
  const [searchValue, setSearchValue] = useState('');
  const [openInvoice, setOpenInvoice] = useState(false);
  const [paginationController, setPaginationController] = useState({
    pagesMax: 10,
    pageNumber: +page || 0,
  });
  const [selectedDate, setSelectedDate] = useState({
    start: moment(new Date())
      .subtract(1, 'years')
      .format('YYYY-MM-DD'),
    end: moment(new Date()).format('YYYY-MM-DD'),
  });
  const handleFilteration = () =>
    !!selectedStatus.length ? ` and statusId in (${selectedStatus}) ` : '';

  /* -------------------------------------------------------------------------- */
  /*                              Get All Invoices                              */
  /* -------------------------------------------------------------------------- */
  const { refetch: getAllInovice, isFetching } = CallAPI({
    name: [
      'getAllInovice',
      selectedStatus,
      selectedDate.start,
      selectedDate.end,
      searchValue,
    ],
    url: '/SPInvoiceOData',
    baseURL: process.env.REACT_APP_ODOMAIN,
    enabled: !!selectedDate.start && !!selectedDate.end,
    select: (data) => data.data.data.list,
    onSuccess: (list) => {
      setFiltedInvoices(list);
      getCount(true);
    },
    refetchOnWindowFocus: false,
    query: {
      $skip: paginationController.pageNumber * paginationController.pagesMax,
      $top: paginationController.pagesMax,
      $filter: `(contains(customerName,'${searchValue}') or (contains(cast(invoiceNumber, 'Edm.String'),'${searchValue}'))) and createdDate gt ${
        selectedDate.start
      } and (createdDate lt ${selectedDate.end} or createdDate eq ${
        selectedDate.end
      })  ${handleFilteration()} `,
      $orderby: `invoiceNumber desc`,
    },
  });
  /* -------------------------------------------------------------------------- */
  /*                               Invoices Count                               */
  /* -------------------------------------------------------------------------- */
  const { refetch: getCount, data: countData } = CallAPI({
    name: 'getCountInvoice',
    url: '/SPInvoiceOData/$count',
    baseURL: process.env.REACT_APP_ODOMAIN,
    refetchOnWindowFocus: false,
    select: (data) => data.data.data.list,
    query: {
      $filter: `(contains(customerName,'${searchValue}') or (contains(cast(invoiceNumber, 'Edm.String'),'${searchValue}')))  and createdDate gt ${
        selectedDate.start
      }  ${handleFilteration()} `,
    },
  });
  const { data: InvoiceImgData, isFetching: InvoiceImgLoading } = CallAPI({
    name: ['getInvoiceImg', selectedInvoice?.invoiceUniqueKey],
    url: 'CheckOut/GetInvoiceImageByUniqueKey',
    enabled: !!selectedInvoice?.invoiceUniqueKey,
    refetchOnWindowFocus: false,
    onSuccess: (res) => setOpenInvoice(true),
    select: (data) => data.data.data,
    query: {
      invoiceUniqueKey: selectedInvoice?.invoiceUniqueKey,
    },
    staleTime: 1,
  });
  /* -------------------------------------------------------------------------- */
  /*                              Download Invoices                             */
  /* -------------------------------------------------------------------------- */
  const { refetch: downloadData, isFetching: downloadRefetching } = CallAPI({
    name: ['getAllInovice', selectedDate.start, selectedDate.end],
    url: '/StoredProc/GetTransactionReport',
    select: (data) => data.data,
    query: {
      startDate: selectedDate.start,
      endDate: selectedDate.end,
    },
    onSuccess: (list) => {
      downloadAsCSV(list, 'export.csv', 'text/csv;charset=utf-8;');
    },
  });
  /* -------------------------------------------------------------------------- */
  /*                             Search In Products                            */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (history?.location?.state?.prevPath?.includes('sales')) {
      setSelectedInvoice({
        ...selectedInvoice,
        invoiceUniqueKey: history?.location?.state?.invoiceUniqueKey,
      });
    }
    history.push(`/sales/invoicesList/${paginationController.pageNumber}`);
    getAllInovice(true);
  }, [paginationController]);
  useEffect(() => {
    if (searchValue !== null || branches) {
      setPaginationController({
        ...paginationController,
        pageNumber: 0,
      });
    }
  }, [searchValue, branches]);

  /* -------------------------------------------------------------------------- */
  /*                                   Delete                                   */
  /* -------------------------------------------------------------------------- */
  const handleChangeDate = ([startDay, endDay]) => {
    setSelectedDate({
      ...selectedDate,
      start: toADayFormat(startDay),
      end: endDay && toADayFormat(endDay),
    });
  };
  useEffect(() => {
    if (paymentDetails.paymentDetails) {
      console.log(paymentDetails);
      setOpenPaymentDetails(true);
    }
  }, [paymentDetails]);

  useEffect(() => {
    if (history?.location?.state?.prevPath?.includes('sales')) {
      console.log(history?.location?.state?.filter);
    }
  }, [history]);
  return (
    <Row className="settings beutiresoulation">
      <Col xs="12">
        <Row className="justify-content-between align-items-center py-3">
          <Col xs="auto" className="mb-2">
            <h3 className="settings__section-title">{messages['Invoices.title']}</h3>
            <p className="settings__section-description">
              {messages['Invoices.description']}
            </p>
          </Col>

          <Col xs="12" className="d-flex">
            <Row className="mb-3 justify-content-between align-items-center w-100">
              <Col xs="auto" className="d-flex  mb-1">
                <div className="beuti-date-range-input">
                  <RangeDateSelect
                    startDate={new Date(selectedDate.start)}
                    endDate={selectedDate.end && new Date(selectedDate.end)}
                    onChange={handleChangeDate}
                  />
                </div>
                <BeutiButton
                  loading={downloadRefetching}
                  text={messages['Invoice.download.csv']}
                  type="button"
                  className="mx-2"
                  onClick={downloadData}
                />
              </Col>

              <Col xs="auto">
                <SearchInput
                  handleChange={setSearchValue}
                  searchValue={searchValue}
                  placeholder={messages['Invoices.search']}
                />
              </Col>
              <Col xs="auto">
                <CustomerInvoiceDD
                  selectedStatus={selectedStatus}
                  setSelectedStatus={setSelectedStatus}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
      {(!!filtedInvoices?.length || isFetching || InvoiceImgLoading) && (
        <Col xs="12">
          <InvoicesTable
            vouchers={filtedInvoices}
            vouchersLoading={isFetching}
            setSelectedInvoice={setSelectedInvoice}
            getInvoiceLoader={InvoiceImgLoading}
            setOpenPaymentDetails={setPaymentDetails}
          />
          {countData > 10 && !isFetching && (
            <section className="beuti-table__footer">
              <BeutiPagination
                count={countData}
                setPaginationController={setPaginationController}
                paginationController={paginationController}
              />
            </section>
          )}
        </Col>
      )}
      {filtedInvoices?.length === 0 && !InvoiceImgLoading && !isFetching && (
        <Col xs="12">
          <NoOInvoicesYet />
        </Col>
      )}
      {openInvoice && (
        <div
          className="layout-booking"
          onClick={() => {
            setSelectedInvoice({});
            setOpenInvoice(false);
          }}
        />
      )}
      <InoviceDetails
        open={openInvoice}
        onClose={setOpenInvoice}
        inoviceImg={InvoiceImgData}
        bookingPaymentStatus={handlePaymentText(messages, selectedInvoice?.statusId)}
        canRefund={selectedInvoice.canRefund}
        paidAmount={selectedInvoice.paidAmount}
        onlinePaid={selectedInvoice.onlinePaidAmount}
        checkoutId={selectedInvoice?.checkOutId}
        callBackAfterRefund={() => getAllInovice(true)}
        callBackAfterClose={() => setSelectedInvoice({})}
      />

      <PaymentDetails
        openModal={openPaymentDetails}
        setOpenModal={setOpenPaymentDetails}
        invoiceForPaymentModal={paymentDetails}
      />
    </Row>
  );
};

export default InvoicessList;
