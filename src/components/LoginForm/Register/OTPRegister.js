import React, { useContext, useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { UserContext } from 'providers/UserProvider';
import { AuthStepsContext, initalAuthSteps } from 'providers/AuthStepsProvider';
import { useIntl } from 'react-intl';
import OtpView from 'components/shared/OtpView';
import { CallAPI } from 'utils/API/APIConfig';
import {
  GET_USER_DATA_EP,
  LOGIN_EP,
  REGISTER_CONFIRM_EP,
} from 'utils/API/EndPoints/AuthEP';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

const OTPRegister = ({ callCreateSalon, loading }) => {
  const [otpCode, setOTPCode] = useState('----');
  const { messages } = useIntl();
  const { authSteps, setAuthSteps } = useContext(AuthStepsContext);
  const { User, setUser } = useContext(UserContext);

  const { refetch: callUserData } = CallAPI({
    name: 'getUserData',
    url: GET_USER_DATA_EP,
    onSuccess: (userData) => {
      if (userData.data) {
        setUser({ ...User, userData: userData?.data });
        localStorage.setItem('userData', JSON.stringify(userData?.data));
        setAuthSteps({ ...initalAuthSteps });
      }
    },
    onError: (err) => toast.error(err.response.data.error.message),
  });
  const { data: tokenRes, refetch: callLogin } = CallAPI({
    name: 'login',
    url: LOGIN_EP,
    method: 'post',
    body: {
      phone: authSteps.registerObject?.mobileNumber,
      password: authSteps.registerObject?.password,
    },
    cacheTime: 500,
    onSuccess: (token) => {
      if (token.data.data.access_token) {
        setUser({
          access_token: token.data.data.access_token,
        });
        localStorage.setItem('access_token', token.data.data.access_token);
      }
    },
    onError: (err) => toast.error(err.response.data.error.message),
  });

  const { data, refetch, isFetching } = CallAPI({
    name: 'register-otp',
    url: REGISTER_CONFIRM_EP,
    body: {
      code: otpCode,
      phoneNumber: authSteps.registerObject?.mobileNumber,
    },
    method: 'post',
    retry: false,
    onSuccess: (res) => {
      if (res.data?.isSuccess) {
        toast.success(res.data?.customMessage?.messageKey);
        setUser({ ...User, access_token: '' });
        callLogin();
      }
    },
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });
  useEffect(() => {
    if (User.access_token && tokenRes?.data?.data?.access_token) callUserData();
  }, [User]);
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
              resend={callCreateSalon}
              loading={loading || isFetching || data?.data?.isSuccess}
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
OTPRegister.propTypes = {
  callCreateSalon: PropTypes.func,
  loading: PropTypes.bool,
};
export default OTPRegister;
