import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import Toggle from 'react-toggle';
import { useHistory } from 'react-router-dom';
import { CallAPI } from 'utils/API/APIConfig';
import { toast } from 'react-toastify';
import { useIntl } from 'react-intl';
import { createTimeDuration } from 'constants/hours';
import SelectInputMUI from '../../../Shared/inputs/SelectInputMUI';
import { cancelationPeriodEn, cancelationPeriodAr } from './CancelationPeriod';

export default function UpdateOnlineBookingStatus() {
  const { locale, messages } = useIntl();
  const history = useHistory();
  const waitingtime = createTimeDuration({ messages });
  const cancelTime = locale === 'ar' ? cancelationPeriodAr : cancelationPeriodEn;

  const [toggleCustomerApp, setToggleCustomerApp] = useState(true);
  const [toggleBW, setToggleBW] = useState(true);
  const [contactNum, setContactNum] = useState(true);
  const [chat, setChat] = useState(true);
  const [selectEmp, setSelectEmp] = useState(true);
  const [deposite, setDeposite] = useState(false);
  const [waitTime, setWaitTime] = useState('12:00:00');
  const [salonBooking, setSalonBooking] = useState(true);
  const [homeBooking, setHomeBooking] = useState(false);
  const [payload, setPayload] = useState(null);
  const [calcelationTime, setCancelationTime] = useState('-1');

  const { refetch, isFetching } = CallAPI({
    name: 'getDataForOnlineBooking',
    url: 'ServiceProvider/GetBookingSettings',
    refetchOnWindowFocus: false,
    // retry: 1,
    enabled: true,
    onSuccess: (res) => {
      if (res?.data?.data) {
        setToggleCustomerApp(res?.data?.data?.allowCABookings);
        setToggleBW(res?.data?.data?.allowBWBookings);
        setChat(res?.data?.data?.allowChatCommunication);
        setContactNum(res?.data?.data?.allowPhoneCommunication);
        setSelectEmp(res?.data?.data?.allowCustomerSelectEmployee);
        setDeposite(res?.data?.data?.depositRequired);
        setWaitTime(res?.data?.data?.maxServiceWaitingTime);
        setSalonBooking(res?.data?.data?.instantConfirmSalonBooking);
        setHomeBooking(res?.data?.data?.instantConfirmHomeBooking);
        setCancelationTime(res?.data?.data?.allowedCancellationPeriodHours);
      }
    },
    onError: (err) => toast.error(err?.response?.data),
  });

  const { refetch: refetchUpdateOnline, isFetching: fetchingUpdateOnline } = CallAPI({
    name: 'setDataForOnlineBooking',
    url: 'ServiceProvider/SetBookingSettings',
    refetchOnWindowFocus: false,
    method: 'put',
    body: {
      ...payload,
    },
    onSuccess: (res) => {
      if (res?.data?.data) {
        toast.success(messages['setting.online.booking.success']);
        history.goBack();
      }
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error?.message);
    },
  });

  useEffect(() => {
    if (payload) {
      refetchUpdateOnline();
    }
  }, [payload]);

  const submitForm = (e) => {
    e.preventDefault();
    setPayload({
      allowCABookings: toggleCustomerApp,
      allowBWBookings: toggleBW,
      allowChatCommunication: chat,
      allowPhoneCommunication: contactNum,
      depositRequired: deposite,
      maxServiceWaitingTime: waitTime,
      allowedCancellationPeriodHours: calcelationTime,
      allowCustomerSelectEmployee: selectEmp,
      instantConfirmSalonBooking: salonBooking,
      instantConfirmHomeBooking: homeBooking,
    });
  };

  return (
    <form onSubmit={(e) => submitForm(e)}>
      {!isFetching ? (
        <>
          <Row className="settings">
            <Col xs={12} className="settings__section">
              <Row>
                <Col lg={8} md={6} xs={12}>
                  <h3 className="settings__section-title">
                    {messages['setting.online.booking']}
                  </h3>
                  <p className="settings__section-description">
                    {messages['setting.online.booking.info']}{' '}
                  </p>
                </Col>
                <Col lg={4} md={6} xs={12}>
                  <div className="settings__section-toggle">
                    <Toggle
                      id="customerApp"
                      defaultChecked={toggleCustomerApp}
                      icons={{
                        unchecked: null,
                      }}
                      onChange={() => setToggleCustomerApp(!toggleCustomerApp)}
                    />
                    <label htmlFor="customerApp">
                      {messages['setting.online.booking.customer.app']}
                    </label>
                  </div>
                  <div className="settings__section-toggle">
                    <Toggle
                      id="bookingWizard"
                      defaultChecked={toggleBW}
                      icons={{
                        unchecked: null,
                      }}
                      onChange={() => setToggleBW(!toggleBW)}
                    />
                    <label htmlFor="bookingWizard">
                      {messages['setting.online.booking.booking.wizard']}
                    </label>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col xs={12} className="settings__section">
              <Row>
                <Col lg={8} md={6} xs={12}>
                  <h3 className="settings__section-title">
                    {messages['setting.online.booking.communtication']}
                  </h3>
                  <p className="settings__section-description">
                    {messages['setting.online.booking.communtication.info']}
                  </p>
                </Col>
                <Col lg={4} md={6} xs={12}>
                  <div className="settings__section-toggle">
                    <Toggle
                      id="conatctNumber"
                      defaultChecked={contactNum}
                      icons={{
                        unchecked: null,
                      }}
                      onChange={() => setContactNum(!contactNum)}
                    />
                    <label htmlFor="conatctNumber">
                      {messages['setting.online.booking.contact.number']}
                    </label>
                  </div>
                  <div className="settings__section-toggle">
                    <Toggle
                      id="chatting"
                      defaultChecked={chat}
                      icons={{
                        unchecked: null,
                      }}
                      onChange={() => setChat(!chat)}
                    />
                    <label htmlFor="chatting">
                      {messages['setting.online.booking.chat']}
                    </label>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col xs={12} className="settings__section">
              <Row>
                <Col lg={8} md={6} xs={12}>
                  <h3 className="settings__section-title">
                    {messages['setting.online.booking.deposite']}
                  </h3>
                  <p className="settings__section-description">
                    {messages['setting.online.booking.deposite.info']}
                  </p>
                </Col>
                <Col lg={4} md={6} xs={12}>
                  <div className="settings__section-toggle">
                    <Toggle
                      id="depositeChecked"
                      defaultChecked={deposite}
                      icons={{
                        unchecked: null,
                      }}
                      onChange={() => setDeposite(!deposite)}
                    />
                    <label htmlFor="depositeChecked">
                      {messages['setting.online.booking.deposite.label']}
                    </label>
                  </div>
                  <p className="onlineBooking--sections__note">
                    {messages['setting.online.booking.deposite.note']}
                  </p>
                </Col>
              </Row>
            </Col>
            <Col xs={12} className="settings__section">
              <Row>
                <Col lg={8} md={6} xs={12}>
                  <h3 className="settings__section-title">
                    {messages['setting.online.booking.wait.time']}
                  </h3>
                  <p className="settings__section-description">
                    {messages['setting.online.booking.wait.time.info']}
                  </p>
                </Col>
                <Col lg={4} md={6} xs={12}>
                  <SelectInputMUI
                    list={waitingtime}
                    label={messages['booking.details.time']}
                    value={waitTime}
                    onChange={(e) => setWaitTime(e.target.value)}
                  />
                  <p className="onlineBooking--sections__note">
                    {messages['setting.online.booking.wait.time.note']}
                  </p>
                </Col>
              </Row>
            </Col>
            <Col xs={12} className="settings__section">
              <Row>
                <Col lg={8} md={6} xs={12}>
                  <h3 className="settings__section-title">
                    {messages['setting.online.booking.select.emp.check']}
                  </h3>
                  <p className="settings__section-description">
                    {messages['setting.online.booking.select.emp.check.info']}
                  </p>
                </Col>
                <Col lg={4} md={6} xs={12}>
                  <div className="settings__section-toggle">
                    <Toggle
                      id="empSelection"
                      defaultChecked={selectEmp}
                      icons={{
                        unchecked: null,
                      }}
                      onChange={() => setSelectEmp(!selectEmp)}
                    />
                    <label htmlFor="empSelection">
                      {messages['setting.online.booking.select.emp.check']}
                    </label>
                  </div>
                  <p className="onlineBooking--sections__note">
                    {messages['setting.online.booking.select.emp.check.note']}
                  </p>
                </Col>
              </Row>
            </Col>
            <Col xs={12} className="settings__section">
              <Row>
                <Col lg={8} md={6} xs={12}>
                  <h3 className="settings__section-title">
                    {messages['setting.online.booking.cancelation']}
                  </h3>
                  <p className="settings__section-description">
                    {messages['setting.online.booking.cancelation.info']}
                  </p>
                </Col>
                <Col lg={4} md={6} xs={12}>
                  <SelectInputMUI
                    list={cancelTime}
                    label={messages['setting.online.booking.cancelation.select.label']}
                    value={calcelationTime}
                    onChange={(e) => setCancelationTime(e.target.value)}
                  />
                </Col>
              </Row>
            </Col>
            <Col xs={12} className="settings__section">
              <Row>
                <Col lg={8} md={6} xs={12}>
                  <h3 className="settings__section-title">
                    {messages['setting.online.booking.confirm.booking']}
                  </h3>
                  <p className="settings__section-description">
                    {messages['setting.online.booking.confirm.booking.info']}
                  </p>
                </Col>
                <Col lg={4} md={6} xs={12}>
                  <div className="settings__section-toggle">
                    <Toggle
                      id="salonChecked"
                      defaultChecked={salonBooking}
                      icons={{
                        unchecked: null,
                      }}
                      onChange={() => setSalonBooking(!salonBooking)}
                    />
                    <label htmlFor="salonChecked">
                      {messages['setting.online.booking.confirm.booking.salon']}
                    </label>
                  </div>
                  <br />
                  <div className="settings__section-toggle">
                    <Toggle
                      id="homeChecked"
                      defaultChecked={homeBooking}
                      icons={{
                        unchecked: null,
                      }}
                      onChange={() => setHomeBooking(!homeBooking)}
                    />
                    <label htmlFor="homeChecked">
                      {messages['setting.online.booking.confirm.booking.home']}
                    </label>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <section className="settings__submit">
            <button
              className="beutibuttonempty mx-2 action"
              type="button"
              onClick={() => history.goBack()}
              disabled={isFetching}
            >
              {messages['common.cancel']}
            </button>
            <button className="beutibutton action" type="submit" disabled={isFetching}>
              {messages['common.save']}
            </button>{' '}
          </section>
        </>
      ) : (
        <div className="loading"></div>
      )}
    </form>
  );
}
