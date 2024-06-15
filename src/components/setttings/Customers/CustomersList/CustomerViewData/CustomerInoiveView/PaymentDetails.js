/* eslint-disable react/prop-types */
import React from 'react';
import { useIntl } from 'react-intl';
import { Modal, Col, Row } from 'react-bootstrap';
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';

export default function PaymentDetails({
  setOpenModal,
  openModal,
  invoiceForPaymentModal,
}) {
  const { messages } = useIntl();
  const paymentMethodImage = (payName, payId) => {
    if (payName?.includes('cash') || payName?.includes('نقدا') || payId === 1) {
      return '/cash.svg';
    }
    if (payName?.includes('mada') || payName?.includes('مدي') || payId === 2) {
      return '/mada.svg';
    }
    if (payName?.includes('apple') || payName?.includes('ابل باي') || payId === 3) {
      return '/apple-pay.svg';
    }
    return '/cash.svg';
  };

  const paymentMethodName = (payId) => {
    if (payId === 1) {
      return messages['common.cash'];
    }
    if (payId === 2) {
      return messages['common.mada'];
    }
    if (payId === 3) {
      return messages['common.applePay'];
    }
    return messages['common.cash'];
  };
  return (
    <Modal
      onHide={() => {
        setOpenModal(false);
      }}
      show={openModal}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      className="bootstrap-modal-customizing  payment-details"
    >
      <Modal.Header>
        <Row className="justify-content-between align-items-center">
          <Col xs="1" />
          <Col xs="auto" className="sideinvoice-title">
            {messages['setting.customer.invoice.details.title']}
          </Col>
          <Col xs="1" className="sideinvoice-close">
            <button type="button" onClick={() => setOpenModal(false)}>
              <SVG src={toAbsoluteUrl('/closeinvoice.svg')} />
            </button>
          </Col>
        </Row>
      </Modal.Header>
      <Modal.Body>
        <Row className="payment-details_body">
          {(invoiceForPaymentModal?.paymentDetails?.length ||
            invoiceForPaymentModal?.hasWalletPayment ||
            invoiceForPaymentModal?.onLinePaidAmount > 0) && (
            <Col className="payment-details_body-data" xs={12}>
              <div className="payment-details_body-data-header">
                {messages['setting.customer.invoice.details.paid']}
              </div>
              <Row className="d-flex">
                {invoiceForPaymentModal?.hasWalletPayment && (
                  <Col xs={6} className="payment-details_body-data-section">
                    <div className="payment-details_body-data-section_img">
                      <SVG src={toAbsoluteUrl('/wallet.svg')} />{' '}
                    </div>
                    <div className="payment-details_body-data-section_info">
                      <div className="payment-details_body-data-section_info-label">
                        {messages['common.wallet']}
                      </div>
                      <div className="payment-details_body-data-section_info-currency">
                        {invoiceForPaymentModal?.walletPaidAmounts}{' '}
                        {messages['common.currency']}
                      </div>
                    </div>
                  </Col>
                )}
                {invoiceForPaymentModal?.paymentDetails?.map((payDetails) => (
                  <Col
                    key={payDetails?.id}
                    xs={6}
                    className="payment-details_body-data-section"
                  >
                    <div className="payment-details_body-data-section_img">
                      <SVG
                        src={toAbsoluteUrl(
                          paymentMethodImage(
                            payDetails?.name,
                            payDetails?.paymentMethodId,
                          ),
                        )}
                      />{' '}
                    </div>
                    <div className="payment-details_body-data-section_info">
                      <div className="payment-details_body-data-section_info-label">
                        {payDetails?.name}
                      </div>
                      <div className="payment-details_body-data-section_info-currency">
                        {payDetails?.amount} {messages['common.currency']}
                      </div>
                    </div>
                  </Col>
                ))}
                {invoiceForPaymentModal?.onLinePaidAmount > 0 && (
                  <Col xs={6} className="payment-details_body-data-section">
                    <div className="payment-details_body-data-section_img">
                      <SVG
                        src={toAbsoluteUrl(
                          paymentMethodImage(
                            '',
                            invoiceForPaymentModal?.onLinePaidAmount,
                          ),
                        )}
                      />{' '}
                    </div>
                    <div className="payment-details_body-data-section_info">
                      <div className="payment-details_body-data-section_info-label">
                        {paymentMethodName(invoiceForPaymentModal?.onLinePaidAmount)}
                      </div>
                      <div className="payment-details_body-data-section_info-currency">
                        {invoiceForPaymentModal?.onLinePaidAmount}{' '}
                        {messages['common.currency']}
                      </div>
                    </div>
                  </Col>
                )}
              </Row>
            </Col>
          )}

          {invoiceForPaymentModal?.remainingAmount > 0 && (
            <Col className="payment-details_body-data" xs={12}>
              <div className="payment-details_body-data-header">
                {messages['setting.customer.invoice.details.un.paid']}
              </div>
              <div className="payment-details_body-data-section">
                <div className="payment-details_body-data-section_img">
                  <SVG src={toAbsoluteUrl('/salonchair.svg')} />{' '}
                </div>
                <div className="payment-details_body-data-section_info">
                  <div className="payment-details_body-data-section_info-label">
                    {messages['service.salon.sm']}
                  </div>
                  <div className="payment-details_body-data-section_info-currency">
                    {invoiceForPaymentModal?.remainingAmount}{' '}
                    {messages['common.currency']}
                  </div>
                </div>
              </div>
            </Col>
          )}
        </Row>
      </Modal.Body>
    </Modal>
  );
}
