import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import {
  getDDTimeByValueDefaultTime,
  handleCasesOfNewShiftTimeDefaultTime,
} from '../../../constants/hours';
import { ConfirmationModal } from '../../../components/shared/ConfirmationModal';

const AddDeleteShift = ({ shiftLength, watch, dayPath, setValue, currentShift }) => {
  const { messages, locale } = useIntl();
  const [openModal, setOpenModal] = useState(false);
  const handleAddShift = () => {
    const dayShifts = watch(dayPath).shifts;
    const [
      secondShiftStartTime,
      secondShiftEndTime,
    ] = handleCasesOfNewShiftTimeDefaultTime(
      getDDTimeByValueDefaultTime(dayShifts[0].startTime, locale).key,
      getDDTimeByValueDefaultTime(dayShifts[0].endTime, locale).key,
      locale,
    );
    const newShifts = [
      ...dayShifts,
      {
        startTime: secondShiftStartTime.value,
        endTime: secondShiftEndTime.value,
        id: Date.now(),
      },
    ];
    setValue(dayPath, {
      ...watch(dayPath),
      shifts: newShifts,
    });
  };
  const handleDeleteShift = () => {
    const dayShifts = watch(dayPath).shifts.filter(
      (shift) => currentShift.id !== shift.id,
    );
    setValue(dayPath, {
      ...watch(dayPath),
      shifts: dayShifts,
    });
  };
  return (
    <>
      {shiftLength === 1 ? (
        <Col xs="auto">
          <div className="informationwizard__box-day--shift-action">
            <button
              className="flaticon-add-circular-button-btn"
              type="button"
              onClick={handleAddShift}
            >
              <i className="flaticon2-add"></i>
              <span> {messages['rw.bussinessHours.addshift']}</span>
            </button>
          </div>
        </Col>
      ) : (
        <Col xs="auto">
          <div className="informationwizard__box-day--shift-action">
            <button
              className="flaticon-delete-btn"
              type="button"
              onClick={() => setOpenModal(true)}
            >
              <i className="flaticon-delete "></i>
            </button>
          </div>
        </Col>
      )}
      <ConfirmationModal
        setPayload={handleDeleteShift}
        openModal={openModal}
        setOpenModal={setOpenModal}
        message="rw.bussinessHours.modal.delete.body"
        title="rw.bussinessHours.modal.delete.title"
        confirmtext="common.delete"
      />
    </>
  );
};
AddDeleteShift.propTypes = {
  shiftLength: PropTypes.number,
  watch: PropTypes.func,
  setValue: PropTypes.func,
  currentShift: PropTypes.object,
  dayPath: PropTypes.string,
};
export default AddDeleteShift;
