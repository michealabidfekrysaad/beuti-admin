/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import noBranchImg from 'images/noBranchImg.png';
import empAvatar from 'images/emp-avatar.png';
import { Row, Col } from 'react-bootstrap';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export default function BranchesSelections({
  allBranches,
  errors,
  expanded,
  handleChange,
  setSingleBranId,
  setBranchFromAccordion,
  register,
  EmpFetching,
  getBC,
  BCloading,
  watch,
  setIndexing,
  allEmployees,
  setAllEmployees,
  EmpListFromBE,
  reset,
  setExpanded,
}) {
  useEffect(() => {
    if (allBranches) setBranchFromAccordion(allBranches[0]?.branchId);
  }, [allBranches]);
  useEffect(() => {
    if (watch('serLocation')) {
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

  const getTheNameOfCategory = (selectedCatId) => {
    if (selectedCatId) {
      return selectedCatId?.split(',')[1];
    }
    return null;
  };

  const { messages } = useIntl();
  return (
    <>
      {allBranches?.length > 1 && (
        <Row className="pt-2">
          <Col xs={12} className="informationwizard__title">
            {messages['newService.branches.title']}
          </Col>
          <Col xs={12} className="informationwizard__subtitle">
            {messages['newService.branches.subtitle']}
          </Col>
        </Row>
      )}
      <Row className={`pt-2 mt-3 mb-2 ${allBranches.length > 1 && 'branchesSection'}`}>
        {errors.branchesCheckboxes?.message && (
          <Col xs="12">
            <p className="branches-err-message">{errors.branchesCheckboxes?.message}</p>
          </Col>
        )}
        {allBranches &&
          allBranches.length > 1 &&
          allBranches.map((branch, index) => (
            <>
              {errors?.branchesCheckboxes && (
                <Col xs="12 errorOfCategory">
                  <p className="branches-err-message">
                    {errors?.branchesCheckboxes[index]?.categoryID?.message}
                  </p>
                </Col>
              )}
              {errors?.branchesCheckboxes && (
                <Col xs="12">
                  <p className="branches-err-message">
                    {errors?.branchesCheckboxes[index]?.employees?.message}
                  </p>
                </Col>
              )}
              <Col key={branch.branchId} xs={12} className="my-3">
                <Accordion
                  key={branch.value}
                  expanded={expanded === `panel-${index}`}
                  onChange={handleChange(`panel-${index}`)}
                  className={`branches ${errors?.branchesCheckboxes &&
                    errors?.branchesCheckboxes[index] &&
                    'error-branches'}`}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    className="branches--summary"
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    onClick={(e) => {
                      setSingleBranId(false);
                      setBranchFromAccordion(branch?.branchId);
                    }}
                  >
                    <Typography className="branches--summary__heading">
                      <input
                        type="checkbox"
                        value={branch?.value}
                        {...register(`branchesCheckboxes[${index}].branchID`)}
                        id={branch?.branchId}
                        className="custom-color"
                        onClick={(event) => {
                          if (event.target.checked) {
                            setExpanded(`panel-${index}`);
                            setBranchFromAccordion(branch?.branchId);
                          }
                          event.stopPropagation();
                        }}
                        onFocus={(event) => event.stopPropagation()}
                      />
                      <input
                        className="fake-error-scroll"
                        type="checkbox"
                        {...register(`branchesCheckboxes[${index}].categoryID`)}
                      />
                      <input
                        className="fake-error-scroll"
                        type="checkbox"
                        {...register(`branchesCheckboxes[${index}].employees`)}
                      />
                      <img
                        src={branch.image || noBranchImg}
                        alt={branch.name}
                        width="50"
                        height="50"
                        className="rounded"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = noBranchImg;
                        }}
                      />
                      <div className="branches--summary__heading--divHolder">
                        <p className="branches--summary__heading--divHolder__brName">
                          {branch.name}
                        </p>
                        <p className="branches--summary__heading--divHolder__brAddress">
                          {branch.address ||
                            messages['branches.display.branches.address']}
                        </p>
                      </div>
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails className="branches--details">
                    {EmpFetching ? (
                      <Row className="loader-height">
                        <Col xs={12}>
                          <div className="loading"></div>
                        </Col>
                      </Row>
                    ) : (
                      <>
                        {allBranches && allBranches.length !== 1 && (
                          <Row className="pt-2">
                            <Col xs={12} className="mb-2">
                              <p className="branchEdit__business">
                                {messages[`category.DD.label`]}
                              </p>
                              <button
                                type="button"
                                className="beuti-dropdown-modal mt-3"
                                onClick={() => {
                                  setIndexing(branch?.branchId);
                                  getBC();
                                }}
                                disabled={BCloading}
                              >
                                <span>
                                  {BCloading ? (
                                    <div className="spinner-border spinner-border-sm mb-1" />
                                  ) : (
                                    getTheNameOfCategory(
                                      watch(`branchesCheckboxes[${index}].categoryID`),
                                    )
                                  )}
                                </span>
                                <span className="primary-color font-weight-bold">
                                  {messages['common.select']}
                                </span>
                              </button>
                            </Col>
                          </Row>
                        )}
                        <Row>
                          <Col xs={12}>
                            <div className="informationwizard__title">
                              {messages['newService.select.employee']}
                            </div>
                            <div className="informationwizard__subtitle">
                              {messages['newService.select.employee.subtitle']}
                            </div>
                          </Col>
                          {allEmployees && allEmployees.length > 0 ? (
                            allEmployees.map((emp, i) => (
                              <Col key={emp.id} md={6} lg={4} className="pt-4">
                                <div className="d-flex  align-items-center">
                                  <input
                                    className="custom-color"
                                    {...register(
                                      `branchesCheckboxes[${index}].employees`,
                                    )}
                                    id={emp.id + branch.branchId.toString() + index}
                                    type="checkbox"
                                    value={emp.id}
                                  />
                                  <label
                                    htmlFor={emp.id + branch.branchId.toString() + index}
                                    className="branches--details__empData"
                                  >
                                    <img
                                      width="50"
                                      height="50"
                                      className="rounded-circle"
                                      src={emp.image || empAvatar}
                                      alt={emp.name}
                                    />
                                    <div>
                                      <p className="branches--details__empData-title">
                                        {emp.name}
                                      </p>
                                      <p className="branches--details__empData-subtitle">
                                        {emp?.title}
                                      </p>
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
                        </Row>
                      </>
                    )}
                  </AccordionDetails>
                </Accordion>
              </Col>
            </>
          ))}
        {/* appear employees when has one branch only */}

        {allBranches &&
          allBranches.length === 1 &&
          allBranches.map((branch, index) => (
            <>
              <Col key={branch?.id} xs={12}>
                <div className="informationwizard__title">
                  {messages['newService.select.employee']}
                </div>
                <div className="informationwizard__subtitle">
                  {messages['newService.select.employee.subtitle']}
                </div>
              </Col>
              {allEmployees && allEmployees.length > 0 ? (
                allEmployees.map((emp, i) => (
                  <Col key={emp.id} md={6} lg={4} className="pt-4">
                    <div className="d-flex  align-items-center">
                      <input
                        className="custom-color"
                        {...register(`branchesCheckboxes[${index}].employees`)}
                        id={emp.id + branch.branchId.toString() + index}
                        type="checkbox"
                        value={emp.id}
                      />
                      {/* fake hidden emp to make array of employees */}
                      <input
                        className="custom-color d-none"
                        {...register(`branchesCheckboxes[${index}].employees`)}
                        id={emp.id + branch.branchId.toString() + index + 0}
                        type="checkbox"
                        value={emp.id + branch.branchId.toString() + index + 0}
                      />
                      <label
                        htmlFor={emp.id + branch.branchId.toString() + index}
                        className="branches--details__empData"
                      >
                        <img
                          width="50"
                          height="50"
                          className="rounded-circle"
                          src={emp.image || empAvatar}
                          alt={emp.name}
                        />
                        <div>
                          <p className="branches--details__empData-title">{emp.name}</p>
                          <p className="branches--details__empData-subtitle">
                            {emp?.title}
                          </p>
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
                    {errors?.branchesCheckboxes[index]?.employees?.message}
                  </p>
                </Col>
              )}
            </>
          ))}
      </Row>
    </>
  );
}
