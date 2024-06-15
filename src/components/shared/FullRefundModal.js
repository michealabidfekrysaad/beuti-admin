import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Modal } from 'react-bootstrap';
const handleModalStatus = (paid, onlinepaid) => {
  if (!paid) {
    return 'Invoice.refund.modal.message.notpaid';
  }
  if (paid && !onlinepaid) {
    return 'Invoice.refund.modal.message.paid.salon.only';
  }
  if (paid === onlinepaid) {
    return 'Invoice.refund.modal.message.paid.online.only';
  }
  return 'Invoice.refund.modal.message.paid.salon.online';
};
export function FullFundModal({
  setPayload,
  Id,
  openModal,
  paidAmount,
  onlinePaid,
  handleCancel = () => null,
  isFetching,
}) {
  return (
    <>
      <Modal
        onHide={() => {
          handleCancel(false);
        }}
        show={openModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        className="bootstrap-modal-customizing"
      >
        <Modal.Header>
          <Modal.Title className="title">
            <FormattedMessage id="Invoice.refund.modal.title" />
          </Modal.Title>
          <p className="subtitle mx-auto text-center w-75">
            <FormattedMessage id="Invoice.refund.modal.description" />
          </p>
          <p className="refund-modal-amount">
            <FormattedMessage
              id={handleModalStatus(paidAmount, onlinePaid)}
              values={{
                price: paidAmount,
                salonPrice: paidAmount - onlinePaid,
                onlinePaid,
              }}
            />
          </p>
        </Modal.Header>
        <section className=" d-flex pt-5 pb-4 justify-content-end">
          <div className="px-5">
            <button
              type="button"
              className="px-4 mx-3 cancel"
              onClick={() => {
                handleCancel(false);
              }}
            >
              <FormattedMessage id="common.cancel" />
            </button>
            <button
              type="button"
              disabled={isFetching}
              onClick={() => {
                setPayload(Id);
              }}
              className="px-4 btn-danger"
            >
              <FormattedMessage id="Invoice.refund.confrim.yes" />
            </button>
          </div>
        </section>
      </Modal>
    </>
  );
}

FullFundModal.propTypes = {
  setPayload: PropTypes.func,
  Id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  openModal: PropTypes.bool,
  isFetching: PropTypes.bool,

  paidAmount: PropTypes.number,
  onlinePaid: PropTypes.number,
  handleCancel: PropTypes.func,
};
