/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import useAPI, { get, put } from 'hooks/useAPI';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import { MenuItem, FormControl, Select, CircularProgress } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    width: '85%',
  },
  root: {
    width: '85%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function ChangeCity({ callApi }) {
  const classes = useStyles();
  const [changeMyCity, setChangeMyCity] = useState('');
  const [isCityChanged, setisCityChanged] = useState(false);
  const [responseError, setResponseError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [payload, setPayload] = useState(null);

  const { response: allCitiesAPI, getting, setRecall: callCallCitiesAPI } = useAPI(
    get,
    'City/ViewCityList',
  );
  const {
    response: currentCityAPI,
    isLoading: currentCityLoading,
    setRecall: callCurrentCityAPI,
  } = useAPI(get, 'ServiceProvider/serviceProviderProfile');
  const { response: editResponse, isLoading: editing, setRecall: callEditCity } = useAPI(
    put,
    'ServiceProvider/UpdateCity',
    payload,
  );
  // Call Current City And All Cites when component mount
  useEffect(() => {
    callCallCitiesAPI(callApi);
  }, [callApi]);
  useEffect(() => {
    callCurrentCityAPI(callApi);
  }, [callApi]);

  // set the data from backend to view
  useEffect(() => {
    if (currentCityAPI && currentCityAPI.data) {
      setChangeMyCity(currentCityAPI.data.cityID);
    }
  }, [currentCityAPI]);

  // submit the Data
  const handleSubmit = () => {
    setSubmit(true);
    setPayload({
      cityID: changeMyCity,
    });
  };

  useEffect(() => {
    if (payload) {
      callEditCity(true);
    }
  }, [payload]);

  // Request Response
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

  const { messages } = useIntl();

  return (
    <>
      <h2 className="title mb-2">{messages['admin.settings.ChangeCity.header']}</h2>
      {success && (
        <div className={classes.root}>
          <Alert severity="success">
            {messages['admin.settings.ChangeCity.success']}{' '}
          </Alert>
        </div>
      )}
      {responseError && (
        <div className={classes.root}>
          <Alert severity="warning">{responseError}</Alert>
        </div>
      )}
      <form>
        <div>
          {!currentCityLoading ? (
            <FormControl className={classes.formControl}>
              <Select
                className="mb-5"
                disabled={editing}
                value={changeMyCity}
                onChange={(event) => {
                  setResponseError(false);
                  if (
                    currentCityAPI.data &&
                    event.target.value.value !== currentCityAPI.data.cityID
                  ) {
                    setisCityChanged(true);
                  } else {
                    setisCityChanged(false);
                  }
                  return setChangeMyCity(event.target.value);
                }}
                // autoWidth
              >
                {allCitiesAPI?.data?.list?.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <CircularProgress />
          )}
        </div>

        <div className="alignBtn mt-3 mb-3 ml-2 mr-2">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!changeMyCity || success || getting || editing || !isCityChanged}
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
