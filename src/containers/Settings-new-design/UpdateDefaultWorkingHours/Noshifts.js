import React from 'react';
import { useIntl } from 'react-intl';
import { Col, Row } from 'react-bootstrap';
const NoShifts = () => {
  const { messages } = useIntl();
  return (
    <Row className="informationwizard__allDays-day--noshift">
      <Col xs="auto" className="informationwizard__allDays-day--noshift_closed">
        {messages['workingHours.no.shifts']}
      </Col>
      <Col xs="auto">
        <div className="informationwizard__allDays-day--shift-action" />
      </Col>
    </Row>
  );
};

export default NoShifts;
