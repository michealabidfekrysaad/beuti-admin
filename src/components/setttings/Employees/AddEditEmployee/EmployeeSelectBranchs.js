/* eslint-disable */

import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import BranchItem from './SelectBranchesComponents/BranchItem';
import { CallAPI } from '../../../../utils/API/APIConfig';
import { SelectServiceModal } from './SelectBranchesComponents/SelectServiceModal';
import { getAllServicesLength } from './SelectBranchesComponents/Helper';

const EmployeeSelectBranchs = ({
  register,
  errors,
  setValue,
  watch,
  AllBranches,
  clearErrors,
  employeeID,
}) => {
  const { messages } = useIntl();
  const [selectBranch, setSelectBranch] = useState(0);
  const [openSelectBranchModal, setOpenSelectBranchModal] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [servicesList, setServicesList] = useState([]);
  const [holdOldServiceSelected, setHoldOldServiceSelected] = useState([]);
  const [serviceHashMapCount, setServiceHashMapCount] = useState({});
  const { refetch, isFetching } = CallAPI({
    name: [
      'getServicesByLocationAndBranchId',
      searchValue,
      selectBranch?.id,
      watch('employee.workingLocation'),
    ],
    url: 'Service/GetServiceByLocation',
    onSuccess: (list) => {
      if (selectBranch?.id) {
        setServiceHashMapCount({
          ...serviceHashMapCount,
          [selectBranch?.id]: getAllServicesLength(list, 'serviceList') || 0,
        });
      }

      setServicesList(list || []);
    },
    select: (res) => res?.data?.data?.list,
    enabled: !!selectBranch?.id,
    refetchOnWindowFocus: false,
    query: {
      branchId: selectBranch?.id,
      locationId: watch('employee.workingLocation'),
      search: searchValue || undefined,
    },
  });

  useEffect(() => {
    if (watch) {
      const subscription = watch((input, { name }) => {
        if (name === 'employee.workingLocation') {
          if (employeeID) {
            setValue('employee.branches', [
              ...watch('employee.branches').map((branch) => ({
                ...branch,
                services: branch?.services
                  ? branch.services.filter(
                      (service) =>
                        +JSON.parse(service).locationId ===
                        +get(input, 'employee.workingLocation'),
                    )
                  : [],
              })),
            ]);
          } else {
            setValue('employee.branches', [
              ...watch('employee.branches').map((branch) => ({
                ...branch,
                services: [],
              })),
            ]);
          }
        }
        if (name.includes('employee.branches')) {
          clearErrors('employee.branches');
        }
      });
      return () => subscription.unsubscribe();
    }
    return null;
  }, [watch]);
  useEffect(() => {
    if (AllBranches?.length === 1) {
      setSelectBranch(AllBranches[0]);
    }
  }, [AllBranches]);
  return (
    <Row>
      <Col lg={8} md={6} xs={12} className="mb-5">
        <h3 className="settings__section-title">
          {AllBranches?.length > 1
            ? messages['setting.employee.branch.title']
            : messages['setting.employee.branch.edit.title']}
        </h3>
        <p className="settings__section-description">
          {AllBranches?.length > 1
            ? messages['setting.employee.branch.description']
            : messages['setting.employee.branch.edit.description']}
        </p>
      </Col>
      {AllBranches?.length > 1 ? (
        <Col xs={12}>
          <Row className={errors?.employee?.branches?.message && 'branch-select-error'}>
            {AllBranches?.map((branch, index) => (
              <Col xs="12" key={index}>
                <BranchItem
                  branch={branch}
                  register={register}
                  index={index}
                  setSelectBranch={setSelectBranch}
                  setOpenSelectBranchModal={setOpenSelectBranchModal}
                  setHoldOldServiceSelected={setHoldOldServiceSelected}
                  serviceHashMapCount={serviceHashMapCount}
                />
              </Col>
            ))}
          </Row>
        </Col>
      ) : (
        <Col xs={8}>
          <Row className="employee-branchitem mx-0">
            <Col xs="auto" className="employee-branchitem__selected">
              {AllBranches[0]?.services?.length ? (
                <FormattedMessage
                  id="setting.employee.service.selected"
                  values={{
                    count: AllBranches[0]?.services?.length,
                    total: serviceHashMapCount[AllBranches[0].id],
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
                  setOpenSelectBranchModal(true);
                  setSelectBranch(AllBranches[0]);

                  if (AllBranches[0].services) {
                    setHoldOldServiceSelected([...AllBranches[0].services]);
                  }
                }}
              >
                {messages['setting.employee.branch.selectservice']}
              </button>
            </Col>
          </Row>
        </Col>
      )}
      {errors?.employee?.branches?.message && (
        <Col xs="12">
          <p className="settings__section-description text-danger">
            {errors?.employee?.branches?.message}
          </p>
        </Col>
      )}
      {!errors?.employee?.branches?.message && AllBranches?.length > 1 && (
        <Col xs="12">
          <p className="settings__section-description">
            {messages['setting.employee.branch.note']}
          </p>
        </Col>
      )}
      <SelectServiceModal
        setPayload={refetch}
        openModal={!!selectBranch && !!openSelectBranchModal && !isFetching}
        selectBranch={selectBranch}
        servicesList={servicesList}
        setOpenModal={setOpenSelectBranchModal}
        watch={watch}
        register={register}
        setValue={setValue}
        setSearchValue={setSearchValue}
        searchValue={searchValue}
        holdOldServiceSelected={holdOldServiceSelected}
        setSelectBranch={setSelectBranch}
      />
    </Row>
  );
};
EmployeeSelectBranchs.propTypes = {
  register: PropTypes.func,
  watch: PropTypes.func,
  setValue: PropTypes.func,
  AllBranches: PropTypes.array,
  errors: PropTypes.object,
  employeeID: PropTypes.number,
  clearErrors: PropTypes.object,
};

export default EmployeeSelectBranchs;
