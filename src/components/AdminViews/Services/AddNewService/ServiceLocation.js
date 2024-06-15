/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import RadioInputMUI from 'Shared/inputs/RadioInputMUI';

export default function ServiceLocation({ register, errors, control }) {
  const { messages } = useIntl();
  const optionsList = useMemo(
    () => [
      {
        id: 1,
        label: messages['add.service.at.home'],
      },
      {
        id: 2,
        label: messages['add.service.at.salon'],
      },
      {
        id: 3,
        label: messages['add.service.at.both'],
      },
    ],
    [],
  );
  return (
    <>
      <Row className="pt-2">
        <Col xs={12} className="informationwizard__title">
          {messages['newService.location.title']}
        </Col>
        <Col xs={12} className="informationwizard__subtitle">
          {messages['newService.location.subtitle']}
        </Col>
      </Row>
      <Row className="pt-2 pb-2">
        <Col sm={12} md={7}>
          <RadioInputMUI
            list={optionsList}
            control={control}
            name="serLocation"
            value="3"
            error={errors?.serLocation?.message}
          />
        </Col>
      </Row>
    </>
  );
}
