import React from 'react';
import { useIntl } from 'react-intl';
import { Col, Row } from 'react-bootstrap';
const NoShifts = () => {
  const { messages } = useIntl();
  return (
    <Row className="informationwizard__box-day--noshift">
      <Col xs="auto" className=" flex-grow-1 text-center">
        {messages['rw.bussinessHours.noshifts']}
      </Col>
      <Col xs="auto">
        <div className="informationwizard__box-day--shift-action" />
      </Col>
    </Row>
  );
};

export default NoShifts;
