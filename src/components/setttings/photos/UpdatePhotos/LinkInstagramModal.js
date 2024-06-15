import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Modal, Image } from 'react-bootstrap';
import { toAbsoluteUrl } from '../../../../functions/toAbsoluteUrl';

const LinkInstagramModal = ({ openModal, setOpenModal }) => {
  const { messages } = useIntl();

  return (
    <>
      <Modal
        onHide={() => {
          setOpenModal(false);
        }}
        show={openModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        className="bootstrap-modal-customizing linkinstagram-modal"
      >
        <Modal.Header>
          <Modal.Title className="title">
            {messages['setting.photos.instagram.link.modal.title']}
          </Modal.Title>
          <p className="subtitle">
            {messages['setting.photos.instagram.link.modal.subtitle']}
          </p>
          <a
            type="button"
            className="linkinstagram-modal__button"
            href={`https://api.instagram.com/oauth/authorize?client_id=347651399747138&redirect_uri=${window.location.origin}/settings/photos/&scope=user_profile,user_media&response_type=code`}
          >
            <Image src={toAbsoluteUrl('/instagram.svg')} />
            <p>{messages['rw.uploadimages.instagram.link']}</p>
          </a>
        </Modal.Header>
      </Modal>
    </>
  );
};

LinkInstagramModal.propTypes = {
  openModal: PropTypes.bool,
  setOpenModal: PropTypes.func,
};

export default LinkInstagramModal;
