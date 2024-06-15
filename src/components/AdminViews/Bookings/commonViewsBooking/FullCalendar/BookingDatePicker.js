import React from 'react';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import arLocale from 'date-fns/locale/ar-SA';
import enLocale from 'date-fns/locale/en-US';
import 'moment/locale/sw';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import WeekDatePicker from './WeeklyPicker';
import ThreeDaysPicker from './ThreeDaysPicker';

const BookingDatePickers = ({ setBookingDate, bookingDate, calendarView }) => {
  const { locale } = useIntl();

  /* -------------------------------------------------------------------------- */
  /*                    Handle To Store Date To LocalStorage                    */
  /* -------------------------------------------------------------------------- */

  const storeDateToLocalStorage = (start, end) => {
    localStorage.setItem(
      'bookingDate',
      JSON.stringify({
        start,
        end,
      }),
    );
  };

  /* -------------------------------------------------------------------------- */
  /*                              Handle Pick Date                              */
  /* -------------------------------------------------------------------------- */

  const handleDayPicker = (value) => {
    const [start, end, lastSelectedDate] = [
      moment(value).format('YYYY-MM-DD'),
      moment(value).format('YYYY-MM-DD'),
      moment(value).format('YYYY-MM-DD'),
    ];
    setBookingDate({
      start,
      end,
      lastSelectedDate,
    });
    storeDateToLocalStorage(start, end);
  };

  const handleThreeDaysPicker = (value) => {
    const [start, end] = [
      moment(value).format('YYYY-MM-DD'),
      moment(value)
        .add(2, 'days')
        .format('YYYY-MM-DD'),
    ];
    setBookingDate({
      ...bookingDate,
      start,
      end,
    });
    storeDateToLocalStorage(start, end);
  };

  const handleWeekPicker = (value) => {
    const [start, end] = [
      moment(value)
        .startOf('week')
        .format('YYYY-MM-DD'),
      moment(value)
        .endOf('week')
        .format('YYYY-MM-DD'),
    ];
    setBookingDate({
      ...bookingDate,
      start,
      end,
    });
    storeDateToLocalStorage(start, end);
  };

  const handleMonthPicker = (value) => {
    const [start, end] = [
      moment(value)
        .startOf('month')
        .format('YYYY-MM-DD'),
      moment(value)
        .endOf('month')
        .format('YYYY-MM-DD'),
    ];
    setBookingDate({
      start,
      end,
    });
    storeDateToLocalStorage(start, end);
  };

  return (
    <>
      {calendarView === 'resourceTimeGridDay' && (
        <MuiPickersUtilsProvider
          utils={DateFnsUtils}
          locale={locale === 'ar' ? arLocale : enLocale}
        >
          <DatePicker
            value={bookingDate.start}
            format="dd MMM yyyy"
            onChange={handleDayPicker}
            autoOk="true"
            okLabel={null}
            variant="inline"
          />
        </MuiPickersUtilsProvider>
      )}

      {calendarView === 'timeGridFourDay' && (
        <MuiPickersUtilsProvider
          utils={DateFnsUtils}
          locale={locale === 'ar' ? arLocale : enLocale}
        >
          <ThreeDaysPicker
            selectedDate={bookingDate.start}
            handleDateChange={handleThreeDaysPicker}
            okLabel={null}
            variant="inline"
          />
        </MuiPickersUtilsProvider>
      )}

      {calendarView === 'dayGridMonth' && (
        <DatePicker
          openTo="month"
          views={['year', 'month']}
          value={bookingDate.start}
          variant="inline"
          autoOk="true"
          onChange={handleMonthPicker}
        />
      )}
      {calendarView === 'timeGridWeek' && (
        <MuiPickersUtilsProvider
          utils={DateFnsUtils}
          locale={locale === 'ar' ? arLocale : enLocale}
        >
          <WeekDatePicker
            handleDateChange={handleWeekPicker}
            variant="inline"
            selectedDate={bookingDate.start}
          />
        </MuiPickersUtilsProvider>
      )}
    </>
  );
};
BookingDatePickers.propTypes = {
  setBookingDate: PropTypes.func,
  calendarView: PropTypes.string,
  bookingDate: PropTypes.object,
};

export default BookingDatePickers;
