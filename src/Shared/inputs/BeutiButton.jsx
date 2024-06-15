/* eslint-disable react/button-has-type */

import React from 'react';
import PropTypes from 'prop-types';

const BeutiButton = ({ loading, type, text, className, disabled, onClick }) => (
  <button
    type={type || 'button'}
    className={`beutibutton ${className || ' '}`}
    disabled={loading || disabled}
    onClick={onClick}
  >
    {loading ? (
      <div className="spinner-border spinner-border-sm mb-1" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    ) : (
      text
    )}
  </button>
);

BeutiButton.propTypes = {
  loading: PropTypes.bool,
  type: PropTypes.string,
  text: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};
export default BeutiButton;
