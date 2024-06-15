/* eslint-disable react/prop-types */
import React from 'react';
import { useIntl } from 'react-intl';
import { Col } from 'react-bootstrap';
import { isNumbersWithoutDash } from 'functions/validate';

export default function EmployeeCommission({
  employeeCommisionValue,
  setEmployeeCommisionValue,
}) {
  const { messages } = useIntl();
  return (
    <>
      <Col className="input-box__controllers mt-2 mb-2" lg={6} xs={12}>
        <label htmlFor="empComission" className="input-box__controllers__label w-100">
          {messages['admin.settings.employeeCommision.header']}
        </label>
        <input
          className={`input-box__controllers-input w-50 ${
            employeeCommisionValue > 99 || employeeCommisionValue < 0
              ? 'input-box__controllers-input--error'
              : ''
          }`}
          id="empComission"
          placeholder={messages['admin.settings.employeeCommision.header']}
          onChange={(e) =>
            isNumbersWithoutDash(e.target.value)
              ? setEmployeeCommisionValue(e.target.value)
              : null
          }
          value={employeeCommisionValue}
        ></input>
        {(employeeCommisionValue > 99 || employeeCommisionValue < 0) && (
          <p className="mt-2 text-danger">{messages['admin.setttings.vat.error']}</p>
        )}
      </Col>
    </>
  );
}
