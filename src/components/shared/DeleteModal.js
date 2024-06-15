import React from 'react';
import { Modal } from 'react-bootstrap';
import { useIntl } from 'react-intl';

import PropTypes from 'prop-types';

export default function DeleteModal({
  setConfirmDelete,
  setOpen,
  open,
  header,
  purpleBtnMsg,
  greyBtnMsg,
}) {
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
        <Modal.Body>{messages[header]}</Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => closeModal()}
          >
            {!greyBtnMsg ? messages[`common.close`] : messages[greyBtnMsg]}
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setConfirmDelete(true);
              closeModal();
            }}
          >
            {!purpleBtnMsg ? messages[`common.save`] : messages[purpleBtnMsg]}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

DeleteModal.propTypes = {
  setConfirmDelete: PropTypes.func,
  setOpen: PropTypes.func,
  open: PropTypes.bool,
  header: PropTypes.string,
  purpleBtnMsg: PropTypes.string,
  greyBtnMsg: PropTypes.string,
};
