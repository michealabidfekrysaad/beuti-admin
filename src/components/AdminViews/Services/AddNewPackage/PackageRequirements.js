/* eslint-disable react/prop-types */
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import BeutiTextArea from 'Shared/inputs/BeutiTextArea';

export default function PackageRequirements({ register, errors }) {
  const { messages } = useIntl();

  return (
    <Row className="pt-3">
      <Col xs={12} className="addPackage-title">
        {messages['package.requirment.title']}
      </Col>
      <Col xs={12} className="addPackage-subTitle">
        {messages['package.requirment.sub.title']}
      </Col>
      <Col xs={12} md={6} className="mb-2 pt-4">
        <BeutiTextArea
          type="text"
          useFormRef={register('requirementsAr')}
          error={errors.requirementsAr?.message}
          note={messages['newService.description.note']}
          label={messages['package.requirment.ar']}
        />
      </Col>
      <Col xs={12} md={6} className="mb-2 pt-4">
        <BeutiTextArea
          type="text"
          useFormRef={register('requirementsEn')}
          error={errors.requirementsEn?.message}
          note={messages['newService.description.note']}
          label={messages['package.requirment.en']}
        />
      </Col>
    </Row>
  );
}
