import React from 'react';
import { Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

export default function Additionaltime({ allowAddTime, setAllowAddTime }) {
  const { messages } = useIntl();

  return (
    <>
      <Col xs={12}>
        <p className="container-box__controllers--header">
          {messages['spAdmin.service.add.additional.time']}
          <span className="container-box__controllers--label__required">*</span>
        </p>
      </Col>
      <Col xs={12}>
        <div className="form-check container-box__controllers--checkDiv">
          <input
            className="form-check-input custom-color"
            type="checkbox"
            checked={allowAddTime}
            onChange={() => setAllowAddTime(!allowAddTime)}
            id="additionalTime"
          />
          <label className="form-check-label" htmlFor="additionalTime">
            {messages['spAdmin.service.add.additional.time.info']}
          </label>
        </div>
      </Col>
    </>
  );
}
Additionaltime.propTypes = {
  allowAddTime: PropTypes.bool,
  setAllowAddTime: PropTypes.func,
};
