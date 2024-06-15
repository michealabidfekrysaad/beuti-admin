import React, { useContext, useEffect, useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import BeutiInput from 'Shared/inputs/BeutiInput';
import { isNumbersWithoutDash, validateInput } from 'functions/validate';
import PropTypes from 'prop-types';
import BeutiButton from '../../../Shared/inputs/BeutiButton';

const EnterPhoneStep = ({ callVerifyPhone, phoneNumber, setPhoneNumber, loading }) => {
  const { messages } = useIntl();
  const [error, setError] = useState(false);
  const handleVerifyPhone = (e) => {
    e.preventDefault();
    callVerifyPhone();
  };

  return (
    <form onSubmit={handleVerifyPhone}>
      <Row className="mx-0">
        <Col md={12} className="forgetpassword">
          <Row className="justify-content-center">
            <Col xs="6" lg="4" className="mb-2">
              <p className="forgetpassword__header">
                {messages[`components.login.forgotYourPassword`]}
              </p>
              <p className="forgetpassword__subtitle">
                {messages[`login.forgetpassword`]}
              </p>
              <BeutiInput
                type="text"
                placeholder={messages['spAdmin.bookings.phone']}
                value={phoneNumber}
                error={error && messages[`admin.customer.new.phone.validate`]}
                disabled={loading}
                onChange={(e) => {
                  if (e.target.value.length === 0) {
                    setError(false);
                  } else {
                    validateInput(e.target.value, setError);
                  }
                  return isNumbersWithoutDash(e.target.value)
                    ? setPhoneNumber(e.target.value)
                    : null;
                }}
              />
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col xs="auto" className="text-center mt-1">
              <BeutiButton
                type="submit"
                disabled={phoneNumber.length === 0 || error}
                text={messages[`login.resetpassword`]}
                loading={loading}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </form>
  );
};

EnterPhoneStep.propTypes = {
  callVerifyPhone: PropTypes.func,
  phoneNumber: PropTypes.string,
  setPhoneNumber: PropTypes.func,
  loading: PropTypes.bool,
};
export default EnterPhoneStep;
