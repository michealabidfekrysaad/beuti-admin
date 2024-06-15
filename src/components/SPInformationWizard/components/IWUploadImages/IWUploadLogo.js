import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Col } from 'react-bootstrap';
import UploadImage from 'components/shared/UploadImage';
import { toAbsoluteUrl, handleImageString } from 'functions/toAbsoluteUrl';
import { toast } from 'react-toastify';
import { CallAPI } from '../../../../utils/API/APIConfig';
import { LOGO_GET_EP, LOGO_SET_EP } from '../../../../utils/API/EndPoints/ImageEP';

const IWUploadLogo = () => {
  const { messages } = useIntl();
  const [logo, setLogo] = useState('');
  const [newLogo, setNewLogo] = useState('');

  const { refetch: getLogoCall, isFetching: gettingLoader } = CallAPI({
    name: 'getLogo',
    url: LOGO_GET_EP,
    onSuccess: (data) => data?.data?.data && setLogo(data?.data?.data?.icon),
    enabled: true,
  });
  // Add Images
  const { refetch: addImageCall, isFetching: addLoader } = CallAPI({
    name: 'setLogo',
    url: LOGO_SET_EP,
    method: 'put',
    body: {
      base64Icon: handleImageString(newLogo),
    },
    onSuccess: (data) => {
      if (data?.data?.data) {
        getLogoCall(true);
      }
    },
  });
  useEffect(() => {
    if (newLogo) {
      addImageCall(true);
    }
  }, [newLogo]);
  return (
    <>
      <Col xs="6" className="informationwizard__box-logo--text">
        <h2>{messages['rw.uploadimages.logo.title']}</h2>
        <p>{messages['rw.uploadimages.logo.subtitle']}</p>
      </Col>
      <Col xs="auto" className="informationwizard__box-logo--image">
        <div className="informationwizard__box-logo--image-result">
          <div
            className="div-image"
            style={{
              backgroundImage: `url(${logo || toAbsoluteUrl('/logoplaceholder.png')})`,
            }}
          >
            {(gettingLoader || addLoader) && (
              <div className="spinner-border spinner-border-sm mb-1" role="status" />
            )}
          </div>
        </div>
        <UploadImage
          onDone={setNewLogo}
          className="informationwizard__box-logo--image-upload"
          changing
          text={messages['common.upload']}
          changeImgText={messages['common.change']}
          maxSizeUpload="500"
          setErrorMessage={(err) => toast.error(err)}
        />
      </Col>
    </>
  );
};

export default IWUploadLogo;
