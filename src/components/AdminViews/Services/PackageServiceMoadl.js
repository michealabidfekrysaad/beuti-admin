import React from 'react';
import { Modal, Row, Col } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { Routes } from 'constants/Routes';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

export default function PackageServiceModal({ open, setOpen }) {
  const { messages, locale } = useIntl();
  const history = useHistory();

  const closeModal = () => {
    setOpen(false);
  };
  return (
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
      <div>
        <Modal.Body>
          <Row className="addItemNewModal">
            <Col xs={12} className="addItemNewModal-header">
              {messages['spAdmin.serviceList.add.header']}
            </Col>
            <Col xs={12}>
              <button
                type="button"
                className="addItemNewModal-body"
                onClick={() => history.push(Routes.newCategory)}
              >
                <div className="addItemNewModal-body__leftSection">
                  <p className="addItemNewModal-body__leftSection-title">
                    {messages['spAdmin.serviceList.add.category.title']}
                  </p>
                  <p className="addItemNewModal-body__leftSection-subTitle">
                    {messages['spAdmin.serviceList.add.category.sub.title']}
                  </p>
                </div>
                <div className="addItemNewModal-body__rightSection">
                  <i
                    className={`flaticon2-${
                      locale === 'ar' ? 'left-arrow' : 'right-arrow'
                    }`}
                  ></i>
                </div>
              </button>
            </Col>
            <hr className="w-100" />
            <Col xs={12}>
              <button
                onClick={() => history.push(Routes.newService)}
                type="button"
                className="addItemNewModal-body"
              >
                <div className="addItemNewModal-body__leftSection">
                  <p className="addItemNewModal-body__leftSection-title">
                    {messages['spAdmin.serviceList.add.service.title']}
                  </p>
                  <p className="addItemNewModal-body__leftSection-subTitle">
                    {messages['spAdmin.serviceList.add.service.sub.title']}
                  </p>
                </div>
                <div className="addItemNewModal-body__rightSection">
                  <i
                    className={`flaticon2-${
                      locale === 'ar' ? 'left-arrow' : 'right-arrow'
                    }`}
                  ></i>
                </div>
              </button>
            </Col>
            <hr className="w-100" />
            <Col xs={12}>
              <button
                onClick={() => history.push(Routes.AddPackage)}
                type="button"
                className="addItemNewModal-body"
              >
                <div className="addItemNewModal-body__leftSection">
                  <p className="addItemNewModal-body__leftSection-title">
                    {messages['spAdmin.serviceList.add.package.title']}
                  </p>
                  <p className="addItemNewModal-body__leftSection-subTitle">
                    {messages['spAdmin.serviceList.add.package.sub.title']}
                  </p>
                </div>
                <div className="addItemNewModal-body__rightSection">
                  <i
                    className={`flaticon2-${
                      locale === 'ar' ? 'left-arrow' : 'right-arrow'
                    }`}
                  ></i>
                </div>
              </button>
            </Col>
          </Row>
        </Modal.Body>
      </div>
    </Modal>
  );
}

PackageServiceModal.propTypes = {
  setOpen: PropTypes.func,
  open: PropTypes.bool,
};
