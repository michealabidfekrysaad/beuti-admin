/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import SVG from 'react-inlinesvg';
const ServiceAccordion = ({ service, location, register, watch, selectBranch }) => {
  const handleStringifyServiceValue = () =>
    JSON.stringify({ serviceId: service?.id, locationId: location });
  return (
    <Row>
      <>
        <Col xs={12} className=" align-items-center d-flex">
          <input
            value={handleStringifyServiceValue()}
            className="custom-color"
            type="checkbox"
            {...register(
              `employee.branches[${watch('employee.branches').findIndex(
                (branch) => branch.id === selectBranch,
              )}].services`,
            )}
            id={handleStringifyServiceValue()}
          />
          <label htmlFor={handleStringifyServiceValue()} className="mb-0">
            <div className="mx-2">
              <span>{service.name}</span>
              <SVG
                className="mx-2"
                src={toAbsoluteUrl(location === 1 ? '/home.svg' : '/salon.svg')}
              />
            </div>
          </label>
        </Col>
      </>
    </Row>
  );
};

ServiceAccordion.propTypes = {
  register: PropTypes.func,
  watch: PropTypes.func,
  selectBranch: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  // AllBranches: PropTypes.array,
  service: PropTypes.object,
  location: PropTypes.number,
};
export default ServiceAccordion;
