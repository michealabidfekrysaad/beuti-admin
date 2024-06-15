import React from 'react';
import { Row, Col } from 'react-bootstrap';
import SVG from 'react-inlinesvg';
import PropTypes from 'prop-types';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import { FormattedMessage, useIntl } from 'react-intl';
const PaidAndUnPaidAmount = ({ BookingDetails }) => {
  const { messages } = useIntl();
  const paymentisShowAndRefunded =
    BookingDetails?.lastInvoiceStatusId === 4 && BookingDetails?.bookingStatusId === 6;
  const handleShowPaymentStatus = () =>
    (!!BookingDetails?.onlinePaidAmount ||
      !!BookingDetails?.walletPaidAmount ||
      !!BookingDetails?.paymentMethods?.length) &&
    !paymentisShowAndRefunded;

  return (
    <Row className="paidamount">
      {handleShowPaymentStatus() && (
        <>
          <Col xs="12" className="paidamount-box">
            <Row>
              <Col xs="12" className="paidamount-box__title">
                {messages['booking.sidebar.paidamount']}
              </Col>
              {/* Wallet */}
              {!!BookingDetails?.walletPaidAmount && (
                <Col xs="6">
                  <Row className="paidamount-box__method">
                    <Col xs="auto" className="paidamount-box__method-image">
                      <SVG src={toAbsoluteUrl('/wallet.svg')} />
                    </Col>
                    <Col xs="auto" className="paidamount-box__method-info">
                      <div className="paidamount-box__method-info--title">
                        {messages['common.wallet']}
                      </div>{' '}
                      <div className="paidamount-box__method-info--price">
                        <FormattedMessage
                          id="booking.service.current"
                          values={{ price: BookingDetails?.walletPaidAmount }}
                        />
                      </div>
                    </Col>
                  </Row>
                </Col>
              )}
              {/* Mada */}
              {!!BookingDetails?.onlinePaidAmount && (
                <Col xs="6">
                  <Row className="paidamount-box__method">
                    <Col xs="auto" className="paidamount-box__method-image">
                      <SVG src={toAbsoluteUrl('/madapayment.svg')} />
                    </Col>
                    <Col xs="auto" className="paidamount-box__method-info">
                      <div className="paidamount-box__method-info--title">
                        {messages['common.mada']}
                      </div>{' '}
                      <div className="paidamount-box__method-info--price">
                        <FormattedMessage
                          id="booking.service.current"
                          values={{ price: BookingDetails?.onlinePaidAmount }}
                        />
                      </div>
                    </Col>
                  </Row>
                </Col>
              )}
              {/* cash */}
              {BookingDetails?.paymentMethods?.map((method) => (
                <Col xs="6" key={method?.id}>
                  <Row className="paidamount-box__method">
                    <Col xs="auto" className="paidamount-box__method-image">
                      <SVG src={toAbsoluteUrl('/cash.svg')} />
                    </Col>
                    <Col xs="auto" className="paidamount-box__method-info">
                      <div className="paidamount-box__method-info--title">
                        {method?.name}
                      </div>{' '}
                      <div className="paidamount-box__method-info--price">
                        <FormattedMessage
                          id="booking.service.current"
                          values={{ price: method?.amount }}
                        />
                      </div>
                    </Col>
                  </Row>
                </Col>
              ))}
            </Row>
          </Col>
        </>
      )}

      {!!BookingDetails?.remainingAmount && (
        <Col xs="12" className="paidamount-box mt-2">
          <Row>
            <Col xs="12" className="paidamount-box__title">
              {messages['booking.sidebar.unpaidamount']}
            </Col>
            {/* Wallet */}
            <Col xs="6">
              <Row className="paidamount-box__method ">
                <Col xs="auto" className="paidamount-box__method-image">
                  <SVG src={toAbsoluteUrl('/salonchair.svg')} />
                </Col>
                <Col xs="auto" className="paidamount-box__method-info">
                  <div className="paidamount-box__method-info--title">
                    {messages['add.service.at.salon']}
                  </div>{' '}
                  <div className="paidamount-box__method-info--price">
                    <FormattedMessage
                      id="booking.service.current"
                      values={{ price: BookingDetails?.remainingAmount }}
                    />
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      )}
    </Row>
  );
};

PaidAndUnPaidAmount.propTypes = {
  BookingDetails: PropTypes.object,
};

export default PaidAndUnPaidAmount;
