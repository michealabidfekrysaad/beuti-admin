import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import Toggle from 'react-toggle';
import PropTypes from 'prop-types';

const GoingToHome = ({ homeServiceSettings, SetHomeServiceSetting }) => {
  const { messages } = useIntl();

  return (
    <Row>
      <Col lg={8} md={6} xs={12}>
        <h3 className="settings__section-title">
          {messages['setting.home.goingtohome.title']}
        </h3>
        <p className="settings__section-description">
          {messages['setting.home.goingtohome.description']}
        </p>
      </Col>
      <Col lg={4} md={6} xs={12}>
        <div className="settings__section-toggle">
          <Toggle
            id="acceptChairBookingOnly"
            icons={{
              unchecked: null,
            }}
            checked={!homeServiceSettings.acceptChairBookingOnly}
            onChange={(e) =>
              SetHomeServiceSetting({
                ...homeServiceSettings,
                acceptChairBookingOnly: !homeServiceSettings.acceptChairBookingOnly,
              })
            }
          />
          <label htmlFor="acceptChairBookingOnly">
            {messages['setting.home.goingtohome.toggle']}
          </label>
        </div>
        <p className="settings__section-note">
          {messages['setting.home.goingtohome.note']}
        </p>
      </Col>
    </Row>
  );
};
GoingToHome.propTypes = {
  homeServiceSettings: PropTypes.object,
  SetHomeServiceSetting: PropTypes.func,
};
export default GoingToHome;
