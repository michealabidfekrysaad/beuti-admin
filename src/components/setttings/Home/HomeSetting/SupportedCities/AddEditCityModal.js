/* eslint-disable */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Modal } from 'react-bootstrap';
import { CallAPI } from 'utils/API/APIConfig';
import BeutiInput from 'Shared/inputs/BeutiInput';
import { CITY_ALL_EP } from 'utils/API/EndPoints/CityEP';
import AutoCompeleteInputMUI from 'Shared/inputs/BeutiAutoCompelete';
import { onlyNumbers } from 'functions/validate';

export function AddEditCityModal({
  openModal,
  setOpenModal,
  setOpenDeleteModal,
  addCity,
  cityPayload,
  setCityPayload,
  isUpdating,
  setIsUpdating,
  loading,
  supportedCities,
}) {
  const [citiesFilterd, setCitiesFilterd] = useState([]);
  const { messages, locale } = useIntl();
  const { data: allCites, refetch: getCities, isFetching: cititesLoad } = CallAPI({
    name: 'getCities',
    url: 'City/EnabledCitiesList',
    refetchOnWindowFocus: false,
    enabled: !!supportedCities,
    select: (data) =>
      data?.data?.data?.list?.map((city) => ({
        id: city?.id,
        text: city?.displayName || (locale === 'ar' ? city?.nameAR : city?.nameEN),
      })),
    onSuccess: (list) => {
      setCitiesFilterd(
        list.filter(
          (city) =>
            city.text && !supportedCities.find((supCity) => city.id === supCity.cityId),
        ),
      );
    },
  });
  useEffect(() => {
    if (supportedCities) {
      getCities(true);
    }
  }, [supportedCities]);

  return (
    <>
      <Modal
        onHide={() => {
          setOpenModal(false);
          setCityPayload({
            cityId: '',
            price: 0,
          });
          setIsUpdating(false);
        }}
        show={openModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        className="bootstrap-modal-customizing importmodal"
      >
        <Modal.Header className="pt-0">
          <Modal.Title className="title">
            {
              messages[
                isUpdating
                  ? 'setting.home.supportedcities.edit'
                  : 'setting.home.supportedcities.add'
              ]
            }
          </Modal.Title>
        </Modal.Header>
        <AutoCompeleteInputMUI
          list={isUpdating ? allCites : citiesFilterd}
          label={messages['setting.home.supportedcities.select']}
          className="mb-1 addcityautocompelete"
          value={allCites?.find((city) => city.id === cityPayload.cityId)}
          disabled={!allCites}
          onChange={(data, e) => {
            setCityPayload({
              ...cityPayload,
              cityId: e.id,
            });
          }}
        />
        <div className="beuti-icon mb-2 mt-1">
          <BeutiInput
            label={messages['setting.home.minimum.price']}
            labelClass="mb-0"
            labelId="minimumPrice"
            value={cityPayload.price}
            onChange={(e) =>
              e.target.value <= 50000 && onlyNumbers(e.target.value)
                ? setCityPayload({
                    ...cityPayload,
                    price: e.target.value,
                  })
                : null
            }
          />
          <label htmlFor="minimumPrice" className="icon">
            {messages['common.sar']}
          </label>
        </div>
        <Modal.Footer className="pt-3 justify-content-between">
          {isUpdating ? (
            <button
              type="button"
              className="px-4 cancel text-danger"
              onClick={() => {
                setOpenDeleteModal(true);
                setOpenModal(false);
              }}
            >
              {messages['common.delete']}
            </button>
          ) : (
            <div />
          )}

          <div>
            <button
              type="button"
              className="px-4 cancel mx-2"
              onClick={() => {
                setOpenModal(false);
                setCityPayload({
                  cityId: '',
                  price: 0,
                });
                setIsUpdating(false);
              }}
            >
              {messages['common.cancel']}
            </button>
            <button
              type="button"
              onClick={() => {
                addCity(true);
              }}
              className="px-4 confirm"
              disabled={
                cititesLoad ||
                loading ||
                !cityPayload.cityId ||
                (!cityPayload.price && cityPayload.price !== 0)
              }
            >
              {cititesLoad || loading ? (
                <div className="spinner-border spinner-border-sm mb-1" role="status" />
              ) : isUpdating ? (
                messages['common.edit']
              ) : (
                messages['common.add']
              )}
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

AddEditCityModal.propTypes = {
  openModal: PropTypes.bool,
  setOpenDeleteModal: PropTypes.func,
  setOpenModal: PropTypes.func,
  addCity: PropTypes.func,
  cityPayload: PropTypes.object,
  setCityPayload: PropTypes.func,
  isUpdating: PropTypes.bool,
  setIsUpdating: PropTypes.func,
  loading: PropTypes.bool,
  supportedCities: PropTypes.array,
};
