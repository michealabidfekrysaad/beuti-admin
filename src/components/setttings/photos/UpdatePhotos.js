import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import { useIntl } from 'react-intl';
import EditLogo from './UpdatePhotos/EditLogo';
import ImagesGallary from './UpdatePhotos/ImagesGallary';
import './UpdatePhotos/UpdatePhoto.scss';
import { CallAPI } from '../../../utils/API/APIConfig';
import { IMAGE_LIST_SP_EP } from '../../../utils/API/EndPoints/ImageEP';
import ImagesFeatured from './UpdatePhotos/ImagesFeatured';
import UploadImagesSelected from './UpdatePhotos/UploadImageSelected';

export const listTypes = {
  noSelect: 0,
  gallary: 1,
  featured: 2,
};

const UpdatePhotos = () => {
  const { messages } = useIntl();
  const [selectedImages, setSelectedImages] = useState({
    type: '',
    list: [],
  });
  const [featuredImages, setFeaturedImages] = useState([]);
  const [gallaryImages, setGallaryImages] = useState([]);

  const { refetch: getImagesCall, isFetching: getImagesLoading } = CallAPI({
    name: 'GetAllImages',
    url: IMAGE_LIST_SP_EP,
    onSuccess: (res) => {
      if (res?.data?.data?.list) {
        setFeaturedImages(
          res?.data?.data?.list
            .map((item) => ({ ...item, isSelected: false }))
            .filter((img) => img.isFeatured),
        );

        setGallaryImages(
          res?.data?.data?.list
            .map((item) => ({ ...item, isSelected: false }))
            .filter((img) => !img.isFeatured),
        );
      }
    },
    refetchOnWindowFocus: false,
    enabled: true,
  });

  useEffect(() => {
    const checkForSelectedFeatured = featuredImages.filter((image) => image.isSelected);
    if (checkForSelectedFeatured.length > 0) {
      setSelectedImages({ type: listTypes.featured, list: checkForSelectedFeatured });
    } else {
      setSelectedImages({ type: listTypes.noSelect, list: [] });
    }
  }, [featuredImages]);
  useEffect(() => {
    const checkForSelectedGallary = gallaryImages.filter((image) => image.isSelected);
    if (checkForSelectedGallary.length > 0) {
      setSelectedImages({ type: listTypes.gallary, list: checkForSelectedGallary });
    } else {
      setSelectedImages({ type: listTypes.noSelect, list: [] });
    }
  }, [gallaryImages]);
  return (
    <section className="updatephotos">
      <Row className="updatephotos__logo">
        <EditLogo />
      </Row>
      {featuredImages.length !== 0 && (
        <Row className="mb-5">
          <ImagesFeatured
            images={featuredImages}
            callImages={getImagesCall}
            setAllImages={setFeaturedImages}
            dimmed={selectedImages.type === listTypes.gallary}
          />
        </Row>
      )}
      <Row>
        <ImagesGallary
          images={gallaryImages}
          callImages={getImagesCall}
          setAllImages={setGallaryImages}
          dimmed={selectedImages.type === listTypes.featured}
        />
      </Row>
      {gallaryImages.length === 0 && featuredImages.length === 0 && (
        <Row className="justify-content-center mt-5">
          <Col xs="6" className="updatephotos__noimage">
            <SVG src={toAbsoluteUrl('/noImagesGallery.svg')} />
            <p>{messages['setting.photos.gallary.noimg']}</p>
          </Col>
        </Row>
      )}
      {selectedImages.list.length > 0 && (
        <UploadImagesSelected
          selectedImages={selectedImages}
          getImagesCall={getImagesCall}
          listTypes={listTypes}
          getImagesLoading={getImagesLoading}
        />
      )}
    </section>
  );
};

export default UpdatePhotos;
