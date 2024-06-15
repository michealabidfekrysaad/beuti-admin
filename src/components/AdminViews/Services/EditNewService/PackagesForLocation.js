/* eslint-disable no-shadow */
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Modal, Col, Row } from 'react-bootstrap';
import { Routes } from 'constants/Routes';

export function PackagesForLocation({
  openModal,
  setOpenModal,
  message,
  packagesData,
  packagesOption,
  title,
  messageWithIndex,
  setMsgPackageIndexing,
  setMsgPackage,
  setTitleWhenDeletePrice,
  setPackagesOption = () => {},
  setPackages = () => {},
}) {
  return (
    <>
      <Modal
        onHide={() => {
          setOpenModal(false);
          setMsgPackageIndexing(false);
          setMsgPackage(false);
          setTitleWhenDeletePrice(false);
          setPackagesOption(false);
          setPackages(false);
        }}
        show={openModal}
        size="lg"
        centered
        aria-labelledby="contained-modal-title-vcenter"
        className="bootstrap-modal-customizing"
      >
        <Modal.Header className="packageServieHeader">
          <Modal.Title className="packageServieHeader-title">
            <FormattedMessage id={title || 'wizard.add.new.service.price.location'} />
          </Modal.Title>
          <p className="packageServieHeader-subTitleEdit">
            {!messageWithIndex && message && <FormattedMessage id={message} />}
            {messageWithIndex && !message && (
              <FormattedMessage
                id={messageWithIndex?.msg}
                values={{ index: messageWithIndex?.index }}
              />
            )}
          </p>
        </Modal.Header>
        <Modal.Body className="packageServieBody">
          <div className="d-flex justify-content-between flex-column align-items-center flex-wrap">
            {packagesData &&
              packagesData.map((singleRes) => (
                <>
                  <div>
                    <button
                      type="button"
                      className="packageServieBody-package"
                      onClick={() => {
                        window.open(
                          `/servicesList/EditPackage/${singleRes.id}`,
                          '_blank',
                        );
                      }}
                    >
                      {singleRes?.name}
                    </button>
                  </div>
                </>
              ))}
          </div>
          <div className="d-flex justify-content-between flex-wrap">
            {packagesOption &&
              packagesOption.map((singleRes, index) => (
                <>
                  <div className="py-3 px-1">
                    <p className="packageServieBody-header">
                      {singleRes?.name?.length ? (
                        singleRes?.name
                      ) : (
                        <FormattedMessage
                          id="service.name.opt"
                          values={{
                            index: index + 1,
                          }}
                        />
                      )}
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
              setMsgPackageIndexing(false);
              setMsgPackage(false);
              setTitleWhenDeletePrice(false);
              setPackagesOption(false);
              setPackages(false);
            }}
          >
            <FormattedMessage id="common.close" />
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

PackagesForLocation.propTypes = {
  openModal: PropTypes.bool,
  setOpenModal: PropTypes.func,
  message: PropTypes.string,
  packagesData: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  packagesOption: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  title: PropTypes.string,
  messageWithIndex: PropTypes.object,
  setMsgPackageIndexing: PropTypes.func,
  setMsgPackage: PropTypes.func,
  setTitleWhenDeletePrice: PropTypes.func,
  setPackagesOption: PropTypes.func,
  setPackages: PropTypes.func,
};
