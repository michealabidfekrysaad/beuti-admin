import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import BeutiInput from 'Shared/inputs/BeutiInput';
import PropTypes from 'prop-types';

const VoucherDetails = ({ register, errors }) => {
  const { messages } = useIntl();
  return (
    <Row>
      <Col lg={8} md={6} xs={12} className="mb-5">
        <h3 className="settings__section-title">{messages['voucher.details.title']}</h3>
        <p className="settings__section-description">
          {messages['voucher.details.description']}
        </p>
      </Col>
      <Col lg={8} md={8} xs={12}>
        <Row className="mb-4">
          <Col xs="12" className="mb-4">
            <BeutiInput
              type="text"
              label={messages['voucher.input.name']}
              useFormRef={register('code')}
              error={errors?.code?.message}
            />
          </Col>
          <Col xs="12" className="mb-4">
            <div className="beuti-icon">
              <BeutiInput
                type="text"
                label={messages['voucher.input.discount']}
                useFormRef={register('value')}
                error={errors?.value?.message}
                id="value"
              />
              <label htmlFor="value" className="icon">
                {messages['common.sar']}
              </label>
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
VoucherDetails.propTypes = {
  register: PropTypes.func,
  errors: PropTypes.object,
};

export default VoucherDetails;
