import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import BeutiButton from 'Shared/inputs/BeutiButton';
import { CallAPI } from 'utils/API/APIConfig';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import GoingToHome from './HomeSetting/GoingToHome';
import MinimumLimitPrice from './HomeSetting/MinimumLimitPrce';
import HomeBlockTime from './HomeSetting/HomeBlockTime';
import SupportedCities from './HomeSetting/SupportedCities';
import {
  SP_GET_HOME_INFO_EP,
  SP_PUT_HOME_INFO_EP,
} from '../../../utils/API/EndPoints/ServiceProviderEP';

const HomeSetting = () => {
  const { messages } = useIntl();
  const history = useHistory();
  const [homeServiceSettings, SetHomeServiceSetting] = useState({
    acceptChairBookingOnly: false,
    homeServicesMinBookingAmount: 0,
    beforServiceBlockTime: '00:00:00',
    afterServiceBlockTime: '00:00:00',
  });
  const { refetch: getHomeSettingCall } = CallAPI({
    name: 'getHomeSetting',
    url: SP_GET_HOME_INFO_EP,
    enabled: true,
    refetchOnWindowFocus: false,
    onSuccess: (res) =>
      SetHomeServiceSetting({
        ...res.data.data,
        beforServiceBlockTime: res?.data?.data?.beforServiceBlockTime || '00:00:00',
        afterServiceBlockTime: res?.data?.data?.afterServiceBlockTime || '00:00:00',
      }),
  });
  const { error, isError } = CallAPI({
    name: 'getHasHomeServices',
    url: '/ServiceProvider/HasHomeServices',
    enabled: true,
    refetchOnWindowFocus: false,
    retry: 0,
  });
  const { refetch: updateHomeSettingCall } = CallAPI({
    name: 'updateHomeSetting',
    url: SP_PUT_HOME_INFO_EP,
    body: {
      ...homeServiceSettings,
      homeServicesMinBookingAmount: homeServiceSettings.homeServicesMinBookingAmount || 0,
      afterServiceBlockTime:
        homeServiceSettings.afterServiceBlockTime === '00:00:00'
          ? null
          : homeServiceSettings.afterServiceBlockTime,
      beforServiceBlockTime:
        homeServiceSettings.beforServiceBlockTime === '00:00:00'
          ? null
          : homeServiceSettings.beforServiceBlockTime,
    },
    onSuccess: (res) => {
      if (res.data.data.success) {
        toast.success(messages['common.edited.success']);
        history.goBack();
      }
    },
    onError: (err) => toast.error(err?.response?.data?.error?.message),
    method: 'put',
  });
  return (
    <Row className="settings">
      <Col xs={12} className="settings__section">
        <GoingToHome
          homeServiceSettings={homeServiceSettings}
          SetHomeServiceSetting={SetHomeServiceSetting}
        />
      </Col>
      <Col xs={12} className="settings__section">
        <MinimumLimitPrice
          homeServiceSettings={homeServiceSettings}
          SetHomeServiceSetting={SetHomeServiceSetting}
        />
      </Col>
      <Col xs={12} className="settings__section">
        <HomeBlockTime
          homeServiceSettings={homeServiceSettings}
          SetHomeServiceSetting={SetHomeServiceSetting}
        />
      </Col>
      <section className="settings__submit">
        <button
          className="beutibuttonempty mx-2 action"
          type="button"
          onClick={() => history.goBack()}
        >
          {messages['common.cancel']}
        </button>
        <button
          type="button"
          className="beutibutton action"
          onClick={updateHomeSettingCall}
        >
          {messages['common.save']}
        </button>
      </section>
      <SupportedCities
        notAcceptHomeServices={isError && error?.response?.data?.error?.message}
        homeServiceSettings={homeServiceSettings}
        SetHomeServiceSetting={SetHomeServiceSetting}
      />
    </Row>
  );
};

export default HomeSetting;
