import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import moment from 'moment';
import { toADayFormat } from 'functions/MomentHandlers';
import BookingDatePickers from '../../commonViewsBooking/FullCalendar/BookingDatePicker';

const DateFilter = ({
  calendarView,
  setSelectedDate,
  selectedDate,
  getDayBookings,
  prevPickerBtnClicked,
  nextPickerBtnClicked,
}) => {
  const { messages, locale } = useIntl();
  const storeDateToLocalStorage = (start, end) => {
    localStorage.setItem(
      'bookingDate',
      JSON.stringify({
        start,
        end,
      }),
    );
  };
  const handleSelectTodayBtn = () => {
    const toDay = toADayFormat(new Date());
    if (calendarView === 'resourceTimeGridDay') {
      setSelectedDate({
        start: toDay,
        end: toDay,
        lastSelectedDate: toDay,
      });
      storeDateToLocalStorage(toDay, toDay);
    }

    if (calendarView === 'timeGridFourDay') {
      setSelectedDate({
        start: toDay,
        end: toADayFormat(moment(new Date()).add(2, 'days')),
        lastSelectedDate: toDay,
      });
      storeDateToLocalStorage(toDay, toADayFormat(moment(new Date()).add(2, 'days')));
    }
    if (calendarView === 'timeGridWeek') {
      setSelectedDate({
        start: toADayFormat(moment(new Date()).startOf('week')),
        end: toADayFormat(moment(new Date()).endOf('week')),
        lastSelectedDate: toDay,
      });
      storeDateToLocalStorage(
        toADayFormat(moment(new Date()).startOf('week')),
        toADayFormat(moment(new Date()).endOf('week')),
      );
    }
  };
  const handleDisableSelectTodyBtn = () => {
    if (calendarView === 'resourceTimeGridDay') {
      return (
        moment(new Date()).format('YYYY-MM-DD') === selectedDate.start &&
        moment(new Date()).format('YYYY-MM-DD') === selectedDate.end
      );
    }

    if (calendarView === 'timeGridFourDay' || calendarView === 'timeGridWeek') {
      return (
        moment(new Date()).isBetween(selectedDate.start, selectedDate.end) ||
        moment(new Date()).isSame(selectedDate.start) ||
        moment(new Date()).isSame(selectedDate.end)
      );
    }
    return false;
  };
  return (
    <div className="calendar-picker">
      <button
        type="button"
        className="calendar-picker__prev"
        onClick={(e) => prevPickerBtnClicked(e)}
      >
        <i className={`flaticon2-${locale !== 'ar' ? 'left' : 'right'}-arrow`}></i>
      </button>
      <BookingDatePickers
        setBookingDate={setSelectedDate}
        bookingDate={selectedDate}
        calendarView={calendarView}
        getDayBookings={getDayBookings}
      />
      <button
        type="button"
        className="calendar-picker__today"
        disabled={handleDisableSelectTodyBtn()}
        onClick={handleSelectTodayBtn}
      >
        {messages['common.today']}
      </button>
      <button
        type="button"
        className="calendar-picker__next"
        onClick={(e) => nextPickerBtnClicked(e)}
      >
        <i className={`flaticon2-${locale === 'ar' ? 'left' : 'right'}-arrow`}></i>
      </button>
    </div>
  );
};
DateFilter.propTypes = {
  calendarView: PropTypes.string,
  setSelectedDate: PropTypes.func,
  selectedDate: PropTypes.string,
  getDayBookings: PropTypes.func,
  prevPickerBtnClicked: PropTypes.func,
  nextPickerBtnClicked: PropTypes.func,
};

export default DateFilter;
