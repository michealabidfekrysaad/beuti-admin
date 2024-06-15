import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';

import BranchItem from './ProductBranch/BranchItem';
import ProductQuantity from './ProductQuantity';

const ProductBranches = ({ register, watch, AllBranches, errors }) => {
  const { messages } = useIntl();
  const { productId } = useParams();

  return (
    <Row>
      {!productId && AllBranches?.length > 1 ? (
        <>
          {' '}
          <Col lg={8} md={6} xs={12} className="mb-5">
            <h3 className="settings__section-title">
              {messages['products.branch.title']}
            </h3>
            <p className="settings__section-description">
              {messages['products.branch.description']}
            </p>
          </Col>
          <Col xs={12}>
            <Row>
              {AllBranches?.map((branch, index) => (
                <Col xs="8" key={branch.id}>
                  <BranchItem
                    branch={branch}
                    register={register}
                    index={index}
                    errors={errors}
                    watch={watch}
                  />
                </Col>
              ))}
            </Row>
          </Col>
          <Col xs="12">
            {errors?.Branches?.message && (
              <p className="text-danger">{errors?.Branches?.message} </p>
            )}
          </Col>
        </>
      ) : (
        <Col xs={12}>
          <ProductQuantity register={register} errors={errors} />
        </Col>
      )}
    </Row>
  );
};
ProductBranches.propTypes = {
  register: PropTypes.func,
  watch: PropTypes.func,
  AllBranches: PropTypes.array,
  errors: PropTypes.object,
};

export default ProductBranches;
