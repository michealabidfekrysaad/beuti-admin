/* eslint-disable no-param-reassign */
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Modal } from 'react-bootstrap';

export function ModalProcessTimeExceed({
  openModalExceedProcess,
  setOpenModalExceedProcess,
  currentIndex,
  currentdata,
  setProcessingTimes,
  processingTimes,
}) {
  const closeResetProcessTime = () => {
    setOpenModalExceedProcess(false);
    currentdata[currentIndex].duration = `00:00:00`;
    currentdata[currentIndex].start = `00:00:00`;
    setProcessingTimes(
      processingTimes?.filter(
        (data, idx) =>
          data?.duration !== '' &&
          data?.duration !== '00:00:00' &&
          +idx !== +currentIndex,
      ),
    );
  };
  return (
    <>
      <Modal
        onHide={() => {
          closeResetProcessTime();
        }}
        show={openModalExceedProcess}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        className="bootstrap-modal-customizing"
        centered
      >
        <Modal.Header>
          <p className="subtitle mx-auto">
            <FormattedMessage id="newService.processing.error" />
          </p>
        </Modal.Header>
        <Modal.Footer className="pt-3">
          <button
            type="button"
            onClick={() => {
              closeResetProcessTime();
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

ModalProcessTimeExceed.propTypes = {
  openModalExceedProcess: PropTypes.bool,
  setOpenModalExceedProcess: PropTypes.func,
  currentIndex: PropTypes.object,
  currentdata: PropTypes.object,
  setProcessingTimes: PropTypes.func,
  processingTimes: PropTypes.array,
};
