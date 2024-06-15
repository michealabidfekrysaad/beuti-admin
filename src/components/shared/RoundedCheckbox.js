/* eslint-disable */
import React from 'react';

const RoundedCheckbox = ({ className, name, label, labelClass, onChange, value }) => (
  <div className={` roundcheckBox ${className}`}>
    <div className="roundcheckBox__wrapper">
      <input type="checkbox" id={name} onChange={onChange} checked={value} />
      <label htmlFor={name} />
    </div>
    {label && (
      <label className={`${labelClass} mb-0 mx-2`} htmlFor={name}>
        {label}
      </label>
    )}
  </div>
);

export default RoundedCheckbox;
