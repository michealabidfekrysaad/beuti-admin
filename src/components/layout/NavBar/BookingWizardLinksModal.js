import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from '../../../functions/toAbsoluteUrl';

export default function BookingWizardLinksModal({ setOpen, open, branches }) {
  const { messages } = useIntl();
  const closeModal = () => {
    setOpen(false);
  };
  return (
    <>
      <Modal
        onHide={() => {
          closeModal();
        }}
        show={open}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="bootstrap-modal-customizing bookingwizard-modal"
      >
        <Modal.Header>
          <Modal.Title className="title"> {messages['navbar.share.link']}</Modal.Title>
          <p className="subtitle mx-auto">{messages['navbar.share.link.description']}</p>
        </Modal.Header>
        <Modal.Body>
          {branches?.map((branch) => (
            <div className="branchitem" key={branch?.id}>
              <a target="_blank" href={branch?.link}>
                {branch?.name}
              </a>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(branch?.link);
                  toast.success(messages['navbar.share.link.copid']);
                }}
              >
                <SVG src={toAbsoluteUrl('/copy.svg')} />{' '}
                <span>{messages['navbar.share.link.copy']}</span>
              </button>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={() => {
              closeModal();
            }}
            type="button"
            className="btn confirm mx-2"
          >
            {messages['common.close']}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

BookingWizardLinksModal.propTypes = {
  setOpen: PropTypes.func,
  open: PropTypes.bool,
  branches: PropTypes.array,
};
