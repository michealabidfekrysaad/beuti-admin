/* eslint-disable react/jsx-props-no-spreading */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

const DayCheckbox = ({
  text,
  dayPath,
  setSelectedDay,
  useFormRef,
  setValue,
  currentDay,
  selectedDay,
  watch,
  defaultValue = false,
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
    <div className="form-check container-box__controllers--checkDiv mt-input width-100px">
      <input
        className="form-check-input custom-color my-0 pb-0"
        type="checkbox"
        checked={valueState}
        id={useFormRef.name}
        {...useFormRef}
        onChange={(e) => {
          if (e.target.checked) {
            setValue(dayPath, {
              ...currentDay,
              shifts: JSON.parse(JSON.stringify(selectedDay.shifts)),
              isSelected: e.target.checked,
            });
          } else {
            setValue(dayPath, {
              ...currentDay,
              shifts: [],
              isSelected: e.target.checked,
            });
          }
        }}
      />
      <label
        className="container-box__controllers--label my-0 mx-2 workingHoursLabel"
        htmlFor={useFormRef.name}
      >
        {text}
      </label>
    </div>
  );
};

DayCheckbox.propTypes = {
  text: PropTypes.string,
  dayPath: PropTypes.string,
  currentDay: PropTypes.object,
  selectedDay: PropTypes.object,
  setSelectedDay: PropTypes.func,
  setValue: PropTypes.func,
  watch: PropTypes.func,
  defaultValue: PropTypes.bool,
  useFormRef: PropTypes.object,
};
export default DayCheckbox;
