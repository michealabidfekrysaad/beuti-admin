/* eslint-disable react/prop-types */
/* eslint-disable indent */

import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import React from 'react';
import { Col, Image, Row } from 'react-bootstrap';
import Rating from '@material-ui/lab/Rating';
import { useIntl } from 'react-intl';
import EmployeeGridDropDown from './EmployeGridDropDown';

const EmployeesGrid = ({ employees, handleDelete, MultiBranchOwner }) => {
  const { messages } = useIntl();

  return (
    <>
      <section className="employees-grid">
        {employees.map((employee) => (
          <section className="employees-grid__item" key={employee.id}>
            <EmployeeGridDropDown handleDelete={handleDelete} id={employee.id} />
            <Row className="align-items-center ">
              <Col xs="auto">
                <div className="employees-grid__item-image">
                  <Image src={employee.image || toAbsoluteUrl('/Avatar.png')} />
                </div>
              </Col>
              <Col xs="auto" className="grid-info">
                <p className="employees-grid__item-name">{employee.name}</p>
                {employee.title && (
                  <p className="employees-grid__item-title">{employee.title}</p>
                )}
                <p className="employees-grid__item-rate">
                  {employee.rate && (
                    <span className="employees-grid__item-rate--value">
                      <Rating
                        name="half-rating-read"
                        defaultValue={0}
                        value={employee.rate / 5}
                        precision={0.1}
                        max={1}
                        readOnly
                      />
                      {employee.rate?.toFixed(1)}
                    </span>
                  )}
                  {employee.isCasher && (
                    <span className="employees-grid__item-rate--pos">
                      {employee.isCasher && messages['setting.employee.pos.title']}
                    </span>
                  )}
                </p>
              </Col>
            </Row>
            <section className="employees-grid-footer">
              <Row>
                <Col xs="12" className="mb-3">
                  <Row>
                    {(employee.branchName || employee.branchAddress) && MultiBranchOwner && (
                      <>
                        <Col xs="3" className="employees-grid-footer--title">
                          {messages['setting.employee.table.branch']} :
                        </Col>
                        <Col xs="9" className="employees-grid-footer--value pl-0">
                          <p> {employee.branchName}</p>
                          <p> {employee.branchAddress}</p>
                        </Col>
                      </>
                    )}
                  </Row>
                </Col>
                <Col xs="12">
                  <Row>
                    {(employee.mobileNumber || employee.email) && (
                      <>
                        <Col xs="auto" className="employees-grid-footer--title">
                          {messages['setting.employee.contact']}
                        </Col>
                        <Col xs="auto" className="employees-grid-footer--value">
                          <p> {employee.mobileNumber}</p>
                          <p> {employee.email}</p>
                        </Col>
                      </>
                    )}
                  </Row>
                </Col>
                <Col xs="12">
                  <Row>
                    {!employee.mobileNumber &&
                      !employee.email &&
                      employee.branchName &&
                      employee.branchAddress &&
                      !MultiBranchOwner && (
                        <>
                          <Col xs="auto" className="employees-grid-footer--title">
                            {messages['setting.employee.contact']}
                          </Col>
                          <Col xs="auto" className="employees-grid-footer--value">
                            <p> {messages['setting.employee.nocontact']}</p>
                          </Col>
                        </>
                      )}
                  </Row>
                </Col>
              </Row>
            </section>
          </section>
        ))}
      </section>
    </>
  );
};

export default EmployeesGrid;
