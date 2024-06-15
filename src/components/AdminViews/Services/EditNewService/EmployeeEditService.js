/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import empAvatar from 'images/emp-avatar.png';
import { Row, Col } from 'react-bootstrap';

export default function EmployeeEditService({
  allEmployees,
  register,
  EmpListFromBE,
  setAllEmployees,
  watch,
  checkFirstTime,
  reset,
  errors,
}) {
  const { messages } = useIntl();
  useEffect(() => {
    if (watch('serLocation') && checkFirstTime) {
      if (+watch('serLocation') === 3) {
        setAllEmployees(EmpListFromBE);
      } else {
        reset(
          {
            ...watch(),
            branchesCheckboxes: watch('branchesCheckboxes').map((el) => ({
              ...el,
              employees: [],
            })),
            pricing: watch('pricing').map((el) => ({
              ...el,
              employeePriceOptions: el?.employeePriceOptions?.map((element) => ({
                ...element,
                emp: [],
              })),
            })),
          },
          { shouldValidate: true },
        );
        setAllEmployees(
          EmpListFromBE?.filter(
            (emp) => +emp.locationId === +watch('serLocation') || +emp.locationId === 3,
          ),
        );
      }
    }
  }, [watch('serLocation')]);
  return (
    <>
      <Row className="pb-2">
        <Col xs={12}>
          <div className="informationwizard__title">
            {messages['newService.select.employee']}
          </div>
          <div className="informationwizard__subtitle">
            {messages['newService.select.employee.subtitle']}
          </div>
        </Col>
        <input
          className="fake-error-scroll"
          type="checkbox"
          {...register(`branchesCheckboxes[${0}].employees`)}
        />
        {allEmployees && allEmployees.length > 0 ? (
          allEmployees.map((emp, i) => (
            <Col key={emp.id} md={6} lg={4} className="pt-4">
              <div className="d-flex  align-items-center">
                <input
                  className="custom-color"
                  {...register(`branchesCheckboxes[${0}].employees`)}
                  id={emp.id}
                  type="checkbox"
                  value={emp.id}
                />
                <label htmlFor={emp.id} className="branches--details__empData">
                  <img
                    width="50"
                    height="50"
                    className="rounded-circle"
                    src={emp.image || empAvatar}
                    alt={emp.name}
                  />
                  <div>
                    <p className="branches--details__empData-title">{emp.name}</p>
                    <p className="branches--details__empData-subtitle">{emp?.title}</p>
                  </div>
                </label>
              </div>
            </Col>
          ))
        ) : (
          <Col xs={12} className="pt-4 d-flex justify-content-center">
            <p className="mb-2">{messages['no.emp.found.at.branch']}</p>
          </Col>
        )}
        {errors?.branchesCheckboxes && (
          <Col xs="12">
            <p className="branches-err-message" style={{ top: '0px' }}>
              {errors?.branchesCheckboxes[0]?.employees?.message}
            </p>
          </Col>
        )}
      </Row>
    </>
  );
}
