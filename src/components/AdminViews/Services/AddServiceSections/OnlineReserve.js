import React from 'react';
import { Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

export default function OnlineReserve({ allowOnlineReserve, setAllowOnlineReserve }) {
  const { messages } = useIntl();

  return (
    <>
      <Col xs={12}>
        <p className="container-box__controllers--header">
          {messages['spAdmin.service.add.online.reserve']}
        </p>
      </Col>
      <Col xs={12}>
        <div className="form-check container-box__controllers--checkDiv">
          <input
            className="form-check-input custom-color"
            type="checkbox"
            value=""
            checked={allowOnlineReserve}
            onChange={() => setAllowOnlineReserve(!allowOnlineReserve)}
            id="flexCheckDefault"
          />
          <label className="form-check-label" htmlFor="flexCheckDefault">
            {messages['spAdmin.service.label.online.reserve']}
          </label>
        </div>
      </Col>
    </>
  );
}

OnlineReserve.propTypes = {
  allowOnlineReserve: PropTypes.bool,
  setAllowOnlineReserve: PropTypes.func,
};
