/* eslint-disable indent */
import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Dropdown, Button } from 'react-bootstrap';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import { useIntl } from 'react-intl';

const EmployeeAndStatusFilter = ({
  allEmp,
  setSelectedEmps,
  setAllEmpData,
  allEmpData,
  selectedEmps,
  selectedStatus,
  setSelectedStatus,
  bookingStatusChoose,
  workingEmp,
  setWorkingEmpIsSelected,
  workingEmpIsSelected,
  setAllEmpIsSelected,
  allEmpIsSelected,
  notSPApp,
}) => {
  const { messages } = useIntl();
  const renderCorrectChooseStatusorEmp = (which) => {
    if (which === 'status') {
      if (selectedStatus?.length === 0) {
        return messages['calendar.choose.status'];
      }
      if (selectedStatus?.length === bookingStatusChoose?.length) {
        return messages['calendar.all.status'];
      }

      return bookingStatusChoose
        ?.filter((el) => selectedStatus?.some((select) => el?.id === select))
        ?.map((el) => el?.label)
        .join(', ');
    }
    if (workingEmpIsSelected) {
      return messages['calendar.working.employeees'];
    }
    if (
      selectedEmps?.length === 0 ||
      selectedEmps?.length > allEmp?.length ||
      selectedEmps?.length === allEmp?.length
    ) {
      return messages['calendar.all.employeees'];
    }

    return allEmp
      ?.filter((el) => selectedEmps?.some((select) => el?.id === select))
      ?.map((el) => el?.text)
      .join(', ');
  };
  return (
    <Row>
      <Col xs={`${notSPApp ? 'auto' : '6'}`} className="">
        <Dropdown
          id="dropdown-menu-align-end"
          className="booking-headers_first--part_status"
          drop="start"
        >
          <Dropdown.Toggle
            className="booking-headers_first--part_status-btn"
            id="dropdown-autoclose-true"
            disabled={allEmp?.length === 0}
          >
            <div>{renderCorrectChooseStatusorEmp('emp')}</div>
          </Dropdown.Toggle>
          <Dropdown.Menu className="booking-headers_first--part_status-drop">
            {/* choose all employees */}
            <div className="booking-headers_first--part_status-drop_holder">
              <FormControlLabel
                onClick={(event) => {
                  event.stopPropagation();
                  if (event?.target?.checked?.toString() === 'true') {
                    setAllEmpIsSelected(true);
                    setSelectedEmps([]);
                    setAllEmpData([]);
                    allEmp?.forEach((state) => {
                      setSelectedEmps((current) => [...current, +state?.id]);
                    });
                    allEmp?.forEach((state) => {
                      setAllEmpData((current) => [
                        ...current,
                        {
                          id: +state?.id,
                          title: state?.name,
                          name: state?.name,
                          image: state?.image,
                          businessHours: state?.businessHours,
                        },
                      ]);
                    });
                  }
                  if (event?.target?.checked?.toString() === 'false') {
                    setAllEmpIsSelected(false);
                    setSelectedEmps([]);
                    setAllEmpData([]);
                  }
                }}
                onFocus={(event) => event.stopPropagation()}
                control={
                  <Checkbox
                    color="primary"
                    indeterminate={
                      selectedEmps?.length < allEmp?.length && selectedEmps?.length
                    }
                    checked={allEmp?.every((elem) =>
                      selectedEmps?.includes(elem?.employeeId),
                    )}
                  />
                }
                label={messages['calendar.all.employeees']}
                value={null}
                disabled={workingEmpIsSelected}
                className={workingEmpIsSelected && 'disable-click-all-emp'}
              />
            </div>
            {/* choose working employees */}
            <div className="booking-headers_first--part_status-drop_holder">
              <FormControlLabel
                onClick={(event) => {
                  event.stopPropagation();
                  if (event?.target?.checked?.toString() === 'true') {
                    setWorkingEmpIsSelected(true);
                    setSelectedEmps([]);
                    setAllEmpData([]);
                    if (workingEmp?.length === 0) {
                      setSelectedEmps([1111111]);
                      setAllEmpData([]);
                    } else {
                      workingEmp?.forEach((state) => {
                        setSelectedEmps((current) => [...current, +state?.employeeId]);
                      });
                      workingEmp?.forEach((state) => {
                        setAllEmpData((current) => [
                          ...current,
                          {
                            id: +state?.employeeId,
                            title: state?.name,
                            name: state?.name,
                            image: state?.image,
                            businessHours: state?.businessHours,
                          },
                        ]);
                      });
                    }
                  }
                  if (event?.target?.checked?.toString() === 'false') {
                    setWorkingEmpIsSelected(false);
                    if (workingEmp?.length === 0) {
                      setSelectedEmps([]);
                      setAllEmpData([]);
                    } else {
                      setSelectedEmps(
                        selectedEmps?.filter(
                          (id) =>
                            !workingEmp?.map((emp) => emp?.employeeId)?.includes(id),
                        ),
                      );
                      setAllEmpData(
                        allEmpData?.filter(
                          (emp) =>
                            !workingEmp?.map((d) => d?.employeeId)?.includes(emp?.id),
                        ),
                      );
                    }
                  }
                }}
                onFocus={(event) => event.stopPropagation()}
                control={
                  <Checkbox
                    color="primary"
                    indeterminate={
                      (selectedEmps?.length && !selectedEmps?.includes(1111111)
                        ? selectedEmps?.length < workingEmp?.length
                        : false) ||
                      (selectedEmps?.length
                        ? workingEmp?.some(
                            (elem) => !selectedEmps?.includes(elem?.employeeId),
                          )
                        : false)
                    }
                    checked={
                      (!selectedEmps?.includes(1111111) &&
                        selectedEmps?.length > 0 &&
                        selectedEmps?.length === workingEmp?.length) ||
                      workingEmpIsSelected ||
                      allEmpIsSelected
                    }
                  />
                }
                label={messages['calendar.working.employeees']}
                //   value={null}
                disabled={allEmpIsSelected}
                className={allEmpIsSelected && 'disable-click-all-emp'}
              />
            </div>
            {allEmp?.map((emp) => (
              <div className="booking-headers_first--part_status-drop_holder">
                <FormControlLabel
                  onClick={(event) => {
                    event.stopPropagation();
                    if (event?.target?.checked?.toString() === 'true') {
                      setSelectedEmps((current) => [...current, +event?.target?.value]);
                      setAllEmpData((curr) => [
                        ...curr,
                        allEmp
                          ?.filter((em) => +em?.id === +event?.target?.value)
                          ?.map((employee) => ({
                            id: +employee?.id,
                            title: employee?.name,
                            name: employee?.name,
                            image: employee?.image,
                            businessHours: employee?.businessHours,
                          }))[0],
                      ]);
                    }
                    if (event?.target?.checked?.toString() === 'false') {
                      setSelectedEmps(
                        selectedEmps?.filter((el) => el !== +event?.target?.value),
                      );
                      setAllEmpData(
                        allEmpData?.filter((el) => +el?.id !== +event?.target?.value),
                      );
                    }
                  }}
                  onFocus={(event) => event.stopPropagation()}
                  control={
                    <Checkbox
                      color="primary"
                      checked={selectedEmps?.some((el) => el === emp?.id)}
                    />
                  }
                  label={emp?.text}
                  value={emp?.id}
                  disabled={workingEmpIsSelected}
                  className={workingEmpIsSelected && 'disable-click-all-emp'}
                />
              </div>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Col>
      <Col xs={`${notSPApp ? 'auto' : '6'}`} className={`${notSPApp ? 'mx-1' : ''}`}>
        <Dropdown
          id="dropdown-menu-align-end"
          className="booking-headers_first--part_status"
          drop="start"
        >
          <Dropdown.Toggle
            className="booking-headers_first--part_status-btn"
            id="dropdown-autoclose-true"
          >
            <div>{renderCorrectChooseStatusorEmp('status')}</div>
          </Dropdown.Toggle>
          <Dropdown.Menu className="booking-headers_first--part_status-drop">
            <div className="booking-headers_first--part_status-drop_holder">
              <FormControlLabel
                onClick={(event) => {
                  event.stopPropagation();
                  if (event?.target?.checked?.toString() === 'true') {
                    setSelectedStatus([]);
                    bookingStatusChoose?.forEach((state) => {
                      setSelectedStatus((current) => [...current, +state?.id]);
                    });
                  }
                  if (event?.target?.checked?.toString() === 'false') {
                    setSelectedStatus([]);
                  }
                }}
                onFocus={(event) => event.stopPropagation()}
                control={
                  <Checkbox
                    color="primary"
                    indeterminate={
                      selectedStatus?.length < bookingStatusChoose?.length &&
                      selectedStatus?.length
                    }
                    checked={selectedStatus?.length === bookingStatusChoose?.length}
                  />
                }
                label={messages['calendar.all.status']}
                value={null}
              />
            </div>
            {bookingStatusChoose?.map((status) => (
              <div className="booking-headers_first--part_status-drop_holder">
                <FormControlLabel
                  onClick={(event) => {
                    event.stopPropagation();
                    if (event?.target?.checked?.toString() === 'true') {
                      setSelectedStatus((current) => [...current, +event?.target?.value]);
                    }
                    if (event?.target?.checked?.toString() === 'false') {
                      setSelectedStatus(
                        selectedStatus?.filter((el) => el !== +event?.target?.value),
                      );
                    }
                  }}
                  onFocus={(event) => event.stopPropagation()}
                  control={
                    <Checkbox
                      color="primary"
                      checked={selectedStatus?.some((el) => el === status?.id)}
                    />
                  }
                  label={status?.label}
                  value={status?.id}
                />
              </div>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Col>
    </Row>
  );
};

EmployeeAndStatusFilter.propTypes = {
  allEmp: PropTypes.array,
  selectedEmps: PropTypes.array,
  selectedStatus: PropTypes.array,
  bookingStatusChoose: PropTypes.array,
  setSelectedStatus: PropTypes.func,
  setSelectedEmps: PropTypes.func,
  setAllEmpData: PropTypes.func,
  allEmpData: PropTypes.array,
  workingEmp: PropTypes.array,
  setWorkingEmpIsSelected: PropTypes.func,
  workingEmpIsSelected: PropTypes.bool,
  setAllEmpIsSelected: PropTypes.func,
  allEmpIsSelected: PropTypes.bool,
  notSPApp: PropTypes.bool,
};
export default EmployeeAndStatusFilter;
