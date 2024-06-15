import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Col, Image } from 'react-bootstrap';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import UploadImage from 'components/shared/UploadImage';
import { FormHelperText } from '@material-ui/core';
import PropTypes from 'prop-types';
const CABannerImage = ({ setValue, watch, setErrorUploadImg, errorUploadImg }) => {
  const { messages } = useIntl();
  return (
    <Col lg="auto" xs={12}>
      <div className="cabanner_image">
        <Image src={watch('image') || toAbsoluteUrl('/noBranchImg.png')} />
        <UploadImage
          onDone={(e) => setValue('image', e)}
          changing
          text={messages['common.upload']}
          changeImgText={messages['common.change']}
          maxSizeUpload="4000"
          setErrorMessage={setErrorUploadImg}
        />
        <FormHelperText id="component-error-text" error>
          {errorUploadImg}
        </FormHelperText>
      </div>
    </Col>
  );
};

CABannerImage.propTypes = {
  watch: PropTypes.func,
  setValue: PropTypes.func,
  setErrorUploadImg: PropTypes.func,
  errorUploadImg: PropTypes.string,
};

export default CABannerImage;
