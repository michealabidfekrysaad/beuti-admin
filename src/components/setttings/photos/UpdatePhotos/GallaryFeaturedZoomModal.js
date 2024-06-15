import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Modal, Image, Row } from 'react-bootstrap';

export function GallaryFeaturedZoomModal({ openModal, setOpenModal, image }) {
  const { messages } = useIntl();
  return (
    <>
      <Modal
        onHide={() => {
          setOpenModal(false);
        }}
        show={openModal}
        size="lg"
        centered
        aria-labelledby="contained-modal-title-vcenter"
        className="bootstrap-modal-customizing zoommodal"
      >
        <div className="zoommodal-body">
          <div className="zoommodal-body__photo">
            <Image src={image?.image || image?.url} />
          </div>
          <button
            type="button"
            onClick={() => setOpenModal(false)}
            className="zoommodal-body__close"
          >
            <i className="flaticon2-cross" />
          </button>
        </div>
      </Modal>
    </>
  );
}

GallaryFeaturedZoomModal.propTypes = {
  image: PropTypes.object,
  openModal: PropTypes.bool,
  setOpenModal: PropTypes.func,
};
