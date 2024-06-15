/* eslint-disable indent */

import clsx from 'clsx';
import format from 'date-fns/format';
import isValid from 'date-fns/isValid';
import endOfWeek from 'date-fns/endOfWeek';
import React from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from '@material-ui/pickers';
import startOfWeek from 'date-fns/startOfWeek';
import isWithinInterval from 'date-fns/isWithinInterval';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import moment from 'moment';
import { useIntl } from 'react-intl';

//
const styles = makeStyles((theme) => ({
  day: {
    width: 36,
    height: 36,
    fontSize: theme.typography.caption.fontSize,
    margin: '0 2px',
    color: 'inherit',
  },
  nonCurrentMonthDay: {
    color: theme.palette.text.disabled,
    cursor: 'auto !important',
  },
  highlightNonCurrentMonthDay: {
    color: '#fff',
  },
  highlight: {
    background: '#a82f96',
    color: '#fff',
    zIndex: '2000',
  },
}));

export default function WeekDatePicker({ selectedDate, handleDateChange, maxDate }) {
  const { locale } = useIntl();
  const classes = styles();
  const formatWeekSelectLabel = (date, invalidLabel) => {
    const dateClone = date;
    if (
      moment(dateClone)
        .startOf('week')
        .month() ===
      moment(dateClone)
        .endOf('week')
        .month()
    ) {
      return dateClone && isValid(dateClone)
        ? `${moment(dateClone)
            .startOf('week')
            .locale(locale)
            .format('DD')} - ${moment(dateClone)
            .endOf('week')
            .locale(locale)
            .format('DD MMM YYYY')}`
        : invalidLabel;
    }
    return dateClone && isValid(dateClone)
      ? `${moment(dateClone)
          .startOf('week')
          .locale(locale)
          .format('DD MMM')} - ${moment(dateClone)
          .endOf('week')
          .locale(locale)
          .format('DD MMM YYYY')}`
      : invalidLabel;
  };

  const renderWrappedWeekDay = (date, daySelected, dayInCurrentMonth) => {
    const dateClone = date;
    const selectedDateClone = daySelected;
    const start = startOfWeek(selectedDateClone);
    const end = endOfWeek(selectedDateClone);
    const dayIsBetween = isWithinInterval(dateClone, { start, end });
    const wrapperClassName = clsx({
      [classes.highlight]: dayIsBetween,
    });
    const dayClassName = clsx(classes.day, {
      [classes.nonCurrentMonthDay]: !dayInCurrentMonth,
      [classes.highlightNonCurrentMonthDay]: !dayInCurrentMonth && dayIsBetween,
    });
    return (
      <div className={`MuiButtonBase-root ${wrapperClassName}`}>
        <IconButton className={dayClassName}>
          <span> {format(dateClone, 'd')} </span>
        </IconButton>
      </div>
    );
  };

  return (
    <DatePicker
      value={selectedDate}
      onChange={handleDateChange}
      renderDay={renderWrappedWeekDay}
      labelFunc={formatWeekSelectLabel}
      variant="inline"
      autoOk="true"
      maxDate={maxDate}
    />
  );
}

WeekDatePicker.propTypes = {
  selectedDate: PropTypes.string,
  handleDateChange: PropTypes.func,
  maxDate: PropTypes.any,
};
