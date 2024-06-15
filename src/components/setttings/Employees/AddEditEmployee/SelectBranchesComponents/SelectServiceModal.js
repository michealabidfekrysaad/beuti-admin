/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Modal, Row, Col } from 'react-bootstrap';
import SearchInput from 'components/shared/searchInput';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
} from '@material-ui/core';
import ServiceAccordion from './ServiceAccordion';
import {
  getAllServicesLength,
  getSelectedServicesLength,
  getAllServicesAsArrayOfString,
  removeAllServicesOfCate,
  addAllCateServices,
} from './Helper';

export function SelectServiceModal({
  setPayload,
  Id,
  openModal,
  setOpenModal,
  servicesList,
  selectBranch,
  watch,
  register,
  setSearchValue,
  searchValue,
  setValue,
  holdOldServiceSelected,
  setSelectBranch,
}) {
  const { messages } = useIntl();
  return (
    <>
      <Modal
        show={openModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        className="bootstrap-modal-customizing employeeservicesmodal"
        onHide={() => setOpenModal(true)}
      >
        <Modal.Header>
          <Modal.Title className="title">
            {messages['setting.employee.add.service.title']}
          </Modal.Title>
          <p className="subtitle mx-auto">
            {messages['setting.employee.add.service.description']}
          </p>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <p className="mb-0">{selectBranch?.name}</p>
            <p>{selectBranch?.address}</p>
          </div>
          {servicesList?.length === 0 && (
            <div className="text-center title border-top pt-3 color-main">
              {messages['employees.noServices']}
            </div>
          )}
          {servicesList?.length > 0 && (
            <>
              <SearchInput
                handleChange={setSearchValue}
                searchValue={searchValue}
                placeholder={messages['setting.employee.search']}
              />

              <Accordion
                className="employeeservicesmodal-accordion mt-3"
                expanded={false}
              >
                <AccordionSummary
                  aria-controls="panel1a-content"
                  className="employeeservicesmodal-accordion__header"
                >
                  <Checkbox
                    color="primary"
                    indeterminate={
                      selectBranch?.services?.length !==
                        getAllServicesLength(servicesList, 'serviceList') &&
                      selectBranch?.services?.length !== 0
                    }
                    checked={
                      selectBranch?.services?.length ===
                      getAllServicesLength(servicesList, 'serviceList')
                    }
                    className="p-0"
                    onClick={(e) => {
                      if (e.target.checked) {
                        return setValue(
                          `employee.branches[${watch('employee.branches').findIndex(
                            (branch) => branch.id === selectBranch.id,
                          )}].services`,
                          getAllServicesAsArrayOfString(servicesList, 'serviceList'),
                        );
                      }
                      return setValue(
                        `employee.branches[${watch('employee.branches').findIndex(
                          (branch) => branch.id === selectBranch.id,
                        )}].services`,
                        [],
                      );
                    }}
                  />
                  <label htmlFor={1} className="mb-0">
                    <div className="mx-2">
                      <span> {messages['setting.employee.add.service.all']}</span>
                    </div>
                  </label>
                  <span className="selectedCount">
                    <FormattedMessage
                      id="setting.service.selected"
                      values={{
                        count: selectBranch?.services?.length || 0,
                        total: getAllServicesLength(servicesList, 'serviceList'),
                      }}
                    />
                  </span>
                </AccordionSummary>
              </Accordion>
            </>
          )}
          <div className="modal-overflow-y-300">
            {servicesList &&
              servicesList.map((cate, i) => (
                <Accordion className="employeeservicesmodal-accordion" key={i}>
                  <AccordionSummary
                    expandIcon={<i className="flaticon2-down"></i>}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    className="employeeservicesmodal-accordion__header"
                  >
                    <Checkbox
                      color="primary"
                      indeterminate={
                        getSelectedServicesLength(
                          cate?.serviceList,
                          selectBranch?.services,
                        ) !== cate?.serviceList?.length &&
                        getSelectedServicesLength(
                          cate?.serviceList,
                          selectBranch?.services,
                        ) !== 0
                      }
                      checked={
                        getSelectedServicesLength(
                          cate?.serviceList,
                          selectBranch?.services,
                        ) === cate?.serviceList?.length
                      }
                      className="p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (e.target.checked) {
                          return setValue(
                            `employee.branches[${watch('employee.branches').findIndex(
                              (branch) => branch.id === selectBranch.id,
                            )}].services`,
                            addAllCateServices(selectBranch?.services, cate?.serviceList),
                          );
                        }
                        return setValue(
                          `employee.branches[${watch('employee.branches').findIndex(
                            (branch) => branch.id === selectBranch.id,
                          )}].services`,
                          [
                            ...(removeAllServicesOfCate(
                              cate?.serviceList,
                              selectBranch?.services,
                            ) || []),
                          ],
                        );
                      }}
                    />
                    <label htmlFor={1} className="mb-0">
                      <div className="mx-2">{cate.name}</div>
                    </label>
                    <span className="selectedCount">
                      <FormattedMessage
                        id="setting.service.selected"
                        values={{
                          count: getSelectedServicesLength(
                            cate?.serviceList,
                            selectBranch?.services,
                          ),
                          total: cate?.serviceList?.length,
                        }}
                      />
                    </span>
                  </AccordionSummary>
                  <AccordionDetails className="employeeservicesmodal-accordion__body">
                    <Row className="w-100">
                      {cate?.serviceList?.map((service, index) => (
                        <Col
                          xs={service.isBoth ? '6' : '12'}
                          key={index}
                          className="employeeservicesmodal-accordion__body--item"
                        >
                          <ServiceAccordion
                            service={service}
                            location={service.location}
                            selectBranch={selectBranch.id}
                            watch={watch}
                            register={register}
                          />
                        </Col>
                      ))}
                    </Row>
                  </AccordionDetails>
                </Accordion>
              ))}
          </div>
        </Modal.Body>
        <Modal.Footer className="pt-3">
          <button
            type="button"
            className="px-4 cancel"
            onClick={() => {
              setValue(
                `employee.branches[${watch('employee.branches').findIndex(
                  (branch) => branch.id === selectBranch.id,
                )}].services`,
                [...holdOldServiceSelected],
              );
              setOpenModal(false);
              setSelectBranch(0);
            }}
          >
            <FormattedMessage id="common.cancel" />
          </button>
          <button
            type="button"
            onClick={() => {
              setPayload(Id);
              setOpenModal(false);
              setSelectBranch(0);
            }}
            className="px-4 confirm"
          >
            <FormattedMessage id="common.confirm" />
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

SelectServiceModal.propTypes = {
  setPayload: PropTypes.func,
  Id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  openModal: PropTypes.bool,
  setOpenModal: PropTypes.func,
  servicesList: PropTypes.array,
  selectBranch: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  watch: PropTypes.func,
  register: PropTypes.func,
  setValue: PropTypes.func,
  setSearchValue: PropTypes.func,
  searchValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  holdOldServiceSelected: PropTypes.array,
  setSelectBranch: PropTypes.func,
};
