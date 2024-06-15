import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import BranchItem from './BranchItem';

const ClosingPeriodBranches = ({ register, watch, AllBranches, errors }) => {
  const { messages } = useIntl();
  const { productId } = useParams();

  return (
    <Row>
      <>
        {' '}
        <Col lg={8} md={6} xs={12} className="mb-5">
          <h3 className="settings__section-title">
            {messages['closing.period.branch.title']}
          </h3>
          <p className="settings__section-description">
            {messages['closing.period.branch.description']}
          </p>
        </Col>
        <Col xs={12}>
          <Row>
            {AllBranches?.map((branch) => (
              <Col xs="6" lg="4" key={branch.id}>
                <BranchItem branch={branch} register={register} errors={errors} />
              </Col>
            ))}
          </Row>
        </Col>
        <Col xs="12">
          {errors?.branches?.message && (
            <p className="text-danger">{errors?.branches?.message} </p>
          )}
        </Col>
      </>
    </Row>
  );
};
ClosingPeriodBranches.propTypes = {
  register: PropTypes.func,
  watch: PropTypes.func,
  AllBranches: PropTypes.array,
  errors: PropTypes.object,
};

export default ClosingPeriodBranches;
