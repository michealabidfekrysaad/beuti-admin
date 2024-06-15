import React from 'react';
import PropTypes from 'prop-types';
import { useIntl, FormattedMessage } from 'react-intl';
import { Modal, Button } from 'react-bootstrap';

export function DisableSpecialityModal({
  openModal,
  setOpenModal,
  recallDisableSpec,
  setSpecId,
  message,
}) {
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
        centered
        className="bootstrap-modal-customizing"
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter" className="title">
            {messages[message]}
          </Modal.Title>
        </Modal.Header>
        <Modal.Footer className="pt-3">
          <Button
            variant="outline-danger"
            className="px-4"
            onClick={() => {
              setOpenModal(false);
              setSpecId(null);
            }}
          >
            <FormattedMessage id="common.back" />
          </Button>
          <Button
            onClick={() => {
              recallDisableSpec(true);
              setOpenModal(false);
            }}
            className="px-4"
            variant="success"
          >
            <FormattedMessage id="common.confirm" />
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

DisableSpecialityModal.propTypes = {
  openModal: PropTypes.bool,
  setOpenModal: PropTypes.func,
  recallDisableSpec: PropTypes.func,
  setSpecId: PropTypes.func,
  message: PropTypes.string,
};
