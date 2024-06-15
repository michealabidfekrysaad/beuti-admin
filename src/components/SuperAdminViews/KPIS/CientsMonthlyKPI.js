import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import useAPI, { get } from 'hooks/useAPI';
import Loading from 'components/AdminViews/NewBooking/Loading/shimmer';
import MonthYearSelection from 'components/MonthYearSelection';
import { Card, Col, Row } from 'react-bootstrap';

const newDate = new Date();
// SUPER ADMIN
export default function ClientsMonthlyKPI() {
  const [year, setYear] = useState(newDate.getFullYear());
  const [month, setMonth] = useState(newDate.getMonth() + 1);
  const { response, setRecall, isLoading } = useAPI(
    get,
    `KPI/GetRegularCustomer?year=${year}&month=${month}`,
  );

  useEffect(() => {
    setRecall(true);
  }, [year, month]);

  return (
    <>
      <Card className="h-100">
        <Card.Header className="border-bottom-0 pb-0">
          <div className="title">
            <FormattedMessage id="kpis.customers" />
          </div>
        </Card.Header>

        {isLoading ? (
          <>
            <Loading active />
          </>
        ) : (
          <Card.Body>
            <MonthYearSelection
              year={year}
              setYear={setYear}
              setMonth={setMonth}
              month={month}
            />
            <Row className="kpis-body mt-5">
              <Col xs={12} className="kpis-body-item border-lr-primary">
                <div className="kpis-body-item__name">
                  <FormattedMessage id="kpis.noOfCustomerAtLeastOne" />
                </div>
                <div className="kpis-body-item__number">
                  {response && response.data && response.data.noOfCustomerAtLeastOne}
                </div>
              </Col>
              <Col xs={12} className="kpis-body-item border-lr-info">
                <div className="kpis-body-item__name">
                  <FormattedMessage id="kpis.noOfCustomerAtLeastTwo" />
                </div>
                <div className="kpis-body-item__number">
                  {response && response.data && response.data.noOfCustomerAtLeastTwo}
                </div>
              </Col>
              <Col xs={12} className="kpis-body-item border-lr-warning">
                <div className="kpis-body-item__name">
                  <FormattedMessage id="kpis.noOfCustomerWeekly" />
                </div>
                <div className="kpis-body-item__number">
                  {response && response.data && response.data.noOfCustomerWeekly}
                </div>
              </Col>
            </Row>
          </Card.Body>
        )}
      </Card>
    </>
  );
}
