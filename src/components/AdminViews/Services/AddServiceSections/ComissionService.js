import React from 'react';
import { Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

export default function ComissionService({ allowComission, setAllowComission }) {
  const { messages } = useIntl();

  return (
    <>
      <Col xs={12}>
        <p className="container-box__controllers--header">
          {messages['spAdmin.service.add.comission']}
          <span className="container-box__controllers--label__required">*</span>
        </p>
      </Col>
      <Col xs={12}>
        <div className="form-check container-box__controllers--checkDiv">
          <input
            className="form-check-input custom-color"
            type="checkbox"
            checked={allowComission}
            onChange={() => setAllowComission(!allowComission)}
            id="allowComission"
          />
          <label className="form-check-label" htmlFor="allowComission">
            {messages['spAdmin.service.add.allow.comission']}
          </label>
        </div>
        <p className="container-box__controllers--hint">
          {messages['spAdmin.service.allow.comission.employee']}
        </p>
      </Col>
    </>
  );
}

ComissionService.propTypes = {
  allowComission: PropTypes.bool,
  setAllowComission: PropTypes.func,
};
