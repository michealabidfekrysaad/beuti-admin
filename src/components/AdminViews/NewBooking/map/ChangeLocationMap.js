/* eslint-disable  */
// www.npmjs.com/package/google-maps-react
import React, { useState, useEffect } from 'react';
import { Map, InfoWindow, GoogleApiWrapper, Marker } from 'google-maps-react';
import { useIntl } from 'react-intl';
import { CallAPI } from 'utils/API/APIConfig';

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};
function ChangeLocationMap(props) {
  const { messages, locale } = useIntl();
  const [selectedPlace, setSelectedPlace] = useState({
    lat: 24.73265591475684,
    lng: 46.69235839843748,
    changed: false,
  });

  CallAPI({
    name: ['geocode', selectedPlace.lat, selectedPlace.lng],
    url: 'City/GetGeoCode',
    enabled: selectedPlace?.changed,
    query: {
      latlng: `${selectedPlace.lat},${selectedPlace.lng}`,
      language: locale,
    },
    refetchOnWindowFocus: false,
    onSuccess: ({ data }) =>
      props.setSalonLocation({
        latitude: selectedPlace.lat,
        longitude: selectedPlace.lng,
        addressEn: data.results[0].formatted_address.replaceAll('Unnamed Road', ''),
        addressAr: data.results[0].formatted_address.replaceAll('Unnamed Road', ''),
      }),
  });
  const [showingInfoWindow, setShowingInfoWindow] = useState(true);
  useEffect(() => {
    if (props.liveLocation) {
      getMyCurrentLocation();
    }
  }, [props.liveLocation]);
  useEffect(() => {
    if (props.getSearchPlace) {
      const lat = props.getSearchPlace.geometry.location.lat();
      const lng = props.getSearchPlace.geometry.location.lng();
      setShowingInfoWindow(false);
      setSelectedPlace({ lat, lng, changed: true });
      setShowingInfoWindow(true);
    }
  }, [props.getSearchPlace]);

  const onMapClicked = (map, maps, e) => {
    setShowingInfoWindow(true);
    const { latLng } = e;
    setSelectedPlace({ lat: latLng.lat(), lng: latLng.lng(), changed: true });
  };

  function getMyCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setSelectedPlace({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          changed: true,
        });
      },
      // eslint-disable-next-line no-shadow
      (error) => {
        if (error.code === 1 && !props?.salonLocation?.latitude) {
          setSelectedPlace({
            lat: 24.73265591475684,
            lng: 46.69235839843748,
            changed: true,
          });
        }
        if (error.code === 2) {
          props.setErrorMessage(true);
        }
      },
      options,
    );
  }

  const { google, mapPosition } = props;

  const infoWindow = (
    <InfoWindow
      position={{
        lat: props.salonLocation.latitude,
        lng: props.salonLocation.longitude,
      }}
      visible={showingInfoWindow}
    >
      <div className="infoWindow">
        {/* <h3 className="info-title">{selectedPlace.name}</h3> */}
        <p className="info-address">
          <i className="material-icons">{messages['map.location']}</i>
          {props.salonLocation.addressEn}
        </p>
      </div>
    </InfoWindow>
  );
  const marker = (
    <Marker
      position={{
        lat: props.salonLocation.latitude || selectedPlace.lat,
        lng: props.salonLocation.longitude || selectedPlace.lng,
      }}
      visible={showingInfoWindow}
    />
  );
  return (
    <div>
      {!props.nobtn && (
        <button
          type="button"
          className="mb-1 btn btn-primary"
          onClick={getMyCurrentLocation}
        >
          {messages['admin.settings.GetMyCurrentLocation']}
        </button>
      )}
      <Map
        className={props.className}
        google={google}
        initialCenter={{
          // eslint-disable-next-line no-nested-ternary
          lat: props.salonLocation.latitude || selectedPlace.lat,
          lng: props.salonLocation.longitude || selectedPlace.lng,
        }}
        center={mapPosition}
        zoom={8}
        onClick={onMapClicked}
      >
        {infoWindow}
        {marker}
      </Map>
    </div>
  );
}

const LoadingContainer = () => <main className="loader" />;

export default GoogleApiWrapper((props) => ({
  apiKey: 'AIzaSyC_5d_KRlQI-ImerPd1hZFrtQYKWL-yS10',
  language: props.language,
  LoadingContainer,
}))(ChangeLocationMap);
