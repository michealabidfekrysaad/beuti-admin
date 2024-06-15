/* eslint-disable react/prop-types */
import React from 'react';
import { useIntl } from 'react-intl';
import { Row, Col, Image } from 'react-bootstrap';
import ServiceAutoCompelete from '../ServicesAutoCompelete';
import BeutiInput from '../../../../Shared/inputs/BeutiInput';

export default function ServiceNames({
  handleEnNameInput,
  setnameAR,
  nameAR,
  register,
  setSearchValue,
  searchValue,
  errors,
}) {
  const { messages } = useIntl();

  return (
    <>
      <Row className="informationwizard py-2">
        <Col xs={12} className="informationwizard__title">
          {messages['newService.title']}
        </Col>
        <Col xs={12} className="informationwizard__subtitle">
          {messages['newService.subtitle']}
        </Col>
      </Row>
      <Row className="pt-2">
        <Col lg="6" xs="12" className=" mb-2">
          <ServiceAutoCompelete
            handleEnNameInput={handleEnNameInput}
            handleArNameInput={(value) => setnameAR(value)}
            nameAr={nameAR}
            useFormRef={register(
              'serviceAr',
              {
                onChange: (e) => {
                  setnameAR(e.target.value);
                  setSearchValue(e.target.value);
                },
              },
              { shouldValidate: true },
            )}
            error={errors.serviceAr?.message}
            searchValue={searchValue}
          />
        </Col>
        <Col lg="6" xs="12" className=" mb-2">
          <BeutiInput
            label={`${messages['wizard.add.new.service.en.name']} *`}
            error={errors.serviceEn?.message && errors.serviceEn?.message}
            useFormRef={register('serviceEn')}
          />
        </Col>
      </Row>
    </>
  );
}
