import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import moment from 'moment';
import { Row, Col } from 'react-bootstrap';
import BookingsKPI from 'components/AdminViews/KPIS/BookingsKPI';
import ChairsKPI from 'components/AdminViews/KPIS/ChairsKPI';
import { DatePicker } from '@material-ui/pickers';
import AllAppsStatics from './AllAppsStatics';
import TotalBookingChart from './TotalBookingChart';
import RatingStaitistics from './RatingStaitistics';
import ComissionStatistics from './ComissionStatistics';

export default function FinancialTabStatistics() {
  const { messages } = useIntl();
  const [bookingDate, setBookingDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
  return (
    <>
      <p className="title-primary">{messages['admin.homePage.BookingHeader']}</p>
      <Row>
        <Col xs="auto">
          <div className="text-left d-flex alig-items-center beuti-picker">
            <DatePicker
              value={bookingDate}
              // label="Booking Day"
              format="dd/MM/yyyy"
              onChange={(e) => setBookingDate(moment(e).format('YYYY-MM-DD'))}
              autoOk="true"
              okLabel={null}
            />
            <button
              type="button"
              className="beuti-picker-today"
              onClick={() => setBookingDate(moment(new Date()).format('YYYY-MM-DD'))}
            >
              {messages['common.today']}
            </button>
          </div>
        </Col>
      </Row>
      <Row className="mt-5 mb-2">
        <AllAppsStatics bookingDate={bookingDate} />
      </Row>
      <Row className="mt-5 mb-2">
        <TotalBookingChart />
      </Row>
      <Row className="mt-5 mb-2">
        <RatingStaitistics />
        <ComissionStatistics />
        <ChairsKPI />
      </Row>
      <Row className="mt-5 mb-2">
        <BookingsKPI />
      </Row>
    </>
  );
}
