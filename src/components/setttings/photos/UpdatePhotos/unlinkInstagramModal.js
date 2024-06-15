import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Modal } from 'react-bootstrap';
import { CallAPI } from 'utils/API/APIConfig';
import { INSTAGRAM_UNLINK_EP } from 'utils/API/EndPoints/ImageEP';

const UnLinkInstagramModal = ({ openModal, setOpenModal, setUsername }) => {
  const { messages } = useIntl();
  const { refetch: unLinkinInstagramCall } = CallAPI({
    name: 'unlinkinstagram',
    url: INSTAGRAM_UNLINK_EP,
    method: 'delete',
  });
  return (
    <>
      <Modal
        onHide={() => {
          setOpenModal(false);
        }}
        show={openModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        className="bootstrap-modal-customizing unlinkinstagram-modal"
      >
        <Modal.Header>
          <Modal.Title className="title">
            {messages['setting.photos.instagram.unlink.modal.title']}
          </Modal.Title>
          <h5>{messages['setting.photos.instagram.unlink.modal.subtitle']}</h5>
          <p className="subtitle">
            {messages['setting.photos.instagram.unlink.modal.info']}
          </p>
        </Modal.Header>
        <Modal.Footer className="pt-3 justify-content-end">
          <button
            type="button"
            className="px-4 cancel mx-2"
            onClick={() => {
              setOpenModal(false);
            }}
          >
            {messages['common.close']}
          </button>
          <button
            type="button"
            onClick={() => {
              unLinkinInstagramCall(true);
              setOpenModal(false);
              setUsername('');
            }}
            className="px-4 confirm"
          >
            {messages['setting.photos.instagram.unlink.modal.yes']}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

UnLinkInstagramModal.propTypes = {
  openModal: PropTypes.bool,
  setOpenModal: PropTypes.func,
  setUsername: PropTypes.func,
};

export default UnLinkInstagramModal;
