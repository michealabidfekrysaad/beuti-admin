/* eslint-disable react/prop-types */
import React from 'react';
import { useIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import BeutiTextArea from 'Shared/inputs/BeutiTextArea';

export default function ServiceRequirements({ register, errors }) {
  const { messages } = useIntl();

  return (
    <>
      <Row className="pt-2">
        <Col xs={12} className="informationwizard__title">
          {messages['newService.requirement.title']}
        </Col>
        <Col xs={12} className="informationwizard__subtitle">
          {messages['newService.requirement.subtitle']}
        </Col>
      </Row>
      <Row className="pt-2 pb-2">
        <Col xs={12} md={6} className="mt-2 mb-2">
          <BeutiTextArea
            type="text"
            useFormRef={register('requireAr')}
            error={errors.requireAr?.message}
            note={messages['newService.description.note']}
            label={messages['newService.requirement.ar']}
          />
        </Col>
        <Col xs={12} md={6} className="mt-2 mb-2">
          <BeutiTextArea
            type="text"
            useFormRef={register('requireEn')}
            error={errors.requireEn?.message}
            note={messages['newService.description.note']}
            label={messages['newService.requirement.en']}
          />
        </Col>
      </Row>
    </>
  );
}
