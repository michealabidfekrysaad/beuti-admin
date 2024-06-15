import React, { useState } from 'react';
import { Row, Col, Image } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import BeutiInput from 'Shared/inputs/BeutiInput';
import PropTypes from 'prop-types';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import UploadImage from 'components/shared/UploadImage';
import { FormHelperText } from '@material-ui/core';
const EmployeeDetails = ({ register, errors, setValue, watch }) => {
  const { messages } = useIntl();
  const [errorUploadImg, setErrorUploadImg] = useState(false);
  return (
    <Row className="align-items-end">
      <Col lg={8} md={6} xs={12} className="mb-5">
        <h3 className="settings__section-title">
          {messages['setting.employee.details.title']}
        </h3>
        <p className="settings__section-description">
          {messages['setting.employee.details.description']}
        </p>
      </Col>
      <Col lg={8} md={8} xs={12}>
        <Row>
          <Col xs="6" className="mb-5">
            <BeutiInput
              type="text"
              label={messages['setting.employee.input.nameAr']}
              useFormRef={register('employee.nameAr')}
              error={errors?.employee?.nameAr?.message}
            />
          </Col>
          <Col xs="6">
            <BeutiInput
              type="text"
              label={messages['setting.employee.input.nameEn']}
              useFormRef={register('employee.nameEn')}
              error={errors?.employee?.nameEn?.message}
            />
          </Col>
          <Col xs="6" className="mb-4">
            <BeutiInput
              type="text"
              label={messages['setting.employee.input.titleAr']}
              useFormRef={register('employee.staffTItleAr')}
              error={errors?.employee?.staffTItleAr?.message}
            />
          </Col>
          <Col xs="6">
            <BeutiInput
              type="text"
              label={messages['setting.employee.input.titleEn']}
              useFormRef={register('employee.staffTItleEn')}
              error={errors?.employee?.staffTItleEn?.message}
            />
          </Col>
        </Row>
      </Col>
      <Col lg="4" xs={12} className="d-flex">
        <div className="employee-edit__image pb-4">
          <Image src={watch('employee.image') || toAbsoluteUrl('/Avatar.png')} />
          <UploadImage
            onDone={(e) => setValue('employee.image', e)}
            changing
            text={messages['common.upload']}
            changeImgText={messages['common.change']}
            maxSizeUpload="3000"
            setErrorMessage={setErrorUploadImg}
          />
          <FormHelperText id="component-error-text" error>
            {errorUploadImg}
          </FormHelperText>
        </div>
      </Col>
    </Row>
  );
};
EmployeeDetails.propTypes = {
  register: PropTypes.func,
  watch: PropTypes.func,
  setValue: PropTypes.func,

  errors: PropTypes.object,
};

export default EmployeeDetails;
