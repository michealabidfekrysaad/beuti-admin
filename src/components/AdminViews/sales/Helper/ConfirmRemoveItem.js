/* eslint-disable react/prop-types */
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Modal } from 'react-bootstrap';

export default function ConfirmRemoveItem({
  openModal,
  message,
  handleClose = () => {},
  handleSubmit = () => {},
}) {
  return (
    <>
      <Modal
        onHide={handleClose}
        show={openModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        className="bootstrap-modal-customizing confirm-remove"
      >
        <Modal.Header>
          <Modal.Title className="title">
            <FormattedMessage id={message} />
          </Modal.Title>
        </Modal.Header>
        <div className="pt-3 modal-footer">
          <button type="button" className="px-4 cancel" onClick={handleClose}>
            <FormattedMessage id="common.cancel" />
          </button>
          <button type="button" onClick={handleSubmit} className="px-4 confirm">
            <FormattedMessage id="common.yes" />
          </button>
        </div>
      </Modal>
    </>
  );
}
