/* eslint-disable react/prop-types */
import React from 'react';
import { useIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import BeutiTextArea from 'Shared/inputs/BeutiTextArea';

export default function ServiceDescription({ register, errors }) {
  const { messages } = useIntl();

  return (
    <>
      <Row className="pt-2">
        <Col xs={12} className="informationwizard__title">
          {messages['newService.description.title']}
        </Col>
        <Col xs={12} className="informationwizard__subtitle">
          {messages['newService.description.subtitle']}
        </Col>
      </Row>
      <Row className="pt-2 pb-2">
        <Col md={6} xs={12} className="mt-2 mb-2">
          <BeutiTextArea
            type="text"
            useFormRef={register('descrAr')}
            error={errors.descrAr?.message}
            note={messages['newService.description.note']}
            label={messages['newService.description.ar']}
          />
        </Col>
        <Col md={6} xs={12} className="mt-2 mb-2">
          <BeutiTextArea
            type="text"
            useFormRef={register('descrEn')}
            error={errors.descrEn?.message}
            note={messages['newService.description.note']}
            label={messages['newService.description.en']}
          />
        </Col>
      </Row>
    </>
  );
}
