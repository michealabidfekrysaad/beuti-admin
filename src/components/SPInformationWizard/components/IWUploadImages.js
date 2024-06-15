import React, { useEffect, useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import { handleImageString } from 'functions/toAbsoluteUrl';
import { CallAPI } from 'utils/API/APIConfig';
import { toast } from 'react-toastify';
import { Routes } from 'constants/Routes';
import { useHistory } from 'react-router-dom';
import IWImageItem from './IWUploadImages/IWImageItem';
import IWUploadAndLinkInstagram from './IWUploadImages/IWUploadAndLinkInstagram';
import {
  IMAGE_UPLOAD_SP_EP,
  IMAGE_LIST_SP_EP,
  SP_HAS_IMAGES_EP,
} from '../../../utils/API/EndPoints/ImageEP';
import IWUploadLogo from './IWUploadImages/IWUploadLogo';

export default function IWUploadImages() {
  const { messages } = useIntl();
  const history = useHistory();
  const [newImage, setNewImage] = useState('');
  // Get Images
  const { refetch: getImagesCall, data: imagesList } = CallAPI({
    name: 'GetAllImages',
    url: IMAGE_LIST_SP_EP,
    select: (data) => data?.data?.data?.list,
    query: { includeExternal: false },
    enabled: true,
  });
  // Add Images
  const { refetch: addImageCall, isFetching: addImageLoading } = CallAPI({
    name: 'AddImage',
    url: IMAGE_UPLOAD_SP_EP,
    method: 'post',
    retry: 0,
    body: {
      image: handleImageString(newImage),
      isDefault: false,
    },
    onSuccess: (data) => {
      if (data?.data?.data) {
        setNewImage('');
        getImagesCall(true);
      }
    },
  });
  // Check if there is images
  const { refetch: hasImagesCall, isFetching: hasImageLoading } = CallAPI({
    name: 'hasImages',
    url: SP_HAS_IMAGES_EP,
    onSuccess: (res) =>
      res?.data?.data?.data
        ? history.push('/')
        : toast.error(messages['rw.uploadimages.gallery.instagram.error']),
  });

  useEffect(() => {
    if (newImage) {
      addImageCall(true);
    }
  }, [newImage]);

  return (
    <>
      <Row className="informationwizard">
        <Col xs={12} className="informationwizard__title">
          {messages['rw.uploadimages.title']}
        </Col>
        <Col xs={12} className="informationwizard__subtitle">
          {messages['rw.uploadimages.subtitle']}
        </Col>
        <Col xs={12} className="informationwizard__box">
          <Row className="informationwizard__box-logo">
            <IWUploadLogo />
          </Row>
          <Row className="informationwizard__box-gallery">
            <Col xs="6" className="informationwizard__box-gallery--text">
              <h2>{messages['rw.uploadimages.gallery.title']}</h2>
              <p>{messages['rw.uploadimages.gallery.subtitle']}</p>
              <p className="my-4">{messages['rw.uploadimages.gallery.manually']}</p>
            </Col>
            <Col xs="auto" className="informationwizard__box-gallery--actions">
              <IWUploadAndLinkInstagram setNewImage={setNewImage} />
            </Col>
            <Col xs="12" className="informationwizard__box-gallery--list">
              <Row>
                <Col xs="12" className="informationwizard__box-gallery--list-title">
                  <FormattedMessage
                    id="rw.uploadimages.gallery.uploaded"
                    values={{ count: imagesList?.length || 0 }}
                  />
                </Col>
                {imagesList?.map((image) => (
                  <Col
                    xs="6"
                    className="informationwizard__box-gallery--list-item"
                    key={image.image}
                  >
                    <IWImageItem image={image} getImagesCall={getImagesCall} />
                  </Col>
                ))}
                {addImageLoading && (
                  <Col xs="6" className="informationwizard__box-gallery--list-item">
                    <div className="iwupload-item h-100 justify-content-center">
                      <div
                        className="spinner-border spinner-border-sm mb-1"
                        role="status"
                      />
                    </div>
                  </Col>
                )}
              </Row>
            </Col>
          </Row>
        </Col>
        <Col className="text-center my-5" xs="12">
          <button
            type="button"
            onClick={() => history.push(Routes.spinformationwizardStepFour)}
            className="informationwizard__previous"
          >
            {messages['common.previous']}
          </button>
          <button
            type="button"
            onClick={() => hasImagesCall()}
            className="informationwizard__submit"
            disabled={hasImageLoading || addImageLoading}
          >
            {messages['common.finish']}
          </button>
        </Col>
      </Row>
    </>
  );
}
