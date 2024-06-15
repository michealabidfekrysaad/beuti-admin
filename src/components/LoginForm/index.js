/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext, useEffect } from 'react';
import { Image } from 'semantic-ui-react';
import { Card, Col, Row } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import {
  AuthStepsContext,
  LOGIN_VIEW,
  FORGET_PASSWORD_VIEW,
  REGISTER_VIEW,
  FORGET_PASSWORD_ONE,
  REGISTER_FORM,
} from 'providers/AuthStepsProvider';
import Logo from 'images/logo.png';
import LocaleSwitch from 'components/layout/NavBar/NavBarItems/LocaleSwitch';
import { UserContext } from 'providers/UserProvider';
import { GET_AUTH_TOKEN_EP, GET_ACCESS_TOKEN_EP } from 'utils/API/EndPoints/AuthEP';
import { CallAPI } from 'utils/API/APIConfig';
import LoginView from './LoginView';
import ForgetPasswordView from './ForgetPasswordView';
import RegisterView from './RegisterView';
function LoginForm() {
  const { messages, locale } = useIntl();
  const { authSteps, setAuthSteps } = useContext(AuthStepsContext);
  const { User, setUser } = useContext(UserContext);

  const { refetch } = CallAPI({
    name: 'getToken',
    url: GET_ACCESS_TOKEN_EP,
    method: 'get',
    // headers: {
    //   ClientId: 'ServiceProvider',
    //   ClientSecret: 'secret',
    //   GrantType: 'client_credentials',
    //   Scope: 'service-provider',
    // },
    refetchOnWindowFocus: false,
    onSuccess: ({ data: { data } }) => setUser({ ...User, access_token: data.token }),
  });
  useEffect(() => {
    if (authSteps.view !== LOGIN_VIEW) {
      refetch();
    }
  }, [authSteps.view]);
  return (
    <>
      <div id="login-page">
        <Row className="logo-local-position">
          <Col lg={1} md={4} xs={12}>
            {authSteps.view === LOGIN_VIEW && <LocaleSwitch />}
          </Col>
          <Col
            lg={10}
            md={4}
            xs={12}
            className="d-flex justify-content-center flex-grow-1"
          >
            <div className="img-login">
              <img alt="Beuti" width={135} height={46} src={Logo} loading="lazy" />
            </div>
          </Col>
          <Col lg={1} md={4} xs={12} />
        </Row>
        <Card>
          <Card.Header
            className="text-center"
            style={{ display: 'block', margin: '15px' }}
          >
            <div className="title">
              {authSteps.view === LOGIN_VIEW && messages['title.loginPage']}
              {(authSteps.view === FORGET_PASSWORD_VIEW ||
                authSteps.view === REGISTER_VIEW) && (
                <i
                  onClick={() =>
                    setAuthSteps({
                      ...authSteps,
                      view: LOGIN_VIEW,
                      stopCallUserDate: true,
                      forgetpasswordStep: FORGET_PASSWORD_ONE,
                      registerStep: REGISTER_FORM,
                    })
                  }
                  className={`pointer la-arrow-left la mx-3 ${locale === 'ar' &&
                    'la-rotate-180'}`}
                ></i>
              )}
              {authSteps.view === FORGET_PASSWORD_VIEW && messages['login.resetpassword']}
              {authSteps.view === REGISTER_VIEW && messages['register.header']}
            </div>
          </Card.Header>
          <Card.Body
            className="box-shadow-30"
            style={{ margin: '15px', padding: '0', overflowx: 'none !important' }}
          >
            {authSteps.view === LOGIN_VIEW && <LoginView />}
            {authSteps.view === FORGET_PASSWORD_VIEW && <ForgetPasswordView />}
            {authSteps.view === REGISTER_VIEW && <RegisterView />}
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

export default LoginForm;
