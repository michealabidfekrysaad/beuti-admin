import React, { useMemo, useState, useEffect } from 'react';
import BeutiInput from 'Shared/inputs/BeutiInput';
import { Row, Col, Image } from 'react-bootstrap';
import { CircularProgress } from '@material-ui/core';
import { CallAPI } from 'utils/API/APIConfig';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ChangeLocationMap from 'components/AdminViews/NewBooking/map/ChangeLocationMap';
import SelectInputMUI from 'Shared/inputs/SelectInputMUI';
import { toast } from 'react-toastify';
import { GCT_BUSSINESS_CATEGORIES_ORDERD_EP } from 'utils/API/EndPoints/ServicesEP';
import {
  SP_GET_BRANCHES_INFO,
  SP_UPDATE_BRANCHES_INFO,
} from 'utils/API/EndPoints/BranchManager';
import BeutiTextArea from 'Shared/inputs/BeutiTextArea';
import BeutiButton from 'Shared/inputs/BeutiButton';
import { CITY_ALL_EP, CITY_BY_LAT_LNG_EP } from 'utils/API/EndPoints/CityEP';
import { EditBranchDetailsSchema } from './EditBranchDetailsSchema';
import { toAbsoluteUrl } from '../../../functions/toAbsoluteUrl';
import BusinessCatModal from './BusinessCateModal';

