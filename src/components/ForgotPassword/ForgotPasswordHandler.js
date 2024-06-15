/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext, Redirect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Form, Segment, Button, Message } from 'semantic-ui-react';
import { useIntl } from 'react-intl';
import useAPI, { post, get } from 'hooks/useAPI';
import { validateInput, validatePassword } from 'validations/login.validations';
import { isNumbersOnly, isValidEmail } from 'functions/validate';
import { UserContext } from 'providers/UserProvider';

// eslint-disable-next-line react/prop-types
function LoginFormHandler() {
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

  useEffect(() => {
    if (User.access_token && User.userData) {
      history.push('/');
    }
  });

  const isButtonDisabled =
    emailOrPhone.length < 1 || emaiOrPhoneError || passwordError || password.length < 8;

  const inputAndValidateEmailOrPhone = (e) => {
    const input = e.target.value;
    setErrorMessage('');
    setEmailOrPhone(input);
    validateInput(input, setEmaiOrPhoneError);
  };
  const inputAndValidatePassword = (e) => {
    const input = e.target.value;
    setErrorMessage('');
    setPassword(input);
    validatePassword(input, setEmaiOrPhoneError);
  };

  useEffect(() => {
    if (User.access_token) getUserData(true);
  }, [User]);

  useEffect(() => {
    if (userData) {
      setUser({ ...User, userData: userData && userData.data });
      localStorage.setItem('userData', JSON.stringify(userData.data));
    }
    if (userData) {
      history.push('/');
    }
  }, [userData]);

  useEffect(() => {
    if (token && token.data && token.data.access_token) {
      setUser({
        access_token: token.data.access_token,
      });
      localStorage.setItem('access_token', token.data.access_token);
    } else if (token && token.error) {
      if (token.error.code === 1100) {
        setEmaiOrPhoneError(true);
        setErrorMessage(token.error.message);
      }
    }
  }, [token]);

  useEffect(() => {
    if (payload) {
      setRecall(true);
      setErrorMessage('');
    }
  }, [payload]);

  const handleSubmit = () => {
    const newPayload = {
      email: isValidEmail(emailOrPhone) ? emailOrPhone : '',
      phone: isNumbersOnly(emailOrPhone) ? emailOrPhone : '',
      password,
      login_using_email: isValidEmail(emailOrPhone),
    };
    setPayload(newPayload);
  };

  return (
    <>
      <Form size="large" loading={isLoading}>
        <Segment>
          <Form.Input
            fluid
            icon={emailOrPhone !== '' && isNumbersOnly(emailOrPhone) ? 'phone' : 'user'}
            error={emaiOrPhoneError}
            placeholder={messages[`components.login.emailAddress`]}
            onBlur={inputAndValidateEmailOrPhone}
            onChange={inputAndValidateEmailOrPhone}
          />
          <Form.Input
            fluid
            icon="lock"
            placeholder={messages[`components.login.password`]}
            error={passwordError}
            type="password"
            onChange={inputAndValidatePassword}
          />
          <Button
            color="purple"
            fluid
            size="large"
            onClick={handleSubmit}
            disabled={isButtonDisabled}
          >
            {messages[`components.login.login`]}
          </Button>
        </Segment>
      </Form>
      <Message negative={errorMessage}>
        {errorMessage && <p>{errorMessage}</p>}
        <Link to="/forgot-your-password">
          {messages[`components.login.forgotYourPassword`]}
        </Link>
      </Message>
    </>
  );
}

export default LoginFormHandler;
