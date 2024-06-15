import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Modal } from 'react-bootstrap';

export function ConfirmMoveService({
  setPayload,
  Id,
  openModal,
  setOpenModal,
  title,
  message,
  confirmtext,
  objectRevertMove,
  setStopAutoRefetch,
}) {
  return (
    <>
      <Modal
        onHide={() => {
          setOpenModal(false);
          objectRevertMove.revert();
        }}
        show={openModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        className="bootstrap-modal-customizing"
      >
        <Modal.Header>
          <Modal.Title className="title">
            {title && <FormattedMessage id={title} />}
          </Modal.Title>
          <p className="subtitle mx-auto">
            <FormattedMessage id={message} />
          </p>
        </Modal.Header>
        <Modal.Footer className="pt-3">
          <button
            type="button"
            className="px-4 cancel"
            onClick={() => {
              setStopAutoRefetch(false);
              setOpenModal(false);
              objectRevertMove.revert();
            }}
          >
            <FormattedMessage id="common.cancel" />
          </button>
          <button
            type="button"
            onClick={() => {
              setPayload(Id);
              setOpenModal(false);
            }}
            className="px-4 confirm"
          >
            <FormattedMessage id={confirmtext || 'common.confirm'} />
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

ConfirmMoveService.propTypes = {
  setPayload: PropTypes.func,
  Id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  openModal: PropTypes.bool,
  setOpenModal: PropTypes.func,
  message: PropTypes.string,
  title: PropTypes.string,
  confirmtext: PropTypes.string,
  objectRevertMove: PropTypes.object,
  setStopAutoRefetch: PropTypes.func,
};
