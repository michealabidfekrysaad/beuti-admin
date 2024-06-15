/* eslint-disable prettier/prettier */
/* eslint-disable arrow-body-style */
/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext, Redirect } from 'react';
import { useHistory } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import useAPI, { post, get } from 'hooks/useAPI';
import {
  isNumbersOnly,
  isValidEmail,
  isPhoneLengthValid,
  startsWith05,
} from 'functions/validate';
import { UserContext } from 'providers/UserProvider';
import {
  AuthStepsContext,
  FORGET_PASSWORD_VIEW,
  REGISTER_VIEW,
} from '../../providers/AuthStepsProvider';

// eslint-disable-next-line react/prop-types
function LoginFormHandler() {
  const { authSteps, setAuthSteps } = useContext(AuthStepsContext);

  const { messages } = useIntl();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [emaiOrPhoneError, setEmaiOrPhoneError] = useState(null);
  const [passwordError, setPasswordError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [payload, setPayload] = useState(null);
  const history = useHistory();
  const { User, setUser } = useContext(UserContext);
  const [tokenAPI, userDataAPI] = ['Account/login', 'Account/GetUserData'];
  const { response: token, isLoading, setRecall } = useAPI(post, tokenAPI, payload);
  const { response: userData, isLoading: waiting, setRecall: getUserData } = useAPI(
    get,
    userDataAPI,
  );
  const inputAndValidateEmailOrPhone = (e) => {
    const input = e.target.value;
    setErrorMessage('');
    setEmaiOrPhoneError(null);
    setEmailOrPhone(input.trim());
  };
  const inputAndValidatePassword = (e) => {
    const input = e.target.value;
    setEmaiOrPhoneError(null);
    setErrorMessage('');
    setPassword(input);
  };

  const validatEmailOrPassword = () => {
    if (Number.isNaN(Number(emailOrPhone))) {
      if (!isValidEmail(emailOrPhone)) {
        setEmaiOrPhoneError(true);
      } else {
        setEmaiOrPhoneError(false);
      }
    } else if (isPhoneLengthValid(emailOrPhone) && startsWith05(emailOrPhone)) {
      setEmaiOrPhoneError(false);
    } else {
      setEmaiOrPhoneError(true);
    }
  };

  useEffect(() => {
    if (User.access_token && User.userData) {
      history.push('/bookings');
    }
  });

  useEffect(() => {
    if (User.access_token && !authSteps?.stopCallUserDate) getUserData(true);
  }, [User]);

  useEffect(() => {
    if (userData?.data) {
      setUser({ ...User, userData: userData && userData.data });
      localStorage.setItem('userData', JSON.stringify(userData.data));
    }
    if (userData?.data) {
      if (userData.data?.isSuperAdmin) {
        history.push('/');
      } else {
        history.push('/bookings');
      }
    }
  }, [userData]);

  useEffect(() => {
    if (token && token.data && token.data.access_token) {
      setUser({
        access_token: token.data.access_token,
      });
      localStorage.setItem('access_token', token.data.access_token);
    } else if (token && token.error) {
      if (token.error.code) {
        setEmaiOrPhoneError(true);
        setErrorMessage(token.error.message);
        setTimeout(() => {
          setEmaiOrPhoneError(null);
          setErrorMessage('');
        }, [4000]);
      }
    }
  }, [token]);

  useEffect(() => {
    if (payload) {
      setRecall(true);
      setErrorMessage('');
    }
  }, [payload]);

  const isEnglishNum = (value) => {
    return value
      .replace(/[٠١٢٣٤٥٦٧٨٩]/g, function(d) {
        return d.charCodeAt(0) - 1632;
      })
      .replace(/[۰۱۲۳۴۵۶۷۸۹]/g, function(d) {
        return d.charCodeAt(0) - 1776;
      });
  };

  const handleSubmit = (e) => {
    setAuthSteps({ ...authSteps, stopCallUserDate: false });
    e.preventDefault();
    const newPayload = {
      email: isValidEmail(emailOrPhone.trim()) ? emailOrPhone.trim() : '',
      phone: isNumbersOnly(isEnglishNum(emailOrPhone)) ? isEnglishNum(emailOrPhone) : '',
      password,
      login_using_email: isValidEmail(emailOrPhone.trim()),
    };
    setPayload(newPayload);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="w-75">
        <Row className="justify-content-center align-items-center">
          <Col md={12} className="">
            <label htmlFor="service" className="input-box__controllers__label w-100">
              {messages[`components.login.emailAddress`]}
            </label>
            <input
              className={`input-box__controllers-input w-100 ${emaiOrPhoneError &&
                'input-box__controllers-input--error'}`}
              name="userName"
              type="text"
              disabled={isLoading}
              placeholder={messages[`components.login.emailAddress`]}
              value={emailOrPhone}
              onChange={inputAndValidateEmailOrPhone}
            />
          </Col>
          <Col md={12} className="mt-3">
            <label htmlFor="service" className="input-box__controllers__label w-100">
              {messages[`components.login.password`]}
            </label>
            <input
              className={`input-box__controllers-input w-100 ${emaiOrPhoneError &&
                'input-box__controllers-input--error'}`}
              name="password"
              type="password"
              disabled={isLoading}
              placeholder={messages[`components.login.password`]}
              value={password}
              onChange={inputAndValidatePassword}
            />
          </Col>
        </Row>
        <Row className="justify-content-between align-items-center mt-3">
          {errorMessage && (
            <Col md={12} className="mt-3 mb-3">
              <p className="error-message">{errorMessage}</p>
            </Col>
          )}
          <Col md="auto" className="mt-3">
            <button
              className="btn btn-primary pl-5 pr-5"
              type="submit"
              disabled={passwordError || emaiOrPhoneError}
            >
              {!isLoading ? (
                messages['title.loginPage']
              ) : (
                <div className="spinner-border spinner-border-sm mb-1" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              )}
            </button>
          </Col>
          <Col md="auto" className="mt-3">
            <button
              type="button"
              className="beuti-link"
              onClick={(e) => setAuthSteps({ ...authSteps, view: FORGET_PASSWORD_VIEW })}
            >
              {messages[`components.login.forgotYourPassword`]}
            </button>
          </Col>
        </Row>
        <Row className="justify-content-center align-items-center mt-5">
          <Col md="auto" className="donthaveaccount">
            <button
              type="button"
              onClick={(e) => setAuthSteps({ ...authSteps, view: REGISTER_VIEW })}
            >
              {messages[`login.dontHaveAccount`]}

              <span>{messages[`login.register`]}</span>
            </button>
          </Col>
        </Row>
      </form>
    </>
  );
}

export default LoginFormHandler;
