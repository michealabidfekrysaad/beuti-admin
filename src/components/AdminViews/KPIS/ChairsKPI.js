import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { DatePicker } from '@material-ui/pickers';
import useAPI, { get } from 'hooks/useAPI';
import Loading from 'components/AdminViews/NewBooking/Loading/shimmer';
import { Card, Col } from 'react-bootstrap';
// SUPER ADMIN
export default function ChairsKPI() {
  const newDate = new Date();
  const [bookingDateRating, setBookingDateRating] = useState(
    moment(new Date()).format('YYYY-MM-DD'),
  );
  const [month, setMonth] = useState(newDate.getMonth() + 1);

  const [year, setYear] = useState(newDate.getFullYear());
  const { response, setRecall, isLoading } = useAPI(
    get,
    `SPChair/GetChairValue?year=${year}&month=${month}`,
  );

  useEffect(() => {
    setRecall(true);
  }, [bookingDateRating]);

  const handleMonthPicker = (value) => {
    setMonth(
      moment(value)
        .startOf('month')
        .format('MM'),
    );
    setYear(
      moment(value)
        .startOf('year')
        .format('YYYY'),
    );
    setBookingDateRating(
      moment(value)
        .startOf('month')
        .format('YYYY-MM-DD'),
    );
  };

  return (
    <>
      <Col xs={12} lg={4}>
        <div className="mt-4 mb-4 w-50">
          <DatePicker
            value={bookingDateRating}
            autoOk="true"
            views={['year', 'month']}
            onChange={handleMonthPicker}
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
                  <FormattedMessage id="kpis.chairs" />
                </h1>
                <hr />

                <Col xs={12} className="kpis-body-item border-lr-primary mt-5">
                  <div className="kpis-body-item__name">
                    <FormattedMessage id="kpis.booking.closedChairCount" />
                  </div>
                  <div className="kpis-body-item__number">
                    {response && response.data && response.data.closedChairCount}
                  </div>
                </Col>
                <Col xs={12} className="kpis-body-item border-lr-info mt-5">
                  <div className="kpis-body-item__name">
                    <FormattedMessage id="kpis.booking.chairBookingsValue" />
                  </div>
                  <div className="kpis-body-item__number">
                    {response && response.data && response.data.chairBookingsValue}
                  </div>
                </Col>
              </>
            )}
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}
