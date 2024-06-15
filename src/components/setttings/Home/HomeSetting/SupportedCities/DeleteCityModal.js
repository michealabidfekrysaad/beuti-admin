import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Modal } from 'react-bootstrap';
import { CallAPI } from 'utils/API/APIConfig';
import { toast } from 'react-toastify';
import { SP_DELETE_SUPPORTED_CITY_EP } from 'utils/API/EndPoints/ServiceProviderEP';

const DeleteSupportedCityModal = ({
  openModal,
  setOpenModal,
  cityPayload,
  handleResetComponent,
}) => {
  const { messages } = useIntl();
  const { refetch: deleteCity, isFetching: deleteCityLoad } = CallAPI({
    name: ['updateSupportedCities', cityPayload.cityId],
    url: SP_DELETE_SUPPORTED_CITY_EP,
    method: 'put',
    retry: 0,
    query: { cityId: cityPayload.cityId },
    onSuccess: (data) => handleResetComponent(data.data.data.success),
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });
  return (
    <>
      <Modal
        onHide={() => {
          setOpenModal(false);
        }}
        show={openModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        className="bootstrap-modal-customizing unlinkinstagram-modal"
      >
        <Modal.Header>
          <Modal.Title className="title">
            {messages['setting.home.supportedcities.delete.title']}
          </Modal.Title>
          <p className="subtitle">
            {messages['setting.home.supportedcities.delete.description']}
          </p>
        </Modal.Header>
        <Modal.Footer className="pt-3 justify-content-end">
          <button
            type="button"
            className="px-4 cancel mx-2"
            onClick={() => {
              setOpenModal(false);
              handleResetComponent(true);
            }}
          >
            {messages['common.close']}
          </button>
          <button
            type="button"
            onClick={() => {
              deleteCity(true);
            }}
            className="px-4 confirm btn btn-danger"
            disabled={deleteCityLoad}
          >
            {deleteCityLoad ? (
              <div className="spinner-border spinner-border-sm mb-1" role="status" />
            ) : (
              messages['setting.home.supportedcities.delete.yes']
            )}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

DeleteSupportedCityModal.propTypes = {
  cityPayload: PropTypes.object,
  setOpenModal: PropTypes.func,
  openModal: PropTypes.bool,
  handleResetComponent: PropTypes.func,
};

export default DeleteSupportedCityModal;
