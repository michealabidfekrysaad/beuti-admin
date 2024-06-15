import React, { useMemo, useState, useEffect } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { Col, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { CallAPI } from 'utils/API/APIConfig';
import { useHistory } from 'react-router-dom';
import { handleImageString } from 'functions/toAbsoluteUrl';
import { toast } from 'react-toastify';
import CABannerImage from './CABannerAdd/CABannerImage';
import RadioInputMUI from '../../../Shared/inputs/RadioInputMUI';
import CAServiceProviderTable from './CABannerAdd/CAServiceProviderTable';
import CAPromoCodesTable from './CABannerAdd/CAPromoCodesTable';

const CABannerAdd = () => {
  const history = useHistory();
  const {
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    mode: 'all',
    defaultValues: {
      bannerType: 3,
    },
  });
  const { messages } = useIntl();
  const [errorUploadImg, setErrorUploadImg] = useState('');

  const { refetch: addBannerCall, isFetching: addBannerLoading } = CallAPI({
    name: 'AddBanner',
    url: 'CustomerBanner/Add',
    method: 'post',
    retry: 0,
    body: {
      bannerType: watch('bannerType'),
      serviceProviderId: watch('branch')?.id,
      image: handleImageString(watch('image')),
      promoCodeId: watch('promoCodeId')?.id,
    },
    onSuccess: (res) => {
      if (res?.data?.data?.success) {
        history.push('/cabanners');
        toast.success(messages['common.success']);
      }
    },
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });
  const optionsList = useMemo(
    () => [
      {
        id: 3,
        label: messages['canbanner.add.none'],
      },
      {
        id: 1,
        label: messages['cabanner.add.singlesp'],
      },
      {
        id: 2,
        label: messages['cabanner.add.promocode'],
      },
    ],
    [],
  );

  const handleAddBannerSubmit = () => {
    if (!errorUploadImg) return addBannerCall(true);
    return null;
  };
  return (
    <form onSubmit={handleSubmit(handleAddBannerSubmit)}>
      <Row className="settings">
        <Col xs={12} className="settings__section">
          <Row>
            {' '}
            <Col lg={12} md={6} xs={12} className="mb-5">
              <h3 className="settings__section-title">
                {messages['cabanner.add.title']}
              </h3>
              <p className="settings__section-description">
                {messages['cabanner.add.description']}
              </p>
            </Col>
            <CABannerImage
              watch={watch}
              setValue={setValue}
              setErrorUploadImg={setErrorUploadImg}
              errorUploadImg={errorUploadImg}
            />
            <Col xs="auto" className="flex-grow-1 cabanner-selectbranch ">
              <Row>
                <Col xs="auto">
                  <RadioInputMUI
                    list={optionsList}
                    control={control}
                    name="bannerType"
                    error={errors?.bannerType?.message}
                  />
                </Col>
                <Col xs="12" className="my-3">
                  {!watch('branch') && watch('bannerType') === '1' && (
                    <p className="selectbranch-text">
                      {messages['cabanner.add.singlesp.note']}
                    </p>
                  )}
                  {watch('branch') && watch('bannerType') === '1' && (
                    <p className="selectbranch-text">
                      <FormattedMessage
                        id="cabanner.add.singlesp.selected"
                        values={{ branch: watch('branch')?.name }}
                      />
                    </p>
                  )}
                  {!watch('promoCodeId') && watch('bannerType') === '2' && (
                    <p className="selectbranch-text">
                      {messages['cabanner.add.promocode.note']}
                    </p>
                  )}
                  {watch('promoCodeId') && watch('bannerType') === '2' && (
                    <p className="selectbranch-text">
                      <FormattedMessage
                        id="cabanner.add.promocode.selected"
                        values={{ code: watch('promoCodeId')?.code }}
                      />
                    </p>
                  )}
                </Col>
                <Col xs="12">
                  {watch('bannerType') === '1' && (
                    <CAServiceProviderTable setValue={setValue} watch={watch} />
                  )}
                  {watch('bannerType') === '2' && (
                    <CAPromoCodesTable setValue={setValue} watch={watch} />
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
      <section className="settings__submit">
        <button
          className="beutibuttonempty mx-2 action"
          type="button"
          onClick={() => history.goBack()}
          disabled={addBannerLoading}
        >
          {messages['common.cancel']}
        </button>
        <button
          className="beutibutton action"
          type="submit"
          disabled={
            !watch('image') ||
            (watch('bannerType') === '1' && !watch('branch')) ||
            (watch('bannerType') === '2' && !watch('promoCodeId')) ||
            addBannerLoading
          }
        >
          {messages['common.save']}
        </button>
      </section>
    </form>
  );
};

export default CABannerAdd;
