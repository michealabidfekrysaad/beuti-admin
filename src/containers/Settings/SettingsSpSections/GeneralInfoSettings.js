/* eslint-disable  react/prop-types */
import React, { useState, useEffect, useMemo } from 'react';
import { Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import useAPI, { get, put } from 'hooks/useAPI';
import { useHistory } from 'react-router-dom';

import { isNumbersOnly } from 'functions/validate';
import { isValidEmail } from 'components/SuperAdminViews/ServicePrivedersList/ServiceProvidersList';
import ChangeLocationMap from 'components/AdminViews/NewBooking/map/ChangeLocationMap';
import ChangeLocationAutoCompelete from 'components/AdminViews/NewBooking/map/ChangeLocationAutoCompelete';
import OtpModal from './OtpModal';

export default function GeneralInfoSettings({
  setUsername,
  setUsernameEn,
  setEmail,
  setPersonalPhone,
  setSalonLocation,
  username,
  usernameEn,
  email,
  validEmail,
  setValidEmail,
  personalPhone,
  getSearchPlace,
  salonLocation,
  setGetSearchPlace,
  setChangeMyCity,
  changeMyCity,
}) {
  const [openOtp, setOpenOtp] = useState(false);
  const [confirmOtp, setConfirmOtp] = useState(false);
  const [centerPhone, setCenterPhone] = useState('');
  const [data, setData] = useState('0980');
  const history = useHistory();
  const { messages, locale } = useIntl();

  const adminSettingsChangeUsername = 'admin.settings.ChangeUsername';

  /* -------------------------------------------------------------------------- */
  /*                            prepare  API calling                            */
  /* -------------------------------------------------------------------------- */
  const { response: currentUsername, getting, setRecall: callCurrentUsername } = useAPI(
    get,
    'ServiceProvider/serviceProviderProfile',
  );

  const { response: allCitiesAPI, getCities, setRecall: callCallCitiesAPI } = useAPI(
    get,
    'City/ViewCityList',
  );
  const {
    response: currentSalonLocation,
    isLoading: getSalonLocation,
    setRecall: callCurrentSalonLocation,
  } = useAPI(get, 'ServiceProvider/serviceProviderProfile');

  /* -------------------------------------------------------------------------- */
  /*                   call the API first load to prefill data                  */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    callCurrentUsername(true);
    callCallCitiesAPI(true);
    callCurrentSalonLocation(true);
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                       fill the data from API response                      */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (currentUsername?.data?.nameAr) {
      setUsername(currentUsername.data.nameAr);
      setUsernameEn(currentUsername.data.nameEn);
      setEmail(currentUsername.data.userMail);
      setCenterPhone(currentUsername?.data?.userPhone);
      setPersonalPhone(currentUsername?.data?.userPhone);
    }
  }, [currentUsername]);

  useEffect(() => {
    if (currentSalonLocation?.data) {
      setSalonLocation({
        latitude: currentSalonLocation.data.lat,
        longitude: currentSalonLocation.data.long,
        addressEN: currentSalonLocation.data.address,
        addressAR: currentSalonLocation.data.address,
      });
    }
  }, [currentSalonLocation]);
  /* -------------------------------------------------------------------------- */
  /*                           Memo For Map Un render                           */
  /* -------------------------------------------------------------------------- */
  const mapWithMemo = useMemo(
    () => (
      <ChangeLocationMap
        getSearchPlace={getSearchPlace}
        language={locale}
        salonLocation={salonLocation}
        setSalonLocation={setSalonLocation}
      />
    ),
    [getSearchPlace, locale, salonLocation, setSalonLocation],
  );
  return (
    <>
      <Col xs={12} className="px-0">
        <p className="container-box__controllers--header">
          {messages['spAdmin.service.add.general.info']}
        </p>
      </Col>
      <Col xs={12} className="px-5 py-2 phone-personal-number">
        <button
          onClick={() => {
            history.push('/settings/SP/change-pass');
          }}
          className="btn "
          type="button"
        >
          {messages['admin.settings.ChangePass.change.password']}
        </button>
      </Col>
      <Col className="input-box__controllers mt-2 mb-2" lg={6} xs={6}>
        <label htmlFor="arUserName" className="input-box__controllers__label w-100">
          {messages[`${adminSettingsChangeUsername}.header.ar`]}
        </label>
        <input
          name="arUserName"
          className={`input-box__controllers-input w-50 ${
            username.length !== 0 && username.length <= 1
              ? 'input-box__controllers-input--error'
              : ''
          }`}
          id="arUserName"
          placeholder={messages[`${adminSettingsChangeUsername}.header.ar`]}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          value={username || ''}
        ></input>
        {username.length !== 0 && username.length <= 1 && (
          <p className="pt-2 text-danger">
            {messages[`${adminSettingsChangeUsername}.error`]}
          </p>
        )}
      </Col>
      <Col className="input-box__controllers mt-2 mb-2" lg={6} xs={6}>
        <label htmlFor="enUserName" className="input-box__controllers__label w-100">
          {messages[`${adminSettingsChangeUsername}.header.en`]}
        </label>
        <input
          name="enUserName"
          className={`input-box__controllers-input w-50 ${
            usernameEn.length !== 0 && usernameEn.length <= 1
              ? 'input-box__controllers-input--error'
              : ''
          }`}
          id="enUserName"
          placeholder={messages[`${adminSettingsChangeUsername}.header.en`]}
          onChange={(e) => {
            setUsernameEn(e.target.value);
          }}
          value={usernameEn || ''}
        ></input>
        {usernameEn.length !== 0 && usernameEn.length <= 1 && (
          <p className="pt-2 text-danger">
            {messages[`${adminSettingsChangeUsername}.error`]}
          </p>
        )}
      </Col>
      <Col className="input-box__controllers mt-2 mb-2" lg={6} xs={6}>
        <label htmlFor="emailAddress" className="input-box__controllers__label w-100">
          {messages['admin.settings.ChangeEmail.placeholder']}
        </label>
        <input
          name="emailAddress"
          className={`input-box__controllers-input w-50 ${
            email && !validEmail ? 'input-box__controllers-input--error' : ''
          }`}
          id="emailAddress"
          placeholder={messages['admin.settings.ChangeEmail.placeholder']}
          onChange={(e) => {
            setEmail(e.target.value);
            setValidEmail(true);
          }}
          value={email || ''}
          onBlur={() => {
            setValidEmail(isValidEmail(email));
          }}
        ></input>
        {email && !validEmail && (
          <p className="pt-2 text-danger">
            {messages['admin.setttings.ChangeEmail.error']}
          </p>
        )}
      </Col>
      <Col className="input-box__controllers mt-2 mb-2" lg={6} xs={6}>
        <label htmlFor="changeCity" className="input-box__controllers__label w-100">
          {messages['admin.settings.ChangeCity.header']}
        </label>
        <select
          id="changeCity"
          className="w-50 input-box__controllers-select"
          onChange={(event) => {
            setChangeMyCity(event.target.value);
          }}
          value={changeMyCity}
        >
          <option
            value={null}
            // selected
            disabled
            defaultValue
          >
            {messages['admin.settings.ChangeCity.header']}
          </option>
          {allCitiesAPI?.data?.list?.map((ser) => (
            <option
              className="font-size container-box__controllers-select__options"
              key={ser.id}
              value={ser.id}
            >
              {ser.name}
            </option>
          ))}
        </select>
      </Col>
      <Col
        className="input-box__controllers mt-2 mb-2 d-flex align-items-end  phone-personal-number"
        lg={6}
        xs={6}
      >
        <div className="contain-label-input">
          <label htmlFor="centerPhone" className="input-box__controllers__label w-100">
            {messages[`admin.settings.center.phone`]}
          </label>
          <input
            name="centerPhone"
            className={`input-box__controllers-input ${
              centerPhone?.length > 10 ? 'input-box__controllers-input--error' : ''
            }`}
            id="centerPhone"
            type="tel"
            placeholder={messages[`admin.settings.center.phone`]}
            onChange={(e) =>
              isNumbersOnly(e.target.value) && e.target.value.length <= 10
                ? setCenterPhone(e.target.value)
                : null
            }
            value={centerPhone}
          ></input>
          {centerPhone?.length > 10 && (
            <p className="pt-2 text-danger">
              {messages[`admin.setttings.certificateNumber.error`]}
            </p>
          )}
        </div>
        <button onClick={() => setOpenOtp(true)} className="btn " type="button">
          {messages['common.confirm']}
        </button>
      </Col>

      <Col
        className="input-box__controllers mt-2 mb-2 d-flex align-items-end phone-personal-number"
        lg={6}
        xs={6}
      >
        <div className="contain-label-input">
          <label htmlFor="personalPhone" className="input-box__controllers__label w-100">
            {messages[`admin.settings.personal.phone`]}
          </label>
          <input
            name="personalPhone"
            className={`input-box__controllers-input ${
              personalPhone?.length > 10 ? 'input-box__controllers-input--error' : ''
            }`}
            id="personalPhone"
            type="tel"
            placeholder={messages[`admin.settings.personal.phone`]}
            onChange={(e) =>
              isNumbersOnly(e.target.value) && e.target.value.length <= 10
                ? setPersonalPhone(e.target.value)
                : null
            }
            value={personalPhone || ''}
          ></input>
          {personalPhone?.length > 10 && (
            <p className="pt-2 text-danger">
              {messages[`admin.setttings.certificateNumber.error`]}
            </p>
          )}
        </div>

        <button onClick={() => setOpenOtp(true)} className="btn" type="button">
          {messages['common.confirm']}
        </button>
      </Col>
      <Col xs={12}>
        <p className="container-box__controllers--header">{messages['common.title']}</p>
        <p className="input-box__controllers--below-header">
          {messages['admin.settings.SalonLocation']}
        </p>
      </Col>
      <Col xs={12} className="salon-location mt-3">
        {mapWithMemo}
        <ChangeLocationAutoCompelete
          setGetSearchPlace={setGetSearchPlace}
          salonLocation={salonLocation}
          setSalonLocation={setSalonLocation}
          className="salon-location__autocompelete form-control"
        />
        <div style={{ position: 'absolute', bottom: '20px' }}>
          <p className="container-box__controllers--header pb-2">
            {messages['admin.settings.SalonLocation.entered']}
          </p>
          <p>{salonLocation?.addressEN}</p>
        </div>
      </Col>
      <OtpModal
        sharedMessage="products.deleteMessage"
        setConfirmOtp={setConfirmOtp}
        setOpen={setOpenOtp}
        open={openOtp}
      />
    </>
  );
}
