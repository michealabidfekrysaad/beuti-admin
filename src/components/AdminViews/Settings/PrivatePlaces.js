/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import useAPI, { get, put } from 'hooks/useAPI';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '85%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function TogglePrivatePlacesStatus({ callApi }) {
  const classes = useStyles();
  const [currentStatus, setCurrentStatus] = useState(false);
  const [responseError, setResponseError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [payload, setPayload] = useState(null);

  const { response: currentDetails, getting, setRecall: callCurrentDetails } = useAPI(
    get,
    'ServiceProvider/isGoPrivatPlace',
  );

  const {
    response: editResponse,
    isLoading: editing,
    setRecall: callEditStatus,
  } = useAPI(put, 'ServiceProvider/goPrivatPlace', payload);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(false);
        setSubmit(false);
        callCurrentDetails(true);
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
    }
  }, [editResponse]);

  useEffect(() => {
    if (payload === true || payload === false) {
      callEditStatus(true);
    }
  }, [payload]);

  useEffect(() => {
    if (currentDetails) {
      setCurrentStatus(currentDetails.data);
    }
  }, [currentDetails]);

  useEffect(() => {
    callCurrentDetails(callApi);
  }, [callApi]);

  const handleSubmit = () => {
    setSubmit(true);
    setPayload(!currentStatus);
  };
  const { messages } = useIntl();
  return (
    <>
      <h2 className="title mb-2">
        {messages['admin.settings.TogglePrivatePlacesStatus']}
      </h2>
      {success && (
        <div className={classes.root}>
          <Alert severity="success">
            {messages['admin.settings.TogglePrivatePlaces.success']}
          </Alert>
        </div>
      )}
      {responseError && (
        <div className={classes.root}>
          <Alert severity="warning">{responseError}</Alert>
        </div>
      )}
      <>
        <div
          style={{ borderTop: `2px solid ${currentStatus ? 'green' : 'red'}` }}
          className="divBoxShadow"
        >
          {`
            ${messages['admin.settings.TogglePrivatePlacesStatus']} :
            ${currentStatus ? messages['common.Active'] : messages['common.InActive']}`}
        </div>
        <div className="alignBtn mt-3 mb-3 ml-2 mr-2">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={success || getting || editing}
          >
            {submit && (
              <span
                className="spinner-border spinner-border-sm spinnerMr"
                role="status"
                aria-hidden="true"
              ></span>
            )}{' '}
            {currentStatus ? messages['common.deactivate'] : messages['common.activate']}
          </button>
        </div>
      </>
    </>
  );
}
