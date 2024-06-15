import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Modal } from 'react-bootstrap';

export function FinancialConfirmDelete({
  setPayload,
  openModal,
  setOpenModal,
  title,
  message,
  messageVariables,
  allPayments,
  paymentIdForModal,
  setOpenEditModal,
  closeReset,
}) {
  return (
    <>
      <Modal
        onHide={() => {
          setOpenModal(false);
          closeReset();
        }}
        show={openModal}
        size="lg"
        centered
        aria-labelledby="contained-modal-title-vcenter"
        className="bootstrap-modal-customizing"
      >
        <Modal.Header>
          <Modal.Title className="title mb-1">
            <FormattedMessage id={title} />
          </Modal.Title>
          <p className="financialSettings__headingDiv--info pb-5">
            <FormattedMessage id={message} values={{ nameReuired: messageVariables }} />
          </p>
        </Modal.Header>
        <Modal.Footer className="pt-3">
          <div className="px-5 w-100 d-flex justify-content-end">
            <button
              type="button"
              className="px-4 cancel"
              onClick={() => {
                setOpenModal(false);
                setOpenEditModal(true);
              }}
            >
              <FormattedMessage id="common.cancel" />
            </button>
            <button
              type="button"
              onClick={() => {
                let newPaymentMethods = [];
                if (allPayments.length > 1) {
                  newPaymentMethods = allPayments.filter(
                    (x) => x.id !== paymentIdForModal,
                  );
                } else {
                  newPaymentMethods = [];
                }
                setPayload(newPaymentMethods);
                setOpenModal(false);
                closeReset();
              }}
              className="px-4 delete  mx-2"
            >
              <FormattedMessage id="common.delete" />
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

FinancialConfirmDelete.propTypes = {
  setPayload: PropTypes.func,
  paymentIdForModal: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  openModal: PropTypes.bool,
  setOpenModal: PropTypes.func,
  message: PropTypes.string,
  title: PropTypes.string,
  messageVariables: PropTypes.object,
  allPayments: PropTypes.array,
  closeReset: PropTypes.func,
  setOpenEditModal: PropTypes.func,
};
