import React from 'react';
import { Grid, Divider, Image } from 'semantic-ui-react';
// import { useIntl } from 'react-intl';

import ForgotPasswordHandler from 'components/LoginForm/FormHandler';
import LocaleToggle from 'components/localeToggle';

import Logo from 'images/logo.png';
import backgroundImg from 'images/login-bg.jpg';

function ForgotPassword() {
  // const { messages } = useIntl();

  return (
    <>
      <Grid divided="vertically" padded id="login-page">
        <Grid.Row columns={2} style={{ margin: '0px', padding: '0px' }}>
          <Grid.Column
            width={5}
            style={{ padding: '20px' }}
            verticalAlign="top"
            textAlign="left"
          >
            <LocaleToggle style={{ marginTop: '5em' }} />
            <Image src={Logo} size="medium" centered />
            <Divider hidden />
            <ForgotPasswordHandler />
          </Grid.Column>
          <Grid.Column width={11} className="purple m0-p0">
            <Image
              src={backgroundImg}
              width="100%"
              height="100%"
              className="login-image"
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
}

export default ForgotPassword;
