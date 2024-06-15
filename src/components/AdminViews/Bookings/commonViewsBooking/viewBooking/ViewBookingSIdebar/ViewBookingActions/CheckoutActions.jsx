import React from 'react';
import { Col, DropdownButton, Dropdown } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Routes } from 'constants/Routes';
import { useHistory } from 'react-router-dom';
const CheckoutActions = ({
  actionHashMap,
  cancelBookingCall,
  setOpenDontShowModal,
  addedSelectedPayMethod,
  toPayAmount,
  setOpenCheckoutUnpaidClicked,
  refetchAddBoookingCheckout,
  setOpenCheckoutCancel,
  fetchBreakDownRes,
  fetchGetCheckoutBooking,
}) => {
  const { messages } = useIntl();

  const renderCorrectNameDependOnPaymentSelected = () => {
    if (+toPayAmount === 0) {
      return messages['booking.sidebar.status.checkout'];
    }
    if (addedSelectedPayMethod?.length > 0) {
      return messages['booking.sidebar.status.checkout'];
    }
    return messages['checkout.status.un.paid'];
  };
  const clickUnpaidOrCheckout = () => {
    if (
      toPayAmount >
      addedSelectedPayMethod?.map((data) => data?.amount).reduce((a, b) => a + b, 0)
    ) {
      setOpenCheckoutUnpaidClicked(true);
    } else {
      refetchAddBoookingCheckout();
    }
  };
  const statusAfterAddPAymentMethod = () => {
    const sumPaymentMethodChoosen = addedSelectedPayMethod
      ?.map((data) => data?.amount)
      .reduce((a, b) => a + b, 0);

    if (fetchBreakDownRes) {
      return <div className="spinner-border spinner-border-sm mb-1" />;
    }

    if (+toPayAmount === 0) {
      return (
        <div className="change--pay">{messages['checkout.modal.no.change.given']}</div>
      );
    }

    if (addedSelectedPayMethod?.length > 0 && toPayAmount > 0) {
      return (
        <>
          <div className="d-flex justify-content-between change--pay">
            <div>{messages['checkout.modal.change.given']}</div>
            <div>
              {Math.abs(toPayAmount)} {messages['common.currency']}
            </div>
          </div>
        </>
      );
    }
    if (
      !addedSelectedPayMethod?.length &&
      toPayAmount > sumPaymentMethodChoosen &&
      toPayAmount !== 0
    ) {
      return (
        <>
          <div className="d-flex justify-content-between change--pay">
            <div>{messages['checkout.modal.amount.pay']}</div>
            <div>
              {Math.abs(toPayAmount)} {messages['common.currency']}
            </div>
          </div>
        </>
      );
    }
    if (!addedSelectedPayMethod?.length && toPayAmount < 0) {
      return (
        <>
          <div className="d-flex justify-content-between change--pay">
            <div>{messages['checkout.modal.amount.refunded']}</div>
            <div>
              {Math.abs(toPayAmount)} {messages['common.currency']}
            </div>
          </div>
        </>
      );
    }
    if (addedSelectedPayMethod?.length > 0 && toPayAmount > 0) {
      return (
        <>
          <div className="d-flex justify-content-between change--pay">
            <div>{messages['checkout.modal.change.given']}</div>
            <div>
              {Math.abs(toPayAmount)} {messages['common.currency']}
            </div>
          </div>
        </>
      );
    }
    if (toPayAmount < sumPaymentMethodChoosen && toPayAmount > 0) {
      return (
        <>
          <div className="d-flex justify-content-between change--pay">
            <div>{messages['checkout.modal.amount.pay']}</div>
            <div>
              {Math.abs(toPayAmount)} {messages['common.currency']}
            </div>
          </div>
        </>
      );
    }
    if (toPayAmount < sumPaymentMethodChoosen && toPayAmount < 0) {
      return (
        <>
          <div className="d-flex justify-content-between change--pay">
            <div>{messages['checkout.modal.change.given']}</div>
            <div>
              {Math.abs(toPayAmount)} {messages['common.currency']}
            </div>
          </div>
        </>
      );
    }
    return null;
  };
  return (
    <>
      <Col xs={12} className="mb-2 px-2">
        <div>{statusAfterAddPAymentMethod()}</div>
      </Col>
      <Col xs="4" className="px-2">
        <DropdownButton
          id="dropdown-item-button"
          title="..."
          className="booking-sidebar__action-empty"
          disabled={fetchBreakDownRes || fetchGetCheckoutBooking}
        >
          <Dropdown.Item
            as="button"
            onClick={() => {
              if (
                toPayAmount >
                addedSelectedPayMethod
                  ?.map((data) => data?.amount)
                  .reduce((a, b) => a + b, 0)
              ) {
                setOpenCheckoutUnpaidClicked(true);
              } else {
                refetchAddBoookingCheckout();
              }
            }}
          >
            {messages['checkout.status.un.paid']}
          </Dropdown.Item>
          <Dropdown.Item
            as="button"
            className="text-danger"
            onClick={() => {
              setOpenCheckoutCancel(true);
            }}
          >
            {messages['checkout.status.cancel.save']}
          </Dropdown.Item>
        </DropdownButton>
      </Col>
      <Col xs="8">
        <button
          type="button"
          onClick={() => clickUnpaidOrCheckout()}
          className="booking-sidebar__action-filled"
          disabled={fetchBreakDownRes || fetchGetCheckoutBooking}
        >
          {renderCorrectNameDependOnPaymentSelected()}
        </button>
      </Col>
    </>
  );
};

CheckoutActions.propTypes = {
  actionHashMap: PropTypes.object,
  cancelBookingCall: PropTypes.func,
  setOpenDontShowModal: PropTypes.func,
  addedSelectedPayMethod: PropTypes.array,
  toPayAmount: PropTypes.number,
  setOpenCheckoutUnpaidClicked: PropTypes.func,
  refetchAddBoookingCheckout: PropTypes.func,
  setOpenCheckoutCancel: PropTypes.func,
  fetchGetCheckoutBooking: PropTypes.func,
  fetchBreakDownRes: PropTypes.func,
};

export default CheckoutActions;
