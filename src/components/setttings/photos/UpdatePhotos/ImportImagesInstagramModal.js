import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Modal, Image, Row, Col } from 'react-bootstrap';
import { CallAPI } from 'utils/API/APIConfig';
import { toast } from 'react-toastify';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import {
  INSTAGRAM_ADD_IMAGES_EP,
  INSTAGRAM_IMAGES_EP,
} from 'utils/API/EndPoints/ImageEP';
import ImportedImageInstagram from './ImportedImageInstagram';

export function ImportImagesInstagramModal({
  openModal,
  setOpenModal,
  username,
  setOpenUnlinkModal,
  callGallaryImages,
}) {
  const { messages } = useIntl();
  const [instagramImages, setInstagramImages] = useState([]);

  const { data: allImages, refetch: getAllImagesCall } = CallAPI({
    name: 'importfrominstgram',
    url: INSTAGRAM_IMAGES_EP,
    onSuccess: (imglist) => setInstagramImages(imglist.slice(0, 16)),
    onError: (err) => toast.error(err?.response?.data?.error?.message),

    select: (data) => data?.data?.data?.list?.map((url) => ({ url, isSelected: false })),
  });
  const {
    refetch: sendImportedtoBackend,
    isFetching: sendImportedToBackendLoading,
  } = CallAPI({
    name: 'sendImportedtobackend',
    url: INSTAGRAM_ADD_IMAGES_EP,
    method: 'post',
    retry: 0,
    body: { urls: [...instagramImages.filter((img) => img.isSelected)] },
    onSuccess: (data) => {
      if (data?.data?.data) {
        callGallaryImages(true);
        getAllImagesCall(true);
        setOpenModal(false);
      }
    },
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });

  useEffect(() => {
    if (username) {
      getAllImagesCall(true);
    }
  }, [username]);

  return (
    <>
      <Modal
        onHide={() => {
          setOpenModal(false);
        }}
        show={openModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        className="bootstrap-modal-customizing importmodal"
      >
        <div className="importmodal-body">
          <div className="importmodal-body__username">
            <Image src={toAbsoluteUrl('/instagram.svg')} />

            <p>@{username}</p>
          </div>
          <div className="importmodal-body__title">
            {messages['setting.photos.instagram']}
          </div>
          <div className="importmodal-body__count">
            <FormattedMessage
              id="setting.photos.instagram.selectd.count"
              values={{ count: instagramImages?.filter((img) => img.isSelected).length }}
            />
          </div>
          <section className="importmodal-body__list">
            {instagramImages?.map((img) => (
              // <Col xs="3" className="px-2" key={img.url}>
              <ImportedImageInstagram
                image={img}
                key={img.url}
                setAllImages={setInstagramImages}
                images={instagramImages}
              />
              // </Col>
            ))}
          </section>
          {allImages?.length !== instagramImages?.length && (
            <Row className="justify-content-center mb-4">
              <Col xs="auto">
                <button
                  type="button"
                  className="seemore"
                  onClick={() =>
                    setInstagramImages([
                      ...instagramImages,
                      ...allImages.slice(
                        instagramImages.length,
                        instagramImages.length + 16,
                      ),
                    ])
                  }
                >
                  {messages['setting.photos.instagram.seemore']}
                </button>
              </Col>
            </Row>
          )}
        </div>
        <Modal.Footer className="pt-3 justify-content-between">
          <button
            type="button"
            className="px-4 cancel unlink"
            onClick={() => {
              setOpenUnlinkModal(true);
              setOpenModal(false);
            }}
          >
            {messages['setting.photos.instagram.unlink']}
          </button>

          <div>
            <button
              type="button"
              className="px-4 cancel mx-2"
              onClick={() => {
                setOpenModal(false);
                getAllImagesCall(true);
              }}
            >
              {messages['common.close']}
            </button>
            <button
              type="button"
              onClick={() => {
                sendImportedtoBackend(true);
              }}
              className="px-4 confirm"
              disabled={
                sendImportedToBackendLoading ||
                instagramImages?.filter((img) => img.isSelected).length === 0
              }
            >
              {sendImportedToBackendLoading ? (
                <div className="spinner-border spinner-border-sm mb-1" role="status" />
              ) : (
                messages['setting.photos.instagram.importselected']
              )}
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

ImportImagesInstagramModal.propTypes = {
  username: PropTypes.string,
  openModal: PropTypes.bool,
  setOpenUnlinkModal: PropTypes.func,
  setOpenModal: PropTypes.func,
  callGallaryImages: PropTypes.func,
};
