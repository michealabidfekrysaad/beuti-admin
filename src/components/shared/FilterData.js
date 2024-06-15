import React from 'react';
import { Modal } from 'react-bootstrap';
import { useIntl } from 'react-intl';

import PropTypes from 'prop-types';

export default function FilterData({ body, filterSelected, header, setOpen, open }) {
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
        className="bootstrap-modal-customizing filter-box"
      >
        <div className="filter-box__title mb-3">{messages[header]}</div>
        <Modal.Body className="filter-box__body">{body()}</Modal.Body>
        <Modal.Footer className="filter-box__footer mb-3">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              filterSelected(true);
              closeModal();
            }}
          >
            {messages[`common.save`]}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

FilterData.propTypes = {
  setOpen: PropTypes.func,
  open: PropTypes.bool,
  body: PropTypes.func,
  filterSelected: PropTypes.object,
  header: PropTypes.string,
};
