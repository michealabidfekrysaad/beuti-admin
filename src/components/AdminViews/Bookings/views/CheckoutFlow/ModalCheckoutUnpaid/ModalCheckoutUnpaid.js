import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Modal } from 'react-bootstrap';

export function ModalCheckoutUnpaid({
  openModal,
  setOpenModal,
  toPayAmount,
  refetchAddBoookingCheckout,
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
            <FormattedMessage id="checkout.modal.confirm.btn.title" />
          </Modal.Title>
          <p className="subtitle mx-auto catSubtitle">
            <FormattedMessage
              id="checkout.modal.confirm.btn.message"
              values={{
                remainPrice: toPayAmount,
              }}
            />
          </p>
        </Modal.Header>
        <div className="pt-3  justify-content-end d-flex somePadd">
          <button
            type="button"
            className="px-4 cancel"
            onClick={() => {
              setOpenModal(false);
            }}
          >
            <FormattedMessage id="common.cancel" />
          </button>
          <button
            type="button"
            onClick={() => {
              refetchAddBoookingCheckout();
              setOpenModal(false);
            }}
            className="btn btn-primary"
          >
            <FormattedMessage id="common.yes" />
          </button>
        </div>
      </Modal>
    </>
  );
}

ModalCheckoutUnpaid.propTypes = {
  openModal: PropTypes.bool,
  setOpenModal: PropTypes.func,
  toPayAmount: PropTypes.number,
  refetchAddBoookingCheckout: PropTypes.func,
};
