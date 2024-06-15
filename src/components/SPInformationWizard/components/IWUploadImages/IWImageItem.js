import React, { useState } from 'react';
import { Image } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { ConfirmationModal } from 'components/shared/ConfirmationModal';
import { CallAPI } from 'utils/API/APIConfig';
import { IMAGE_DELETE_SP_EP } from '../../../../utils/API/EndPoints/ImageEP';

const IWImageItem = ({ image, getImagesCall }) => {
  const [openModal, setOpenModal] = useState(false);
  const { refetch } = CallAPI({
    name: ['Deleteimage', image.id],
    url: IMAGE_DELETE_SP_EP,
    body: {
      id: [image?.id],
    },
    method: 'delete',
    onSuccess: (data) => data?.data?.data && getImagesCall(true),
  });
  return (
    <div className="iwupload-item">
      <div className="iwupload-item__info">
        <Image src={image?.image} />
        <p className="iwupload-item__info-name">{image?.image.split('com/').pop()}</p>
      </div>
      <div className="iwupload-item__action">
        <button
          className="flaticon-delete-btn"
          type="button"
          onClick={() => setOpenModal(true)}
        >
          <i className="flaticon-delete "></i>
        </button>
      </div>
      <ConfirmationModal
        setPayload={refetch}
        openModal={openModal}
        setOpenModal={setOpenModal}
        title="admin.deleteImage"
        message="admin.deleteImage.request"
        confirmtext="common.delete"
      />
    </div>
  );
};
IWImageItem.propTypes = {
  image: PropTypes.object,
  getImagesCall: PropTypes.func,
};
export default IWImageItem;
