/* eslint-disable react/prop-types */
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Toggle from 'react-toggle';
import { useIntl } from 'react-intl';

export default function PackageOnlineBooking({ toggleOnline, setToggleOnline }) {
  const { messages } = useIntl();

  return (
    <>
      <Row className="pt-2">
        <Col xs={12} className="informationwizard__title">
          {messages['package.online.book.title']}
        </Col>
        <Col xs={12} className="informationwizard__subtitle">
          {messages['package.online.book.subtitle']}
        </Col>
      </Row>
      <Row className="pt-2 pb-2">
        <Col xs={12} className="mt-3">
          <div className="beuti-toggle">
            <Toggle
              id="packageOnline"
              defaultChecked={toggleOnline}
              icons={{
                unchecked: null,
              }}
              onChange={() => setToggleOnline(!toggleOnline)}
            />
            <label htmlFor="packageOnline">
              {messages['package.enable.booking.online']}
            </label>
          </div>
        </Col>
      </Row>
    </>
  );
}
