import React, { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

// This Provider To Share Booking Date Between Queue View Calender And Booking Details
export const AuthStepsContext = createContext();
export const LOGIN_VIEW = 'login';
export const FORGET_PASSWORD_VIEW = 'forgetPassword';
export const FORGET_PASSWORD_ONE = 'forgetPasswordStepOne';
export const FORGET_PASSWORD_OTP = 'forgetPasswordStepOTP';
export const FORGET_PASSWORD_RESET = 'forgetPasswordStepReset';
export const REGISTER_VIEW = 'register';
export const REGISTER_FORM = 'registerForm';
export const REGISTER_OTP = 'registerOTP';
export const REGISTER_COMPELETE = 'registerCompelete';
let interval;
export const initalAuthSteps = {
  view: LOGIN_VIEW,
  forgetpasswordStep: FORGET_PASSWORD_ONE,
  registerStep: REGISTER_FORM,
  registerObject: {},
  timer: 120,
  phoneNumber: '',
  resetPasswordToken: '',
  businessCategory: 0,
};
const AuthStepsProvider = ({ children }) => {
  moment.locale('en');
  const [authSteps, setAuthSteps] = useState({ ...initalAuthSteps });
  /* -------------------------------------------------------------------------- */
  /*                                    Timer                                   */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (
      authSteps.forgetpasswordStep === FORGET_PASSWORD_OTP ||
      authSteps.registerStep === REGISTER_OTP
    ) {
      clearInterval(interval);
      interval = setInterval(() => {
        setAuthSteps((oldState) => ({ ...oldState, timer: oldState.timer - 1 }));
      }, 1000);
    }
    if (authSteps.timer === 0) {
      clearInterval(interval);
    }
  }, [authSteps]);
  return (
    <AuthStepsContext.Provider value={{ authSteps, setAuthSteps }}>
      {children}
    </AuthStepsContext.Provider>
  );
};
AuthStepsProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export default AuthStepsProvider;
