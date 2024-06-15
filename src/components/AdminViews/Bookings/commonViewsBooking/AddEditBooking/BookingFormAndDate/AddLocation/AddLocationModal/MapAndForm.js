/* eslint-disable  */

import React from 'react';
import GoogleMap from 'google-map-react';
import { FormattedMessage, useIntl } from 'react-intl';
import ReactGoogleAutocomplete from 'react-google-autocomplete';
// import SvgIcon from "components/atoms/Icons/SvgIcon";
import { Row, Col } from 'react-bootstrap';
import MapForm from './MapAndForm/MapForm';
import SVG from 'react-inlinesvg';
import { CircularProgress } from '@material-ui/core';
import { toAbsoluteUrl } from '../../../../../../../../functions/toAbsoluteUrl';

const MapAndForm = ({
  bookingData,
  setbookingData,
  handleSelectOnMap,
  handleAutoCompelete,
  loading,
  setTempFees = () => {},
}) => {
  const { messages } = useIntl();

  return (
    <section className="map">
      <Row>
        <Col xs="12">
          <div className="map-wrapper">
            <div className="map-wrapper__input-wrapper">
              <ReactGoogleAutocomplete
                apiKey="AIzaSyC_5d_KRlQI-ImerPd1hZFrtQYKWL-yS10"
                onPlaceSelected={handleAutoCompelete}
                className="map-wrapper__input-wrapper--autocompelete"
                placeholder={messages['location.input.place.holder']}
              />

              <div className="map-wrapper__input-wrapper--icon-map">
                <SVG src={toAbsoluteUrl('/location.svg')} />
              </div>
            </div>
            <GoogleMap
              bootstrapURLKeys={{
                key: 'AIzaSyC_5d_KRlQI-ImerPd1hZFrtQYKWL-yS10',
              }}
              defaultCenter={{
                lat: bookingData.latitude,
                lng: bookingData.longitude,
              }}
              center={{
                lat: bookingData.latitude,
                lng: bookingData.longitude,
              }}
              defaultZoom={16}
              onClick={handleSelectOnMap}
            >
              <div
                className="map-pin"
                lat={bookingData.latitude}
                lng={bookingData.longitude}
              >
                <SVG src={toAbsoluteUrl('/Pin.svg')} />
              </div>
            </GoogleMap>
          </div>
        </Col>
        <Col xs="12">
          <MapForm
            bookingData={bookingData}
            setbookingData={setbookingData}
            setTempFees={setTempFees}
          />
        </Col>
      </Row>
      {loading && (
        <div className="maploader">
          <CircularProgress size={24} className="mx-auto" color="secondary" />
        </div>
      )}
    </section>
  );
};

export default MapAndForm;
