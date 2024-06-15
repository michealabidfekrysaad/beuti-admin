import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';
import { Header, Icon } from 'semantic-ui-react';
import { useIntl } from 'react-intl';

export function WorkingHoursDeleteModal({
  setDeletePayload,
  id,
  setSuccess,
  setDeleteError,
}) {
  const { messages } = useIntl();
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <div key={id}>
      <button
        type="button"
        className="icon-wrapper-btn btn-icon-danger"
        onClick={() => setModalShow(true)}
      >
        <i className="flaticon2-rubbish-bin text-danger"></i>
      </button>

      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="bootstrap-modal-customizing"
      >
        <Modal.Body>
          <p>{messages['workingTime.delete.msg']}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button size="lg" variant="secondary" onClick={() => setModalShow(false)}>
            <Icon name="remove" /> {messages['common.cancel']}
          </Button>
          <Button
            size="lg"
            variant="danger"
            onClick={() => {
              setDeletePayload(id);
              setModalShow(false);
            }}
          >
            <Icon name="checkmark" /> {messages['common.confirm']}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export function ResponseMessage({ confirmModalOpen, setConfirmModalOpen, msg }) {
  const handleClose = () => setConfirmModalOpen(false);

  return (
    <Modal open={confirmModalOpen} onClose={handleClose} basic size="small">
      <Header icon="browser" content={msg} />
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
  msg: PropTypes.string,
};

WorkingHoursDeleteModal.propTypes = {
  setDeletePayload: PropTypes.func,
  setSuccess: PropTypes.func,
  setDeleteError: PropTypes.func,
  id: PropTypes.number,
};
