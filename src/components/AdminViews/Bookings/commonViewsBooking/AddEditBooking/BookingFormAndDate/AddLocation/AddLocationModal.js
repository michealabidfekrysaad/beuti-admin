/* eslint-disable  */

import React, { useContext, useState } from 'react';
import { useIntl } from 'react-intl';
import { Modal } from 'react-bootstrap';
import Geocode from 'react-geocode';
import { BookingContext } from 'providers/BookingProvider';
import MapAndForm from './AddLocationModal/MapAndForm';
import { CallAPI } from 'utils/API/APIConfig';

// Geocode.setApiKey('AIzaSyC_5d_KRlQI-ImerPd1hZFrtQYKWL-yS10');

const AddLocationModal = ({
  openModal,
  setOpenModal,
  setTempFees = () => {},
  tempFees = 0,
  setFeesSelected = () => {},
}) => {
  const { booking, setBooking } = useContext(BookingContext);
  const [selectedPlace, setSelectedPlace] = useState({ lat: '', lng: '' });
  const { messages, locale } = useIntl();
  const { isFetching: geoLoader } = CallAPI({
    name: ['geocode', selectedPlace.lat, selectedPlace.lng],
    url: 'City/GetGeoCode',
    enabled: !!selectedPlace.lat && !!selectedPlace.lng,
    query: {
      latlng: `${selectedPlace.lat},${selectedPlace.lng}`,
      language: locale,
    },
    refetchOnWindowFocus: false,
    onSuccess: ({ data }) =>
      setBooking({
        ...booking,
        latitude: selectedPlace.lat,
        longitude: selectedPlace.lng,
        addressEn: data.results[0].formatted_address.replaceAll('Unnamed Road', ''),
        addressAr: data.results[0].formatted_address.replaceAll('Unnamed Road', ''),
      }),
  });
  const handleAutoCompelete = (place) => {
    if (!place.geometry) return;
    setBooking({
      ...booking,
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng(),
      addressEn: place.formatted_address,
      addressAr: place.formatted_address,
    });
  };
  const handleSelectOnMap = (place) => {
    setSelectedPlace(place);
  };

  return (
    <>
      <Modal
        onHide={() => {
          setOpenModal(false);
          if (booking?.addressDescription?.length > 500) {
            setBooking({
              ...booking,
              addressDescription: '',
            });
          }
        }}
        show={openModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        className="bootstrap-modal-customizing importmodal"
      >
        <form>
          <Modal.Header className="pt-0">
            <Modal.Title className="title">
              {messages['location.addNewAddress']}
            </Modal.Title>
          </Modal.Header>
          <MapAndForm
            handleSelectOnMap={handleSelectOnMap}
            handleAutoCompelete={handleAutoCompelete}
            bookingData={booking}
            setbookingData={setBooking}
            setTempFees={setTempFees}
            loading={geoLoader}
          />
          <Modal.Footer className="pt-3 justify-content-end">
            <div>
              <button
                type="button"
                className="px-4 cancel mx-2"
                onClick={() => {
                  setOpenModal(false);
                  if (booking?.addressDescription?.length > 500) {
                    setBooking({
                      ...booking,
                      addressDescription: '',
                    });
                  }
                }}
              >
                {messages['common.cancel']}
              </button>
              <button
                type="button"
                className="px-4 confirm"
                onClick={() => {
                  if (
                    booking?.addressDescription?.length <= 500 ||
                    !booking?.addressDescription
                  ) {
                    setFeesSelected(tempFees);
                    setOpenModal(false);
                    setBooking({ ...booking, isLocationSelected: true });
                  }
                }}
              >
                {messages['common.add']}
              </button>
            </div>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

export default AddLocationModal;
