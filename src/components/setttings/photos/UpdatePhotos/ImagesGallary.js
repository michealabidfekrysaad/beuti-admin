/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Col, Row } from 'react-bootstrap';
import { IMAGE_UPLOAD_SP_EP } from 'utils/API/EndPoints/ImageEP';
import { handleImageString } from 'functions/toAbsoluteUrl';
import { toast } from 'react-toastify';
import UploadedPhoto from './UploadedPhoto';
import { CallAPI } from '../../../../utils/API/APIConfig';
import UploadImage from '../../../shared/UploadImage';
import ImportFromInstagram from './ImportFromInstagram';

const ImagesGallary = ({ images, setAllImages, callImages, dimmed }) => {
  const { messages } = useIntl();
  const [newImage, setNewImage] = useState('');

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
        callImages(true);
      }
    },
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });
  useEffect(() => {
    if (newImage) {
      addImageCall(true);
    }
  }, [newImage]);

  return (
    <>
      <Col xs="12">
        <Row className="align-items-center justify-content-between">
          <Col xs="6" className="updatephotos__featured--text">
            <h2>{messages['setting.photos.gallary.title']}</h2>
            <p>{messages['setting.photos.gallary.subtitle']}</p>
          </Col>
          <Col xs="auto" className="updatephotos__featured--upload">
            <UploadImage
              className="updatephotos__featured--upload-manually"
              onDone={setNewImage}
              maxSizeUpload="3000"
              setErrorMessage={(err) => toast.error(err)}
              loading={addImageLoading}
              text={messages['setting.photos.gallary.upload']}
            />
            <ImportFromInstagram callGallaryImages={callImages} />
          </Col>
        </Row>
      </Col>

      <Col xs="12">
        <section className="updatephotos__featured--list">
          {images?.map((image) => (
            <UploadedPhoto
              image={image}
              key={image.id}
              setAllImages={setAllImages}
              images={images}
              dimmed={dimmed}
              callImages={callImages}
            />
          ))}
        </section>
      </Col>
    </>
  );
};

export default ImagesGallary;
