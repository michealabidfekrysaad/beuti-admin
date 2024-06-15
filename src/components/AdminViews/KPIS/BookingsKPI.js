import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { DatePicker } from '@material-ui/pickers';
import { Card, Row, Col } from 'react-bootstrap';

import useAPI, { get } from 'hooks/useAPI';
import Loading from 'components/AdminViews/NewBooking/Loading/shimmer';

export default function BookingsKPI() {
  const [closedBookingDate, setClosedBookingDate] = useState(
    moment(new Date()).format('YYYY-MM-DD'),
  );
  const { response, setRecall, isLoading } = useAPI(
    get,
    `KPI/GetDayBookingsStat?date=${closedBookingDate}`,
  );

  useEffect(() => {
    setRecall(true);
  }, [closedBookingDate]);

  const handleMonthPicker = (value) => {
    setClosedBookingDate(moment(value).format('YYYY-MM-DD'));
  };

  return (
    <Col xs={12} lg={12}>
      <div className="mt-4 mb-4 w-50">
        <DatePicker
          value={closedBookingDate}
          format="dd/MM/yyyy"
          onChange={handleMonthPicker}
          autoOk="true"
          okLabel={null}
        />
      </div>
      <Card className="admin-statistics">
        <Card.Body>
          {isLoading ? (
            <>
              <Loading active />
            </>
          ) : (
            <>
              <h1 className="title-primary text-center">
                <FormattedMessage id="kpis.booking.title" />
              </h1>
              <hr />
              <Row className="kpis-body mt-5">
                <Col xs={12} className="mb-5">
                  <Row className="justify-content-between">
                    <Col xs={6} lg={2} className="mt-2">
                      <div className="statistic">
                        <div className="statistic-value">
                          {response && response.data && response.data.noOfDayBookings}
                        </div>
                        <div className="statistic-name">
                          <FormattedMessage id="kpis.booking.noOfClosedToday" />
                        </div>
                      </div>
                    </Col>
                    <Col xs={6} lg={2} className="mt-2">
                      <div className="statistic">
                        <div className="statistic-value">
                          {response && response.data && response.data.noOfWeekBookings}
                        </div>
                        <div className="statistic-name">
                          <FormattedMessage id="kpis.booking.noOfClosedThisWeek" />
                        </div>
                      </div>
                    </Col>
                    <Col xs={6} lg={2} className="mt-2">
                      <div className="statistic">
                        <div className="statistic-value">
                          {response && response.data && response.data.noOfMonthBookings}
                        </div>
                        <div className="statistic-name">
                          <FormattedMessage id="kpis.booking.noOfClosedThisDayMonth" />
                        </div>
                      </div>
                    </Col>
                    <Col xs={6} lg={2} className="mt-2">
                      <div className="statistic">
                        <div className="statistic-value">
                          {response && response.data && response.data.valueOfDayBookings}
                        </div>
                        <div className="statistic-name">
                          <FormattedMessage id="kpis.booking.valOfClosedToday" />
                        </div>
                      </div>
                    </Col>
                    <Col xs={6} lg={2} className="mt-2">
                      <div className="statistic">
                        <div className="statistic-value">
                          {response && response.data && response.data.valueOfWeekBookings}
                        </div>
                        <div className="statistic-name">
                          <FormattedMessage id="kpis.booking.valOfClosedThisWeek" />
                        </div>
                      </div>
                    </Col>
                    <Col xs={6} lg={2} className="mt-2">
                      <div className="statistic">
                        <div className="statistic-value">
                          {response &&
                            response.data &&
                            response.data.valueOfMonthBookings}
                        </div>
                        <div className="statistic-name">
                          <FormattedMessage id="kpis.booking.valOfClosedThisMonth" />
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Col>
                <Col
                  xs={12}
                  className="kpis-body-item border-lr-primary justify-content-start"
                >
                  <div className="kpis-body-item__name">
                    <FormattedMessage id="kpis.booking.avgThisDay" />
                  </div>
                  <div className="kpis-body-item__number mx-2">
                    {response && response.data && response.data.dayAverage}
                  </div>
                </Col>
                <Col
                  xs={12}
                  className="kpis-body-item border-lr-info justify-content-start"
                >
                  <div className="kpis-body-item__name">
                    <FormattedMessage id="kpis.booking.avgThisDayPrevMonth" />{' '}
                  </div>
                  <div className="kpis-body-item__number mx-2">
                    {response && response.data && response.data.prevMonthDayAverage}
                  </div>
                </Col>
              </Row>
            </>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
}
