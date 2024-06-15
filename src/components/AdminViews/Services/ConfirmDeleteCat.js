import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Modal } from 'react-bootstrap';

export function ConfirmDeleteCat({
  setPayload,
  Id,
  openModal,
  setOpenModal,
  title,
  message,
  messageVariables,
  confirmtext,
  showCheckbox,
}) {
  const [deleteCatCheck, setDeleteChecked] = useState(false);
  return (
    <>
      <Modal
        onHide={() => {
          setOpenModal(false);
          setDeleteChecked(false);
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
          <p className="subtitle mx-auto catSubtitle">
            <FormattedMessage id={message} values={messageVariables} />
          </p>
        </Modal.Header>
        {showCheckbox && (
          <div className="checkDeleteCat">
            <input
              className="custom-color"
              type="checkbox"
              checked={deleteCatCheck}
              onChange={() => setDeleteChecked(!deleteCatCheck)}
              id="deleteCatCheck"
            />
            <label className="form-check-label mx-2" htmlFor="deleteCatCheck">
              <FormattedMessage id="delete.checkbox.confirm.check" />
            </label>
          </div>
        )}
        <div
          className={`pt-3 ${
            showCheckbox ? 'justify-content-end d-flex somePadd' : 'modal-footer'
          }`}
        >
          <button
            type="button"
            className="px-4 cancel"
            onClick={() => {
              setOpenModal(false);
              setDeleteChecked(false);
            }}
          >
            <FormattedMessage id="common.cancel" />
          </button>
          <button
            type="button"
            onClick={() => {
              setDeleteChecked(false);
              setPayload(Id);
              setOpenModal(false);
            }}
            className={`px-4  ${showCheckbox ? 'redBtn' : 'confirm'}`}
            disabled={showCheckbox && !deleteCatCheck}
          >
            <FormattedMessage id={confirmtext || 'common.delete'} />
          </button>
        </div>
      </Modal>
    </>
  );
}

ConfirmDeleteCat.propTypes = {
  setPayload: PropTypes.func,
  Id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  openModal: PropTypes.bool,
  setOpenModal: PropTypes.func,
  message: PropTypes.string,
  title: PropTypes.string,
  confirmtext: PropTypes.string,
  messageVariables: PropTypes.object,
  showCheckbox: PropTypes.bool,
};
