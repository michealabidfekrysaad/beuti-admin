import React, { useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { SP_OFFER_ADD } from 'utils/API/EndPoints/OfferEP';
import BeutiButton from 'Shared/inputs/BeutiButton';
import { CallAPI } from '../../../utils/API/APIConfig';
import { AddOfferSchema } from './AddOffer/OfferSchema';
import OfferDetails from './AddOffer/OfferDetails';
import OfferPeriod from './AddOffer/OfferPeriod';
import OfferServices from './AddOffer/OfferServices';

const AddOffer = () => {
  const { messages } = useIntl();
  const history = useHistory();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(AddOfferSchema),
    defaultValues: {
      servicesOptions: [],
    },
  });
  useEffect(() => {
    setValue('bookingStart', new Date());
    setValue('bookingEnd', new Date());
    setValue('reservationStart', new Date());
    setValue('reservationEnd', new Date());
    setValue('receivingService', false);
  }, []);

  const { refetch: addOfferCall, isFetching: addOfferLoading } = CallAPI({
    name: 'AddOffer',
    url: SP_OFFER_ADD,
    method: 'post',
    body: {
      ...watch(),
      bookingStart: watch('receivingService')
        ? watch('bookingStart')
        : watch('reservationStart'),
      bookingEnd: watch('receivingService')
        ? watch('bookingEnd')
        : watch('reservationEnd'),
      serviceOptionIds: watch('servicesOptions')
        ?.flat()
        ?.map((el) => el.services)
        ?.flat()
        ?.map((el) => el?.options)
        ?.flat()
        ?.filter((el) => el?.serviceOptionID)
        ?.map((el) => +el?.serviceOptionID)
        ?.flat(),
    },
    onSuccess: (res) => {
      if (res?.data?.data?.success) {
        history.push('/allOffers/0');
        toast.success(messages['common.success']);
      }
    },
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });
  return (
    <form onSubmit={handleSubmit(addOfferCall)}>
      <Row className="settings">
        <Col xs={12} className="settings__section">
          <OfferDetails
            errors={errors}
            register={register}
            watch={watch}
            setValue={setValue}
          />
        </Col>
        <Col xs={12} className="settings__section">
          <OfferPeriod
            errors={errors}
            register={register}
            watch={watch}
            setValue={setValue}
            clearErrors={clearErrors}
          />
        </Col>
        <Col xs={12} className="settings__section">
          <OfferServices
            errors={errors}
            register={register}
            watch={watch}
            setValue={setValue}
            clearErrors={clearErrors}
            getValues={getValues}
          />
        </Col>
      </Row>
      <section className="settings__submit">
        <button
          className="beutibuttonempty mx-2 action"
          type="button"
          onClick={() => history.goBack()}
          disabled={addOfferLoading}
        >
          {messages['common.cancel']}
        </button>
        <BeutiButton
          text={messages['common.save']}
          type="submit"
          disabled={addOfferLoading}
          loading={addOfferLoading}
          className="beutibutton action"
        />
      </section>
    </form>
  );
};

export default AddOffer;
