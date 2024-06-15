import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { Header, Segment, Table } from 'semantic-ui-react';
import useAPI, { get } from 'hooks/useAPI';
import Loading from 'components/AdminViews/NewBooking/Loading/shimmer';
import MonthYearSelection from 'components/MonthYearSelection';
import { Card, Row, Col } from 'react-bootstrap';
const newDate = new Date();
// SUPER ADMIN
export default function GetAverageRevenue() {
  const [year, setYear] = useState(newDate.getFullYear());
  const [month, setMonth] = useState(newDate.getMonth() + 1);
  const { response, setRecall, isLoading } = useAPI(
    get,
    `Revenue/GetAverageRevenue?year=${year}&month=${month}`,
  );

  useEffect(() => {
    setRecall(true);
  }, [year, month]);

  return (
    <>
      <Card className="h-100">
        <Card.Header className="border-bottom-0 pb-0">
          <div className="title">
            <FormattedMessage id="kpis.GrossMerchandiseValue" />
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
                  <FormattedMessage id="arpuPerMonth" />
                </div>
                <div className="kpis-body-item__number">
                  {response && response.data.arpuPerMonth}
                </div>
              </Col>
              <Col xs={12} className="kpis-body-item border-lr-info">
                <div className="kpis-body-item__name">
                  <FormattedMessage id="arpuPerYear" />
                </div>
                <div className="kpis-body-item__number">
                  {response && response.data.arpuPerYear}
                </div>
              </Col>
              <Col xs={12} className="kpis-body-item border-lr-warning">
                <div className="kpis-body-item__name">
                  <FormattedMessage id="arppuPerMonth" />
                </div>
                <div className="kpis-body-item__number">
                  {response && response.data.arppuPerMonth}
                </div>
              </Col>
              <Col xs={12} className="kpis-body-item border-lr-sucess">
                <div className="kpis-body-item__name">
                  <FormattedMessage id="arppuPerYear" />
                </div>
                <div className="kpis-body-item__number">
                  {response && response.data.arppuPerYear}
                </div>
              </Col>
            </Row>
          </Card.Body>
        )}
      </Card>
    </>
  );
}
