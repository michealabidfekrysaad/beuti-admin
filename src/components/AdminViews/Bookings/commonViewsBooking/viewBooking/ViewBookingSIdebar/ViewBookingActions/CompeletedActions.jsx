/* eslint-disable  */

import React from 'react';
import { Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
const CompeletedActions = ({
  actionHashMap,
  setOpenInvoice,
  redirectToCheckout,
  showCheckoutBtn = 'true',
}) => {
  const { messages } = useIntl();
  return (
    <>
      {!!actionHashMap[2] && (
        <Col xs={`${showCheckoutBtn ? 6 : 12} `} className="px-2">
          <button
            type="button"
            className="booking-sidebar__action-empty"
            onClick={() => setOpenInvoice(true)}
          >
            {messages['booking.sidebar.status.viewinvoice']}
          </button>
        </Col>
      )}
      {/* show checkout if it is partially paid only not fully paid */}
      {showCheckoutBtn && (
        <Col xs="6" className="px-2">
          <button
            type="button"
            className="booking-sidebar__action-filled"
            onClick={() => redirectToCheckout()}
          >
            {!!actionHashMap[2] && messages['booking.sidebar.status.checkout']}
          </button>
        </Col>
      )}
    </>
  );
};

CompeletedActions.propTypes = {
  actionHashMap: PropTypes.object,
  setOpenInvoice: PropTypes.func,
  redirectToCheckout: PropTypes.func,
};

export default CompeletedActions;
