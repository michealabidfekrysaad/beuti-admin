/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import PropTypes from 'prop-types';

import './InputsBeuti.scss';
import { Controller } from 'react-hook-form';
import { FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import { Col, Row } from 'react-bootstrap';
const RadioInputMUI = ({
  label,
  error,
  list,
  onChange,
  disabled,
  labelClass,
  className,
  useFormRef,
  defaultValue,
  note,
  disabledOptions,
  control,
  checkedValue,
  ...props
}) => (
  <>
    {useFormRef || control ? (
      <div className="beutiselect">
        <Controller
          control={control}
          className="beuti"
          {...props}
          render={({ field }) => (
            <RadioGroup aria-label="gender" {...field}>
              <Row className="justify-content-between">
                {list.map((item) => (
                  <Col xs="auto">
                    <FormControlLabel
                      value={item.id}
                      control={<Radio />}
                      label={item.label}
                      checked={item?.id?.toString() === field?.value?.toString()}
                    />
                  </Col>
                ))}
              </Row>
            </RadioGroup>
          )}
        />
        {error && <p className="beuti-input__errormsg">{error}</p>}
        {note && !error && <p className="beuti-input__note">{note}</p>}
      </div>
    ) : (
      <div className="beutiselect">
        <RadioGroup aria-label="gender" {...props}>
          <Row className="justify-content-between">
            {list?.map((element) => (
              <Col xs="auto">
                <FormControlLabel
                  value={element.id}
                  control={<Radio onChange={onChange} disabled={disabled} />}
                  label={element.label}
                  checked={element?.id?.toString() === checkedValue?.toString()}
                />
              </Col>
            ))}
          </Row>
        </RadioGroup>
        {error && <p className="beuti-input__errormsg">{error}</p>}
        {note && !error && <p className="beuti-input__note">{note}</p>}
      </div>
    )}
  </>
);

RadioInputMUI.propTypes = {
  label: PropTypes.string,
  labelClass: PropTypes.string,
  note: PropTypes.string,
  className: PropTypes.string,
  error: PropTypes.bool,
  disabled: PropTypes.bool,
  list: PropTypes.array,
  onChange: PropTypes.func,
  watch: PropTypes.func,
  disabledOptions: PropTypes.func,
  defaultValue: PropTypes.number,
  control: PropTypes.object,
  useFormRef: PropTypes.object,
  checkedValue: PropTypes.string,
};
export default RadioInputMUI;
