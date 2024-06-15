/* eslint-disable dot-notation */
import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Routes } from 'constants/Routes';
import Toggle from 'react-toggle';
import { useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CircularProgress } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CallAPI } from 'utils/API/APIConfig';
import BeutiInput from 'Shared/inputs/BeutiInput';
import BeutiButton from 'Shared/inputs/BeutiButton';

export default function UpdateChairSettings() {
  const history = useHistory();
  const [chairEnabled, setChairEnabled] = useState(false);
  const [oldData, setOldData] = useState({
    noOfChairs: 0,
    chairPrice: 0,
  });
  const [payload, setPayload] = useState(false);
  const [id, setID] = useState(null);
  const { messages } = useIntl();

  const schema = yup.object({
    numberChair:
      chairEnabled &&
      yup
        .number()
        .typeError(messages['settings.chair.number'])
        .test({
          name: 'decimal Error',
          message: messages['settings.chair.float.required.number'],
          test: (value) => /^[0-9]*(\.[0-9]{0,2})?$/.test(value),
        })
        .required(messages['settings.chair.number'])
        .min(1, messages['settings.chair.number.min'])
        .max(99, messages['settings.chair.number.max']),
    priceChair:
      chairEnabled &&
      yup
        .number()
        .typeError(messages['settings.chair.price'])
        .test({
          name: 'decimal Error',
          message: messages['settings.chair.float.required'],
          test: (value) => /^[0-9]*(\.[0-9]{0,2})?$/.test(value),
        })
        .required(messages['settings.chair.price'])
        .min(1, messages['settings.chair.price.min'])
        .max(10000, messages['settings.chair.price.max']),
  });

  const {
    register,
    handleSubmit,
    clearErrors,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(schema),
  });

  const { isFetching: gettingData } = CallAPI({
    name: 'getChairSettings',
    url: 'SPChair/Get',
    enabled: true,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      if (data?.data?.data) {
        setChairEnabled(data?.data?.data.isEnabled);
        setID(data?.data?.data.id);
        setValue('numberChair', data?.data?.data.noOfChairs);
        setValue('priceChair', data?.data?.data.chairPrice);
        setOldData({
          noOfChairs: data?.data?.data.noOfChairs,
          chairPrice: data?.data?.data.chairPrice,
        });
      }
    },
    onError: (err) => toast.error(err.response.data.error.message),
  });

  const { refetch: refetchUpdate, isFetching: fetchUpdate } = CallAPI({
    name: 'UpdateChairSettings',
    url: 'SPChair/Update',
    refetchOnWindowFocus: false,
    method: 'post',
    retry: 0,
    body: {
      ...payload,
    },
    onSuccess: (data) => {
      if (data?.data?.data?.success) {
        toast.success(messages['settings.chair.success']);
        history.goBack();
      }
    },
    onError: (err) => toast.error(err.response.data.error.message),
  });

  const submitForm = () => {
    if (chairEnabled) {
      setPayload({
        id,
        noOfChairs: +watch('numberChair'),
        chairPrice: +watch('priceChair'),
        isEnabled: chairEnabled,
      });
    } else {
      setPayload({
        id,
        noOfChairs: oldData.noOfChairs > 0 ? oldData.noOfChairs : 0,
        chairPrice: oldData.chairPrice > 0 ? oldData.chairPrice : 0,
        isEnabled: chairEnabled,
      });
    }
  };

  useEffect(() => {
    if (payload) {
      refetchUpdate();
    }
  }, [payload]);

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      {!gettingData ? (
        <>
          <Row className="settings">
            <Col xs={12} className="settings__section">
              <Row className="align-items-center">
                <Col lg={9} md={6} xs={12}>
                  <h3 className="settings__section-title">
                    {messages['settings.chair.header']}{' '}
                  </h3>
                  <p className="settings__section-description">
                    {messages['settings.chair.info']}{' '}
                  </p>
                </Col>
                <Col md={6} lg={3}>
                  <div className="settings__section-toggle">
                    <Toggle
                      id="chair"
                      defaultChecked={chairEnabled}
                      icons={{
                        unchecked: null,
                      }}
                      onChange={() => {
                        clearErrors();
                        setChairEnabled(!chairEnabled);
                      }}
                    />
                    <label htmlFor="chair">
                      {!chairEnabled
                        ? messages['settings.chair.label.enable']
                        : messages['settings.chair.label.disable']}
                    </label>
                  </div>
                  <br />
                  {chairEnabled && (
                    <p className="info">{messages['settings.chair.checkbox.note']}</p>
                  )}
                </Col>
              </Row>
            </Col>
            {chairEnabled && (
              <Col xs="12" className="settings__section">
                <Row className=" updateChairSettings">
                  <Col md={6} lg={8}>
                    <h3 className="settings__section-title">
                      {messages['settings.chair.available.chairs']}
                    </h3>
                  </Col>
                  <Col md={6} lg={4} className="mb-2">
                    <BeutiInput
                      label={messages['settings.chair.available.chairs.num']}
                      useFormRef={register('numberChair')}
                      error={errors?.numberChair?.message && errors?.numberChair?.message}
                    />
                    <br />
                    <BeutiInput
                      label={messages['settings.chair.available.chairs.price']}
                      useFormRef={register('priceChair')}
                      error={errors?.priceChair?.message && errors?.priceChair?.message}
                    />
                  </Col>
                </Row>
              </Col>
            )}
          </Row>
        </>
      ) : (
        <div className="text-center mt-5 pt-5">
          <div className="loading"></div>
        </div>
      )}
      <section className="settings__submit">
        <button
          className="beutibuttonempty mx-2 action"
          type="button"
          onClick={() => history.goBack()}
          disabled={gettingData}
        >
          {messages['common.cancel']}
        </button>
        <button className="beutibutton action" type="submit" disabled={gettingData}>
          {messages['common.save']}
        </button>{' '}
      </section>
    </form>
  );
}
