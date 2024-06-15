import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

export default function AddEmployeeService({
  empDD,
  selectedUsers,
  handleSelectAllUsers,
  handleSelectUser,
}) {
  const { messages } = useIntl();

  return (
    <>
      <Col xs={12}>
        <p className="container-box__controllers--header d-inline-block">
          {messages['spAdmin.service.add.employees']}
          <span className="container-box__controllers--label__required">*</span>
        </p>
        {empDD.length > 0 && (
          <div className="container-box__controllers--header-second">
            <input
              type="checkbox"
              className="container-box__controllers--header-second__input-hidden"
              checked={selectedUsers.length === empDD.length}
              onChange={handleSelectAllUsers}
              id="checkAll"
            />
            <label
              className={`form-check-label container-box__controllers--header-second__label ${selectedUsers.length ===
                empDD.length && `primary-color`}`}
              htmlFor="checkAll"
            >
              {messages['spAdmin.service.add.checkAll']}
            </label>
          </div>
        )}
      </Col>

      <Col xs={12} className="container-box__controllers mt-2 mb-2">
        {/* Employess */}
        <Row>
          {empDD.length > 0 ? (
            empDD?.map((singleEmp, i) => (
              <Col sm={12} md={6} lg={4} key={singleEmp.id}>
                <div className="form-check container-box__controllers--checkDiv mt-4">
                  <input
                    type="checkbox"
                    className="custom-color"
                    id="flexCheckDefault"
                    value={singleEmp.id}
                    checked={selectedUsers.includes(singleEmp.id)}
                    onChange={handleSelectUser}
                  />{' '}
                  <label className="form-check-label" htmlFor="flexCheckDefault">
                    {singleEmp.name}
                  </label>
                </div>
              </Col>
            ))
          ) : (
            <div className="form-check container-box__controllers--checkDiv mt-4">
              {messages['spAdmin.service.add.choose.cat']}
            </div>
          )}
        </Row>
      </Col>
    </>
  );
}

AddEmployeeService.propTypes = {
  empDD: PropTypes.array,
  selectedUsers: PropTypes.array,
  handleSelectAllUsers: PropTypes.func,
  handleSelectUser: PropTypes.func,
};
