import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { CallAPI } from 'utils/API/APIConfig';
import { toast } from 'react-toastify';
import { ConfirmationModal } from 'components/shared/ConfirmationModal';
import {
  IMAGE_DELETE_SP_EP,
  MOVE_TO_FEATURE_EP,
  MOVE_TO_GALLARY_EP,
} from '../../../../utils/API/EndPoints/ImageEP';

const UploadImagesSelected = ({
  selectedImages,
  getImagesCall,
  listTypes,
  getImagesLoading,
}) => {
  const { messages } = useIntl();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  // Delete Image
  const { refetch: deleteImageCall, isFetching: deleteLoading } = CallAPI({
    name: 'DeleteSelectedImages',
    url: IMAGE_DELETE_SP_EP,
    body: {
      id: [...selectedImages?.list?.map((image) => image.id)],
    },
    method: 'delete',
    onSuccess: (data) => data?.data?.data && getImagesCall(true),
  });
  // Move To Feature or To Gallary
  const { refetch: moveToFeatureCall, isFetching: moveLoading } = CallAPI({
    name: 'MoveSelectedToFeatureOrGallary',
    url:
      listTypes.featured === selectedImages.type
        ? MOVE_TO_GALLARY_EP
        : MOVE_TO_FEATURE_EP,
    method: 'put',
    retry: 0,
    body: { id: [...selectedImages?.list?.map((image) => image.id)] },
    onSuccess: (data) => data?.data?.data && getImagesCall(true),
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });
  return (
    <div
      className={`updatephotos__selected ${(deleteLoading ||
        moveLoading ||
        getImagesLoading) &&
        'loading'}`}
    >
      <Row className="justify-content-between align-items-center">
        <Col xs="auto">
          <Row>
            <Col xs="auto">
              <i className="flaticon2-image-file" />
            </Col>
            <Col className="px-0">
              <p className="updatephotos__selected-count">
                <FormattedMessage
                  id={
                    listTypes.featured === selectedImages.type
                      ? 'setting.photos.gallary.selectd.featured'
                      : 'setting.photos.gallary.selectd.gallary'
                  }
                  values={{ count: selectedImages?.list?.length }}
                />
              </p>
              <button
                className="updatephotos__selected-selectall"
                type="button"
                onClick={getImagesCall}
                disabled={deleteLoading || moveLoading || getImagesLoading}
              >
                {messages['common.UnselectAll']}
              </button>
            </Col>
          </Row>
        </Col>
        <Col xs="auto">
          <button
            className="updatephotos__selected-move"
            type="button"
            onClick={moveToFeatureCall}
            disabled={deleteLoading || moveLoading || getImagesLoading}
          >
            {listTypes.featured === selectedImages.type
              ? messages['setting.photos.move.to.gallary']
              : messages['setting.photos.move.to.featured']}
          </button>
          <button
            className="updatephotos__selected-delete"
            type="button"
            onClick={setOpenDeleteModal}
            disabled={deleteLoading || moveLoading || getImagesLoading}
          >
            {messages['common.delete']}
          </button>
        </Col>
      </Row>
      <ConfirmationModal
        setPayload={deleteImageCall}
        openModal={openDeleteModal}
        setOpenModal={setOpenDeleteModal}
        message="setting.photos.gallary.selectd.delete.description"
        title="setting.photos.gallary.selectd.delete.title"
        confirmtext="common.delete"
      />
    </div>
  );
};
UploadImagesSelected.propTypes = {
  selectedImages: PropTypes.object,
  listTypes: PropTypes.object,
  getImagesCall: PropTypes.func,
  getImagesLoading: PropTypes.bool,
};
export default UploadImagesSelected;
