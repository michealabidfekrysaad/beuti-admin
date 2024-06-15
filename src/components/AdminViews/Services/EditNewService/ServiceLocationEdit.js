/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash';
import { Row, Col } from 'react-bootstrap';
import RadioInputMUI from 'Shared/inputs/RadioInputMUI';

export default function ServiceLocationEdit({
  register,
  errors,
  watch,
  originalLocation,
  canchangeCall,
  fetchCanOrNot,
  setOriginalLocation,
  setSerLocation,
  serLocation,
  setcheckFirstTime,
  checkFirstTime,
  setValue,
}) {
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

  const checkForPackageBeforeChangeLocation = (val) => {
    if (!checkFirstTime && val !== serLocation) canchangeCall();
    if (checkFirstTime) setValue('serLocation', val);

    setSerLocation(val);
  };

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
        <Col sm={10} md={7}>
          <RadioInputMUI
            list={optionsList}
            value={watch('serLocation')}
            error={errors?.serLocation?.message}
            onChange={(event) =>
              checkForPackageBeforeChangeLocation(event?.target?.value)
            }
            checkedValue={serLocation}
            disabled={fetchCanOrNot}
          />
        </Col>
        <Col sm={2} md={5}>
          {fetchCanOrNot && <div className="loading"></div>}
        </Col>
        <Col
          xs={12}
          className="beuti-input__errormsg"
          style={{ position: 'relative', bottom: '0px' }}
        >
          {errors.serLocation?.message}
        </Col>
      </Row>
    </>
  );
}
