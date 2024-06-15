/* eslint-disable react/prop-types */
import { isNumbersWithoutDash } from 'functions/validate';
import React from 'react';
import { Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { isNumbersOnly } from 'validations/validate';

export default function Vat({
  vatValue,
  setVatValue,
  countOfCertificateNumber,
  certificateNumber,
  setcertificateNumber,
}) {
  const { messages } = useIntl();
  return (
    <>
      <Col className="input-box__controllers mt-2 mb-2" lg={6} xs={12}>
        <label htmlFor="vatPercentage" className="input-box__controllers__label w-100">
          {messages['admin.settings.vat.header']}
        </label>
        <input
          className={`input-box__controllers-input w-50 ${
            vatValue > 99 || vatValue < 0 ? 'input-box__controllers-input--error' : ''
          }`}
          id="vatPercentage"
          placeholder={messages['admin.settings.vat.header']}
          onChange={(e) =>
            isNumbersWithoutDash(e.target.value) ? setVatValue(e.target.value) : null
          }
          value={vatValue || ''}
        ></input>
        <small className="form-text text-muted">
          {messages['admin.setttings.vat.error']}
        </small>
        <small
          className={`form-text ${
            certificateNumber.length > countOfCertificateNumber
              ? 'text-danger'
              : 'text-muted'
          }`}
        >
          {messages['admin.setttings.vat.certificate.error']}
        </small>
        {(vatValue > 99 || vatValue < 0) && (
          <p className="mt-2 text-danger">{messages['admin.setttings.vat.error']}</p>
        )}
      </Col>

      <Col className="input-box__controllers mt-2 mb-2" lg={6} xs={12}>
        <label htmlFor="certificateNum" className="input-box__controllers__label w-100">
          {messages['admin.settings.certificate.placeholder']}
        </label>
        <input
          className={`input-box__controllers-input w-50 ${
            certificateNumber.length > countOfCertificateNumber
              ? 'input-box__controllers-input--error'
              : ''
          }`}
          id="certificateNum"
          placeholder={messages['admin.settings.certificate.placeholder']}
          onChange={(e) =>
            isNumbersOnly(e.target.value) ? setcertificateNumber(e.target.value) : null
          }
          value={certificateNumber || ''}
        ></input>
        <small
          className={`form-text ${
            certificateNumber.length > countOfCertificateNumber
              ? 'text-danger'
              : 'text-muted'
          }`}
        >
          {messages['admin.setttings.certificate.error']}{' '}
          {certificateNumber.length > countOfCertificateNumber &&
            `- ${certificateNumber.length - countOfCertificateNumber}`}
        </small>
      </Col>
    </>
  );
}
