/* eslint-disable */

import React, { useState } from 'react';
import { Image } from 'react-bootstrap';
import RoundedCheckbox from 'components/shared/RoundedCheckbox';
import SVG from 'react-inlinesvg';
import PropTypes from 'prop-types';
import { toAbsoluteUrl } from '../../../../functions/toAbsoluteUrl';
import { GallaryFeaturedZoomModal } from './GallaryFeaturedZoomModal';

const handleClasses = (selected) => {
  if (selected) {
    return 'updatephotos__featured--list-item active';
  }
  return 'updatephotos__featured--list-item';
};

const ImportedImageInstagram = ({ image, setAllImages, images }) => {
  const [openZoom, setOpenZoom] = useState(false);

  const handleCheckBox = (e) => {
    const updatedSelects = images?.map((data) =>
      data.url === image.url ? { ...image, isSelected: e.target.checked } : data,
    );
    setAllImages(updatedSelects);
  };
  return (
    <>
      <label htmlFor={image.url} className={handleClasses(image.isSelected)}>
        <Image src={image.url} className="updatephotos__featured--list-item--img" />
        <RoundedCheckbox
          className="updatephotos__featured--list-item--checkbox"
          name={image.url}
          onChange={handleCheckBox}
          value={image.isSelected}
        />

        <button
          type="button"
          onClick={() => setOpenZoom(true)}
          className="updatephotos__featured--list-item--zoom"
        >
          <SVG src={toAbsoluteUrl('/zoomin.svg')} />
        </button>
      </label>
      <GallaryFeaturedZoomModal
        openModal={openZoom}
        setOpenModal={setOpenZoom}
        image={image}
      />
    </>
  );
};
ImportedImageInstagram.propTypes = {
  image: PropTypes.object,
  images: PropTypes.array,
  setAllImages: PropTypes.func,
  dimmed: PropTypes.bool,
};
export default ImportedImageInstagram;
