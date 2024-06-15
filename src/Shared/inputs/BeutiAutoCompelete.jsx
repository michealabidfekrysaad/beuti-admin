/* eslint-disable react/jsx-props-no-spreading */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Select, MenuItem, TextField } from '@material-ui/core';
import './InputsBeuti.scss';
import { get } from 'lodash';
import { Autocomplete } from '@material-ui/lab';
const AutoCompeleteInputMUI = ({
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
  ...props
}) => {
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
                {hour.text}
              </MenuItem>
            ))}
          </Select>
          {error && <p className="beuti-input__errormsg">{error}</p>}
          {note && !error && <p className="beuti-input__note">{note}</p>}
        </div>
      ) : (
        <div className="beuti-autocomeplete">
          {label && (
            <label htmlFor={label} className={`beutiselect-label ${labelClass}`}>
              {label}
            </label>
          )}
          <Autocomplete
            labelId={label}
            className={`beuti-autocomeplete_dropdown ${
              error ? 'error-border ' : ' '
            } ${className || ' '}`}
            value={value}
            disabled={disabled}
            options={list}
            getOptionLabel={(city) => city.text}
            onChange={onChange}
            // defaultValue={list[0]}
            {...props}
            renderInput={(rest) => <TextField {...rest} variant="outlined" />}
          />
          {error && <p className="beuti-input__errormsg">{error}</p>}
          {note && !error && <p className="beuti-input__note">{note}</p>}
        </div>
      )}{' '}
    </>
  );
};

AutoCompeleteInputMUI.propTypes = {
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
};
export default AutoCompeleteInputMUI;
