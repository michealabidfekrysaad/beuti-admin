import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ConfirmationModal } from 'components/shared/ConfirmationModal';
import { CallAPI } from 'utils/API/APIConfig';
import { SP_DELETE_WIZARD_EMPLOYEES_EP } from '../../../../utils/API/EndPoints/ServiceProviderEP';

const IWEditDeleteEmployee = ({
  employee,
  setValue,
  setSubmitActionType,
  setOpenAddEditModal,
  getAllEmployees,
  employees,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const { refetch } = CallAPI({
    name: 'DeleteEmployee',
    url: SP_DELETE_WIZARD_EMPLOYEES_EP,
    query: {
      employeeId: employee?.id,
    },
    method: 'delete',
    onSuccess: (data) => data?.data?.data && getAllEmployees(true),
  });
  return (
    <>
      <button
        type="button"
        className="informationwizard__box-employess-list--item-edit"
        onClick={() => {
          setValue('employee', {
            nameEn: employee.nameEN,
            nameAr: employee.nameAR,
            image: employee.photo,
            employeeId: employee.id,
            workingLocation: employee.workingLocation,
          });
          setSubmitActionType(2);
          setOpenAddEditModal(true);
        }}
      >
        <i className="flaticon-edit"></i>
      </button>
      {employees.length > 1 && (
        <button
          type="button"
          className="informationwizard__box-employess-list--item-delete"
          onClick={() => setOpenModal(true)}
        >
          <i className="flaticon2-cross"></i>
        </button>
      )}
      <ConfirmationModal
        setPayload={refetch}
        openModal={openModal}
        setOpenModal={setOpenModal}
        message="rw.employees.modal.delete.body"
        title="rw.employees.modal.delete.title"
        confirmtext="common.delete"
      />
    </>
  );
};
IWEditDeleteEmployee.propTypes = {
  employee: PropTypes.object,
  setValue: PropTypes.func,
  getAllEmployees: PropTypes.func,
  setOpenAddEditModal: PropTypes.func,
  employees: PropTypes.array,
  setSubmitActionType: PropTypes.func,
};
export default IWEditDeleteEmployee;
