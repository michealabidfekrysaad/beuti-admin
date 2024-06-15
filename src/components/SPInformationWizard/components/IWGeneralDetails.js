import React, { useMemo, useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import ChangeLocationMap from 'components/AdminViews/NewBooking/map/ChangeLocationMap';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CallAPI } from 'utils/API/APIConfig';
import { Routes } from 'constants/Routes';
import { SP_GENERAL_INFO_EP } from 'utils/API/EndPoints/ServiceProviderEP';
import { CITY_ALL_EP, CITY_BY_LAT_LNG_EP } from 'utils/API/EndPoints/CityEP';
import BeutiTextArea from 'Shared/inputs/BeutiTextArea';
import { useHistory } from 'react-router-dom';
import BeutiInput from '../../../Shared/inputs/BeutiInput';
import SelectInputMUI from '../../../Shared/inputs/SelectInputMUI';
import { schemaStepOne } from '../schema/IWSchemas';

const IWGeneralDetails = () => {
  const { messages, locale } = useIntl();
  const [salonLocation, setSalonLocation] = useState('');
  const [liveLocation, setliveLocation] = useState(false);
  const history = useHistory();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(schemaStepOne),
  });
  const { data: cities, isFetching: cititesLoad } = CallAPI({
    name: 'getCities',
    url: CITY_ALL_EP,
    refetchOnWindowFocus: false,
    enabled: true,
    select: (data) =>
      data?.data?.data?.list?.map((city) => ({ id: city.id, text: city.name })),
  });
  const { isFetching: generalInfoLoad } = CallAPI({
    name: 'initalValues',
    url: SP_GENERAL_INFO_EP,
    refetchOnWindowFocus: false,
    enabled: true,
    onSuccess: ({ data }) => {
      const {
        cityId,
        email,
        descriptionAr,
        descriptionEn,
        latitude,
        longitude,
        addressAr,
        addressEn,
      } = data?.data;
      if (addressAr && addressEn && latitude && longitude && cityId) {
        setValue('email', email);
        setValue('descriptionAr', descriptionAr || '');
        setValue('descriptionEn', descriptionEn || '');
        setValue('cityId', cityId, { shouldValidate: true });
        setSalonLocation({ addressAr, addressEn, latitude, longitude });
      } else {
        setliveLocation(true);
      }
    },
  });
  const { refetch, isFetching: cityCheckerLoad } = CallAPI({
    name: 'cityByPolygon',
    url: CITY_BY_LAT_LNG_EP,
    query: {
      latitude: salonLocation.latitude,
      longitude: salonLocation.longitude,
    },
    onSuccess: (data) =>
      setValue('cityId', data?.data?.data?.id || 3, { shouldValidate: true }),
  });
  useEffect(() => {
    if (salonLocation) {
      setValue(
        'address',
        locale === 'ar' ? salonLocation?.addressAr : salonLocation?.addressEn,
        {
          shouldValidate: true,
        },
      );
      refetch();
    }
  }, [salonLocation]);
  const { refetch: updateDataCall, isFetching: updateLoad } = CallAPI({
    name: 'updateInfo',
    url: 'ServiceProvider/SetSPGeneralInfo',
    method: 'put',
    retry: 0,
    body: {
      ...salonLocation,
      ...watch(),
      email: watch('email') || null,
    },
    onSuccess: (data) => {
      if (data.data.data.success) {
        setliveLocation(false);
        history.push(Routes.spinformationwizardStepTwo);
      }
    },
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });

  const mapWithMemo = useMemo(
    () => (
      <ChangeLocationMap
        language={locale}
        salonLocation={salonLocation}
        setSalonLocation={setSalonLocation}
        className="informationwizard__box-map--view"
        liveLocation={liveLocation}
        nobtn
      />
    ),
    [locale, salonLocation, setSalonLocation, liveLocation],
  );

  return (
    <form onSubmit={handleSubmit(updateDataCall)}>
      <Row className="informationwizard">
        <Col xs={12} className="informationwizard__title">
          {messages['rw.generaldetails.title']}
        </Col>
        <Col xs={12} className="informationwizard__subtitle">
          {messages['rw.generaldetails.subtitle']}
        </Col>
        <Col xs={12} className="informationwizard__box">
          <Row className="justify-content-center">
            <Col xs={12} className="informationwizard__box-map">
              {mapWithMemo}
            </Col>
          </Row>
          <Row>
            <Col xs="6" className="mt-4 mb-2">
              <BeutiInput
                type="text"
                disabled
                label={messages['rw.generaldetails.address']}
                useFormRef={register('address')}
                error={errors.address?.message}
              />
            </Col>
            <Col xs="6" className="mt-4 mb-2">
              <SelectInputMUI
                list={cities}
                useFormRef={register('cityId')}
                watch={watch}
                defaultValue={3}
                label={messages['rw.generaldetails.city']}
                error={errors.cityId?.message}
              />
            </Col>
            <Col xs="12" className="mt-1 mb-2">
              <BeutiInput
                type="text"
                label={messages['rw.generaldetails.email']}
                placeholder="Example@gmail.com"
                useFormRef={register('email')}
                error={errors.email?.message}
                note={messages['rw.generaldetails.email.note']}
              />
            </Col>
            <Col xs="6" className="mt-1 mb-2">
              <BeutiTextArea
                type="text"
                label={messages['rw.generaldetails.bio.arabic']}
                useFormRef={register('descriptionAr')}
                error={errors.descriptionAr?.message}
              />
            </Col>
            <Col xs="6" className="mt-1 mb-2">
              <BeutiTextArea
                type="text"
                label={messages['rw.generaldetails.bio.english']}
                useFormRef={register('descriptionEn')}
                error={errors.descriptionEn?.message}
              />
            </Col>
          </Row>
        </Col>
        <Col className="text-center my-5" xs="12">
          <button
            type="submit"
            className="informationwizard__submit"
            disabled={cititesLoad || generalInfoLoad || cityCheckerLoad || updateLoad}
          >
            {messages['common.next']}
          </button>
        </Col>
      </Row>
    </form>
  );
};

export default IWGeneralDetails;
