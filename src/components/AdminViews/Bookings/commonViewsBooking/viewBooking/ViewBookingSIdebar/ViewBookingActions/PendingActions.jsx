import React from 'react';
import { Col, DropdownButton, Dropdown } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
const PendingActions = ({
  actionHashMap,
  confirmBookingCall,
  cancelBookingCall,
  setOpenDontShowModal,
  setOpenInvoice,
  redirectToEditBooking,
}) => {
  const { messages } = useIntl();

  return (
    <>
      <Col xs="6" className="px-2">
        <DropdownButton
          id="dropdown-item-button"
          title={messages['booking.sidebar.more.options']}
          className="booking-sidebar__action-empty"
        >
          {!!actionHashMap[3] && (
            <Dropdown.Item as="button" onClick={() => redirectToEditBooking()}>
              {messages['booking.sidebar.status.edit']}
            </Dropdown.Item>
          )}
          {!!actionHashMap[2] && (
            <Dropdown.Item as="button" onClick={() => setOpenInvoice(true)}>
              {messages['booking.sidebar.status.viewinvoice']}
            </Dropdown.Item>
          )}
          {!!actionHashMap[5] && (
            <Dropdown.Item
              as="button"
              className="text-danger"
              onClick={() => setOpenDontShowModal(true)}
            >
              {messages['booking.sidebar.status.noshow']}
            </Dropdown.Item>
          )}
          {!!actionHashMap[4] && (
            <Dropdown.Item
              as="button"
              className="text-danger"
              onClick={() => cancelBookingCall(true)}
            >
              {messages['booking.sidebar.status.cancelbooking']}
            </Dropdown.Item>
          )}
        </DropdownButton>
      </Col>
      <Col xs="6" className="px-2">
        <button
          type="button"
          className="booking-sidebar__action-filled"
          onClick={() => confirmBookingCall(true)}
        >
          {!!actionHashMap[6] && messages['booking.sidebar.status.confirm']}
        </button>
      </Col>
    </>
  );
};

PendingActions.propTypes = {
  actionHashMap: PropTypes.object,
  confirmBookingCall: PropTypes.func,
  cancelBookingCall: PropTypes.func,
  setOpenDontShowModal: PropTypes.func,
  setOpenInvoice: PropTypes.func,
  redirectToEditBooking: PropTypes.func,
};

export default PendingActions;