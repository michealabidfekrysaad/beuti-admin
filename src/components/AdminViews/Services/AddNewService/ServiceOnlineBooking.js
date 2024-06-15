/* eslint-disable react/prop-types */
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Toggle from 'react-toggle';
import { useIntl } from 'react-intl';

export default function ServiceOnlineBooking({
  toggleCustomerApp,
  setToggleCustomerApp,
}) {
  const { messages } = useIntl();

  return (
    <>
      <Row className="pt-2">
        <Col xs={12} className="informationwizard__title">
          {messages['newService.online.book.title']}
        </Col>
        <Col xs={12} className="informationwizard__subtitle">
          {messages['newService.online.book.subtitle']}
        </Col>
      </Row>
      <Row className="pt-2 pb-2">
        <Col xs={12} className="mt-3">
          <div className="beuti-toggle">
            <Toggle
              id="customerApp"
              defaultChecked={toggleCustomerApp}
              icons={{
                unchecked: null,
              }}
              onChange={() => setToggleCustomerApp(!toggleCustomerApp)}
            />
            <label htmlFor="customerApp">
              {messages['newService.enable.booking.online']}
            </label>
          </div>
        </Col>
      </Row>
    </>
  );
}
