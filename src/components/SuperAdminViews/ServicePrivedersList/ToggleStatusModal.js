import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { Tooltip } from '@material-ui/core';
import Fade from '@material-ui/core/Fade';

export const ToggleStatusModal = ({
  id,
  isEnable,
  setTogglePayload,
  messages,
  toggleResponse,
  setConfirmModalOpen,
  setErrorMessage,
}) => {
  const [open, setOpen] = useState(false);
  const modalMsgValue = {
    action: isEnable ? messages['common.deactivate'] : messages['common.activate'],
  };
  const toggleModalMessage = (
    <FormattedMessage
      id="sAdmin.spList.activateDeactivate.modalMsg"
      values={modalMsgValue}
    />
  );

  const closeModal = () => setOpen(false);
  const openModal = () => setOpen(true);

  useEffect(() => {
    if (toggleResponse?.data) {
      if (toggleResponse.data.success === true) {
        closeModal();
      }
    }
    if (toggleResponse?.error) {
      setErrorMessage(toggleResponse.error?.message);
      setConfirmModalOpen(true);
      setOpen(false);
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  }, [toggleResponse]);

  return (
    <>
      {!isEnable ? (
        <Tooltip
          key={id}
          arrow
          TransitionComponent={Fade}
          title={isEnable ? messages['common.deactivate'] : messages['common.activate']}
        >
          <button
            type="button"
            className="icon-wrapper-btn btn-icon-danger-fill mx-1"
            onClick={openModal}
          >
            <i className="flaticon2-exclamation  text-danger "></i>
          </button>
        </Tooltip>
      ) : (
        <Tooltip
          key={id}
          arrow
          TransitionComponent={Fade}
          title={isEnable ? messages['common.deactivate'] : messages['common.activate']}
        >
          <button
            type="button"
            className="icon-wrapper-btn btn-icon-success-fill mx-1"
            onClick={openModal}
          >
            <i className="flaticon2-check-mark text-success "></i>
          </button>
        </Tooltip>
      )}
      <Modal
        onHide={closeModal}
        show={open}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="bootstrap-modal-customizing"
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter" className="title">
            {toggleModalMessage}
          </Modal.Title>
        </Modal.Header>
        <Modal.Footer className="pt-3">
          <Button variant="outline-danger" className="px-4" onClick={closeModal}>
            <FormattedMessage id="common.cancel" />
          </Button>
          <Button
            onClick={() =>
              setTogglePayload({ ServiceProviderId: id, isActive: isEnable ? 0 : 1 })
            }
            className="px-4"
            variant="success"
          >
            <FormattedMessage id="common.confirm" />
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

ToggleStatusModal.propTypes = {
  id: PropTypes.number,
  isEnable: PropTypes.bool,
  setTogglePayload: PropTypes.func,
  messages: PropTypes.object,
  setConfirmModalOpen: PropTypes.func,
  setErrorMessage: PropTypes.func,
  toggleResponse: PropTypes.object,
};

export default ToggleStatusModal;
