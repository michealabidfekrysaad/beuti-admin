/* eslint-disable  */
import React from 'react';
import { Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
const NoShowActions = ({ actionHashMap, setOpenUnDontShowModal, setOpenInvoice }) => {
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
      <Col xs={`${!!actionHashMap[2] ? 6 : 12} `} className="px-2">
        <button
          type="button"
          className="booking-sidebar__action-filled"
          onClick={() => setOpenUnDontShowModal(true)}
        >
          {!!actionHashMap[7] && messages['booking.sidebar.status.undonoshow']}
        </button>
      </Col>
    </>
  );
};

NoShowActions.propTypes = {
  actionHashMap: PropTypes.object,
  setOpenUnDontShowModal: PropTypes.func,
  setOpenInvoice: PropTypes.func,
};

export default NoShowActions;
