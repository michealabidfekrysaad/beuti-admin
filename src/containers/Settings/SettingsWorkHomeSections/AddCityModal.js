import React, { useState } from 'react';
import { Modal, Col, Row } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { TextField } from '@material-ui/core';
import PropTypes from 'prop-types';

export default function AddCityModal({ setOpen, open, header }) {
  const { messages } = useIntl();
  const [cityName, setCityName] = useState('');

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
        className="bootstrap-modal-customizing"
      >
        <div className="employee-box pb-0">
          <div className="employee-box__title">{messages[header]}</div>
        </div>
        <Modal.Body>
          <Row>
            <Col xs={12} className="mt-2">
              <form noValidate>
                <TextField
                  type="text"
                  className="w-100 "
                  placeholder={messages[`cities.search.by.city`]}
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <span className="search">
                        <i
                          onClick={() => alert('wait for API of City')}
                          role="presentation"
                          onMouseUp={() => null}
                          className="flaticon-search px-2"
                        ></i>
                      </span>
                    ),
                  }}
                />
              </form>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <button type="button" className="btn btn-primary" onClick={() => closeModal()}>
            {messages[`common.save`]}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

AddCityModal.propTypes = {
  setOpen: PropTypes.func,
  open: PropTypes.bool,
  header: PropTypes.string,
};
