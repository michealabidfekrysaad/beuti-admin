import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import BeutiInput from 'Shared/inputs/BeutiInput';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';

const ProductPricing = ({ register, errors, watch, AllBranches }) => {
  const { messages } = useIntl();
  const { productId } = useParams();
  const calculateVat = (price, vat) => {
    const vatPercentage = (+price / 100) * +vat;
    return vatPercentage + +price;
  };
  return (
    <Row>
      <Col lg={8} md={6} xs={12} className="mb-5">
        <h3 className="settings__section-title">{messages['products.pricing.title']}</h3>
        <p className="settings__section-description">
          {messages['products.pricing.description']}
        </p>
      </Col>
      <Col lg={8} md={8} xs={12}>
        <Row>
          <Col xs="6" className="mb-4">
            <div className="beuti-icon">
              <BeutiInput
                type="text"
                label={messages['products.input.price.withvat']}
                useFormRef={register('price')}
                error={errors?.price?.message}
              />
              <label htmlFor="minimumPrice" className="icon">
                {messages['common.sar']}
              </label>
            </div>
          </Col>
          {(productId || AllBranches?.length === 1) && (
            <Col xs="6">
              <div className="beuti-icon">
                <BeutiInput
                  type="text"
                  label={messages['products.input.price.withoutvat']}
                  value={calculateVat(watch('price'), watch('vat'))}
                  disabled
                />
                <label htmlFor="minimumPrice" className="icon">
                  {messages['common.sar']}
                </label>
              </div>
            </Col>
          )}
        </Row>
      </Col>
    </Row>
  );
};
ProductPricing.propTypes = {
  register: PropTypes.func,
  errors: PropTypes.object,
  watch: PropTypes.func,
  AllBranches: PropTypes.array,
};

export default ProductPricing;
