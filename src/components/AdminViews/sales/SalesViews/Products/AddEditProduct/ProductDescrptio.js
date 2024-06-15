import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import BeutiTextArea from '../../../../Shared/inputs/BeutiTextArea';
const ProductDescrption = ({ register, errors }) => {
  const { messages } = useIntl();

  return (
    <Row>
      <Col lg={8} md={6} xs={12} className="mb-5">
        <h3 className="settings__section-title">
          {messages['products.description.title']}
        </h3>
        <p className="settings__section-description">
          {messages['products.description.description']}
        </p>
      </Col>
      <Col lg={8} md={8} xs={12}>
        <Row>
          <Col xs="12" className="mb-4">
            <BeutiTextArea
              type="text"
              label={messages['products.input.description']}
              useFormRef={register('description')}
              error={errors?.description?.message}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
ProductDescrption.propTypes = {
  register: PropTypes.func,
  errors: PropTypes.object,
};

export default ProductDescrption;
