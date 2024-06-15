import React, { useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import useAPI, { get } from 'hooks/useAPI';

import products from '../../../../assets/img/dashboard/products.svg';
import book from '../../../../assets/img/dashboard/book.svg';
import customers from '../../../../assets/img/dashboard/customers.svg';
import income from '../../../../assets/img/dashboard/income.svg';
import Chart from './Chart';

export default function Index() {
  const { messages, locale } = useIntl();
  const adminHomePage = 'admin.homePage';
  const currentMonth = new Date().toLocaleString(`${locale === 'ar' ? 'ar' : 'en-us'}`, {
    month: 'long',
  });
  const currentYear = new Date().getFullYear();

  const {
    response: BasicStatistics,
    isLoading: gettingStatistics,
    setRecall: recallBasicStatistics,
  } = useAPI(get, `ServiceProvider/GetBasicStatistics`);

  useEffect(() => {
    recallBasicStatistics(true);
  }, []);

  return (
    <>
      <Row>
        <Col lg={6} md={12} className="mt-3">
          <div className="summary-info">
            <h6 className="summary-info__header">
              {messages[`${adminHomePage}.monthSummary`]}
            </h6>
            <p className="summary-info__month">
              {currentMonth} {currentYear}
            </p>
            {/* the month will be retrieved from the API */}
          </div>
          <div className="summary-details">
            {BasicStatistics?.data && (
              <Row className="mb-5 mt-2">
                <Col xs={6} className="summary-details__block">
                  <img src={book} alt="booking-details" />
                  <p className="summary-details__block-information">
                    {messages[`serviceDetails.bookings`]}
                  </p>
                  <span className="summary-details__block-statics">
                    {Object.values(BasicStatistics?.data)[0]}
                  </span>
                </Col>
                <Col xs={6} className="summary-details__block">
                  <img src={products} alt="products-details" />
                  <p className="summary-details__block-information">
                    {messages[`products.sidebar`]}
                  </p>
                  <span className="summary-details__block-statics">
                    {Object.values(BasicStatistics?.data)[1]}
                  </span>
                </Col>
                <Col xs={6} className="summary-details__block">
                  <img src={customers} alt="customers-details" />
                  <p className="summary-details__block-information">
                    {messages[`common.clients`]}
                  </p>
                  <span className="summary-details__block-statics">
                    {Object.values(BasicStatistics?.data)[2]}
                  </span>
                </Col>
                <Col xs={6} className="summary-details__block">
                  <img src={income} alt="income-details" />
                  <p className="summary-details__block-information">
                    {messages[`${adminHomePage}.income`]}
                  </p>
                  <span className="summary-details__block-statics">
                    {Object.values(BasicStatistics?.data)[3]}
                  </span>
                </Col>
              </Row>
            )}
            <Link
              className="summary-details__link"
              to="/main"
              onClick={() => alert('put the reports page')}
            >
              {messages[`${adminHomePage}.moreReportes`]}
            </Link>{' '}
            <p> </p>
          </div>
        </Col>
        <Col lg={6} md={12} className="mt-3">
          <Chart />
        </Col>
      </Row>
    </>
  );
}
