import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import { useIntl } from 'react-intl';
import '../../Style/ViewBooking.scss';
import { FullFundModal } from 'components/shared/FullRefundModal';
import { CallAPI } from 'utils/API/APIConfig';
import { toast } from 'react-toastify';

const InoviceDetails = ({
  inoviceImg,
  open,
  onClose,
  bookingPaymentStatus,
  canRefund,
  paidAmount,
  onlinePaid,
  checkoutId,
  callBackAfterRefund = () => null,
  callBackAfterClose = () => null,
}) => {
  const { messages } = useIntl();
  const [opeRefundModal, setOpenRefundModal] = useState(false);
  const { refetch: refundBookingCall, isFetching } = CallAPI({
    name: 'refundBooking',
    url: 'CheckOut/FullRefund',
    method: 'put',
    query: {
      checkoutId,
    },
    onSuccess: (data) => {
      if (data) {
        setOpenRefundModal(false);
        callBackAfterRefund(true);
      }
    },
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });
  const printImage = () => {
    const win = window.open();
    win.document.write(`<img src=${inoviceImg} alt="invoice" />`); // Write contents in the new window  to print
    win.document.close();
    win.print();
  };
  return (
    <section className={`sideinvoice ${open && 'open'}`}>
      <section className="sideinvoice_status">
        <Row>
          <Col xs="1" className="sideinvoice-close">
            <button
              type="button"
              onClick={() => {
                callBackAfterClose();
                onClose(false);
              }}
            >
              <SVG src={toAbsoluteUrl('/closeinvoice.svg')} />
            </button>
          </Col>
        </Row>
        <Row className="justify-content-center align-items-center">
          <Col xs="12" className="sideinvoice_status-icon">
            <SVG src={toAbsoluteUrl('/refunded.svg')} />
          </Col>
          <Col xs="12" className="sideinvoice_status-title">
            {bookingPaymentStatus}
          </Col>
          <Col xs="12" className="sideinvoice_status-description">
            {messages['Invoice.description']}
          </Col>
        </Row>
        <Row className="sideinvoice-actions">
          <Col xs="auto" className="sideinvoice-actions__item">
            <button
              className="sideinvoice-actions__item-image"
              type="button"
              onClick={() => printImage()}
            >
              <SVG src={toAbsoluteUrl('/print.svg')} />
            </button>
            <span className="sideinvoice-actions__name">{messages['common.print']}</span>
          </Col>

          <Col xs="auto" className="sideinvoice-actions__item">
            <a
              className="sideinvoice-actions__item-image"
              type="button"
              download="invoice.jpeg"
              href={inoviceImg}
            >
              <SVG src={toAbsoluteUrl('/downloadinvoice.svg')} />
            </a>
            <span className="sideinvoice-actions__name">
              {messages['common.Download']}
            </span>
          </Col>
        </Row>
        {canRefund && (
          <Row className="sideinvoice-tabs">
            <Col xs="12">
              <button
                type="button"
                className="sideinvoice-tabs__item"
                onClick={() => {
                  onClose(false);
                  setOpenRefundModal(true);
                }}
              >
                {messages['Invoice.refund']}
              </button>
            </Col>
            {/* <Col xs="12">
            <button type="button" className="sideinvoice-tabs__item">
              {messages['Invoice.partially.refund']}
            </button>
          </Col> */}
          </Row>
        )}
      </section>
      <section className="sideinvoice_invoice">
        <Row>
          <Col xs="auto">
            <p className="sideinvoice-title">
              {messages['reservationSteps.summary.invoiceDetails']}
            </p>
          </Col>
        </Row>
        {inoviceImg && (
          <Row>
            <Col xs="12" className="sideinvoice-invoice">
              <img src={inoviceImg} alt="invoice" />
            </Col>
          </Row>
        )}
      </section>
      <FullFundModal
        setPayload={refundBookingCall}
        openModal={opeRefundModal}
        handleCancel={() => {
          setOpenRefundModal(false);
          callBackAfterClose();
        }}
        setOpenModal={setOpenRefundModal}
        paidAmount={paidAmount}
        onlinePaid={onlinePaid}
        isFetching={isFetching}
      />
    </section>
  );
};
InoviceDetails.propTypes = {
  inoviceImg: PropTypes.string,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  bookingPaymentStatus: PropTypes.string,
  checkoutId: PropTypes.string,
  canRefund: PropTypes.bool,
  callBackAfterRefund: PropTypes.func,
  callBackAfterClose: PropTypes.func,
  paidAmount: PropTypes.string,
  onlinePaid: PropTypes.string,
};

export default InoviceDetails;
