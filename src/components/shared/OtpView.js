import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import OtpInput from 'react-otp-input';
import PropTypes from 'prop-types';
import BeutiButton from '../../Shared/inputs/BeutiButton';

const OtpView = ({
  value,
  setter,
  loading,
  resend,
  timer,
  showSubmitBtn,
  showResendBtn,
}) => {
  const { messages } = useIntl();

  return (
    <>
      <Row>
        <Col xs="12">
          <div className="beuti-otp">
            <OtpInput
              numInputs={4}
              value={value}
              onChange={(e) => setter(e)}
              className="beuti-otp__item"
            />
          </div>
        </Col>
      </Row>
      {showSubmitBtn && (
        <Row className="justify-content-center mt-5">
          <Col xs="auto">
            <BeutiButton
              type="submit"
              disabled={value.length < 4 || value.includes('-') || loading}
              className="px-5"
              loading={loading}
              text={messages['common.activate']}
            />
          </Col>
        </Row>
      )}
      {showResendBtn && (
        <Row className="justify-content-center mt-5">
          <Col xs="auto" className="beuti-otp__timer">
            <button
              className="beuti-otp__timer-button"
              type="button"
              disabled={timer !== 0 || loading}
              onClick={resend}
            >
              {messages['login.reset']}
            </button>
            {timer !== 0 && <p className="beuti-otp__timer-count"> ({timer})</p>}
          </Col>
        </Row>
      )}
    </>
  );
};
OtpView.propTypes = {
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  setter: PropTypes.func,
  resend: PropTypes.func,
  loading: PropTypes.bool,
  timer: PropTypes.number,
  showSubmitBtn: PropTypes.bool,
  showResendBtn: PropTypes.bool,
};

export default OtpView;
