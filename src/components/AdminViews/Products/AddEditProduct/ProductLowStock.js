import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import BeutiInput from 'Shared/inputs/BeutiInput';
import PropTypes from 'prop-types';
const ProductLowStock = ({ register, errors }) => {
  const { messages } = useIntl();

  return (
    <Row>
      <Col lg={8} md={6} xs={12} className="mb-5">
        <h3 className="settings__section-title">{messages['products.lowstock.title']}</h3>
        <p className="settings__section-description">
          {messages['products.lowstock.description']}
        </p>
      </Col>
      <Col lg={8} md={8} xs={12}>
        <Row>
          <Col xs="6" className="mb-4">
            <BeutiInput
              type="text"
              label={messages['products.input.Lowstock']}
              useFormRef={register('lowStockAlert')}
              error={errors?.lowStockAlert?.message}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
ProductLowStock.propTypes = {
  register: PropTypes.func,
  errors: PropTypes.object,
};

export default ProductLowStock;
