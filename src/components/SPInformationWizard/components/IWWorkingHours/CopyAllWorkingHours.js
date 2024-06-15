import React from 'react';
import { useIntl } from 'react-intl';
import { Col, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';

const CopyAllWorkingHours = ({ handleClose, handleCopy }) => {
  const { messages } = useIntl();

  return (
    <Col xs="12">
      <Row className="informationwizard__box-copy">
        <Col xs="auto">
          <span className="informationwizard__box-copy--text">
            {messages['rw.bussinessHours.copyalltext']}
          </span>
          <button
            type="button"
            className="informationwizard__box-copy--yes"
            onClick={handleCopy}
          >
            {messages['rw.bussinessHours.yescopy']}
          </button>
        </Col>
        <Col xs="auto">
          <button
            type="button"
            className="informationwizard__box-copy--close"
            onClick={handleClose}
          >
            <i className="flaticon2-cross"></i>
          </button>
        </Col>
      </Row>
    </Col>
  );
};

CopyAllWorkingHours.propTypes = {
  handleClose: PropTypes.func,
  handleCopy: PropTypes.func,
};
export default CopyAllWorkingHours;
