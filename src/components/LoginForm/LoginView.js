import React from 'react';
import { Image } from 'semantic-ui-react';
import { Card, Col, Row } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import LoginFormHandler from 'components/LoginForm/FormHandler';
import backgroundImg from 'images/login-bg.jpg';
import DownloadStores from 'components/layout/SideBar/SideBarMenu/DownloadStores';
const LoginView = () => {
  const { messages } = useIntl();

  return (
    <Row className="mx-0">
      <Col md={6} className="d-flex justify-content-center align-items-center py-4">
        <LoginFormHandler />
      </Col>
      <Col
        md={6}
        className="mt-3 mt-sm-3 mt-md-0 px-0"
        style={{
          overflow: 'hidden',
        }}
      >
        <div className="image-login-div">
          <Image src={backgroundImg} width="100%" height="100%" className="login-image" />
        </div>
        <div className="download-icon">
          <p className="label">{messages[`components.login.sp.app`]}</p>
          <DownloadStores />
        </div>
      </Col>
    </Row>
  );
};

export default LoginView;
