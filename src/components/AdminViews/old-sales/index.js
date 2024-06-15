/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { Switch, useLocation } from 'react-router-dom';
import { AdminRoute } from 'Routes/PrivateRoute';
import { Routes } from 'constants/Routes';
import { Card, Row, Col } from 'react-bootstrap';
import { DatePicker } from '@material-ui/pickers';
import PageTabs from 'Shared/PageTabs/PageTabs';
import moment from 'moment';
import FilterData from 'components/shared/FilterData';
import DailySales from './DailySales';
import AppoitmentsSales from './AppoitmentsSales';
import InvoiceSales from './InvoiceSales';
import VoucherSales from './VoucherSales';
import TableLoader from '../../shared/TableLoader';

export default function SalesPage() {
  const { messages } = useIntl();
  const location = useLocation();
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [bodyFilter, setBodyFilter] = useState(() => filterBodyDailySales);
  const headerFilter = 'sales.filter.header';

  const [query, setQuery] = useState('');

  const [bookingDate, setBookingDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
  const handleChangeDate = (date) => {
    setBookingDate(moment(date).format('YYYY-MM-DD'));
  };

  const handleTodayClick = () => {
    setBookingDate(moment(new Date()).format('YYYY-MM-DD'));
  };
  const handleSearch = () => {};

  function sendBodyToFilterModal(locationParam) {
    if (locationParam.pathname === Routes.salesList) {
      setBodyFilter(() => filterBodyDailySales);
    } else if (locationParam.pathname === Routes.salesAppoitment) {
      setBodyFilter(() => filterBodyInvoices);

      //   nedd it's  own filter body
    } else if (locationParam.pathname === Routes.salesInvoice) {
      setBodyFilter(() => filterBodyInvoices);
    } else if (locationParam.pathname === Routes.salesVoucher) {
      setBodyFilter(() => filterBodyInvoices);

      //   nedd it's  own filter body
    }
    setFilterModalOpen(true);
  }
  const tabsArray = useMemo(
    () => [
      {
        key: 1,
        message: 'sales.daily',
        link: Routes.salesList,
      },
      {
        key: 2,
        message: 'sales.appoitment',
        link: Routes.salesAppoitment,
      },
      {
        key: 3,
        message: 'sales.invoices',
        link: Routes.salesInvoice,
      },
      {
        key: 4,
        message: 'sales.vouchers',
        link: Routes.salesVoucher,
      },
      //   {
      //     key: 4,
      //     message: 'spAdmin.serviceList.paidPlans',
      //     link: '/missiing/link',
      //   },
    ],
    [],
  );

  //   body of daily sales filter
  function filterBodyDailySales() {
    return (
      <>
        <Row className="container-box">
          <Col xs={12}>
            <p className="container-box__controllers--header">
              {messages['common.rate']}
            </p>
          </Col>
          <Col xs={12} lg={12} className="d-flex flex-wrap">
            Dialy-sales
          </Col>
        </Row>
        <Row className="container-box">
          <Col xs={12}>Dialy-sales</Col>
          <Col className="input-box__controllers" lg={3} xs={6}></Col>
          <Col className="input-box__controllers" lg={3} xs={6}></Col>
        </Row>
        <Row className="container-box">
          <Col xs={12}></Col>
          <Col className="input-box__controllers " lg={3} xs={6}></Col>
          <Col className="input-box__controllers " lg={3} xs={6}></Col>
        </Row>
      </>
    );
  }
  //   body of invoice filter
  function filterBodyInvoices() {
    return (
      <>
        <Row className="container-box">
          <Col xs={12}>
            <p className="container-box__controllers--header">
              {messages['common.rate']}
            </p>
          </Col>
          <Col xs={12} lg={12} className="d-flex flex-wrap">
            invoice
          </Col>
        </Row>
        <Row className="container-box">
          <Col xs={12}>invoice</Col>
          <Col className="input-box__controllers" lg={3} xs={6}>
            invoice
          </Col>
          <Col className="input-box__controllers" lg={3} xs={6}></Col>
        </Row>
      </>
    );
  }

  return (
    <>
      <Card className="mb-5">
        <Card.Header>
          <div className="title"> {messages['admin.reports.sales']}</div>
          <PageTabs tabsArray={tabsArray} />
        </Card.Header>
        <>
          <div className="d-lg-flex justify-content-between">
            <div className="mt-2 d-flex align-items-center beuti-picker">
              <DatePicker
                value={bookingDate}
                format="dd/MM/yyyy"
                onChange={handleChangeDate}
                autoOk="true"
                variant="inline"
              />
              <button
                type="button"
                className="beuti-picker-today"
                onClick={handleTodayClick}
              >
                {messages['common.today']}
              </button>
            </div>
            {Routes.salesList !== location.pathname && (
              <div className="mt-2 d-flex align-items-center">
                <input
                  value={query}
                  placeholder={`${messages['products.Search']}`}
                  className="input-box__controllers-input search-input h-100"
                  id="search"
                  onChange={(e) => {
                    setQuery(e.target.value);
                  }}
                ></input>
                <span className="search" onClick={handleSearch}>
                  <i className="flaticon-search"></i>
                </span>
              </div>
            )}
            <div className="mt-2 d-flex align-items-center">
              <button
                type="button"
                className="btn btn-filter  ml-2 mr-2"
                onClick={() => {
                  sendBodyToFilterModal(location);
                }}
              >
                <i className="flaticon-interface-8 ml-2 mr-2 btn-filter__icon"></i>
                <span className="btn-filter__word">
                  {messages['customer.btn.filter']}
                </span>
              </button>{' '}
              <select
                id="centerType"
                className="form-select container-box__controllers-select"
                //   onChange={(e) => handleCTUserSelection(e.target.value)}
                //   value={centerTypeId || ''}
              >
                <option
                  value={null}
                  className="container-box__controllers-select__pre-choosen"
                  // selected
                  defaultValue
                >
                  {messages['table.categories.centerType']}
                </option>
                {/* {ctDD?.map((ser) => (
                    <option
                      className="font-size container-box__controllers-select__options"
                      key={ser.id}
                      value={ser.id}
                    >
                      {ser.name}
                    </option>
                  ))} */}
              </select>
            </div>
          </div>
        </>
        <Switch>
          <AdminRoute exact path={Routes.salesList}>
            <DailySales TableLoader={TableLoader} />
          </AdminRoute>
          <AdminRoute exact path={Routes.salesAppoitment}>
            <AppoitmentsSales TableLoader={TableLoader} />
          </AdminRoute>
          <AdminRoute exact path={Routes.salesInvoice}>
            <InvoiceSales TableLoader={TableLoader} />
          </AdminRoute>
          <AdminRoute exact path={Routes.salesVoucher}>
            <VoucherSales TableLoader={TableLoader} />
          </AdminRoute>
        </Switch>
      </Card>
      <FilterData
        open={filterModalOpen}
        setOpen={setFilterModalOpen}
        body={bodyFilter}
        filterSelected={setFilters}
        header={headerFilter}
      />
    </>
  );
}
