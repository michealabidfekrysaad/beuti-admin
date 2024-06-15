import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Col, Dropdown, Button } from 'react-bootstrap';
import UploadImage from 'components/shared/UploadImage';
import { toAbsoluteUrl, handleImageString } from 'functions/toAbsoluteUrl';
import { toast } from 'react-toastify';
import { ConfirmationModal } from 'components/shared/ConfirmationModal';
import { CallAPI } from '../../../../utils/API/APIConfig';
import {
  LOGO_GET_EP,
  LOGO_SET_EP,
  LOGO_DELETE_EP,
} from '../../../../utils/API/EndPoints/ImageEP';

const EditLogo = () => {
  const { messages } = useIntl();
  const [logo, setLogo] = useState('');
  const [newLogo, setNewLogo] = useState('');
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  // Get Logo
  const { refetch: getLogoCall, isFetching: gettingLoader } = CallAPI({
    name: 'getLogo',
    url: LOGO_GET_EP,
    onSuccess: (data) => data?.data?.data && setLogo(data?.data?.data?.icon),
    enabled: true,
    refetchOnWindowFocus: false,
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
  // Delete Logo
  const { refetch: deleteLogoCall, isFetching: deletingLoader } = CallAPI({
    name: 'deleteingLogo',
    url: LOGO_DELETE_EP,
    method: 'delete',
    onSuccess: (data) => data?.data?.data && getLogoCall(true),
  });
  useEffect(() => {
    if (newLogo) {
      addImageCall(true);
    }
  }, [newLogo]);
  return (
    <>
      <Col xs="6" className="updatephotos__logo--text">
        <h2>{messages['rw.uploadimages.logo.title']}</h2>
        <p>{messages['rw.uploadimages.logo.subtitle']}</p>
      </Col>
      <Col xs="auto" className="updatephotos__logo--image">
        <div className="updatephotos__logo--image-result">
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
        <Dropdown id="dropdown-menu-align-end" className="updatephotos__logo--dropdown">
          <Dropdown.Toggle
            id="dropdown-autoclose-true"
            className="updatephotos__logo--dropdown-toggle"
            disabled={deletingLoader || addLoader || gettingLoader}
          >
            <i className="flaticon-photo-camera" />
          </Dropdown.Toggle>
          <Dropdown.Menu className="updatephotos__logo--dropdown-menu">
            <Dropdown.Item as={Button} eventKey="1">
              <UploadImage
                onDone={setNewLogo}
                className="updatephotos__logo--image-upload"
                text={
                  logo
                    ? messages['setting.photos.change.logo']
                    : messages['setting.photos.upload.logo']
                }
                maxSizeUpload="500"
                setErrorMessage={(err) => toast.error(err)}
              />
            </Dropdown.Item>

            {logo && (
              <Dropdown.Item as={Button} eventKey="3" onClick={setOpenDeleteModal}>
                {messages['setting.photos.delete.logo']}
              </Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>
      </Col>
      <ConfirmationModal
        setPayload={deleteLogoCall}
        openModal={openDeleteModal}
        setOpenModal={setOpenDeleteModal}
        message="admin.deleteImage.request"
        title="admin.deleteImage"
        confirmtext="admin.deleteImage.delete"
      />
    </>
  );
};

export default EditLogo;
