/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/prop-types */
import React from 'react';
import { FormattedMessage } from 'react-intl';

export default function PaymentDetails({ salesData, setSalesData }) {
  const deleteAddedPaymentMethod = (id) => {
    setSalesData({
      ...salesData,
      paymentMethodAmounts: salesData?.paymentMethodAmounts?.filter(
        (meth) => meth?.id !== id,
      ),
    });
  };
  return (
    <div className="p-2">
      {salesData?.calculations?.subtotal >= 0 && (
        <div className="cart--payment-container">
          <div>
            <FormattedMessage id="checkout.sub.total" />
          </div>
          <div>
            <FormattedMessage
              id="booking.service.current"
              values={{ price: salesData?.calculations?.subtotal }}
            />
          </div>
        </div>
      )}
      {salesData?.calculations?.bookingVat > 0 && (
        <div className="cart--payment-container">
          <div>
            <FormattedMessage id="sales.cart.booking.vat" />
          </div>
          <div>
            <FormattedMessage
              id="booking.service.current"
              values={{ price: salesData?.calculations?.bookingVat }}
            />
          </div>
        </div>
      )}
      {salesData?.calculations?.vat > 0 && (
        <div className="cart--payment-container">
          <div>
            <FormattedMessage id="common.vat" />
          </div>
          <div>
            <FormattedMessage
              id="booking.service.current"
              values={{ price: salesData?.calculations?.vat }}
            />
          </div>
        </div>
      )}
      {salesData?.calculations?.total >= 0 && (
        <div className="cart--payment-container">
          <div>
            <FormattedMessage id="common.total" />
          </div>
          <div>
            <FormattedMessage
              id="booking.service.current"
              values={{ price: salesData?.calculations?.total?.truncNumNotRound() }}
            />
          </div>
        </div>
      )}
      {/* show here the payment method choosen to pay money */}
      {(salesData?.paymentMethodAmounts?.length > 0 ||
        salesData?.calculations?.sumBookingPaidAmounts > 0) && (
        <div className="cart--info-section--payments">
          {salesData?.calculations?.sumBookingPaidAmounts > 0 && (
            <div className="cart--payment-container">
              <div>
                <span>
                  <FormattedMessage id="sales.confirm.booking.online.payments" />
                </span>
              </div>
              <div>
                <FormattedMessage
                  id="booking.service.current"
                  values={{
                    price: salesData?.calculations?.sumBookingPaidAmounts,
                  }}
                />
              </div>
            </div>
          )}
          {salesData?.paymentMethodAmounts?.map((payment) => (
            <div className="cart--payment-container">
              <div>
                {!payment?.isSaved && (
                  <i
                    className="flaticon2-rubbish-bin text-dark checkout-payments_name-delete"
                    onClick={() => deleteAddedPaymentMethod(payment?.id)}
                  ></i>
                )}
                <span className={!payment?.isSaved && 'mx-2'}>{payment?.name}</span>
              </div>
              <div>
                <FormattedMessage
                  id="booking.service.current"
                  values={{ price: payment?.amount }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
