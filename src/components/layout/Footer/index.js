import React from 'react';
import { Link } from 'react-router-dom';
import { Segment, Container, Header } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import googleChrome from 'images/chrome1.png';
const scope = 'components.footer';

function Footer() {
  const values = {
    year: new Date().getFullYear(),
    application: (
      <Link to="/" style={{ color: 'wheat' }}>
        Beuti
      </Link>
    ),
  };

  return (
    <Segment inverted vertical color="purple" id="footer">
      <Container fluid>
        <Header as="h5" inverted>
          <FormattedMessage id={`${scope}.copyRights`} values={values} />
          <span className="ml-1 mr-1">-</span>
          <FormattedMessage id={`${scope}.browserHint`} />
          <img alt="google-chrome" className="google-image-footer" src={googleChrome} />
        </Header>
      </Container>
    </Segment>
  );
}

export default Footer;
