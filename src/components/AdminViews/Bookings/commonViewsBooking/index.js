import React from 'react';
import { useIntl } from 'react-intl';
import { statusColorForWord } from 'functions/statusColor';
import { Col, Row } from 'react-bootstrap';

export default function CircleContainer() {
  const { messages, locale } = useIntl();

  return (
    <>
      <Row className="color-guide ">
        <Col xs="auto" className="color-guide__closed mx-3">
          {messages['change.to.closed']}
        </Col>
        <Col xs="auto" className="color-guide__confirmed">
          {messages['change.to.confirmed']}
        </Col>
        <Col xs="auto" className="color-guide__pending mx-3">
          {messages['change.to.pending']}
        </Col>
        <Col xs="auto" className="color-guide__cancelled">
          {messages['change.to.cancelled']}
        </Col>
      </Row>
    </>
  );
}
