/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import React from 'react';
import { useHistory } from 'react-router-dom';
import SVG from 'react-inlinesvg';

export default function CloseBackIcon({ onClick }) {
  const history = useHistory();
  return (
    <div>
      <button
        type="button"
        className="booking-navbar__close"
        onClick={() => {
          if (onClick) {
            onClick();
          } else {
            history.goBack();
          }
        }}
      >
        <SVG src={toAbsoluteUrl('/Close.svg')} />
      </button>
    </div>
  );
}
