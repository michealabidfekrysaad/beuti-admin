import React, { useEffect, useState } from 'react';
import { CircularProgress, FormControl } from '@material-ui/core';
import { useIntl } from 'react-intl';
import CloseBackIcon from 'components/shared/CloseBackIcon';
import { Card, Row, Col } from 'react-bootstrap';

export default function SettingsImage() {
  const { messages, locale } = useIntl();
  const [staredImage, setStaredImage] = useState(false);
  const [imageChanged, setImageChanged] = useState(false);
  const [photoError, setPhotoError] = useState(false);
  const [imgBase64, setImgBase64] = useState();
  const [selectedImage, setSelectedImage] = useState();

  const [colorChange, setColorchange] = useState(false);
  const changeNavbarColor = () => {
    if (window.scrollY >= 80) {
      setColorchange(true);
    } else {
      setColorchange(false);
    }
  };
  useEffect(() => {
    window.addEventListener('scroll', changeNavbarColor);
  });

  const imageChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageChanged(true);
      const base64 = await convertBase64(e.target.files[0]);
      setImgBase64(base64);
      setSelectedImage(e.target.files[0]);
      setPhotoError(false);
    } else {
      setPhotoError(true);
    }
  };
  const convertBase64 = (file) =>
    new Promise((resolve) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
    });

  return (
    <>
      <div className={`close-save-nav ${colorChange ? 'nav__white' : ''}`}>
        <div className="d-flex justify-content-between">
          <div>
            <FormControl component="fieldset" fullWidth>
              <button
                type="button"
                className="btn btn-primary"
                // onClick={() => {
                //   ClearLocalStorage('serviceIDFromSameLevel');
                //   setSubmit(true);
                // }}
              >
                {false ? (
                  <CircularProgress size={24} style={{ color: '#fff' }} />
                ) : (
                  messages['common.save']
                )}
              </button>
            </FormControl>
          </div>

          <CloseBackIcon />
        </div>
      </div>
      <Card className="mb-5 p-5 card-special">
        <Card.Header>
          <div className="title"> {messages['admin.settings.general.images.header']}</div>
        </Card.Header>
        <Card.Body>
          <Row className="container-box">
            <Col xs={12}>
              <p className="container-box__controllers--header">
                {messages['admin.settings.general.images.add.new']}
              </p>
            </Col>
            <Col xs={12} lg={6} className="d-flex">
              <div
                className="mt-2 add-image__image-section--choose-image"
                style={{ backgroundColor: '#eef0ff' }}
              >
                <p className="add-image__image-section--choose-image__label">
                  {messages['admin.settings.general.images.upload.image']}
                </p>
                <div className="add-image__image-section--choose-image__icon">
                  <div className="add-image__image-section--camera-photo">
                    <i className="flaticon-photo-camera"></i>
                  </div>
                  <input
                    accept="image/png, image/jpeg"
                    type="file"
                    onChange={imageChange}
                  />
                </div>
              </div>
              <div
                className="mt-2 add-image__image-section--choose-image"
                style={{ backgroundColor: '#FFF7DE' }}
              >
                <p className="add-image__image-section--choose-image__label">
                  {messages['admin.settings.general.images.from.insta']}
                </p>
                <div className="add-image__image-section--choose-image__icon">
                  <div className="add-image__image-section--camera-photo">
                    <i className="flaticon-photo-camera"></i>
                  </div>
                  <input
                    accept="image/png, image/jpeg"
                    type="file"
                    onChange={imageChange}
                  />
                </div>
              </div>
            </Col>
            <Col xs={12} lg={6} className="d-flex align-items-center">
              {selectedImage && (
                <p>{messages['admin.settings.SPImages.successUploaded']}</p>
              )}
              {photoError && (
                <p className="text-danger">{messages['product.add.unsupportedFile']}</p>
              )}
            </Col>
          </Row>
          <Row className="container-box">
            <Col xs={12}>
              <p className="container-box__controllers--header">
                {messages['admin.settings.SPImages']}
              </p>
            </Col>
            <Col xs={12}>
              <p className="input-box__controllers--below-header">
                {messages['admin.settings.general.images.hint']}
              </p>
            </Col>
            <Col xs={12} md={6} lg={4} className="mt-4">
              <div
                className="image-star-choose"
                style={{
                  background: `url(${`https://via.placeholder.com/500`}) no-repeat center center`,
                }}
              >
                <i
                  onClick={() => alert('star-clicked')}
                  role="presentation"
                  className="flaticon-star image-star-choose__star-position yellow-star-color"
                ></i>
                <i
                  onClick={() => alert('delete-clicked')}
                  role="presentation"
                  style={{
                    left: `${locale === 'ar' && '30px'}`,
                    right: `${locale === 'en' && '30px'}`,
                  }}
                  className="flaticon-delete image-star-choose__delete-postion"
                ></i>
                <i
                  style={{
                    left: `${locale === 'ar' && '30px'}`,
                    right: `${locale === 'en' && '30px'}`,
                  }}
                  className="flaticon-instagram-logo image-star-choose__insta-postion"
                ></i>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
}
