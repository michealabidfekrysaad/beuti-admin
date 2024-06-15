import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Col, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';

import {
  getDDTimeByValueDefaultTime,
  handleCasesOfNewShiftTimeDefaultTime,
} from 'constants/hours';

const AddDeleteEmployeeShiftButton = ({ shiftLength, watch, setValue }) => {
  const { messages, locale } = useIntl();
  const handleAddShift = () => {
    const dayShifts = watch('day.shifts');
    const [
      secondShiftStartTime,
      secondShiftEndTime,
    ] = handleCasesOfNewShiftTimeDefaultTime(
      getDDTimeByValueDefaultTime(dayShifts[0].startTime, locale).key,
      getDDTimeByValueDefaultTime(dayShifts[0].endTime, locale).key,
      locale,
    );
    const newShifts = [
      ...dayShifts,
      {
        startTime: secondShiftStartTime.value,
        endTime: secondShiftEndTime.value,
        id: Date.now(),
      },
    ];
    setValue('day.shifts', newShifts);
  };
  const handleDeleteShift = () => {
    const dayShifts = watch('day.shifts').filter((shift, index) => index !== 1);
    setValue('day.shifts', dayShifts);
  };
  return (
    <Row
      className={`${
        shiftLength === 1 ? 'justify-content-start' : 'justify-content-end'
      } mb-3`}
    >
      {shiftLength === 1 ? (
        <Col xs="auto">
          <div className="employeewh--shift-action">
            <button
              className="flaticon-add-circular-button-btn"
              type="button"
              onClick={handleAddShift}
            >
              <i className="flaticon2-add"></i>
              <span> {messages['setting.employee.wh.anothershift']}</span>
            </button>
          </div>
        </Col>
      ) : (
        <Col xs="auto">
          <div className="employeewh--shift-action">
            <button
              className="flaticon-delete-btn"
              type="button"
              onClick={handleDeleteShift}
            >
              <span> {messages['setting.employee.wh.deleteshift']}</span>
            </button>
          </div>
        </Col>
      )}
    </Row>
  );
};
AddDeleteEmployeeShiftButton.propTypes = {
  shiftLength: PropTypes.number,
  watch: PropTypes.func,
  setValue: PropTypes.func,
};
export default AddDeleteEmployeeShiftButton;
