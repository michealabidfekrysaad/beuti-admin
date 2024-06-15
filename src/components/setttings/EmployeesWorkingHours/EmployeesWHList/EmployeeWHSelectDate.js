/* eslint-disable  */
import React from 'react';
import moment from 'moment';
import { useIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import { Select, Checkbox, MenuItem } from '@material-ui/core';
import SVG from 'react-inlinesvg';
import PropTypes from 'prop-types';
import WeekDatePicker from 'components/AdminViews/Bookings/commonViewsBooking/FullCalendar/WeeklyPicker';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import arLocale from 'date-fns/locale/ar-SA';
import enLocale from 'date-fns/locale/en-US';
const EmployeeWHSelectDate = ({
  setSelectedDate,
  selectedDate,
  setFilterEmployees,
  filterEmployees,
  AllEmployeesPlaceholder,
  paginatedEmployees,
}) => {
  const { locale } = useIntl();

  const handleWeekPicker = (value) => {
    moment.locale('en');
    const [start, end] = [
      moment(value)
        .startOf('week')
        .format('YYYY-MM-DD'),
      moment(value)
        .endOf('week')
        .format('YYYY-MM-DD'),
    ];
    setSelectedDate({
      start,
      end,
    });
  };
  const handleSelectWeekAfterAndBefore = (type, date) => {
    moment.locale('en');
    if (type === 'before') {
      setSelectedDate({
        start: moment(date)
          .subtract(1, 'days')
          .startOf('week')
          .format('YYYY-MM-DD'),
        end: moment(date)
          .subtract(1, 'days')
          .endOf('week')
          .format('YYYY-MM-DD'),
      });
    }
    if (type === 'after') {
      setSelectedDate({
        start: moment(date)
          .add(1, 'days')
          .startOf('week')
          .format('YYYY-MM-DD'),
        end: moment(date)
          .add(1, 'days')
          .endOf('week')
          .format('YYYY-MM-DD'),
      });
    }
  };
  const handleChange = (event) => {
    if (event.target.value[event.target.value.length - 1]?.employeeId === 0) {
      return setFilterEmployees([AllEmployeesPlaceholder]);
    }
    setFilterEmployees(event.target.value.filter((emp) => emp.employeeId));
  };
  return (
    <Row className="justify-content-end">
      <Col xs="3">
        <div className="beutiselect">
          <Select
            labelId="text"
            className="beutiselect-dropdown"
            value={filterEmployees}
            onChange={handleChange}
            multiple
            renderValue={(selected) => selected.map((x) => x.name).join(', ')}
          >
            <MenuItem
              className="beutiselect-dropdown--item"
              value={AllEmployeesPlaceholder}
              selected
            >
              {AllEmployeesPlaceholder.name}
            </MenuItem>
            {paginatedEmployees?.map((hour) => (
              <MenuItem
                className="beutiselect-dropdown--item"
                key={hour.employeeId}
                value={hour}
              >
                <Checkbox
                  checked={
                    !!filterEmployees.find((item) => item.employeeId === hour.employeeId)
                  }
                  value={
                    filterEmployees.length > 0
                      ? filterEmployees.find(
                          (item) => item.employeeId === hour.employeeId,
                        )
                      : false
                  }
                />
                {hour.name}
              </MenuItem>
            ))}
          </Select>
        </div>
      </Col>
      <Col xs="auto">
        <div className="text-left d-flex alig-items-center beuti-weekly-picker">
          <button
            onClick={() => handleSelectWeekAfterAndBefore('before', selectedDate.start)}
            type="button"
          >
            <SVG
              src={toAbsoluteUrl(locale === 'en' ? '/arrowleft.svg' : '/arrowright.svg')}
            />
          </button>
          <MuiPickersUtilsProvider
            utils={DateFnsUtils}
            locale={locale === 'ar' ? arLocale : enLocale}
          >
            <WeekDatePicker
              handleDateChange={handleWeekPicker}
              variant="inline"
              selectedDate={selectedDate.start}
              maxDate={new Date().setMonth(new Date().getMonth() + 6)}
            />
          </MuiPickersUtilsProvider>
          <button
            type="button"
            onClick={() => handleSelectWeekAfterAndBefore('after', selectedDate.end)}
            disabled={
              new Date(selectedDate.end).getTime() >=
              new Date().setMonth(new Date().getMonth() + 6)
            }
          >
            <SVG
              src={toAbsoluteUrl(locale === 'en' ? '/arrowright.svg' : '/arrowleft.svg')}
            />
          </button>
        </div>
      </Col>
    </Row>
  );
};
EmployeeWHSelectDate.propTypes = {
  setSelectedDate: PropTypes.func,
  selectedDate: PropTypes.object,
  setFilterEmployees: PropTypes.func,
  filterEmployees: PropTypes.array,
  AllEmployeesPlaceholder: PropTypes.object,
  paginatedEmployees: PropTypes.array,
};

export default EmployeeWHSelectDate;
