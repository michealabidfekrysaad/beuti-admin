/* eslint-disable no-shadow */
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Modal } from 'react-bootstrap';
import { Routes } from 'constants/Routes';

export function PackagesOfService({
  openModal,
  setOpenModal,
  message,
  packagesData,
  title,
  hasMultipleServiceOption = true,
}) {
  return (
    <>
      <Modal
        onHide={() => {
          setOpenModal(false);
        }}
        show={openModal}
        size="lg"
        centered
        aria-labelledby="contained-modal-title-vcenter"
        className="bootstrap-modal-customizing"
      >
        <Modal.Header className="packageServieHeader">
          <Modal.Title className="packageServieHeader-title">
            <FormattedMessage id={title || 'service.delete'} />
          </Modal.Title>
          <p className="packageServieHeader-subTitle">
            <FormattedMessage id={message} />
          </p>
        </Modal.Header>
        <Modal.Body className="packageServieBody">
          <div
            className={`d-flex ${
              hasMultipleServiceOption
                ? 'justify-content-between'
                : 'justify-content-center'
            } flex-wrap`}
          >
            {packagesData &&
              packagesData.map((singleRes) => (
                <>
                  <div
                    className={`${
                      !hasMultipleServiceOption ? 'd-flex flex-column' : 'py-2'
                    }`}
                  >
                    <p className="packageServieBody-header">
                      {hasMultipleServiceOption && singleRes?.name}
                    </p>
                    {singleRes &&
                      singleRes.packages &&
                      singleRes.packages.map((pack) => (
                        <>
                          <button
                            type="button"
                            className="packageServieBody-package"
                            onClick={() => {
                              window.open(
                                `/servicesList/EditPackage/${pack.id}`,
                                '_blank',
                              );
                            }}
                          >
                            {pack?.name}
                          </button>
                        </>
                      ))}
                  </div>
                </>
              ))}
          </div>
        </Modal.Body>
        <Modal.Footer className="pt-3 justify-content-center packageServieFooter">
          <button
            type="button"
            className="px-4 cancel"
            onClick={() => {
              setOpenModal(false);
            }}
          >
            <FormattedMessage id="common.close" />
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

PackagesOfService.propTypes = {
  openModal: PropTypes.bool,
  setOpenModal: PropTypes.func,
  message: PropTypes.string,
  packagesData: PropTypes.array,
  title: PropTypes.string,
  hasMultipleServiceOption: PropTypes.bool,
};
