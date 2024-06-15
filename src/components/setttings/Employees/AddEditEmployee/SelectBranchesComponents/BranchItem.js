/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
const BranchItem = ({
  branch,
  register,
  setSelectBranch,
  setOpenSelectBranchModal,
  setHoldOldServiceSelected,
  index,
  serviceHashMapCount,
}) => {
  const { messages } = useIntl();
  return (
    <Row className="employee-branchitem mx-0">
      <Col xs="6" className="employee-branchitem__info">
        <Row className="align-items-center w-100">
          <Col xs="auto">
            <input
              className="custom-color"
              type="checkbox"
              {...register(`employee.branches[${index}].isSelected`)}
              id={branch?.id}
            />
          </Col>
          <Col xs={10}>
            <label htmlFor={branch.id} className="employee-branchitem__info-label">
              <div>
                <img
                  src={branch.bannerImage || toAbsoluteUrl('/android-chrome-192x192.png')}
                  alt={branch.name}
                />
              </div>
              <div className="mx-2">
                <span className="employee-branchitem__info-label--name">
                  {branch.name}
                </span>
                <p className="employee-branchitem__info-label--address">
                  {branch.address || messages['branches.display.branches.address']}
                </p>
              </div>
            </label>
          </Col>
        </Row>
      </Col>
      <Col xs="3" className="employee-branchitem__selected">
        {branch?.services?.length ? (
          <FormattedMessage
            id="setting.employee.service.selected"
            values={{
              count: branch?.services?.length,
              total: serviceHashMapCount[branch.id],
            }}
          />
        ) : (
          messages['setting.employee.no.service.selected']
        )}
      </Col>

      <Col xs="auto" className="employee-branchitem__select">
        <button
          className=""
          type="button"
          onClick={(e) => {
            setSelectBranch(branch);
            setOpenSelectBranchModal(true);
            if (branch.services) {
              setHoldOldServiceSelected([...branch.services]);
            }
          }}
        >
          {messages['setting.employee.branch.selectservice']}
        </button>
      </Col>
    </Row>
  );
};

BranchItem.propTypes = {
  register: PropTypes.func,
  setSelectBranch: PropTypes.func,
  setOpenSelectBranchModal: PropTypes.func,
  setHoldOldServiceSelected: PropTypes.func,

  index: PropTypes.number,
  // AllBranches: PropTypes.array,
  branch: PropTypes.object,
  serviceHashMapCount: PropTypes.object,
};
export default BranchItem;
