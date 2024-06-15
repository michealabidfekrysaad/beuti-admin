/* eslint-disable */
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Modal, Col, Row } from 'react-bootstrap';
import SelectInputMUI from 'Shared/inputs/SelectInputMUI';
import EmployeeAndStatusFilter from './components/EmployeeAndStatusFilter';

export function FilterModal({
  openFilters,
  setOpenFilters,
  calendarViewsChoose,
  calendarView,
  setCalendarView,
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
}) {
  return (
    <>
      <Modal
        onHide={() => {
          setOpenFilters(false);
        }}
        show={openFilters}
        size="lg"
        centered
        aria-labelledby="contained-modal-title-vcenter"
        className="bootstrap-modal-customizing filter-dialog"
      >
        <div className="packageServieHeader">
          <Modal.Title className="packageServieHeader-title">
            <FormattedMessage id="setting.customer.profile.filters" />
          </Modal.Title>
        </div>
        <Modal.Body className="package-affected">
          <Row className="mt-5">
            <Col xs="12">
              <EmployeeAndStatusFilter
                allEmp={allEmp}
                setSelectedEmps={setSelectedEmps}
                setAllEmpData={setAllEmpData}
                allEmpData={allEmpData}
                selectedEmps={selectedEmps}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                bookingStatusChoose={bookingStatusChoose}
                workingEmp={workingEmp}
                setWorkingEmpIsSelected={setWorkingEmpIsSelected}
                workingEmpIsSelected={workingEmpIsSelected}
                setAllEmpIsSelected={setAllEmpIsSelected}
                allEmpIsSelected={allEmpIsSelected}
              />
            </Col>
          </Row>
          <Row className="mt-4">
            <Col xs="12">
              <Row>
                <Col xs="12">
                  <div className="header">
                    <FormattedMessage id="common.timing" />
                  </div>
                  <div className="d-flex justify-content-between">
                    {calendarViewsChoose?.map((view) => {
                      return (
                        <div key={view?.key}>
                          <input
                            type="radio"
                            id={view?.id}
                            name={view?.text}
                            value={view?.id}
                            onChange={(e) => {
                              setCalendarView(e?.target?.value);
                              localStorage.setItem('intialView', e?.target?.value);
                            }}
                            checked={calendarView === view?.id}
                          />
                          <label htmlFor={view?.id}>{view?.text}</label>
                        </div>
                      );
                    })}
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="pt-3 justify-content-center packageServieFooter">
          <button
            type="button"
            className="px-4 cancel"
            onClick={() => {
              setOpenFilters(false);
            }}
          >
            <FormattedMessage id="common.close" />
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
