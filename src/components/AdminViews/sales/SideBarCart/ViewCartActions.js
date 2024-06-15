/* eslint-disable react/prop-types */
import React from 'react';
import { Col, Row, DropdownButton, Dropdown } from 'react-bootstrap';
import { useIntl } from 'react-intl';

export default function ViewCartActions({
  toPayAmount = 0,
  setCollectPhase,
  salesData,
  collectPhase,
  setOpenCheckoutUnpaidClicked,
  refetchAddBoookingCheckout,
  fetchingNewCheckout,
  setOpenCancelSaleModal,
}) {
  const { messages } = useIntl();
  const statusAfterAddPAymentMethod = () => {
    const addedSelectedPayMethod = salesData?.paymentMethodAmounts;
    const sumPaymentMethodChoosen =
      addedSelectedPayMethod?.map((data) => data?.amount).reduce((a, b) => a + b, 0) +
      (salesData?.calculations?.sumBookingPaidAmounts || 0);

    // enter here  if total item inside cart was 0
    if (+salesData?.calculations?.total === 0) {
      return (
        <div className="change--pay">{messages['checkout.modal.no.change.given']}</div>
      );
    }

    // enter here if  added items to cart and has total >0
    // and has add payment methods before
    // their subtract >0
    if (
      +salesData?.calculations?.total > 0 &&
      sumPaymentMethodChoosen > 0 &&
      +salesData?.calculations?.total.sumPaymentMethodChoosen > 0
    ) {
      return (
        <>
          <div className="d-flex justify-content-between change--pay">
            <div>{messages['checkout.modal.amount.pay']}</div>
            <div>
              {Math.abs(
                +salesData?.calculations?.total - sumPaymentMethodChoosen,
              )?.toFixed(2)}{' '}
              {messages['common.currency']}
            </div>
          </div>
        </>
      );
    }

    // sum of payment method < total price of  items
    if (sumPaymentMethodChoosen < salesData?.calculations?.total) {
      return (
        <>
          <div className="d-flex justify-content-between change--pay">
            <div>{messages['checkout.modal.amount.pay']}</div>
            <div>
              {Math.abs(
                +salesData?.calculations?.total - sumPaymentMethodChoosen,
              )?.toFixed(2)}{' '}
              {messages['common.currency']}
            </div>
          </div>
        </>
      );
    }

    // sum of payment method === total price of items
    if (sumPaymentMethodChoosen === salesData?.calculations?.total) {
      return (
        <div className="change--pay">{messages['checkout.modal.no.change.given']}</div>
      );
    }

    // sum of payment method > total price of  items
    if (sumPaymentMethodChoosen > salesData?.calculations?.total) {
      return (
        <>
          <div className="d-flex justify-content-between change--pay">
            <div>{messages['checkout.modal.change.given']}</div>
            <div>
              {Math.abs(
                sumPaymentMethodChoosen - +salesData?.calculations?.total,
              )?.toFixed(2)}{' '}
              {messages['common.currency']}
            </div>
          </div>
        </>
      );
    }
    // the above methods are working fine till now

    return null;
  };
  const renderCorrectName = () => {
    if (!collectPhase) {
      return messages['sales.cart.continue'];
    }
    if (+toPayAmount === 0) {
      return messages['booking.sidebar.status.checkout'];
    }
    if (salesData?.paymentMethodAmounts?.length > 0) {
      return messages['booking.sidebar.status.checkout'];
    }
    return messages['checkout.status.un.paid'];
  };

  const clickUnpaidOrCheckout = () => {
    if (
      toPayAmount >
      salesData?.paymentMethodAmounts
        ?.map((data) => data?.amount)
        .reduce((a, b) => a + b, 0)
    ) {
      setOpenCheckoutUnpaidClicked(true);
    } else {
      refetchAddBoookingCheckout();
    }
  };

  return (
    <div className="cart--payment">
      <Row className="mx-0">
        <Col xs={12} className="cart--payment-label">
          <div className="text-center">{statusAfterAddPAymentMethod()}</div>
        </Col>
        <Col xs="4">
          <DropdownButton
            id="dropdown-item-button"
            title="..."
            className="booking-sidebar__action-empty"
            disabled={fetchingNewCheckout}
          >
            <Dropdown.Item
              as="button"
              onClick={() => {
                if (
                  toPayAmount >
                  salesData?.paymentMethodAmounts
                    ?.map((data) => data?.amount)
                    .reduce((a, b) => a + b, 0)
                ) {
                  return setOpenCheckoutUnpaidClicked(true);
                }
                return refetchAddBoookingCheckout();
              }}
            >
              {messages['checkout.status.un.paid']}
            </Dropdown.Item>
            <Dropdown.Item
              as="button"
              className="text-danger"
              onClick={() => {
                setOpenCancelSaleModal(true);
              }}
            >
              {messages['checkout.status.cancel.save']}
            </Dropdown.Item>
          </DropdownButton>
        </Col>
        <Col xs="8">
          <button
            type="button"
            disabled={fetchingNewCheckout}
            onClick={() => {
              if (!collectPhase) {
                return setCollectPhase(true);
              }
              return clickUnpaidOrCheckout();
            }}
            className="booking-sidebar__action-filled"
          >
            {!fetchingNewCheckout ? (
              renderCorrectName()
            ) : (
              <div className="spinner-border text-light" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            )}
          </button>
        </Col>
      </Row>
    </div>
  );
}
