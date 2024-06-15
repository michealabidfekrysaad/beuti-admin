import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import BeutiInput from 'Shared/inputs/BeutiInput';
import PropTypes from 'prop-types';

const OfferDetails = ({ register, errors }) => {
  const { messages } = useIntl();
  return (
    <Row>
      <Col lg={8} md={6} xs={12} className="mb-5">
        <h3 className="settings__section-title">{messages['offers.details.title']}</h3>
        <p className="settings__section-description">
          {messages['offers.details.description']}
        </p>
      </Col>
      <Col lg={8} md={8} xs={12}>
        <Row className="mb-4">
          <Col xs="6" className="mb-4">
            <BeutiInput
              type="text"
              label={messages['offers.input.nameAr']}
              useFormRef={register('nameAR')}
              error={errors?.nameAR?.message}
            />
          </Col>
          <Col xs="6">
            <BeutiInput
              type="text"
              label={messages['offers.input.nameEn']}
              useFormRef={register('nameEN')}
              error={errors?.nameEN?.message}
            />
          </Col>
          <Col xs="12" className="mb-4">
            <div className="beuti-icon">
              <BeutiInput
                type="text"
                label={messages['offers.input.discount']}
                useFormRef={register('percentage')}
                error={errors?.percentage?.message}
                id="percentage"
              />
              <label htmlFor="percentage" className="icon">
                &#x25;
              </label>
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
OfferDetails.propTypes = {
  register: PropTypes.func,
  errors: PropTypes.object,
};

export default OfferDetails;
