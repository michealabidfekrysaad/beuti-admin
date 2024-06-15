/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React, { useEffect, useMemo } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import RadioInputMUI from 'Shared/inputs/RadioInputMUI';

export default function PackageLocations({
  register,
  errors,
  watch,
  setValue,
  getValues,
  control,
}) {
  const { messages } = useIntl();
  const optionsList = useMemo(
    () => [
      {
        id: 1,
        label: messages['package.location.home'],
      },
      {
        id: 2,
        label: messages['package.location.salon'],
      },
      {
        id: 3,
        label: messages['package.location.both'],
      },
    ],
    [],
  );

  useEffect(() => {
    if (watch('packageLocation')) {
      setValue('servicesOptions', []);
    }
  }, [watch('packageLocation')]);

  return (
    <>
      <Row className="pt-3">
        <Col xs={12} className="addPackage-title">
          {messages['package.location.title']}
        </Col>
        <Col xs={12} className="addPackage-subTitle">
          {messages['package.location.sub.title']}
        </Col>
      </Row>
      <Row className="pt-2 pb-4">
        <Col sm={12} md={7}>
          <RadioInputMUI
            list={optionsList}
            control={control}
            name="packageLocation"
            value="2"
            error={errors?.packageLocation?.message}
          />
        </Col>
      </Row>
    </>
  );
}
