import React, { useContext, useState } from 'react';
import {
  AuthStepsContext,
  REGISTER_FORM,
  REGISTER_OTP,
} from 'providers/AuthStepsProvider';
import { REGISTER_EP } from 'utils/API/EndPoints/AuthEP';
import { CallAPI } from 'utils/API/APIConfig';
import { toast } from 'react-toastify';
import RegisterForm from './Register/RegisterForm';
import OTPRegister from './Register/OTPRegister';

const RegisterView = () => {
  const { authSteps, setAuthSteps } = useContext(AuthStepsContext);
  const [formData, setFormData] = useState({});
  const handleSuccess = (data) => {
    if (
      (data.data?.data?.isSuccess || data.data?.data?.blockType === 0) &&
      data.data?.data?.isPhoneConfirmationRequired
    ) {
      setAuthSteps({
        ...authSteps,
        registerObject: { ...authSteps.registerObject, ...formData },
        registerStep: REGISTER_OTP,
        timer: data.data?.data?.remainingBlockTime,
      });
    }
  };
  const { refetch, isFetching } = CallAPI({
    name: 'create-salon',
    url: REGISTER_EP,
    method: 'post',
    body: { ...authSteps.registerObject, ...formData },
    onSuccess: handleSuccess,
    onError: (err) => toast.error(err?.response?.data?.error?.message),
    retry: false,
  });
  return (
    <>
      {authSteps.registerStep === REGISTER_FORM && (
        <RegisterForm
          callCreateSalon={refetch}
          loading={isFetching}
          setFormData={setFormData}
        />
      )}
      {authSteps.registerStep === REGISTER_OTP && (
        <OTPRegister callCreateSalon={refetch} loading={isFetching} />
      )}
    </>
  );
};

export default RegisterView;
