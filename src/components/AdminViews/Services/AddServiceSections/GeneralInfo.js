import React from 'react';
import { FormControl, FormHelperText, TextField } from '@material-ui/core';
import { validateLettersAndNumbersOnly } from 'functions/validate';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import ServiceAutoCompelete from '../ServicesAutoCompelete';

export default function GeneralInfo({
  handleGCTUserSelection,
  generalCenterTypeId,
  gctDD,
  handleCTUserSelection,
  centerTypeId,
  ctDD,
  setCategoryId,
  categoryid,
  catDD,
  setnameARError,
  setnameEnError,
  setnameAR,
  setnameEn,
  nameAR,
  nameARError,
  nameEn,
  nameEnError,
  atSalon,
  atHome,
  setAtHome,
  setAtSalon,
}) {
  const { messages, locale } = useIntl();

  const handleArNameInput = (value) => {
    setnameAR(value);
    validateLettersAndNumbersOnly(value, setnameARError);
  };

  const handleEnNameInput = (value) => {
    setnameEn(value);
    validateLettersAndNumbersOnly(value, setnameEnError);
  };

  return (
    <>
      <Col xs={12}>
        <p className="container-box__controllers--header">
          {messages['spAdmin.service.add.general.info']}
        </p>
      </Col>
      <Col className="container-box__controllers mt-2 mb-2" lg={6} xs={12}>
        {/* GCT List   */}
        <label htmlFor="GCT" className="container-box__controllers--label">
          {messages['table.categories.generalCenterType']}
        </label>
        <select
          id="GCT"
          className="form-select w-75 container-box__controllers-select"
          onChange={(e) => handleGCTUserSelection(e.target.value)}
          value={generalCenterTypeId || ''}
        >
          <option
            value={null}
            className="container-box__controllers-select__pre-choosen"
            // selected
            defaultValue
          >
            {messages['table.categories.generalCenterType']}
          </option>
          {gctDD?.map((ser) => (
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
      <Col className="container-box__controllers mt-2 mb-2" lg={6} xs={12}>
        {/* CT List   */}
        <label htmlFor="centerType" className="container-box__controllers--label">
          {messages['table.categories.centerType']}
        </label>
        <select
          id="centerType"
          className="form-select w-75 container-box__controllers-select"
          onChange={(e) => handleCTUserSelection(e.target.value)}
          value={centerTypeId || ''}
        >
          <option
            value={null}
            className="container-box__controllers-select__pre-choosen"
            // selected
            defaultValue
          >
            {messages['table.categories.centerType']}
          </option>
          {ctDD?.map((ser) => (
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
      <Col className="container-box__controllers mt-2 mb-2" lg={6} xs={12}>
        {/* CAT List   */}
        <label htmlFor="categoryList" className="container-box__controllers--label">
          {messages['table.categories.categories']}
          <span className="container-box__controllers--label__required">*</span>
        </label>
        <select
          id="categoryList"
          className="form-select w-75 container-box__controllers-select"
          onChange={(e) => {
            setCategoryId(e.target.value);
          }}
          value={categoryid || ''}
        >
          <option
            value={null}
            className="container-box__controllers-select__pre-choosen"
            // selected
            defaultValue
          >
            {messages['table.categories.categories']}
          </option>
          {catDD?.map((ser) => (
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
      <Col lg={6} xs={12}></Col>
      <Col lg={6} xs={12} className="container-box__controllers mt-2 mb-2">
        {/* Name In Arabic */}
        <FormControl fullWidth>
          <span
            style={{
              position: 'absolute',
              top: '19px',
              right: `${locale === 'ar' && '116px'}`,
              left: `${locale !== 'ar' && '150px'}`,
            }}
            className="container-box__controllers--label__required"
          >
            *
          </span>
          <ServiceAutoCompelete
            handleEnNameInput={handleEnNameInput}
            handleArNameInput={handleArNameInput}
            nameAr={nameAR}
            shrinkOrNot
          />
          {nameARError && (
            <FormHelperText
              id="nameErrorAr"
              error
              className="container-box__controllers--error"
            >
              {messages['spAdmin.categories.add.nameError']}
            </FormHelperText>
          )}
        </FormControl>
      </Col>
      <Col lg={6} xs={12} className="container-box__controllers mt-2 mb-2">
        {/* Name In English */}
        <FormControl fullWidth>
          <span
            style={{
              position: 'absolute',
              top: '19px',
              right: `${locale === 'ar' && '131px'}`,
              left: `${locale !== 'ar' && '155px'}`,
            }}
            className="container-box__controllers--label__required"
          >
            *
          </span>
          <TextField
            id="nameEn"
            InputLabelProps={{
              shrink: false,
            }}
            label={messages['spAdmin.categories.add.nameEn']}
            className="mb-1"
            onChange={(e) => handleEnNameInput(e.target.value)}
            value={nameEn}
            error={nameEnError}
          />
          {nameEnError && (
            <FormHelperText id="nameErrorEn" error>
              {messages['spAdmin.categories.add.nameError']}
            </FormHelperText>
          )}
        </FormControl>
      </Col>
      <Col lg={12} xs={12} className="container-box__controllers mt-2 mb-2">
        {/* service Description   */}

        <label htmlFor="serviceDesc" className="container-box__controllers--label">
          {messages['spAdmin.service.desc.ar']}
        </label>
        <textarea
          className="form-select w-75 container-box__controllers-textArea"
          id="serviceDesc"
          placeholder={messages['spAdmin.service.desc']}
        ></textarea>
      </Col>
      <Col lg={12} xs={12} className="container-box__controllers mt-2 mb-2">
        {/* service Description   */}

        <label htmlFor="serviceDesc" className="container-box__controllers--label">
          {messages['spAdmin.service.desc.en']}
        </label>
        <textarea
          className="form-select w-75 container-box__controllers-textArea"
          id="serviceDesc"
          placeholder={messages['spAdmin.service.desc']}
        ></textarea>
      </Col>
      <Col lg={12} xs={12} className="container-box__controllers mt-2 mb-2">
        {/* service located at   */}
        <Row className="container-box">
          <Col xs={12}>
            <p className="container-box__controllers--header">
              {messages['spAdmin.service.located.at']}{' '}
              <span className="container-box__controllers--label__required">*</span>
            </p>
          </Col>
          <Col xs={12} lg={3}>
            <div className="form-check container-box__controllers--checkDiv">
              <input
                className="form-check-input custom-color"
                type="checkbox"
                checked={atSalon}
                onChange={() => setAtSalon(!atSalon)}
                id="flexCheckDefault"
              />
              <label className="form-check-label" htmlFor="flexCheckDefault">
                {messages['spAdmin.service.label.located.salon']}
              </label>
            </div>
          </Col>
          <Col xs={12} lg={3}>
            <div className="form-check container-box__controllers--checkDiv">
              <input
                className="form-check-input custom-color"
                type="checkbox"
                checked={atHome}
                onChange={() => setAtHome(!atHome)}
                id="flexCheckDefault"
              />
              <label className="form-check-label" htmlFor="flexCheckDefault">
                {messages['spAdmin.service.label.located.home']}
              </label>
            </div>
          </Col>
        </Row>
      </Col>
    </>
  );
}

GeneralInfo.propTypes = {
  handleGCTUserSelection: PropTypes.func,
  generalCenterTypeId: PropTypes.number,
  gctDD: PropTypes.array,
  handleCTUserSelection: PropTypes.func,
  centerTypeId: PropTypes.number,
  ctDD: PropTypes.array,
  setCategoryId: PropTypes.func,
  categoryid: PropTypes.number,
  catDD: PropTypes.array,
  setnameARError: PropTypes.func,
  setnameEnError: PropTypes.func,
  setnameAR: PropTypes.func,
  setnameEn: PropTypes.func,
  nameAR: PropTypes.string,
  nameARError: PropTypes.bool,
  nameEn: PropTypes.string,
  nameEnError: PropTypes.bool,
  atSalon: PropTypes.bool,
  atHome: PropTypes.bool,
  setAtHome: PropTypes.func,
  setAtSalon: PropTypes.func,
};
