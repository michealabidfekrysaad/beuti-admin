/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import BeutiInput from 'Shared/inputs/BeutiInput';
import { get } from 'lodash';
const BranchItem = ({ branch, register, index, errors, watch }) => {
  const { messages } = useIntl();

  return (
    <label className="products-branchitem mx-0 row" htmlFor={branch.id}>
      <Col xs="8" className="products-branchitem__info">
        <Row className="align-items-center">
          <Col xs={1}>
            <input
              className="custom-color"
              type="checkbox"
              {...register(`Branches[${index}].isSelected`)}
              id={branch?.id}
            />
          </Col>
          <Col xs={10}>
            <label htmlFor={branch.id} className="products-branchitem__info-label">
              <img
                src={branch.bannerImage || toAbsoluteUrl('/noBranchImg.png')}
                alt={branch.name}
              />

              <div className="mx-2">
                <span className="products-branchitem__info-label--name">
                  {branch.name}
                </span>
                <p className="products-branchitem__info-label--address">
                  {branch.address || messages['branches.display.branches.address']}
                </p>
              </div>
            </label>
          </Col>
        </Row>
      </Col>
      <Col xs="4" className="products-branchitem__selected">
        <BeutiInput
          type="number"
          min="0"
          disabled={!watch(`Branches[${index}].isSelected`)}
          useFormRef={register(`Branches[${index}].quantity`)}
          placeholder={messages['products.input.quantity']}
          error={get(errors, `Branches[${index}].quantity.message`)}
        />
      </Col>
    </label>
  );
};

BranchItem.propTypes = {
  register: PropTypes.func,
  watch: PropTypes.func,
  index: PropTypes.number,
  branch: PropTypes.object,
  errors: PropTypes.object,
};
export default BranchItem;
