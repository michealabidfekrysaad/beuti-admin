import React, { useState, useEffect } from 'react';
import useAPI, { get } from 'hooks/useAPI';
import moment from 'moment';
import { Col } from 'react-bootstrap';
import { DatePicker } from '@material-ui/pickers';
import MonthlyCommisionKPI from 'components/AdminViews/KPIS/MonthlyCommissionKpi';

export default function ComissionStatistics() {
  const newDate = new Date();
  const [bookingDateRating, setBookingDateRating] = useState(
    moment(new Date()).format('YYYY-MM-DD'),
  );
  const [year, setYear] = useState(newDate.getFullYear());
  const [month, setMonth] = useState(newDate.getMonth() + 1);

  const { response, setRecall, isLoading } = useAPI(
    get,
    `Commission/GetCommission?year=${year}&month=${month}`,
  );
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

  useEffect(() => {
    setRecall(true);
  }, [bookingDateRating]);

  return (
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
      <MonthlyCommisionKPI response={response} isLoading={isLoading} />
    </Col>
  );
}
