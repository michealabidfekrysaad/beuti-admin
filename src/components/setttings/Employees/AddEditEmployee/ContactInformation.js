import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import BeutiInput from 'Shared/inputs/BeutiInput';
import PropTypes from 'prop-types';

const ContactInformation = ({ register, errors }) => {
  const { messages } = useIntl();

  return (
    <Row>
      <Col lg={8} md={6} xs={12} className="mb-5">
        <h3 className="settings__section-title">
          {messages['setting.employee.contact.title']}
        </h3>
        <p className="settings__section-description">
          {messages['setting.employee.contact.description']}
        </p>
      </Col>
      <Col lg={8} md={8} xs={12}>
        <Row>
          <Col xs="6">
            <div className="phonenumber-start">
              <BeutiInput
                type="text"
                label={messages['setting.employee.input.mobile']}
                useFormRef={register('employee.mobileNumber')}
                error={errors?.employee?.mobileNumber?.message}
              />

              <label htmlFor="minimumPrice" className="icon">
                05 |
              </label>
            </div>
          </Col>
          <Col xs="6">
            <BeutiInput
              type="text"
              label={messages['setting.employee.input.email']}
              useFormRef={register('employee.email')}
              error={errors?.employee?.email?.message}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
ContactInformation.propTypes = {
  register: PropTypes.func,
  errors: PropTypes.object,
};

export default ContactInformation;
