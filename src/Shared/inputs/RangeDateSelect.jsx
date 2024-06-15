/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import PropTypes from 'prop-types';
import './InputsBeuti.scss';
import DatePicker from 'react-datepicker';
import format from 'date-fns/format';

const RangeDateSelect = ({ startDate, endDate, onChange }) => {
  const handleFormat = (start, end) => {
    if (!end) {
      return `${format(start, 'do')} ${format(start, 'MMM')} - Select End`;
    }
    if (start && end) {
      if (format(start, 'MMM') === format(end, 'MMM')) {
        return `${format(start, 'do')} - ${format(end, 'do')} ${format(
          startDate,
          'MMMM',
        )} `;
      }
      return `${format(start, 'do')} ${format(startDate, 'MMM')} - ${format(
        end,
        'do',
      )} ${format(end, 'MMM')} `;
    }
    return null;
  };
  return (
    <DatePicker
      className="beuti-range-picker"
      selected={startDate}
      onChange={onChange}
      startDate={startDate}
      endDate={endDate}
      selectsRange
      value={handleFormat(startDate, endDate)}
      showYearDropdown
      showMonthDropdown
    />
  );
};

RangeDateSelect.propTypes = {
  startDate: PropTypes.any,
  endDate: PropTypes.any,

  onChange: PropTypes.func,
};
export default RangeDateSelect;
