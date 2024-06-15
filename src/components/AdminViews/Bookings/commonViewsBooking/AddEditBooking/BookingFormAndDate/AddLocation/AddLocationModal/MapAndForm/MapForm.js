/* eslint-disable  */

import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import { CallAPI } from 'utils/API/APIConfig';
import BeutiTextArea from '../../../../../../../../../Shared/inputs/BeutiTextArea';
import BeutiInput from '../../../../../../../../../Shared/inputs/BeutiInput';
import SelectInputMUI from '../../../../../../../../../Shared/inputs/SelectInputMUI';
const MapForm = ({ bookingData, setbookingData, setTempFees = () => {} }) => {
  const { messages, locale } = useIntl();

  const { data: allCitiesRes } = CallAPI({
    name: 'AlliCities',
    url: 'City/ViewCityList',
    enabled: true,
    refetchOnWindowFocus: false,
    select: (data) =>
      data.data.data.list.map((city) => ({ id: city.id, text: city.name })),
  });

  const { data: insideCityOrNot } = CallAPI({
    name: ['getCurrentCity', bookingData.latitude, bookingData.longitude],
    url: 'City/GetCityByLatLng',
    enabled: !!allCitiesRes,
    query: {
      latitude: bookingData.latitude,
      longitude: bookingData.longitude,
    },
    refetchOnWindowFocus: false,
    onSuccess: ({ id }) => id && setbookingData({ ...bookingData, cityId: id }),
    select: (data) => data.data.data,
  });

  const { data: isCitySupported } = CallAPI({
    name: ['IsServiceableAddressCity', bookingData.cityId],
    url: 'ServiceProvider/IsServiceableAddressCity',
    enabled: !!allCitiesRes,
    query: {
      cityId: bookingData.cityId,
      serviceProviderId: bookingData.spId,
    },
    refetchOnWindowFocus: false,
    onSuccess: (res) => setTempFees(res?.fees),
    select: (data) => data.data.data,
  });

  return (
    <>
      <Row className="mt-5 mb-5">
        <Col xs="6">
          <BeutiInput
            label={<FormattedMessage id="location.address" />}
            className="mb-0"
            value={bookingData?.addressEn}
            disabled
            onChange={(e) =>
              setbookingData({ ...bookingData, addressEn: e.target.value })
            }
          />
        </Col>
        <Col xs="6">
          <SelectInputMUI
            label={<FormattedMessage id="location.city" />}
            list={allCitiesRes}
            value={bookingData?.cityId}
            onChange={(e) => setbookingData({ ...bookingData, cityId: e.target.value })}
          />
        </Col>
        {((insideCityOrNot && insideCityOrNot?.id === 0) ||
          (isCitySupported && !isCitySupported?.isSupported)) && (
          <Col xs="12">
            <div className="map-not--supported">{messages['location.not.supported']}</div>
          </Col>
        )}

        {insideCityOrNot?.id !== 0 && isCitySupported?.fees > 0 && (
          <Col xs="12">
            <div className="map-not--supported">
              <FormattedMessage
                id="location.extra.fees"
                values={{
                  fees: isCitySupported?.fees,
                }}
              />
            </div>
          </Col>
        )}

        <Col xs="12">
          <BeutiTextArea
            type="text"
            value={bookingData.addressDescription}
            onChange={(e) =>
              setbookingData({ ...bookingData, addressDescription: e.target.value })
            }
            label={<FormattedMessage id="location.description" />}
            error={
              bookingData?.addressDescription?.length > 500 &&
              messages['location.description.max']
            }
          />
        </Col>
      </Row>
    </>
  );
};

export default MapForm;
