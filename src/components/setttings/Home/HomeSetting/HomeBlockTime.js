import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import SelectInputMUI from 'Shared/inputs/SelectInputMUI';
import PropTypes from 'prop-types';
import { homeBlockTimeEn, homeBlockTimeAr } from '../Helpers/BlockTimeObject';

const HomeBlockTime = ({ homeServiceSettings, SetHomeServiceSetting }) => {
  const { messages, locale } = useIntl();
  const blockTimelist = locale === 'ar' ? homeBlockTimeAr : homeBlockTimeEn;

  return (
    <Row>
      <Col lg={8} md={6} xs={12}>
        <h3 className="settings__section-title">
          {messages['setting.home.blockedTime.title']}
        </h3>
        <p className="settings__section-description">
          {messages['setting.home.blockedTime.description']}
        </p>
      </Col>
      <Col lg={4} md={6} xs={12}>
        <Row>
          <Col xs={12} className="mb-3">
            <div>
              <SelectInputMUI
                list={blockTimelist}
                label={messages['setting.home.blockedTime.before']}
                value={homeServiceSettings.beforServiceBlockTime}
                onChange={(e) =>
                  SetHomeServiceSetting({
                    ...homeServiceSettings,
                    beforServiceBlockTime: e.target.value,
                  })
                }
              />
            </div>
          </Col>
          <Col xs={12}>
            <div>
              <SelectInputMUI
                list={blockTimelist}
                label={messages['setting.home.blockedTime.after']}
                value={homeServiceSettings.afterServiceBlockTime}
                onChange={(e) =>
                  SetHomeServiceSetting({
                    ...homeServiceSettings,
                    afterServiceBlockTime: e.target.value,
                  })
                }
              />
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
HomeBlockTime.propTypes = {
  homeServiceSettings: PropTypes.object,
  SetHomeServiceSetting: PropTypes.func,
};
export default HomeBlockTime;
