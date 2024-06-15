/* eslint-disable indent */

import clsx from 'clsx';
import format from 'date-fns/format';
import isValid from 'date-fns/isValid';
import React from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from '@material-ui/pickers';
import isWithinInterval from 'date-fns/isWithinInterval';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import moment from 'moment';
import { useIntl } from 'react-intl';

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
    '&:hover': {
      background: 'rgb(7, 177, 77, 0.42)',
    },
  },
  highlightNonCurrentMonthDay: {
    color: '#fff',
    '&:hover': {
      background: 'rgb(7, 177, 77, 0.42)',
    },
  },
  highlight: {
    background: theme.palette.primary.main,
    color: '#fff',
    zIndex: '2000',
  },
}));

export default function ThreeDaysPicker({ selectedDate, handleDateChange, maxDate }) {
  const { locale } = useIntl();
  const classes = styles();
  const formatThreeDaysSelectLabel = (date, invalidLabel) => {
    const dateClone = date;
    if (
      moment(dateClone, 'DD-MM-YYYY').month() ===
      moment(dateClone, 'DD-MM-YYYY')
        .add(2, 'days')
        .month()
    ) {
      return dateClone && isValid(dateClone)
        ? `${moment(dateClone)
            .locale(locale)
            .format('DD')} - ${moment(date)
            .add(2, 'days')
            .locale(locale)
            .format('DD MMM YYYY')}`
        : invalidLabel;
    }
    return dateClone && isValid(dateClone)
      ? `${moment(dateClone)
          .locale(locale)
          .format('DD MMM')} - ${moment(date)
          .add(2, 'days')
          .locale(locale)
          .format('DD MMM YYYY')}`
      : invalidLabel;
  };
  const renderWrappedThreeDays = (date, daySelected, dayInCurrentMonth) => {
    const dateClone = date;
    const selectedDateClone = daySelected;
    const start = new Date(selectedDateClone);
    const end = new Date(moment(selectedDate).add(2, 'days'));
    const dayIsBetween = isWithinInterval(dateClone, { start, end });
    const wrapperClassName = clsx({
      [classes.highlight]: dayIsBetween,
    });
    const dayClassName = clsx(classes.day, {
      [classes.nonCurrentMonthDay]: !dayInCurrentMonth,
      [classes.highlightNonCurrentMonthDay]: !dayInCurrentMonth && dayIsBetween,
    });
    return (
      <div className={`MuiButtonBase-root-three-days ${wrapperClassName}`}>
        <IconButton className={dayClassName}>
          <span
            className={
              moment(dateClone).format('DD MMM') === moment().format('DD MMM') &&
              !dayIsBetween &&
              'today'
            }
          >
            {' '}
            {format(dateClone, 'd')}{' '}
          </span>
        </IconButton>
      </div>
    );
  };

  return (
    <DatePicker
      value={selectedDate}
      onChange={handleDateChange}
      renderDay={renderWrappedThreeDays}
      labelFunc={formatThreeDaysSelectLabel}
      variant="inline"
      autoOk="true"
      maxDate={maxDate}
    />
  );
}

ThreeDaysPicker.propTypes = {
  selectedDate: PropTypes.string,
  handleDateChange: PropTypes.func,
  maxDate: PropTypes.any,
};
