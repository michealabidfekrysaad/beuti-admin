import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Modal } from 'react-bootstrap';

export function ConfirmationModal({
  setPayload,
  Id,
  openModal,
  setOpenModal,
  title,
  message,
  messageVariables,
  confirmtext,
  canceltext,
  handleCancel = () => null,
}) {
  return (
    <>
      <Modal
        onHide={() => {
          setOpenModal(false);
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
            <FormattedMessage id={message} values={messageVariables} />
          </p>
        </Modal.Header>
        <Modal.Footer className="pt-3">
          <button
            type="button"
            className="px-4 cancel"
            onClick={() => {
              handleCancel(Id);
              setOpenModal(false);
            }}
          >
            <FormattedMessage id={canceltext || 'common.cancel'} />
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

ConfirmationModal.propTypes = {
  setPayload: PropTypes.func,
  Id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  openModal: PropTypes.bool,
  setOpenModal: PropTypes.func,
  message: PropTypes.string,
  title: PropTypes.string,
  confirmtext: PropTypes.string,
  messageVariables: PropTypes.object,
  canceltext: PropTypes.string,
  handleCancel: PropTypes.func,
};
