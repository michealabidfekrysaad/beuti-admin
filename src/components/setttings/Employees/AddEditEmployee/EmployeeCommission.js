import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import BeutiInput from 'Shared/inputs/BeutiInput';
import PropTypes from 'prop-types';

const EmployeeCommission = ({ register, errors }) => {
  const { messages } = useIntl();

  return (
    <Row>
      <Col lg={8} md={6} xs={12} className="mb-5">
        <h3 className="settings__section-title">
          {messages['setting.employee.commission.title']}
        </h3>
        <p className="settings__section-description">
          {messages['setting.employee.commission.description']}
        </p>
      </Col>
      <Col lg={8} md={8} xs={12}>
        <Row>
          <Col xs="6" className="mb-4">
            <div className="beuti-icon">
              <BeutiInput
                type="text"
                label={messages['setting.employee.input.services.commission']}
                useFormRef={register('employee.servicesCommission')}
                error={errors?.employee?.servicesCommission?.message}
                id="servicesCommission"
              />
              <label htmlFor="servicesCommission" className="icon">
                &#x25;
              </label>
            </div>
          </Col>
          <Col xs="6" className="mb-4">
            <div className="beuti-icon">
              <BeutiInput
                type="text"
                label={messages['setting.employee.input.products.commission']}
                useFormRef={register('employee.productsCommission')}
                error={errors?.employee?.productsCommission?.message}
                id="productsCommission"
              />
              <label htmlFor="productsCommission" className="icon">
                &#x25;
              </label>
            </div>
          </Col>
          <Col xs="6" className="mb-4">
            <div className="beuti-icon">
              <BeutiInput
                type="text"
                label={messages['setting.employee.input.offers.commission']}
                useFormRef={register('employee.offersCommission')}
                error={errors?.employee?.offersCommission?.message}
                id="offersCommission"
              />
              <label htmlFor="offersCommission" className="icon">
                &#x25;
              </label>
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
EmployeeCommission.propTypes = {
  register: PropTypes.func,

  errors: PropTypes.object,
};

export default EmployeeCommission;
