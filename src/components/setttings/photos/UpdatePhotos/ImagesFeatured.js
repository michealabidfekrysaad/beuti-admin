/* eslint-disable */
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Col, Row } from 'react-bootstrap';

import UploadedPhoto from './UploadedPhoto';

const ImagesFeatured = ({ images, setAllImages, callImages, dimmed }) => {
  const { messages } = useIntl();

  return (
    <>
      <Col xs="12" className="updatephotos__featured--text">
        <h2>{messages['setting.photos.featured.title']}</h2>
        <p>{messages['setting.photos.featured.subtitle']}</p>
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

export default ImagesFeatured;
