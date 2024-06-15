/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import useAPI, { get, put } from 'hooks/useAPI';

import ChangeLocationMap from '../NewBooking/map/ChangeLocationMap';
import ChangeLocationAutoCompelete from '../NewBooking/map/ChangeLocationAutoCompelete';

export default function SalonLocation({ callApi }) {
  const [salonLocation, setSalonLocation] = useState('');
  const [responseError, setResponseError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [payload, setPayload] = useState(null);
  const [getSearchPlace, setGetSearchPlace] = useState();
  const [placeChanged, setPlaceChanged] = useState(false);
  const { locale } = useIntl();

  const {
    response: currentSalonLocation,
    isLoading: getting,
    setRecall: callCurrentSalonLocation,
  } = useAPI(get, 'ServiceProvider/serviceProviderProfile');

  const {
    response: editResponse,
    isLoading: editing,
    setRecall: callEditSalonLocation,
  } = useAPI(put, 'ServiceProvider/UpdateAddress', payload);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(false);
        setSubmit(false);
      }, 3000);
    }
  }, [success]);

  useEffect(() => {
    if (editResponse && editResponse.error) {
      setResponseError(editResponse.error.message);
      setSubmit(false);
    }
    if (editResponse && editResponse.data) {
      setSuccess(true);
      setSubmit(false);
    }
  }, [editResponse]);

  useEffect(() => {
    if (payload) {
      callEditSalonLocation(true);
    }
  }, [payload]);

  useEffect(() => {
    if (currentSalonLocation && currentSalonLocation.data) {
      setSalonLocation({
        latitude: currentSalonLocation.data.lat,
        longitude: currentSalonLocation.data.long,
        addressEN: currentSalonLocation.data.address,
        addressAR: currentSalonLocation.data.address,
      });
    }
  }, [currentSalonLocation]);

  useEffect(() => {
    callCurrentSalonLocation(callApi);
  }, [callApi]);
  useEffect(() => {
    if (
      currentSalonLocation &&
      salonLocation.latitude !== currentSalonLocation.data.lat &&
      salonLocation.longitude !== currentSalonLocation.data.long &&
      salonLocation.addressEN !== currentSalonLocation.data.address
    ) {
      setPlaceChanged(true);
    }
  }, [salonLocation]);
  const handleSubmit = () => {
    setSubmit(true);

    setPayload({
      ...salonLocation,
    });
  };
  const { messages } = useIntl();
  return (
    <>
      <h2 className="title mb-2">{messages['admin.settings.SalonLocation']}</h2>
      {success && (
        <div className="alert alert-success font-weight-bold" role="alert">
          {messages['admin.settings.SalonLocation.sucess']}
        </div>
      )}
      {responseError && (
        <div className="alert alert-danger font-weight-bold" role="alert">
          {responseError}
        </div>
      )}
      <form className="salon-location mt-5" style={{ position: 'relative' }}>
        <ChangeLocationMap
          getSearchPlace={getSearchPlace}
          language={locale}
          salonLocation={salonLocation}
          setSalonLocation={setSalonLocation}
        />
        <ChangeLocationAutoCompelete
          setGetSearchPlace={setGetSearchPlace}
          salonLocation={salonLocation}
          setSalonLocation={setSalonLocation}
          className="salon-location__autocompelete form-control"
        />
        <div className="salon-location__submit mt-3 mb-3 ml-2 mr-2">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!salonLocation || success || getting || editing || !placeChanged}
          >
            {submit && (
              <span
                className="spinner-border spinner-border-sm spinnerMr"
                role="status"
                aria-hidden="true"
              ></span>
            )}{' '}
            {messages['common.save']}
          </button>
        </div>
      </form>
    </>
  );
}
