import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormControl } from '@material-ui/core';
import CloseBackIcon from './CloseBackIcon';

const NavbarForNoWrapViews = ({
  button,
  submited,
  title,
  disabled,
  hideBtn,
  onClick = false,
}) => {
  const [colorChange, setColorchange] = useState(false);
  const changeNavbarColor = () => {
    if (window.scrollY >= 80) {
      setColorchange(true);
    } else {
      setColorchange(false);
    }
  };
  useEffect(() => {
    window.addEventListener('scroll', changeNavbarColor);
  }, []);
  return (
    <div className="booking-navbar">
      <div className="d-flex justify-content-between align-items-center w-100">
        {!hideBtn ? (
          <div>
            <FormControl component="fieldset" fullWidth>
              <button
                type="button"
                onClick={submited}
                className="btn btn-primary px-4 py-2"
                disabled={disabled}
              >
                {button}
              </button>
            </FormControl>
          </div>
        ) : (
          <div></div>
        )}
        <h4>{title}</h4>
        <CloseBackIcon onClick={onClick} />
      </div>
    </div>
  );
};
NavbarForNoWrapViews.propTypes = {
  submited: PropTypes.func,
  button: PropTypes.string,
  title: PropTypes.string,
  disabled: PropTypes.bool,
  hideBtn: PropTypes.bool,
  onClick: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
};
export default NavbarForNoWrapViews;
