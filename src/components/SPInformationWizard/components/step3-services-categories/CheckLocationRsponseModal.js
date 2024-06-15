import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Modal } from 'react-bootstrap';

export function CheckLocationResponseModal({
  openModal,
  setOpenModal,
  title,
  message,
  setFnToCall,
  refetchUpdateService,
  refetchAddService,
  openCloseBigModal = () => {},
  editedService,
  branchNameWithNewLocation,
}) {
  const { messages } = useIntl();
  return (
    <>
      <Modal
        onHide={() => {
          setOpenModal(true);
        }}
        show={openModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        className="bootstrap-modal-customizing"
      >
        <Modal.Header>
          <Modal.Title className="title">
            {title && <FormattedMessage id={title} />}
          </Modal.Title>
          <p className="subtitle mx-auto">
            <FormattedMessage id={message} />
          </p>
        </Modal.Header>
        {branchNameWithNewLocation?.map((branch) => (
          <p className="subtitle mb-1">
            <FormattedMessage
              id="service.branches.with.location.hint"
              values={{
                branch: branch?.branchName,
                newLocation:
                  +branch?.updatedServiceLocation === 1
                    ? messages['service.home.sm']
                    : messages['service.salon.sm'],
              }}
            />
          </p>
        ))}
        <Modal.Footer className="pt-3 mt-4">
          <button
            type="button"
            className="px-4 cancel"
            onClick={() => {
              setOpenModal(false);
              openCloseBigModal(true);
            }}
          >
            <FormattedMessage id="common.cancel" />
          </button>
          <button
            type="button"
            onClick={() => {
              setOpenModal(false);
              if (editedService) refetchUpdateService();
              if (!editedService) refetchAddService();
            }}
            className="px-4 confirm"
          >
            <FormattedMessage id="common.confirm" />
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

CheckLocationResponseModal.propTypes = {
  openModal: PropTypes.bool,
  setOpenModal: PropTypes.func,
  message: PropTypes.string,
  title: PropTypes.string,
  setFnToCall: PropTypes.func,
  refetchUpdateService: PropTypes.func,
  refetchAddService: PropTypes.func,
  openCloseBigModal: PropTypes.func,
  editedService: PropTypes.oneOf([PropTypes.number, PropTypes.bool]),
  branchNameWithNewLocation: PropTypes.array,
};
