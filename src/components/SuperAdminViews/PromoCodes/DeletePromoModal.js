import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Header, Icon, Modal, Popup } from 'semantic-ui-react';
import { useIntl } from 'react-intl';

export function DeletePromo({ setDeletePayload, id, setError, setSuccess, isLoading }) {
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  const openModal = () => {
    setError(null);
    setSuccess(null);
    setDeletePayload(null);
    setOpen(true);
  };
  const { messages } = useIntl();
  return (
    <Modal
      key={id}
      open={open}
      trigger={
        <Popup
          content={messages['common.delete']}
          trigger={
            <button
              type="button"
              className="icon-wrapper-btn btn-icon-danger"
              onClick={openModal}
              disabled={isLoading}
            >
              <i className="flaticon2-rubbish-bin text-danger"></i>
            </button>
          }
        />
      }
      basic
      size="small"
    >
      <Header icon="archive" content="Archive Old Messages">
        {messages['promo.deleteMessage']}
      </Header>
      <Modal.Actions>
        <Button color="red" inverted onClick={closeModal}>
          <Icon name="remove" /> {messages['common.cancel']}
        </Button>
        <Button
          color="green"
          inverted
          onClick={() => {
            setDeletePayload(id);
            closeModal();
          }}
        >
          <Icon name="checkmark" /> {messages['common.confirm']}
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export function ResponseMessage({ confirmModalOpen, setConfirmModalOpen }) {
  const { messages } = useIntl();
  const handleClose = () => setConfirmModalOpen(false);

  return (
    <Modal open={confirmModalOpen} onClose={handleClose} basic size="small">
      <Header icon="browser" content={messages['spAdmin.categories.cantDeleteMsg']} />
      <Modal.Content></Modal.Content>
      <Modal.Actions>
        <Button color="green" onClick={handleClose} inverted>
          <Icon name="checkmark" />
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

ResponseMessage.propTypes = {
  confirmModalOpen: PropTypes.bool,
  setConfirmModalOpen: PropTypes.func,
};

DeletePromo.propTypes = {
  setDeletePayload: PropTypes.func,
  setError: PropTypes.func,
  isLoading: PropTypes.bool,
  setSuccess: PropTypes.func,
  id: PropTypes.number,
};
