/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { Modal, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

export default function AddNewPackageModal({ open, setOpen }) {
  const { messages } = useIntl();

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
      <div className="employee-box">
        <div className="employee-box__title mb-3">
          {messages['spAdmin.serviceList.addCategoryNew.new']}
        </div>
        <Modal.Body>
          <div className="employee-box__controllers--">
            <Row className=" container-box">
              <Col className="container-box__controllers mt-2 mb-2" lg={4} xs={12}>
                <label
                  htmlFor="categoryArName"
                  className="container-box__controllers--label w-100"
                >
                  {messages['spAdmin.serviceList.newPackage.name-ar']}
                </label>
                <input
                  className="input-box__controllers-input w-100"
                  type="text"
                  id="categoryArName"
                  placeholder={messages[`spAdmin.serviceList.newPackage.name-ar`]}
                  //   value={priceNameAr || ''}
                  //   onChange={(e) => setPriceNameAr(e.target.value)}
                />
              </Col>
              <Col className="container-box__controllers mt-2 mb-2" lg={4} xs={12}>
                <label
                  htmlFor="categoryEnName"
                  className="container-box__controllers--label w-100"
                >
                  {messages['spAdmin.serviceList.newPackage.name-en']}
                </label>
                <input
                  className="input-box__controllers-input w-100"
                  type="text"
                  id="categoryEnName"
                  placeholder={messages[`spAdmin.serviceList.newPackage.name-en`]}
                  //   value={priceNameAr || ''}
                  //   onChange={(e) => setPriceNameAr(e.target.value)}
                />
              </Col>
              <Col lg={12} xs={12} className="container-box__controllers mt-2 mb-2">
                <label
                  htmlFor="serviceDesc"
                  className="container-box__controllers--label"
                >
                  {messages['spAdmin.service.desc.ar']}
                </label>
                <textarea
                  className="form-select w-75 container-box__controllers-textArea"
                  id="serviceDesc"
                  placeholder={messages['spAdmin.service.desc']}
                ></textarea>
              </Col>
              <Col lg={12} xs={12} className="container-box__controllers mt-2 mb-2">
                <label
                  htmlFor="serviceDescEn"
                  className="container-box__controllers--label"
                >
                  {messages['spAdmin.service.desc.en']}
                </label>
                <textarea
                  className="form-select w-75 container-box__controllers-textArea"
                  id="serviceDescEn"
                  placeholder={messages['spAdmin.service.desc']}
                ></textarea>
              </Col>
            </Row>
          </div>
        </Modal.Body>
      </div>
    </Modal>
  );
}

AddNewPackageModal.propTypes = {
  setOpen: PropTypes.func,
  open: PropTypes.bool,
};
