import React, { useContext, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { AuthStepsContext, FORGET_PASSWORD_RESET } from 'providers/AuthStepsProvider';
import { useIntl } from 'react-intl';
import OtpView from 'components/shared/OtpView';
import { CallAPI } from 'utils/API/APIConfig';
import { CONFIRM_PHONE_EP } from 'utils/API/EndPoints/AuthEP';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

const OTPSTEP = ({ callVerifyPhone, loading }) => {
  const [otpCode, setOTPCode] = useState('----');
  const { messages } = useIntl();
  const { authSteps, setAuthSteps } = useContext(AuthStepsContext);

  const { refetch, isFetching } = CallAPI({
    name: 'confirmPhone',
    url: CONFIRM_PHONE_EP,
    baseURL: process.env.REACT_APP_VERIFY_URL,
    query: {
      code: otpCode,
      phoneNumber: authSteps.phoneNumber,
    },
    retry: false,
    onSuccess: (res) => {
      if (res.data.data.isSuccess) {
        setAuthSteps({
          ...authSteps,
          resetPasswordToken: res.data.data.resetPasswordToken,
          forgetpasswordStep: FORGET_PASSWORD_RESET,
        });
      } else {
        toast.error(res.data.data.message);
      }
    },
    onError: (err) => toast.error(err.response.data.error.message),
  });
  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          refetch();
        }}
      >
        <Row className="mx-0">
          <Col md={12} className="forgetpassword">
            <Row className="forgetpassword__verifycode">
              <Col xs="auto">
                <h2> {messages['login.otp']}</h2>
              </Col>
            </Row>
            <OtpView
              value={otpCode}
              setter={setOTPCode}
              resend={callVerifyPhone}
              loading={loading || isFetching}
              timer={authSteps.timer}
              showSubmitBtn
              showResendBtn
            />
          </Col>
        </Row>
      </form>
    </>
  );
};
OTPSTEP.propTypes = {
  callVerifyPhone: PropTypes.func,
  loading: PropTypes.bool,
};
export default OTPSTEP;
