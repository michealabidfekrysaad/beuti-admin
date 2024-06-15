/* eslint-disable */

import React, { useState } from 'react';
import { Image } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import RoundedCheckbox from 'components/shared/RoundedCheckbox';
import SVG from 'react-inlinesvg';
import PropTypes from 'prop-types';
import { CallAPI } from 'utils/API/APIConfig';
import { toast } from 'react-toastify';
import { ConfirmationModal } from 'components/shared/ConfirmationModal';
import { toAbsoluteUrl } from '../../../../functions/toAbsoluteUrl';
import ImageDropDown from './ImageDropDown';
import { GallaryFeaturedZoomModal } from './GallaryFeaturedZoomModal';
import {
  IMAGE_DELETE_SP_EP,
  MOVE_TO_FEATURE_EP,
  MOVE_TO_GALLARY_EP,
  MAKE_IMAGE_BANNER_EP,
} from '../../../../utils/API/EndPoints/ImageEP';

const handleClasses = (selected, dimmed) => {
  if (dimmed) {
    return 'updatephotos__featured--list-item dimmed';
  }
  if (selected) {
    return 'updatephotos__featured--list-item active';
  }
  return 'updatephotos__featured--list-item';
};

const UploadedPhoto = ({ image, setAllImages, images, callImages, dimmed }) => {
  const { messages } = useIntl();
  const [openZoom, setOpenZoom] = useState(false);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  // Delete Image
  const { refetch: deleteImageCall } = CallAPI({
    name: ['Deleteimage', image.id],
    url: IMAGE_DELETE_SP_EP,
    body: {
      id: [image?.id],
    },
    method: 'delete',
    onSuccess: (data) => data?.data?.data && callImages(true),
  });
  // Move To Feature or To Gallary
  const { refetch: moveToFeatureCall } = CallAPI({
    name: ['MoveToFeatureOrGallary', image.id],
    url: image.isFeatured ? MOVE_TO_GALLARY_EP : MOVE_TO_FEATURE_EP,
    method: 'put',
    body: { id: [image?.id] },
    onSuccess: (data) => data?.data?.data && callImages(true),
    onError: (err) => toast.error(err?.response?.data?.error?.message),
    retry: 0,
  });
  // Move To Feature or To Gallary
  const { refetch: makeBannerCall } = CallAPI({
    name: ['makeImageBanner', image.id],
    url: MAKE_IMAGE_BANNER_EP,
    method: 'put',
    query: { imageId: image?.id },
    onSuccess: (data) => data?.data?.data && callImages(true),
  });

  const handleCheckBox = (e) => {
    const updatedSelects = images?.map((data) =>
      data.id === image.id ? { ...image, isSelected: e.target.checked } : data,
    );
    setAllImages(updatedSelects);
  };
  return (
    <>
      <label htmlFor={image.id} className={handleClasses(image.isSelected, dimmed)}>
        <Image src={image.image} className="updatephotos__featured--list-item--img" />
        <RoundedCheckbox
          className="updatephotos__featured--list-item--checkbox"
          name={image.id}
          onChange={handleCheckBox}
          value={image.isSelected}
        />
        <ImageDropDown
          image={image}
          callImages={callImages}
          deleteImageCall={setOpenDeleteModal}
          moveToFeatureCall={moveToFeatureCall}
          makeBannerCall={setOpenConfirmationModal}
        />
        <button
          type="button"
          onClick={() => setOpenZoom(true)}
          className="updatephotos__featured--list-item--zoom"
        >
          <SVG src={toAbsoluteUrl('/zoomin.svg')} />
        </button>
        {image.isDefault && (
          <div className="updatephotos__featured--list-item--banner">
            <SVG src={toAbsoluteUrl('/flag-banner.svg')} />
            <p> {messages['setting.photos.Banner']}</p>
          </div>
        )}
      </label>
      <GallaryFeaturedZoomModal
        openModal={openZoom}
        setOpenModal={setOpenZoom}
        image={image}
        moveToFeatureCall={moveToFeatureCall}
      />
      <ConfirmationModal
        setPayload={makeBannerCall}
        openModal={openConfirmationModal}
        setOpenModal={setOpenConfirmationModal}
        message="setting.photos.banner.modal.subtitle"
        title="setting.photos.Banner"
      />
      <ConfirmationModal
        setPayload={deleteImageCall}
        openModal={openDeleteModal}
        setOpenModal={setOpenDeleteModal}
        message="admin.deleteImage.request"
        title="admin.deleteImage"
        confirmtext="admin.deleteImage.delete"
      />
    </>
  );
};
UploadedPhoto.propTypes = {
  image: PropTypes.object,
  images: PropTypes.array,
  setAllImages: PropTypes.func,
  dimmed: PropTypes.bool,
};
export default UploadedPhoto;
