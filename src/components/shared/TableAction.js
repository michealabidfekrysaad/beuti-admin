import { Tooltip } from '@material-ui/core';
import React from 'react';
import { useIntl } from 'react-intl';
import Fade from '@material-ui/core/Fade';
import PropTypes from 'prop-types';

const TableAction = ({
  icon,
  name,
  onClick,
  children,
  className = '',
  disabled = false,
}) => {
  const { messages } = useIntl();

  return (
    <Tooltip arrow TransitionComponent={Fade} title={messages[name]}>
      <button
        type="button"
        className={`icon-wrapper-btn btn-icon-transparent ${className}`}
        onClick={onClick}
        disabled={disabled}
      >
        {children || <i className={icon}></i>}
      </button>
    </Tooltip>
  );
};
TableAction.propTypes = {
  icon: PropTypes.string,
  name: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.elementType,
  disabled: PropTypes.bool,
};
export default TableAction;
