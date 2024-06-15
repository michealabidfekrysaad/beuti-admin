/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable  react/prop-types */
import React, { useState, useEffect } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import BeutiInput from 'Shared/inputs/BeutiInput';
import useAPI, { get } from 'hooks/useAPI';
import { toast } from 'react-toastify';
import { CircularProgress } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import NavBar from 'components/layout/NavBar/index';
import { CallAPICustom } from 'utils/API/CustomAPIConfig';
import { ChangePasswordSchema } from './ChangePasswordSchema';

export default function ChangePassword() {
  const { messages, locale } = useIntl();
  const history = useHistory();
  const [userID, setUserID] = useState(null);
  const [errMessage, setErrorMessage] = useState(false);
  const [payload, setPayload] = useState(null);
  const adminSettingsChangePass = 'admin.settings.ChangePass';
  const { response: currentUsername, getting, setRecall: callCurrentUsername } = useAPI(
    get,
    'ServiceProvider/serviceProviderProfile',
  );

  const totalAPI = CallAPICustom({
    name: 'getTheGet',
    url: 'account/serviceProvider/changePassword',
    baseURL: process.env.REACT_APP_VERIFY_URL,
    body: payload,
    method: 'put',
    // retry: 1,
    cacheTime: 1000,
    onSuccess: (res) => {
      notify(messages[`${adminSettingsChangePass}.success`]);
      setTimeout(() => {
        history.goBack();
      }, 3000);
    },
    onError: () => {
      setErrorMessage(false);
    },
  });

  useEffect(() => {
    if (totalAPI?.error?.response?.data?.error?.message) {
      setErrorMessage(totalAPI?.error?.response?.data?.error?.message);
    }
  }, [totalAPI?.error?.response?.data?.error?.message]);

  useEffect(() => {
    if (errMessage) {
      notify(errMessage, 'err');
    }
  }, [errMessage]);

  const schema = ChangePasswordSchema();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields, isDirty },
    clearErrors,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const submitForm = (data) => {
    setPayload({
      UserID: userID,
      CurrentPassword: data.oldPass,
      NewPassword: data.newPass,
      ConfirmPassword: data.confirmNewPass,
    });
  };

  useEffect(() => {
    if (currentUsername?.data?.nameAr) {
      setUserID(currentUsername?.data?.uSerID);
    }
  }, [currentUsername]);

  useEffect(() => {
    if (payload) {
      totalAPI.refetch();
    }
  }, [payload]);

  useEffect(() => {
    callCurrentUsername(true);
  }, []);

  const notify = (message, err) => {
    if (err) {
      toast.error(message);
    } else {
      toast.success(message);
    }
  };
  return (
    <>
      <NavBar />
      <form onSubmit={handleSubmit(submitForm)} method="post">
        <Row className="pass">
          <Col xs={8} className="mx-auto">
            <Card className="mb-2">
              <Card.Header className="pass-header">
                <div className="title">
                  {messages[`${adminSettingsChangePass}.change.password`]}
                </div>
              </Card.Header>
              <Card.Body className="pass-body">
                <Col xs="8" className="pass-body_col mb-2">
                  <p className="forgetpassword__header">
                    {messages[`${adminSettingsChangePass}.change.password`]}
                  </p>
                  <p className="forgetpassword__subtitle">
                    {messages[`${adminSettingsChangePass}.change.password.hint`]}
                  </p>
                  <BeutiInput
                    type="password"
                    name="oldPass"
                    error={errors?.oldPass?.message && errors?.oldPass?.message}
                    useFormRef={register('oldPass')}
                    placeholder={messages[`${adminSettingsChangePass}.curr.password`]}
                  />
                </Col>
                <Col xs="8" className="pass-body_col mb-2">
                  <BeutiInput
                    type="password"
                    name="newPass"
                    error={errors?.newPass?.message && errors?.newPass?.message}
                    useFormRef={register('newPass')}
                    placeholder={messages[`${adminSettingsChangePass}.new.password`]}
                  />
                </Col>
                <Col xs="8" className="pass-body_col mb-2">
                  <BeutiInput
                    type="password"
                    name="confirmNewPass"
                    error={
                      errors?.confirmNewPass?.message && errors?.confirmNewPass?.message
                    }
                    useFormRef={register('confirmNewPass')}
                    placeholder={
                      messages[`${adminSettingsChangePass}.confirm.new.password`]
                    }
                  />
                </Col>
                <Col xs="8" className="pass-body_col text-center">
                  <button
                    className="btn btn-primary text-center"
                    type="submit"
                    disabled={
                      errors?.oldPass ||
                      errors?.newPass ||
                      errors?.confirmNewPass ||
                      getting ||
                      totalAPI?.isFetching ||
                      totalAPI?.isLoading ||
                      !isValid
                    }
                  >
                    {!totalAPI?.isFetching ? (
                      messages[`${adminSettingsChangePass}.btn.change`]
                    ) : (
                      <CircularProgress size={15} className="mx-auto" color="inherit" />
                    )}
                  </button>
                </Col>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </form>
    </>
  );
}
