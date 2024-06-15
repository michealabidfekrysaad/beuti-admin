import React, { useState } from 'react';
import { Row, Col, Image } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import BeutiInput from 'Shared/inputs/BeutiInput';
import PropTypes from 'prop-types';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import UploadImage from 'components/shared/UploadImage';
import { FormHelperText } from '@material-ui/core';
const ProductDetails = ({
  register,
  errors,
  setValue,
  watch,
  errorUploadImg,
  setErrorUploadImg,
}) => {
  const { messages } = useIntl();
  return (
    <Row>
      <Col lg={8} md={6} xs={12} className="mb-5">
        <h3 className="settings__section-title">{messages['products.details.title']}</h3>
        <p className="settings__section-description">
          {messages['products.details.description']}
        </p>
      </Col>
      <Col lg={8} md={8} xs={12}>
        <Row className="mb-4">
          <Col xs="6" className="mb-4">
            <BeutiInput
              type="text"
              label={messages['products.input.nameAr']}
              useFormRef={register('nameAR')}
              error={errors?.nameAR?.message}
            />
          </Col>
          <Col xs="6">
            <BeutiInput
              type="text"
              label={messages['products.input.nameEn']}
              useFormRef={register('nameEN')}
              error={errors?.nameEN?.message}
            />
          </Col>
          <Col xs="12" className="mb-4">
            <BeutiInput
              type="text"
              label={messages['products.input.barcode']}
              useFormRef={register('parcode')}
              error={errors?.parcode?.message}
            />
          </Col>
        </Row>
      </Col>
      <Col lg="auto" xs={12}>
        <div className="products-edit__image">
          <Image src={watch('image') || toAbsoluteUrl('/productplaceholder.png')} />
          <UploadImage
            onDone={(e) => setValue('image', e)}
            changing
            text={messages['common.upload']}
            changeImgText={messages['common.change']}
            maxSizeUpload="3000"
            setErrorMessage={setErrorUploadImg}
            inputName={messages['products.productImage']}
          />
          <FormHelperText id="component-error-text" error>
            {errorUploadImg}
          </FormHelperText>
        </div>
      </Col>
    </Row>
  );
};
ProductDetails.propTypes = {
  register: PropTypes.func,
  watch: PropTypes.func,
  setValue: PropTypes.func,
  errorUploadImg: PropTypes.bool,
  setErrorUploadImg: PropTypes.func,
  errors: PropTypes.object,
};

export default ProductDetails;
