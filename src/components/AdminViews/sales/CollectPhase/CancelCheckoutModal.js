import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

export function CancelCheckoutModal({
  openCancelSaleModal,
  setOpenCancelSaleModal,
  setSalesData,
  salesData,
  setCollectPhase,
}) {
  const history = useHistory();
  return (
    <>
      <Modal
        onHide={() => {
          setOpenCancelSaleModal(false);
        }}
        show={openCancelSaleModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        className="bootstrap-modal-customizing"
      >
        <Modal.Header>
          <Modal.Title className="title">
            <FormattedMessage id="sales.cancel.checkout.modal.cancel.sale" />
          </Modal.Title>
          <p className="subtitle mx-auto catSubtitle">
            <FormattedMessage
              id={`${
                !salesData?.prevSale
                  ? 'sales.cancel.checkout.modal.cancel.sale.message'
                  : 'sales.cancel.checkout.modal.cancel.prev.sale'
              }`}
            />
          </p>
        </Modal.Header>
        <div className="pt-3 justify-content-end d-flex somePadd">
          <button
            type="button"
            className="px-4 cancel"
            onClick={() => {
              setOpenCancelSaleModal(false);
            }}
          >
            <FormattedMessage id="common.cancel" />
          </button>
          <button
            type="button"
            onClick={() => {
              if (salesData?.prevSale) {
                history.push('/sales/invoicesList');
              }
              setSalesData({
                itemsSelected: [],
                calculations: {
                  ...salesData?.calculations,
                  subtotal: 0,
                  vat: 0,
                  bookingVat: 0,
                  total: 0,
                },
                paymentMethodAmounts: [],
              });
              setCollectPhase(false);
              setOpenCancelSaleModal(false);
            }}
            className="px-4 redBtn"
          >
            <FormattedMessage id="common.confirm" />
          </button>
        </div>
      </Modal>
    </>
  );
}

CancelCheckoutModal.propTypes = {
  openCancelSaleModal: PropTypes.bool,
  setOpenCancelSaleModal: PropTypes.func,
  setSalesData: PropTypes.func,
  salesData: PropTypes.object,
  setCollectPhase: PropTypes.func,
};
