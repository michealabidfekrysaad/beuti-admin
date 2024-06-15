/* eslint-disable indent */

import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import BeutiInput from 'Shared/inputs/BeutiInput';
import PropTypes from 'prop-types';
import { onlyNumbers } from 'functions/validate';

const MinimumLimitPrice = ({ homeServiceSettings, SetHomeServiceSetting }) => {
  const { messages } = useIntl();

  return (
    <Row>
      <Col lg={8} md={6} xs={12}>
        <h3 className="settings__section-title">
          {messages['setting.home.minimum.title']}
        </h3>
        <p className="settings__section-description">
          {messages['setting.home.minimum.description']}
        </p>
      </Col>
      <Col lg={4} md={6} xs={12}>
        <div className="beuti-icon">
          <BeutiInput
            label={messages['setting.home.minimum.price']}
            className="mb-1"
            labelClass="mb-0"
            labelId="minimumPrice"
            value={homeServiceSettings.homeServicesMinBookingAmount}
            onChange={(e) =>
              onlyNumbers(e.target.value) && e.target.value <= 10000
                ? SetHomeServiceSetting({
                    ...homeServiceSettings,
                    homeServicesMinBookingAmount: e.target.value,
                  })
                : null
            }
          />
          <label htmlFor="minimumPrice" className="icon">
            {messages['common.sar']}
          </label>
        </div>

        <p className="settings__section-note">{messages['setting.home.minimum.note']}</p>
      </Col>
    </Row>
  );
};
MinimumLimitPrice.propTypes = {
  homeServiceSettings: PropTypes.object,
  SetHomeServiceSetting: PropTypes.func,
};
export default MinimumLimitPrice;
