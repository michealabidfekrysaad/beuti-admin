/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/prop-types */
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';

export default function PaymentChoosenDisplayed({
  checkoutDataBooking,
  deleteAddedPaymentMethod,
  breakDownRes,
}) {
  const { messages } = useIntl();
  /* -------------------------------------------------------------------------- */
  /*     el mafrod a3red mn el  breakDownRes  mosh mn el checkoutDataBooking    */
  /* -------------------------------------------------------------------------- */
  return (
    <>
      <Row className="checkout-payments">
        {breakDownRes?.subTotal > 0 && (
          <Col xs={12} className="d-flex justify-content-between">
            <div className="checkout-payments_name">{messages['checkout.sub.total']}</div>
            <div className="checkout-payments_value">
              <FormattedMessage
                id="booking.service.current"
                values={{
                  price: breakDownRes?.subTotal,
                }}
              />
            </div>
          </Col>
        )}
        {breakDownRes?.cityFees > 0 && (
          <Col xs={12} className="d-flex justify-content-between">
            <div className="checkout-payments_name">{messages['checkout.city.fees']}</div>
            <div className="checkout-payments_value">
              <FormattedMessage
                id="booking.service.current"
                values={{
                  price: breakDownRes?.cityFees,
                }}
              />
            </div>
          </Col>
        )}
        {breakDownRes?.voucherValue > 0 && (
          <Col xs={12} className="d-flex justify-content-between">
            <div className="checkout-payments_name">{messages['checkout.voucher']}</div>
            <div className="checkout-payments_value">
              <FormattedMessage
                id="booking.service.current"
                values={{
                  price: breakDownRes?.voucherValue,
                }}
              />
            </div>
          </Col>
        )}
        {breakDownRes?.promoCodePercentage > 0 && (
          <Col xs={12} className="d-flex justify-content-between">
            <div className="checkout-payments_name">
              {messages['checkout.promo.code']}
            </div>
            <div className="checkout-payments_value">
              <FormattedMessage
                id="offers.table.discount.perctange"
                values={{
                  count: breakDownRes?.promoCodePercentage,
                }}
              />
            </div>
          </Col>
        )}
        {breakDownRes?.promoCodePercentage + breakDownRes?.referralCodePercentage > 0 && (
          <Col xs={12} className="d-flex justify-content-between">
            <div className="checkout-payments_name">{messages['checkout.coupon']}</div>
            <div className="checkout-payments_value">
              <FormattedMessage
                id="offers.table.discount.perctange"
                values={{
                  count:
                    breakDownRes?.promoCodePercentage +
                    breakDownRes?.referralCodePercentage,
                }}
              />
            </div>
          </Col>
        )}
        {breakDownRes?.vatAmount > 0 && (
          <Col xs={12} className="d-flex justify-content-between">
            <div className="checkout-payments_name">{messages['common.vat']}</div>
            <div className="checkout-payments_value">
              <FormattedMessage
                id="booking.service.current"
                values={{
                  price: breakDownRes?.vatAmount,
                }}
              />
            </div>
          </Col>
        )}
        <Col xs={12} className="d-flex justify-content-between">
          <div className="checkout-payments_name">{messages['common.sum']}</div>
          <div className="checkout-payments_value">
            <FormattedMessage
              id="booking.service.current"
              values={{
                price: breakDownRes?.totalPriceWithVat,
              }}
            />
          </div>
        </Col>
      </Row>

      {(breakDownRes?.paidAmounts?.length > 0 ||
        breakDownRes?.walletAmount > 0 ||
        breakDownRes?.onlineAmount > 0) && (
        <Row className="checkout-added--payments">
          {breakDownRes?.onlineAmount > 0 && (
            // <Row className="checkout-added--payments">
            <Col xs={12} className="d-flex justify-content-between py-2">
              <div className="checkout-payments_name">
                <span className="mx-2">{breakDownRes?.paymentMethodName}</span>
              </div>
              <div className="checkout-payments_value">
                <FormattedMessage
                  id="booking.service.current"
                  values={{
                    price: breakDownRes?.onlineAmount,
                  }}
                />
              </div>
            </Col>
            // </Row>
          )}

          {breakDownRes?.walletAmount > 0 && (
            // <Row className="checkout-added--payments">
            <Col xs={12} className="d-flex justify-content-between py-2">
              <div className="checkout-payments_name">
                <span className="mx-2">{messages['common.wallet']}</span>
              </div>
              <div className="checkout-payments_value">
                <FormattedMessage
                  id="booking.service.current"
                  values={{
                    price: breakDownRes?.walletAmount,
                  }}
                />
              </div>
            </Col>
            // </Row>
          )}
          {breakDownRes?.paidAmounts?.map((payment) => (
            <Col
              xs={12}
              className="d-flex justify-content-between py-2"
              key={payment?.id}
            >
              <div className="checkout-payments_name">
                {!payment?.isSaved && (
                  <i
                    className="flaticon2-rubbish-bin text-dark checkout-payments_name-delete"
                    onClick={() => deleteAddedPaymentMethod(payment?.id)}
                  ></i>
                )}
                <span className={!payment?.isSaved && 'mx-2'}>{payment?.name}</span>
              </div>
              <div className="checkout-payments_value">
                <FormattedMessage
                  id="booking.service.current"
                  values={{
                    price: payment?.amount,
                  }}
                />
              </div>
            </Col>
          ))}
        </Row>
      )}
    </>
  );
}
