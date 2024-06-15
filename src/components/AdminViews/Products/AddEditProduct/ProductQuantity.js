import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import BeutiInput from 'Shared/inputs/BeutiInput';
import PropTypes from 'prop-types';
const ProductQuantity = ({ register, errors }) => {
  const { messages } = useIntl();

  return (
    <Row>
      <Col lg={8} md={6} xs={12} className="mb-5">
        <h3 className="settings__section-title">{messages['products.input.quantity']}</h3>
        <p className="settings__section-description">
          {messages['products.input.quantity.note']}
        </p>
      </Col>
      <Col lg={8} md={8} xs={12}>
        <Row>
          <Col xs="6" className="mb-4">
            <BeutiInput
              type="text"
              label={messages['products.input.quantity']}
              useFormRef={register('quantity')}
              error={errors?.quantity?.message}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
ProductQuantity.propTypes = {
  register: PropTypes.func,
  errors: PropTypes.object,
};

export default ProductQuantity;
