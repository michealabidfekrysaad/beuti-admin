import React, { useContext, useState } from 'react';
import {
  AuthStepsContext,
  FORGET_PASSWORD_ONE,
  FORGET_PASSWORD_OTP,
  FORGET_PASSWORD_RESET,
} from 'providers/AuthStepsProvider';
import { VERIFY_PHONE_EP } from 'utils/API/EndPoints/AuthEP';
import { CallAPI } from 'utils/API/APIConfig';
import { toast } from 'react-toastify';
import EnterPhoneStep from './forgetPassword/EnterPhoneStep';
import OTPSTEP from './forgetPassword/OTPSTEP';
import ResetPasswordStep from './forgetPassword/ResetPasswordStep';

const ForgetPasswordView = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const { authSteps, setAuthSteps } = useContext(AuthStepsContext);
  const { refetch, isFetching } = CallAPI({
    name: 'verifyPhone',
    url: VERIFY_PHONE_EP,
    baseURL: process.env.REACT_APP_VERIFY_URL,
    query: {
      PhoneNumber: phoneNumber,
    },
    onSuccess: (res) => {
      if (res.data?.data?.isSuccess || res.data?.data?.blockType === 0) {
        setAuthSteps({
          ...authSteps,
          forgetpasswordStep: FORGET_PASSWORD_OTP,
          phoneNumber,
          timer: res?.data?.data?.remainingBlockTime,
        });
      } else {
        toast.error(res.data.data.message);
      }
    },
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });

  return (
    <>
      {authSteps.forgetpasswordStep === FORGET_PASSWORD_ONE && (
        <EnterPhoneStep
          callVerifyPhone={refetch}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          loading={isFetching}
        />
      )}
      {authSteps.forgetpasswordStep === FORGET_PASSWORD_OTP && (
        <OTPSTEP callVerifyPhone={refetch} loading={isFetching} />
      )}
      {authSteps.forgetpasswordStep === FORGET_PASSWORD_RESET && <ResetPasswordStep />}
    </>
  );
};

export default ForgetPasswordView;
