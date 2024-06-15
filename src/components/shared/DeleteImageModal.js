import React from 'react';
import { Button, Header, Image, Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

function DeleteImageModal({ open, setOpen, imageUrl, onDelete }) {
  const { messages } = useIntl();

  return (
    <Modal onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open}>
      <Modal.Header> {messages['admin.deleteImage']}</Modal.Header>
      <Modal.Content image>
        <Image size="medium" src={imageUrl} wrapped />
        <Modal.Description>
          <Header>{messages['admin.deleteImage.request']}</Header>
          <p>{messages['admin.deleteImage.warning']}</p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button positive onClick={() => setOpen(false)}>
          {messages['admin.deleteImage.cancel']}
        </Button>
        <Button
          content={messages['admin.deleteImage.delete']}
          labelPosition="right"
          icon="checkmark"
          onClick={() => onDelete(imageUrl)}
          negative
        />
      </Modal.Actions>
    </Modal>
  );
}
DeleteImageModal.propTypes = {
  setOpen: PropTypes.func,
  onDelete: PropTypes.func,
  open: PropTypes.bool,
  imageUrl: PropTypes.string,
};
export default DeleteImageModal;
