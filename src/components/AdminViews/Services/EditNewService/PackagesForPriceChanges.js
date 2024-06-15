/* eslint-disable no-shadow */
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Modal, Col, Row } from 'react-bootstrap';

export function PackagesForPriceChanges({
  openAffectedPackagesModal,
  setOpenAffectedPackagesModal,
  affectedPackages,
  setAffectedPackages,
}) {
  return (
    <>
      <Modal
        onHide={() => {
          setOpenAffectedPackagesModal(false);
          setAffectedPackages([]);
        }}
        show={openAffectedPackagesModal}
        size="lg"
        centered
        aria-labelledby="contained-modal-title-vcenter"
        className="bootstrap-modal-customizing"
      >
        <Modal.Header className="packageServieHeader">
          <Modal.Title className="packageServieHeader-title">
            <FormattedMessage id="edit.price.service.package.modal.header" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="package-affected">
          <Row className="pt-4">
            {affectedPackages?.map((pack) => (
              <Col xs={6} className="p-2" key={pack?.id}>
                <div className="package-affected-affected--pack">{pack.name}</div>
              </Col>
            ))}
          </Row>
        </Modal.Body>
        <Modal.Footer className="pt-3 justify-content-center packageServieFooter">
          <button
            type="button"
            className="px-4 cancel"
            onClick={() => {
              setOpenAffectedPackagesModal(false);
              setAffectedPackages([]);
            }}
          >
            <FormattedMessage id="common.close" />
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

PackagesForPriceChanges.propTypes = {
  openAffectedPackagesModal: PropTypes.bool,
  setOpenAffectedPackagesModal: PropTypes.func,
  affectedPackages: PropTypes.array,
  setAffectedPackages: PropTypes.func,
};
