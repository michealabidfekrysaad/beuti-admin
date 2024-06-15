import React from 'react';
import { Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
const CanceledActions = ({ actionHashMap, setOpenInvoice }) => {
  const { messages } = useIntl();

  return (
    <>
      {!!actionHashMap[2] && (
        <Col xs="12 px-2">
          <button
            type="button"
            className="booking-sidebar__action-empty"
            onClick={() => setOpenInvoice(true)}
          >
            {messages['booking.sidebar.status.viewinvoice']}
          </button>
        </Col>
      )}
    </>
  );
};

CanceledActions.propTypes = {
  actionHashMap: PropTypes.object,
  setOpenInvoice: PropTypes.func,
};

export default CanceledActions;
