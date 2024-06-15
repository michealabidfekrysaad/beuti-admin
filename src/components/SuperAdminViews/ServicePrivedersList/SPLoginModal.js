/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useContext, useEffect, useState } from 'react';
import useAPI, { post, get } from 'hooks/useAPI';
import { isNumbersOnly, startsWith05 } from 'validations/validate';
import { UserContext } from 'providers/UserProvider';
import { useIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';

import { emailPattern } from 'constants/regex';
import { useHistory } from 'react-router-dom';
import { FormControl, TextField, Tooltip } from '@material-ui/core';
import Fade from '@material-ui/core/Fade';

import Alert from '@material-ui/lab/Alert';

export const isValidEmail = (value) => emailPattern.test(value);

function SPLoginModal({ id }) {
  const { messages } = useIntl();
  const history = useHistory();
  const { User, setUser } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginOpen, setloginOpen] = useState();
  const [loginAs, setLoginAs] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [logedInAsSp, setLogedInAsSp] = useState(false);
  const [gotData, setGotData] = useState(false);
  const [errorLogin, setErrorLogin] = useState(false);
  const { response, isLoading, setRecall } = useAPI(post, 'Account/loginAs', {
    serviceProviderId: loginAs,
    email: isValidEmail(email) ? email : null,
    phone: isNumbersOnly(email) ? email : null,
    password,
    login_using_email: isValidEmail(email),
  });
  const { response: userData, setRecall: getUserData } = useAPI(
    get,
    'Account/GetUserData',
  );
  useEffect(() => {
    if (response && response.data && response.data.access_token) {
      setUser({
        access_token: response.data.access_token,
      });
      localStorage.setItem('access_token', response.data.access_token);
      setLogedInAsSp(true);
    } else {
      setErrorLogin(response?.error?.message);
      setTimeout(() => {
        setErrorLogin(false);
      }, [3000]);
    }
  }, [response]);

  useEffect(() => {
    if (User.access_token && logedInAsSp) getUserData(true);
  }, [User]);

  useEffect(() => {
    if (userData) {
      setUser({ ...User, userData: userData && userData.data });
      localStorage.setItem('userData', JSON.stringify(userData.data));
      setGotData(true);
    }
    if (userData && logedInAsSp && gotData) {
      history.push('/');
    }
  }, [userData]);

  useEffect(() => {
    setLoginAs(id);
  }, [id]);
  return (
    <>
      <Tooltip
        arrow
        TransitionComponent={Fade}
        title={messages['components.login.login']}
      >
        <button
          type="button"
          className="icon-wrapper-btn btn-icon-info mx-1"
          onClick={() => setloginOpen(true)}
        >
          <i className="flaticon-home text-info"></i>
        </button>
      </Tooltip>
      <Modal
        onHide={() => {
          setloginOpen(false);
        }}
        show={loginOpen}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="bootstrap-modal-customizing"
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter" className="title">
            <FormattedMessage id="title.loginPage" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {(emailError || errorLogin) && (
            <Alert className="align-items-center mb-2" severity="error">
              <FormattedMessage id="reservationSteps.userData.invalidEmailOrPassword" />
            </Alert>
          )}
          <FormControl fullWidth className="mb-3">
            <TextField
              error={
                emailError
                  ? messages['reservationSteps.userData.invalidEmailOrPassword']
                  : false
              }
              className="login-modal-input"
              label={messages['reservationSteps.userData.emailOrPhone']}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              helperText={
                emailError
                  ? messages['reservationSteps.userData.invalidEmailOrPassword']
                  : false
              }
            />
          </FormControl>
          <FormControl fullWidth>
            <TextField
              error={
                password.length < 8 &&
                password.length !== 0 &&
                messages['reservationSteps.userData.invalidEmailOrPassword']
              }
              label={messages['reservationSteps.userData.password']}
              className="login-modal-input"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              helperText={
                password.length < 8 &&
                password.length !== 0 &&
                messages['reservationSteps.userData.invalidEmailOrPassword']
              }
            />
          </FormControl>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => setloginOpen(false)}
            disabled={isLoading}
            className="px-4"
            variant="outline-danger"
          >
            <FormattedMessage id="common.close" />
          </Button>
          <Button
            variant="success"
            disabled={password.length < 8 || isLoading}
            onClick={() => {
              if (isValidEmail(email) || (isNumbersOnly(email) && startsWith05(email))) {
                setRecall(true);
              } else {
                setEmailError(true);
              }
            }}
            className="px-4"
          >
            <FormattedMessage id="title.loginPage" />
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default SPLoginModal;

SPLoginModal.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
