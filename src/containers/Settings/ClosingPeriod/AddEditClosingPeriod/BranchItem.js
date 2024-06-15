/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';

const BranchItem = ({ branch, register }) => {
  const { messages } = useIntl();

  return (
    <label className="mx-0 align-items-center row flex-nowrap" htmlFor={branch.id}>
      <Col xs={1}>
        <input
          className="custom-color"
          type="checkbox"
          {...register('branches')}
          id={branch?.id}
          value={branch?.id}
        />
      </Col>
      <Col xs={11}>
        <label htmlFor={branch.id} className="products-branchitem__info-label">
          <img
            src={branch.bannerImage || toAbsoluteUrl('/noBranchImg.png')}
            alt={branch.name}
          />

          <div className="mx-2">
            <span className="products-branchitem__info-label--name">{branch.name}</span>
            <p className="products-branchitem__info-label--address">
              {branch.address || messages['branches.display.branches.address']}
            </p>
          </div>
        </label>
      </Col>
    </label>
  );
};

BranchItem.propTypes = {
  register: PropTypes.func,
  index: PropTypes.number,
  branch: PropTypes.object,
  errors: PropTypes.object,
};
export default BranchItem;
