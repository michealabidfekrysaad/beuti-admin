/* eslint-disable react/prop-types */
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import BeutiTextArea from 'Shared/inputs/BeutiTextArea';

export default function PackageDescription({ register, errors }) {
  const { messages } = useIntl();

  return (
    <Row className="pt-3">
      <Col xs={12} className="addPackage-title">
        {messages['package.description.title']}
      </Col>
      <Col xs={12} className="addPackage-subTitle">
        {messages['package.description.sub.title']}
      </Col>
      <Col xs={12} md={6} className="mb-2 pt-4">
        <BeutiTextArea
          type="text"
          useFormRef={register('descriptionAr')}
          error={errors.descriptionAr?.message}
          note={messages['newService.description.note']}
          label={messages['package.description.ar']}
        />
      </Col>
      <Col xs={12} md={6} className="mb-2 pt-4">
        <BeutiTextArea
          type="text"
          useFormRef={register('descriptionEn')}
          error={errors.descriptionEn?.message}
          note={messages['newService.description.note']}
          label={messages['package.description.en']}
        />
      </Col>
    </Row>
  );
}
