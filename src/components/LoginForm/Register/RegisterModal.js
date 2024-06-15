import React from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';

const RegisterModal = ({ show, setShow, setSelectedBC, list, selectedBC }) => {
  const { messages } = useIntl();
  return (
    <Modal show={show} className="registermodal-wrapper">
      <Modal.Body className="registermodal">
        <div className="registermodal-title">{messages['register.modal.salontype']}</div>
        <div className="registermodal-subtitle">{messages['register.modal.support']}</div>
        <Row className="registermodal-list">
          {list &&
            list.map((category) => (
              <Col
                className={`registermodal-list__item ${category.id === selectedBC.id &&
                  'active'}`}
                xs={4}
                key={category.id}
                onClick={() => setSelectedBC(category)}
              >
                <img
                  className="registermodal-list__item-image"
                  src={category.image}
                  alt={category.name}
                />
                <div className="registermodal-list__item-name">{category.name}</div>
              </Col>
            ))}
        </Row>
        {selectedBC.description && (
          <div className="registermodal-description">{selectedBC.description}</div>
        )}
        <div className="registermodal-submit">
          <Button
            type="submit"
            onClick={() => {
              if (selectedBC.id) {
                setShow(false);
              } else {
                toast.error(messages['register.modal.error']);
              }
            }}
          >
            {messages[`common.contiune`]}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
RegisterModal.propTypes = {
  show: PropTypes.bool,
  list: PropTypes.array,
  selectedBC: PropTypes.oneOf([PropTypes.object, PropTypes.bool]),
  setSelectedBC: PropTypes.func,
  setShow: PropTypes.func,
};
export default RegisterModal;
