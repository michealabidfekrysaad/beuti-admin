/* eslint-disable */

import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { Tooltip } from '@material-ui/core';
import { toast } from 'react-toastify';
import Fade from '@material-ui/core/Fade';
import {
  SP_GET_SUPPORTED_CITY_EP,
  SP_ADD_SUPPORTED_CITY_EP,
  SP_PUT_SUPPORTED_CITY_EP,
} from 'utils/API/EndPoints/ServiceProviderEP';
import { AddEditCityModal } from './SupportedCities/AddEditCityModal';
import { CallAPI } from '../../../../utils/API/APIConfig';
import DeleteSupportedCityModal from './SupportedCities/DeleteCityModal';

const SupportedCities = ({ notAcceptHomeServices }) => {
  const { messages, locale } = useIntl();
  const [openAddEditModal, setOpenAddEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [cityPayload, setCityPayload] = useState({
    cityId: '',
    price: 0,
  });
  const handleResetComponent = (stat) => {
    if (stat) {
      getSupportedCities(true);
      setOpenAddEditModal(false);
      setOpenDeleteModal(false);
      setCityPayload({
        cityId: '',
        price: 0,
      });
      setIsUpdating(false);
    }
  };
  const { data: cities, refetch: getSupportedCities, isFetching: cititesLoad } = CallAPI({
    name: 'getSupportedCities',
    url: SP_GET_SUPPORTED_CITY_EP,
    refetchOnWindowFocus: false,
    enabled: true,
    select: (data) => data.data.data || [],
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });
  const { refetch: addCity, isFetching: addcityLoad } = CallAPI({
    name: 'addSupportedCities',
    url: SP_ADD_SUPPORTED_CITY_EP,
    method: 'put',
    body: { ...cityPayload },
    onSuccess: (data) => handleResetComponent(data.data.data.success),
  });
  const { refetch: updateCity, isFetching: updatecityLoad } = CallAPI({
    name: [SP_PUT_SUPPORTED_CITY_EP, cityPayload.cityId],
    url: '/ServiceProvider/UpdateServicableCity',
    method: 'put',
    body: { ...cityPayload },
    onSuccess: (data) => handleResetComponent(data.data.data.success),
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });

  return (
    <>
      <Col xs={12} className="settings__section">
        <Row className="align-items-end justify-content-between">
          <Col lg={8} md={6} xs={12}>
            <h3 className="settings__section-title">
              {messages['setting.home.supportedcities.title']}
            </h3>
            <p className="settings__section-description">
              {messages['setting.home.supportedcities.description']}
            </p>
          </Col>
          <Col xs="auto">
            <button
              type="button"
              className="settings__section-addcities"
              onClick={setOpenAddEditModal}
            >
              {messages['setting.home.supportedcities.add']}
            </button>
          </Col>
        </Row>
      </Col>
      {notAcceptHomeServices && (
        <Col xs="12" className="mt-3">
          <p className="text-danger">{notAcceptHomeServices}</p>
        </Col>
      )}
      <Col lg={6} xs={12} className="settings__section">
        <ul className="settings__section-citylist">
          {cities &&
            cities.map((city) => (
              <li className="settings__section-citylist--item" key={city.cityId}>
                <Col xs={3} className="settings__section-citylist--item-name">
                  {city.city}
                </Col>
                <Col xs={2} className="settings__section-citylist--item-price">
                  {`${city.price} ${messages['common.sar']}`}
                </Col>
                <Tooltip arrow TransitionComponent={Fade} title={messages['common.edit']}>
                  <button
                    type="button"
                    className="icon-wrapper-btn btn-icon-transparent mx-1"
                    onClick={() => {
                      setIsUpdating(true);
                      setCityPayload({ ...city });
                      setOpenAddEditModal(true);
                    }}
                  >
                    <i className={`flaticon2-${locale === 'ar' ? 'back' : 'next'}`}></i>
                  </button>
                </Tooltip>
              </li>
            ))}
        </ul>
      </Col>
      <AddEditCityModal
        openModal={openAddEditModal}
        setOpenModal={setOpenAddEditModal}
        cityPayload={cityPayload}
        setCityPayload={setCityPayload}
        isUpdating={isUpdating}
        setIsUpdating={setIsUpdating}
        addCity={isUpdating ? updateCity : addCity}
        loading={addcityLoad || updatecityLoad || cititesLoad}
        setOpenDeleteModal={setOpenDeleteModal}
        supportedCities={cities}
      />
      <DeleteSupportedCityModal
        cityPayload={cityPayload}
        openModal={openDeleteModal}
        setOpenModal={setOpenDeleteModal}
        handleResetComponent={handleResetComponent}
      />
    </>
  );
};

export default SupportedCities;
