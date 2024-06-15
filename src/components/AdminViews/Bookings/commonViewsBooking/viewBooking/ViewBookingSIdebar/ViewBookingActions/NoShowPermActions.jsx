/* eslint-disable  */
import React from 'react';
import { Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
const NoShowPemaActions = ({ actionHashMap, setOpenRefundModal, setOpenInvoice }) => {
  const { messages } = useIntl();

  return (
    <>
      {!!actionHashMap[2] && (
        <Col xs="6" className="px-2">
          <button
            type="button"
            className="booking-sidebar__action-empty"
            onClick={() => setOpenInvoice(true)}
          >
            {messages['booking.sidebar.status.viewinvoice']}
          </button>
        </Col>
      )}
      {!!actionHashMap[8] && (
        <Col xs={`${!!actionHashMap[2] ? 6 : 12} `} className="px-2">
          <button
            type="button"
            className="booking-sidebar__action-filled"
            onClick={() => setOpenRefundModal(true)}
          >
            {messages['booking.sidebar.status.refund']}
          </button>
        </Col>
      )}
    </>
  );
};

NoShowPemaActions.propTypes = {
  actionHashMap: PropTypes.object,
  setOpenInvoice: PropTypes.func,
  setOpenRefundModal: PropTypes.func,
};

export default NoShowPemaActions;
