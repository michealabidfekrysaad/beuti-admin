import React, { useContext, useEffect } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import BeutiInput from 'Shared/inputs/BeutiInput';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CallAPI } from 'utils/API/APIConfig';
import { toast } from 'react-toastify';
import { AuthStepsContext, initalAuthSteps } from 'providers/AuthStepsProvider';
import { UserContext } from 'providers/UserProvider';
import { schema } from './ResetPasswordSchema';
import BeutiButton from '../../../Shared/inputs/BeutiButton';
import {
  RESET_PHONE_EP,
  LOGIN_EP,
  GET_USER_DATA_EP,
} from '../../../utils/API/EndPoints/AuthEP';
const ResetPasswordStep = () => {
  const { messages } = useIntl();
  const { authSteps, setAuthSteps } = useContext(AuthStepsContext);
  const { User, setUser } = useContext(UserContext);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(schema),
  });
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
      phone: authSteps.phoneNumber,
      password: getValues('NewPassword'),
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
    name: 'resetPassword',
    url: RESET_PHONE_EP,
    baseURL: process.env.REACT_APP_VERIFY_URL,
    method: 'post',
    body: {
      ...getValues(),
      GeneratedToken: authSteps.resetPasswordToken,
      PhoneNumber: authSteps.phoneNumber,
    },
    cacheTime: 500,
    onSuccess: (res) => {
      if (res.data.success) {
        toast.success(messages['admin.settings.ChangePass.success']);
        setUser({ ...User, access_token: '' });
        callLogin();
      } else {
        toast.error(res.data.data.message);
      }
    },
    onError: (err) => toast.error(err.response.data.error.message),
  });
  useEffect(() => {
    if (User.access_token && tokenRes?.data?.data?.access_token) callUserData();
  }, [User]);
  return (
    <form onSubmit={handleSubmit(refetch)}>
      <Row className="mx-0">
        <Col md={12} className="forgetpassword">
          <Row className="justify-content-center">
            <Col xs="6" lg="4">
              <p className="forgetpassword__subtitle">
                {messages[`login.enternewpassword`]}
              </p>
              <BeutiInput
                type="password"
                label={messages['components.login.password']}
                placeholder="****"
                useFormRef={register('NewPassword')}
                error={errors.NewPassword?.message}
                disabled={isFetching || data?.data?.success}
                className="mb-2"
              />
              <BeutiInput
                type="password"
                label={messages['components.login.confirmpassword']}
                placeholder="****"
                useFormRef={register('ConfirmPassword')}
                error={errors.ConfirmPassword?.message}
                disabled={isFetching || data?.data?.success}
                className="mb-2"
              />
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col xs="auto" className="text-center mt-1">
              <BeutiButton
                type="submit"
                disabled={!isValid || isFetching}
                text={messages[`common.confirm`]}
                loading={isFetching || data?.data?.success}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </form>
  );
};

export default ResetPasswordStep;
