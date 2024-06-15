/* eslint-disable */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

export function WarningErrorModal({
  openModal,
  setOpenModal,
  title,
  message,
  messageVariables,
  services,
  setShowConfirmBtn,
  showConfirmBtn,
  callDeleteMethod = () => {},
  empSavedLocationDefault = () => {},
  noCheckAgain = () => {},
}) {
  const history = useHistory();
  return (
    <>
      <Modal
        onHide={() => {
          setOpenModal([]);
          setShowConfirmBtn(false);
        }}
        show={openModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        className="bootstrap-modal-customizing"
      >
        <Modal.Header className="text-center pb-4">
          <Modal.Title className="title">
            {title && <FormattedMessage id={title} />}
          </Modal.Title>
          <p className="subtitle mx-auto mb-1">
            <FormattedMessage id={message} values={messageVariables} />
          </p>
        </Modal.Header>
        {!showConfirmBtn && (
          <Modal.Body className="text-center modal-overflow-y-600">
            {services.map((service) => (
              <p
                key={service.id}
                className="warning-delete-service"
                onClick={() => history.push(`/servicesList/EditService/${service.id}`)}
              >
                {service?.name}
              </p>
            ))}
          </Modal.Body>
        )}
        <Modal.Footer className="pt-3">
          <button
            type="button"
            className="px-4 cancel"
            style={{ width: '283px' }}
            onClick={() => {
              setOpenModal([]);
              setShowConfirmBtn(false);
              empSavedLocationDefault();
            }}
          >
            <FormattedMessage id="common.cancel" />
          </button>
          {showConfirmBtn && (
            <button
              type="button"
              className="btn btn-primary"
              style={{ width: '283px' }}
              onClick={() => {
                callDeleteMethod();
                setOpenModal([]);
                setShowConfirmBtn(false);
                noCheckAgain();
              }}
            >
              <FormattedMessage id="common.confirm" />
            </button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

WarningErrorModal.propTypes = {
  services: PropTypes.array,
  openModal: PropTypes.bool,
  setOpenModal: PropTypes.func,
  message: PropTypes.string,
  title: PropTypes.string,
  messageVariables: PropTypes.object,
  setShowConfirmBtn: PropTypes.func,
  showConfirmBtn: PropTypes.bool,
  callDeleteMethod: PropTypes.func,
  empSavedLocationDefault: PropTypes.func,
};
