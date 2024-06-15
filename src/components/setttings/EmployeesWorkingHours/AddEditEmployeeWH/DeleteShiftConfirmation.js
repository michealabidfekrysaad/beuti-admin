/* eslint-disable */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Modal } from 'react-bootstrap';
import moment from 'moment';
import { CallAPI } from 'utils/API/APIConfig';
import { toast } from 'react-toastify';

export function DeleteShiftConfirmation({
  openModal,
  setOpenModal,
  setOpenAddModal,
  watch,
  resetValuesAndCloseModal,
  deleteEmployeeWHCallNoRepeat,
}) {
  const { messages } = useIntl();

  const { refetch: updateEmployeeWHCallUpComing } = CallAPI({
    name: 'DeletUpcomingShifts',
    url: 'EmployeeWorkDay/Update',
    method: 'post',
    body: {
      ...watch('day'),
      employeeWorkDayRepeat: 0,
      employeeWorkDayEndRepeat: 0,
      selectedDate: watch('day')?.date,
      employeeId: watch('employee')?.employeeId,
      shifts: [],
    },
    onSuccess: (data) => {
      if (data?.data?.data?.success) {
        toast.success(messages['common.deletedSuccess']);

        resetValuesAndCloseModal();
      }
    },
  });
  return (
    <>
      <Modal
        onHide={() => {
          setOpenAddModal(true);
          setOpenModal(false);
        }}
        show={openModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        className="bootstrap-modal-customizing importmodal"
      >
        <Modal.Header className="pt-0">
          <Modal.Title className="title">
            {messages['setting.employee.wh.delete.modal.title']}
          </Modal.Title>
          <p className="subtitle">
            <FormattedMessage
              id="setting.employee.wh.delete.modal.description"
              values={{
                date:
                  watch('day')?.date &&
                  moment(watch('day')?.repeatEndDate).format('dddd, DD MMM YYYY'),
              }}
            />
          </p>
        </Modal.Header>

        <Modal.Footer className="pt-3 justify-content-between">
          <button
            type="button"
            className="px-4 cancel "
            onClick={() => {
              setOpenAddModal(true);
              setOpenModal(false);
            }}
          >
            {messages['common.cancel']}
          </button>

          <div>
            <button
              type="button"
              className="px-4 cancel mx-2"
              onClick={() => {
                updateEmployeeWHCallUpComing(true);

                setOpenModal(false);
              }}
            >
              {messages['setting.employee.wh.modal.upcoming']}
            </button>
            <button
              type="button"
              onClick={() => {
                setOpenModal(false);
                deleteEmployeeWHCallNoRepeat(true);
              }}
              className="px-4 btn-danger"
            >
              {messages['setting.employee.wh.modal.only']}
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

DeleteShiftConfirmation.propTypes = {
  openModal: PropTypes.bool,
  setOpenAddModal: PropTypes.func,
  setOpenModal: PropTypes.func,
  handleNextDayDates: PropTypes.func,
  resetValuesAndCloseModal: PropTypes.func,
};
