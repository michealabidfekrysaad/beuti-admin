/* eslint-disable */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Modal } from 'react-bootstrap';
import moment from 'moment';
import { CallAPI } from 'utils/API/APIConfig';
import { toast } from 'react-toastify';

export function RepeatShiftModal({
  openModal,
  setOpenModal,
  setOpenAddModal,
  watch,
  updateEmployeeWHCall,
  handleNextDayDates,
  resetValuesAndCloseModal,
}) {
  const { messages, locale } = useIntl();
  const { refetch: updateEmployeeWHCallNoRepeat } = CallAPI({
    name: 'UpdateNoRepeatShifts',
    url: 'EmployeeWorkDay/Update',
    method: 'post',
    body: {
      ...watch('day'),
      employeeWorkDayRepeat: 1,
      employeeWorkDayEndRepeat: 0,
      selectedDate: watch('day')?.date,
      employeeId: watch('employee')?.employeeId,
      shifts: handleNextDayDates(watch('day')?.shifts),
    },
    onSuccess: (data) => {
      if (data?.data?.data?.success) {
        toast.success(messages['common.edited.success']);
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
            {messages['setting.employee.wh.reapet.modal.title']}
          </Modal.Title>
          <p className="subtitle">
            <FormattedMessage
              id="setting.employee.wh.reapet.modal.description"
              values={{
                date:
                  watch('day')?.date &&
                  moment(watch('day')?.repeatEndDate)
                    .locale(locale)
                    .format('dddd, DD MMM YYYY'),
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
                updateEmployeeWHCall(true);
                setOpenModal(false);
              }}
            >
              {messages['setting.employee.wh.modal.upcoming']}
            </button>
            <button
              type="button"
              onClick={() => {
                updateEmployeeWHCallNoRepeat(true);
                setOpenModal(false);
              }}
              className="px-4 confirm"
            >
              {messages['setting.employee.wh.modal.only']}
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

RepeatShiftModal.propTypes = {
  openModal: PropTypes.bool,
  setOpenAddModal: PropTypes.func,
  setOpenModal: PropTypes.func,
  updateEmployeeWHCall: PropTypes.func,
  handleNextDayDates: PropTypes.func,
  resetValuesAndCloseModal: PropTypes.func,
};