export default function BranchInfoEditDetails() {
  const history = useHistory();
  const { messages, locale } = useIntl();
  const [salonLocation, setSalonLocation] = useState('');
  const [payload, setPayload] = useState(false);
  const [liveLocation, setliveLocation] = useState(false);
  const [selectedBC, setSelectedBC] = useState({ id: '', name: '', description: '' });
  const [openModal, setOpenModal] = useState(false);
  const [cityId, setCityId] = useState(false);
  const [savedAddress, setSavedAddress] = useState(false);

  const schema = EditBranchDetailsSchema();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });

  /* -------------------------------------------------------------------------- */
  /*                         update branchInfo settings                         */
  /* -------------------------------------------------------------------------- */
  const { refetch: updateBranch, isFetching: updatingFetching } = CallAPI({
    name: 'updateBranchInfor',
    method: 'put',
    url: SP_UPDATE_BRANCHES_INFO,
    body: {
      ...payload,
    },
    onSuccess: (res) => {
      if (res?.data?.data?.success) {
        toast.success(messages['setting.online.booking.success']);
        history.goBack();
      }
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error?.message);
    },
  });

  //   update city DD when change map
  const { refetch, isFetching: cityCheckerLoad } = CallAPI({
    name: 'cityByPolygon',
    url: CITY_BY_LAT_LNG_EP,
    query: {
      latitude: salonLocation.latitude,
      longitude: salonLocation.longitude,
    },
    onSuccess: (data) => {
      setValue('cityId', data?.data?.data?.id || 3, { shouldValidate: true });
    },
  });

  //   get city for  branch
  const { data: cities, isFetching: cititesLoad } = CallAPI({
    name: 'getCities',
    url: CITY_ALL_EP,
    refetchOnWindowFocus: false,
    enabled: true,
    select: (data) =>
      data?.data?.data?.list?.map((city) => ({ id: city.id, text: city.name })),
  });
  //   get all branch information
  const { isFetching: gettingData } = CallAPI({
    name: 'getBranchInfoForEdit',
    url: SP_GET_BRANCHES_INFO,
    enabled: true,
    refetchOnWindowFocus: false,
    onSuccess: (res) => {
      if (res?.data?.data) {
        const {
          addressAR,
          cityId: citId,
          descriptionAR,
          descriptionEN,
          addressEN,
          latitude,
          longitude,
          nameAR,
          nameEN,
          communicationNumber,
          businessCategory,
        } = res?.data?.data;
        setCityId(citId);
        setValue('descriptionAr', descriptionAR || '');
        setValue('descriptionEn', descriptionEN || '');
        setValue('cityId', citId, { shouldValidate: true });
        setValue('branchNameAr', nameAR);
        setValue('branchNameEn', nameEN);
        setValue('communicationNum', communicationNumber);
        setSavedAddress(locale === 'ar' ? addressAR : addressEN);
        setSelectedBC({
          id: businessCategory?.id,
          name: businessCategory?.name,
          description: '',
        });

        if (addressAR && addressEN && latitude && longitude) {
          setSalonLocation({
            addressAr: addressAR,
            addressEn: addressEN,
            latitude: +latitude,
            longitude: +longitude,
          });
        } else {
          setliveLocation(true);
        }
      }
    },
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });

  //   get all businness category
  const { data: BClist, refetch: getBC, isFetching: BCloading } = CallAPI({
    name: 'bussiness-categories',
    url: GCT_BUSSINESS_CATEGORIES_ORDERD_EP,
    onSuccess: () => setOpenModal(true),
    onError: (err) => toast.error(err?.response?.data?.error?.message),
    select: (res) => res?.data?.data?.list,
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

  useEffect(() => {
    if (salonLocation) {
      setValue(
        'address',
        locale === 'ar' ? salonLocation?.addressAr : salonLocation?.addressEn,
        {
          shouldValidate: true,
        },
      );
    }
  }, [salonLocation]);

  useEffect(() => {
    if (watch('address') && watch('address') !== savedAddress) {
      refetch();
    }
  }, [watch('address')]);

  useEffect(() => {
    if (payload) {
      updateBranch();
    }
  }, [payload]);

  const submitForm = (data) => {
    setPayload({
      nameAR: data?.branchNameAr,
      nameEN: data?.branchNameEn,
      businessCategoryId: selectedBC?.id,
      communicationNumber: data?.communicationNum,
      longitude: salonLocation.longitude,
      latitude: salonLocation.latitude,
      addressEN: salonLocation?.addressEn,
      addressAR: salonLocation?.addressAr,
      cityId: data?.cityId,
      descriptionAR: data?.descriptionAr,
      descriptionEN: data?.descriptionEn,
    });
  };

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <Row className="branchEdit">
        {!gettingData && !cititesLoad ? (
          <>
            <Col xs={12} className="mb-2">
              <p className="title">{messages['settings.branch.header']}</p>
              <p className="sub-title">{messages['bracnh.edit.info']}</p>
            </Col>
            <Col md={6} xs={12} className="mb-2">
              <BeutiInput
                type="text"
                useFormRef={register('branchNameAr')}
                label={`${messages['bracnh.edit.name.ar']} *`}
                error={errors?.branchNameAr?.message}
              />
            </Col>
            <Col md={6} xs={12} className="mb-2">
              <BeutiInput
                type="text"
                useFormRef={register('branchNameEn')}
                label={`${messages['bracnh.edit.name.en']} *`}
                error={errors?.branchNameEn?.message}
              />
            </Col>
            <Col xs={12} className="mb-2">
              <p className="branchEdit__business">{messages[`register.salontype`]}</p>
              <button
                type="button"
                className="beuti-dropdown-modal mt-3"
                onClick={getBC}
                disabled={BCloading}
              >
                <span>
                  {BCloading ? (
                    <div className="spinner-border spinner-border-sm mb-1" />
                  ) : (
                    selectedBC.name
                  )}
                </span>
                <Image src={toAbsoluteUrl('/arrowdown.png')} alt="arrow-down" />
              </button>
            </Col>
            <Col md={6} xs={12} className="mb-2">
              <BeutiInput
                type="text"
                useFormRef={register('communicationNum')}
                label={messages['bracnh.edit.communication.num']}
                error={errors?.communicationNum?.message}
              />
            </Col>
            <hr className="w-100" />
            <Col xs={12} className="mb-2">
              <p className="title">{messages['bracnh.edit.business.location']}</p>
              <p className="sub-title">
                {messages['bracnh.edit.business.location.info']}
              </p>
            </Col>
            <Col xs={12} className="informationwizard__box-map">
              {mapWithMemo}
            </Col>
            <Col xs={12} className="mt-4">
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
                    defaultValue={cityId}
                    label={messages['rw.generaldetails.city']}
                    error={errors.cityId?.message}
                  />
                </Col>
              </Row>
            </Col>
            <hr className="w-100" />
            <Col xs={12} className="mb-2">
              <p className="title">{messages['bracnh.edit.business.description']}</p>
              <p className="sub-title">
                {messages['bracnh.edit.business.description.info']}
              </p>
            </Col>
            <Col md={6} xs={12} className="mb-2">
              <BeutiTextArea
                type="text"
                label={messages['bracnh.edit.business.description.ar']}
                useFormRef={register('descriptionAr')}
                error={errors.descriptionAr?.message}
              />
            </Col>
            <Col md={6} xs={12} className="mb-2">
              <BeutiTextArea
                type="text"
                label={messages['bracnh.edit.business.description.en']}
                useFormRef={register('descriptionEn')}
                error={errors.descriptionEn?.message}
              />
            </Col>
          </>
        ) : (
          <Col xs={12} className="p-4 m-4 text-center">
            <CircularProgress size={24} className="mx-auto" color="secondary" />
          </Col>
        )}
      </Row>

      {!gettingData && !cititesLoad && (
        <section className="settings__submit">
          <button
            className="beutibuttonempty mx-2 action"
            type="button"
            onClick={() => history.goBack()}
          >
            {messages['common.cancel']}
          </button>
          <button
            type="submit"
            className="beutibutton action"
            disabled={updatingFetching}
          >
            {messages['common.save']}
          </button>
        </section>
      )}

      {/* business category modal */}
      <BusinessCatModal
        show={openModal}
        setShow={setOpenModal}
        list={BClist}
        selectedBC={selectedBC}
        setSelectedBC={setSelectedBC}
      />
    </form>
  );
}
