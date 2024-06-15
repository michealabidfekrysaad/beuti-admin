/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import useAPI, { get, put } from 'hooks/useAPI';

export default function ChangeUsername({ callApi }) {
  const [username, setUsername] = useState('');
  const [usernameEn, setUsernameEn] = useState('');
  const [responseError, setResponseError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [payload, setPayload] = useState(null);
  const [isNameChanged, setIsNameChanged] = useState(null);
  const adminSettingsChangeUsername = 'admin.settings.ChangeUsername';

  const { response: currentUsername, getting, setRecall: callCurrentUsername } = useAPI(
    get,
    'ServiceProvider/serviceProviderProfile',
  );

  const {
    response: editResponse,
    isLoading: editing,
    setRecall: callEditUsername,
  } = useAPI(put, 'ServiceProvider/changeName', payload);

  useEffect(() => {
    if (editResponse && editResponse.error) {
      setResponseError(editResponse.error.message);
      setSubmit(false);
      setTimeout(() => {
        setResponseError(false);
        setIsNameChanged(false);
      }, 2000);
      setSubmit(false);
    }
    if (editResponse && editResponse.data) {
      setSuccess(true);
      setSubmit(false);
      setTimeout(() => {
        setSuccess(false);
        setIsNameChanged(false);
      }, 3000);
    }
  }, [editResponse]);

  useEffect(() => {
    if (payload) {
      callEditUsername(true);
    }
  }, [payload]);

  useEffect(() => {
    if (currentUsername && currentUsername.data && currentUsername.data.nameAr) {
      setUsername(currentUsername.data.nameAr);
      setUsernameEn(currentUsername.data.nameEn);
    }
  }, [currentUsername]);

  useEffect(() => {
    callCurrentUsername(callApi);
  }, [callApi]);

  const handleSubmit = () => {
    setSubmit(true);
    setPayload({
      newName: username,
      NewNameEn: usernameEn,
    });
  };
  const { messages } = useIntl();
  return (
    <>
      {success && (
        <div className="alert alert-success font-weight-bold" role="alert">
          {messages[`${adminSettingsChangeUsername}.success`]}
        </div>
      )}
      {responseError && (
        <div className="alert alert-danger font-weight-bold" role="alert">
          {responseError}
        </div>
      )}
      <form>
        <div className="form-group">
          <p className="title">{messages[`${adminSettingsChangeUsername}.header.ar`]}</p>
          <input
            disabled={submit}
            placeholder={messages[`${adminSettingsChangeUsername}.placeholder`]}
            className="form-control"
            type="tel"
            value={username}
            onChange={(e) => {
              setResponseError(false);
              setIsNameChanged(true);
              return setUsername(e.target.value);
            }}
          />
          {username.length !== 0 && username.length <= 1 && (
            <label className="customeLabel pointer">
              {messages[`${adminSettingsChangeUsername}.error`]}
            </label>
          )}
        </div>
      </form>
      {/* the input with english name */}
      <form className="mt-4">
        <div className="form-group">
          <p className="title">{messages[`${adminSettingsChangeUsername}.header.en`]}</p>

          <input
            disabled={submit}
            placeholder={messages[`${adminSettingsChangeUsername}.placeholder`]}
            className="form-control"
            type="tel"
            value={usernameEn}
            onChange={(e) => {
              setResponseError(false);
              setIsNameChanged(true);
              return setUsernameEn(e.target.value);
            }}
          />
          {usernameEn.length !== 0 && usernameEn.length <= 1 && (
            <label className="customeLabel pointer">
              {messages[`${adminSettingsChangeUsername}.error`]}
            </label>
          )}
        </div>
        <div className="alignBtn">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              !username ||
              !usernameEn ||
              success ||
              getting ||
              editing ||
              !isNameChanged ||
              (usernameEn.length !== 0 && usernameEn.length <= 1) ||
              (username.length !== 0 && username.length <= 1)
            }
            className="btn btn-primary"
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
