import React, { useEffect } from 'react';
import CaValuesStatics from 'components/AdminViews/KPIS/CaValuesStatics';
import { Col } from 'react-bootstrap';
import PropTypes from 'prop-types';

import useAPI, { get } from 'hooks/useAPI';
import SpvaluesStaitcs from 'components/AdminViews/KPIS/SpvaluesStaitcs';
import BwValuesStaitcs from 'components/AdminViews/KPIS/BwValuesStaitcs';

export default function AllAppsStatics({ bookingDate }) {
  const {
    response: bookingRes,
    setRecall: getBookings,
    isLoading: gettingBookings,
  } = useAPI(get, `Booking/GetSPBookingsCount?bookingDate=${bookingDate}`);
  const { response: valuesRes, setRecall: getVals, isLoading: gettingValues } = useAPI(
    get,
    `Booking/GetSPBookingsValue?bookingDate=${bookingDate}`,
  );

  useEffect(() => {
    getVals(true);
    getBookings(true);
  }, [bookingDate]);

  return (
    <>
      <Col lg={4} sm={12}>
        <CaValuesStatics
          bookingRes={bookingRes}
          valuesRes={valuesRes}
          gettingBookings={gettingBookings}
          gettingValues={gettingValues}
        />
      </Col>
      <Col lg={4} sm={12}>
        <SpvaluesStaitcs
          bookingRes={bookingRes}
          valuesRes={valuesRes}
          gettingBookings={gettingBookings}
          gettingValues={gettingValues}
        />
      </Col>
      <Col lg={4} sm={12}>
        <BwValuesStaitcs
          bookingRes={bookingRes}
          valuesRes={valuesRes}
          gettingBookings={gettingBookings}
          gettingValues={gettingValues}
        />
      </Col>
    </>
  );
}

AllAppsStatics.propTypes = {
  bookingDate: PropTypes.string,
};
