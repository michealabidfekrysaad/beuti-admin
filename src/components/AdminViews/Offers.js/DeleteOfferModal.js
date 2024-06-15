import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Modal, Button } from 'react-bootstrap';

// this components isn't used must be deleted !!!
export function DeleteOfferModal({
  setDeletePayload,
  offerId,
  openDeleteModal,
  setOpenDeleteModal,
}) {
  return (
    <>
      <Modal
        onHide={() => {
          setOpenDeleteModal(false);
        }}
        show={openDeleteModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="bootstrap-modal-customizing"
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter" className="title">
            <FormattedMessage id="offers.delete.message" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Footer className="pt-3">
          <Button
            variant="secondary"
            className="px-4"
            onClick={() => {
              setOpenDeleteModal(false);
            }}
          >
            <FormattedMessage id="common.back" />
          </Button>
          <Button
            onClick={() => {
              setDeletePayload(offerId);
              setOpenDeleteModal(false);
            }}
            className="px-4"
            variant="danger"
          >
            <FormattedMessage id="common.delete" />
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

DeleteOfferModal.propTypes = {
  setDeletePayload: PropTypes.func,
  offerId: PropTypes.number,
  openDeleteModal: PropTypes.bool,
  setOpenDeleteModal: PropTypes.func,
};
