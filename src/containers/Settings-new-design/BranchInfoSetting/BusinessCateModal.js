import React, { useEffect, useState } from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';

const BusinessCatModal = ({ show, setShow, setSelectedBC, list, selectedBC }) => {
  const { messages } = useIntl();
  const [categorySelected, setCategorySelected] = useState({
    id: '',
    name: '',
    description: '',
  });
  useEffect(() => {
    if (selectedBC?.id) {
      setCategorySelected(list?.find((element) => element?.id === selectedBC?.id));
    }
  }, [show]);

  return (
    <Modal
      onHide={() => {
        setShow(false);
        setCategorySelected({
          id: '',
          name: '',
          description: '',
        });
      }}
      show={show}
      className="registermodal-wrapper"
    >
      <Modal.Body className="businessModal">
        <div className="businessModal-title">
          {messages['bracnh.edit.business.modal.header']}
        </div>
        <div className="businessModal-subtitle">
          {messages['bracnh.edit.business.modal.header.info']}
        </div>
        <Row className="businessModal-list">
          {list &&
            list.map((category) => (
              <Col
                className={`businessModal-list__item ${category.id ===
                  categorySelected?.id && 'active'}`}
                xs={3}
                key={category.id}
                onClick={() => setCategorySelected(category)}
              >
                <img
                  className="businessModal-list__item-image"
                  src={category.image}
                  alt={category.name}
                />
                <div className="businessModal-list__item-name">{category.name}</div>
              </Col>
            ))}
        </Row>
        {categorySelected && (
          <div className="businessModal-description">
            <h2>{categorySelected.name}</h2>
            <p>{categorySelected.description}</p>
          </div>
        )}
        <div className="businessModal-footer">
          <Button
            type="button"
            className="btn btn-grey"
            onClick={() => {
              setCategorySelected({
                id: '',
                name: '',
                description: '',
              });
              setShow(false);
            }}
          >
            {messages[`common.cancel`]}
          </Button>
          <Button
            type="submit"
            onClick={() => {
              if (!categorySelected.id) {
                toast.error(messages['register.modal.error']);
              } else {
                setSelectedBC(categorySelected);
                setShow(false);
              }
            }}
          >
            {messages[`common.select`]}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
BusinessCatModal.propTypes = {
  show: PropTypes.bool,
  list: PropTypes.array,
  selectedBC: PropTypes.oneOf([PropTypes.object, PropTypes.bool]),
  setSelectedBC: PropTypes.func,
  setShow: PropTypes.func,
};
export default BusinessCatModal;
