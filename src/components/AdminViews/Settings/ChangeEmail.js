/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import useAPI, { get, put } from 'hooks/useAPI';
import { isValidEmail } from '../../SuperAdminViews/ServicePrivedersList/ServiceProvidersList';

export default function ChangeEmail({ callApi }) {
  const [email, setEmail] = useState('');
  const [responseError, setResponseError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [payload, setPayload] = useState(null);
  const [isEmailChanged, setisEmailChanged] = useState(null);

  const { response: currentEmail, getting, setRecall: callCurrentEmail } = useAPI(
    get,
    'ServiceProvider/serviceProviderProfile',
  );

  const { response: editResponse, isLoading: editing, setRecall: callEditEmail } = useAPI(
    put,
    'ServiceProvider/changeProviderEmail',
    payload,
  );

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(false);
        setSubmit(false);
      }, 3000);
    }
  }, [success]);

  useEffect(() => {
    if (editResponse && editResponse.error) {
      setResponseError(editResponse.error.message);
      setSubmit(false);
    }
    if (editResponse && editResponse.data) {
      setSuccess(true);
      setSubmit(false);
    }
  }, [editResponse]);

  useEffect(() => {
    if (payload) {
      callEditEmail(true);
    }
  }, [payload]);

  useEffect(() => {
    if (currentEmail && currentEmail.data && currentEmail.data.userMail) {
      setEmail(currentEmail.data.userMail);
    }
  }, [currentEmail]);

  useEffect(() => {
    callCurrentEmail(callApi);
  }, [callApi]);

  const handleSubmit = () => {
    setSubmit(true);
    setPayload({
      newEmail: email,
    });
  };
  const { messages } = useIntl();
  return (
    <>
      <h2 className="title mb-2">{messages['admin.settings.ChangeEmail.header']}</h2>
      {success && (
        <div className="alert alert-success font-weight-bold" role="alert">
          {messages['admin.settings.ChangeEmail.success']}
        </div>
      )}
      {responseError && (
        <div className="alert alert-danger font-weight-bold" role="alert">
          {responseError}
        </div>
      )}
      <form>
        <input
          disabled={submit}
          placeholder={messages['admin.settings.ChangeEmail.placeholder']}
          type="tel"
          className="form-control"
          value={email}
          onChange={(e) => {
            setResponseError(false);
            if (currentEmail && e.target.value !== currentEmail.data.userMail) {
              setisEmailChanged(true);
            } else {
              setisEmailChanged(false);
            }
            return setEmail(e.target.value);
          }}
        />
        {email && !isValidEmail(email) && (
          <label className="ui red pointing basic label">
            {messages['admin.setttings.ChangeEmail.error']}
          </label>
        )}
        <div className="alignBtn">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={
              !email ||
              success ||
              !isValidEmail(email) ||
              getting ||
              editing ||
              !isEmailChanged
            }
          >
            {submit && (
              <span
                className="spinner-border spinner-border-sm spinnerMr"
                role="status"
                aria-hidden="true"
              ></span>
            )}{' '}
            {messages['common.save']}
          </button>
        </div>
      </form>
    </>
  );
}
