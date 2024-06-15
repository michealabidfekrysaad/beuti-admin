/* eslint-disable react/jsx-props-no-spreading */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Select, MenuItem } from '@material-ui/core';
import './InputsBeuti.scss';
import { get } from 'lodash';
const SelectInputMUI = ({
  label,
  error,
  list,
  onChange,
  value,
  disabled,
  labelClass,
  className,
  objectUseForm,
  useFormRef,
  watch,
  defaultValue,
  arrayReference,
  note,
  disabledOptions,
  dontShowErrorMessage,
  ...props
}) => {
  const { messages } = useIntl();
  const [valueState, setValueState] = useState(defaultValue);

  useEffect(() => {
    if (watch && useFormRef) {
      const subscription = watch((input) => setValueState(get(input, useFormRef.name)));
      return () => subscription.unsubscribe();
    }
    return null;
  }, [watch]);
  return (
    <>
      {useFormRef ? (
        <div className="beutiselect">
          {label && (
            <label
              htmlFor={label}
              className={`beutiselect-label ${
                error ? `beuti-input__label-error ${labelClass}` : labelClass
              } `}
            >
              {label}
            </label>
          )}
          <Select
            labelId={label}
            className={`beutiselect-dropdown ${
              error ? 'error-border ' : ' '
            } ${className || ' '}`}
            disabled={disabled}
            value={valueState}
            {...useFormRef}
            {...props}
          >
            {list?.map((hour, key) => (
              <MenuItem
                className="beutiselect-dropdown--item"
                key={hour.key}
                value={hour.id}
                disabled={disabledOptions && disabledOptions(hour.id)}
              >
                {hour.text}{' '}
                {hour.iseNextDay && (
                  <span className="mx-3"> {messages['workingHours.next.day']}</span>
                )}
              </MenuItem>
            ))}
          </Select>
          {error && !dontShowErrorMessage && (
            <p className="beuti-input__errormsg">{error}</p>
          )}
          {note && !error && <p className="beuti-input__note">{note}</p>}
        </div>
      ) : (
        <div className="beutiselect">
          {label && (
            <label htmlFor={label} className={`beutiselect-label ${labelClass}`}>
              {label}
            </label>
          )}
          <Select
            labelId={label}
            className={`beutiselect-dropdown ${
              error ? 'error-border ' : ' '
            } ${className || ' '}`}
            value={value}
            onChange={onChange}
            disabled={disabled}
            {...props}
            {...objectUseForm}
          >
            {list?.map((hour, key) => (
              <MenuItem
                className="beutiselect-dropdown--item"
                key={hour.key || hour.id}
                value={hour.id}
                disabled={disabledOptions && disabledOptions(hour.id)}
              >
                {hour.text}{' '}
                {hour.iseNextDay && (
                  <span className="mx-3"> {messages['workingHours.next.day']}</span>
                )}{' '}
              </MenuItem>
            ))}
          </Select>
          {error && !dontShowErrorMessage && (
            <p className="beuti-input__errormsg">{error}</p>
          )}
          {note && !error && <p className="beuti-input__note">{note}</p>}
        </div>
      )}{' '}
    </>
  );
};

SelectInputMUI.propTypes = {
  label: PropTypes.string,
  labelClass: PropTypes.string,
  note: PropTypes.string,
  className: PropTypes.string,
  arrayReference: PropTypes.string,
  error: PropTypes.bool,
  disabled: PropTypes.bool,
  list: PropTypes.array,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  watch: PropTypes.func,
  disabledOptions: PropTypes.func,
  defaultValue: PropTypes.number,
  objectUseForm: PropTypes.object,
  useFormRef: PropTypes.object,
  dontShowErrorMessage: PropTypes.bool,
};
export default SelectInputMUI;
