import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

export function ModalCancelCheckout({
  openCheckoutCancel,
  setOpenCheckoutCancel,
  bookingId,
}) {
  const history = useHistory();

  return (
    <>
      <Modal
        onHide={() => {
          setOpenCheckoutCancel(false);
        }}
        show={openCheckoutCancel}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        className="bootstrap-modal-customizing"
      >
        <Modal.Header>
          <Modal.Title className="title">
            <FormattedMessage id="checkout.cancel.title" />
          </Modal.Title>
          <p className="subtitle mx-auto catSubtitle">
            <FormattedMessage id="checkout.cancel.message" />
          </p>
        </Modal.Header>
        <div className="pt-3 justify-content-end d-flex somePadd">
          <button
            type="button"
            className="px-4 cancel"
            onClick={() => {
              setOpenCheckoutCancel(false);
            }}
          >
            <FormattedMessage id="common.cancel" />
          </button>
          <button
            type="button"
            onClick={() => {
              //   history.push(`/booking/view/${bookingId}`);
              history.push(`/booking`);
              setOpenCheckoutCancel(false);
            }}
            className="px-4 redBtn"
          >
            <FormattedMessage id="checkout.cancel.yes.exit" />
          </button>
        </div>
      </Modal>
    </>
  );
}

ModalCancelCheckout.propTypes = {
  openCheckoutCancel: PropTypes.bool,
  setOpenCheckoutCancel: PropTypes.func,
  bookingId: PropTypes.number,
};
