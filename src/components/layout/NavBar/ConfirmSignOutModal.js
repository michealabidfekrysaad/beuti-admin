import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import { useIntl } from 'react-intl';

export default function ConfirmSignOutModal({ setOpen, open, confirmSignout }) {
  const { messages } = useIntl();
  const closeModal = () => {
    setOpen(false);
  };

  return (
    <>
      <Modal
        onHide={() => {
          closeModal();
        }}
        show={open}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="bootstrap-modal-customizing"
      >
        <Modal.Body>
          <div className="sign-out">{messages['navbar.logout.message.confirm']}</div>
        </Modal.Body>
        <Modal.Footer>
          <button onClick={() => closeModal()} type="button" className="btn cancel mx-2">
            {messages['common.cancel']}
          </button>
          <button
            onClick={() => {
              closeModal();
              confirmSignout(true);
            }}
            type="button"
            className="btn confirm mx-2"
          >
            {messages['navbar.logout']}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

ConfirmSignOutModal.propTypes = {
  setOpen: PropTypes.func,
  open: PropTypes.bool,
  confirmSignout: PropTypes.func,
};
