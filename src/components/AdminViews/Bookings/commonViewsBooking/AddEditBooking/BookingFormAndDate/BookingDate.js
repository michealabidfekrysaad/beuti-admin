import React, { useContext, useEffect } from 'react';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { useIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import moment from 'moment';
import { Select, MenuItem } from '@material-ui/core';
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import { BookingContext } from 'providers/BookingProvider';
import arLocale from 'date-fns/locale/ar-SA';
import enLocale from 'date-fns/locale/en-US';
import DateFnsUtils from '@date-io/date-fns';

const BookingDate = () => {
  const { booking, setBooking } = useContext(BookingContext);

  const handleChangeDate = (date) => {
    setBooking({ ...booking, bookingDate: moment(date).format('YYYY-MM-DD') });
  };

  const { messages, locale } = useIntl();
  return (
    <Row className=" align-items-center justify-content-between">
      <Col xs="auto">
        <section className="arrowdatepicker">
          <MuiPickersUtilsProvider
            utils={DateFnsUtils}
            locale={locale === 'ar' ? arLocale : enLocale}
          >
            <DatePicker
              className="picker-add-new-booking"
              value={booking.bookingDate}
              format="EEEE, dd MMMM yyyy"
              onChange={handleChangeDate}
              //   minDate={new Date()}
              autoOk="true"
              okLabel={null}
              variant="inline"
            />
          </MuiPickersUtilsProvider>
          <SVG src={toAbsoluteUrl('/dropdown.svg')} className="arrowdatepicker-icon" />
        </section>
      </Col>
      <Col xs="auto">
        <div className="beutiselect">
          <Select
            labelId="selectservice"
            className="beutiselect-dropdown selectlocation"
            value={booking.isHomeBooking ? 1 : 0}
            onChange={(e) => setBooking({ ...booking, isHomeBooking: e.target.value })}
          >
            <MenuItem value={0} selected className="selectlocation-item">
              <SVG src={toAbsoluteUrl('/salonblack.svg')} />{' '}
              <span>{messages['booking.details.salon']}</span>
            </MenuItem>
            <MenuItem value={1} className="selectlocation-item">
              <SVG src={toAbsoluteUrl('/Homeblack.svg')} />{' '}
              <span>{messages['booking.details.home']}</span>
            </MenuItem>
          </Select>
        </div>
      </Col>
    </Row>
  );
};

export default BookingDate;
