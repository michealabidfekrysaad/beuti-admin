import React, { useEffect, useMemo } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import RadioInputMUI from '../../../../Shared/inputs/RadioInputMUI';
const EmployeeLocation = ({
  errors,
  control,
  employeeID,
  originalLocationEmp = '',
  watch = () => {},
  refetchCheckEmpLocation = () => {},
}) => {
  const { messages } = useIntl();
  const optionsList = useMemo(
    () => [
      {
        id: 1,
        label: messages['wizard.add.new.service.location.home'],
      },
      {
        id: 2,
        label: messages['wizard.add.new.service.location.salon'],
      },
      {
        id: 3,
        label: messages['wizard.add.new.service.location.both'],
      },
    ],
    [],
  );
  useEffect(() => {
    if (
      employeeID &&
      originalLocationEmp &&
      watch('employee.workingLocation') &&
      originalLocationEmp !== watch('employee.workingLocation')
    ) {
      refetchCheckEmpLocation();
    }
  }, [watch('employee.workingLocation')]);
  return (
    <Row>
      <Col lg={8} md={8} xs={12} className="mb-4">
        <h3 className="settings__section-title">
          {messages['setting.employee.location.title']}
        </h3>
        <p className="settings__section-description">
          {messages['setting.employee.location.description']}
        </p>
      </Col>
      <Col lg={6} md={6} xs={12}>
        <RadioInputMUI
          list={optionsList}
          control={control}
          name="employee.workingLocation"
          error={errors?.employee?.workingLocation?.message}
        />
      </Col>
      {/* <Col xs="12">
        <div className="waning-message-beuti ">test</div>
      </Col> */}
    </Row>
  );
};
EmployeeLocation.propTypes = {
  errors: PropTypes.object,
  control: PropTypes.object,
  employeeID: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  originalLocationEmp: PropTypes.string,
  watch: PropTypes.func,
  refetchCheckEmpLocation: PropTypes.func,
};

export default EmployeeLocation;
