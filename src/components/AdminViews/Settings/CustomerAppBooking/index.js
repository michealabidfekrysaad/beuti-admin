/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import useAPI, { get, put } from 'hooks/useAPI';
import { HandleSuccessAndErrorMsg } from 'functions/HandleSuccessAndErrorMsg';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '85%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function CustomerAppBooking({ callApi }) {
  const classes = useStyles();
  const [currentStatus, setCurrentStatus] = useState(null);
  const [responseError, setResponseError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [payload, setPayload] = useState(null);
  const [currentBwStatus, setCurrentBwStatus] = useState(null);
  const [responseBwError, setResponseBwError] = useState('');
  const [successBw, setSuccessBw] = useState(false);
  const [queryBwStatus, setQueryBwStatus] = useState(null);
  const [submitBw, setSubmitBw] = useState(false);
  const scope = 'admin.settings';

  /* -------------------------------------------------------------------------- */
  /*               api for get,set the customer-app-booking-status              */
  /* -------------------------------------------------------------------------- */
  const { response: currentDetails, setRecall: callCurrentDetails } = useAPI(
    get,
    'ServiceProvider/ServiceProviderDetail',
  );

  const { response: editResponse, setRecall: callEditStatus } = useAPI(
    put,
    'ServiceProvider/enableDisableOnlineBooking',
    payload,
  );

  /* -------------------------------------------------------------------------- */
  /*                    api for get-set booking-wizard statu                   */
  /* -------------------------------------------------------------------------- */
  const { response: BwCurrentStatus, setRecall: callCurrentBwStatus } = useAPI(
    get,
    'ServiceProvider/BookingWizardEnabled',
  );

  const { response: editResponseBwStatus, setRecall: callEditBwStatus } = useAPI(
    put,
    `ServiceProvider/BookingWizardEnabled?isBookingWizardEnabled=${queryBwStatus}`,
  );
  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSubmit(false);
        callCurrentDetails(true);
      }, 3000);
    }
  }, [success]);
  useEffect(() => {
    if (successBw) {
      setTimeout(() => {
        setSubmitBw(false);
        callCurrentBwStatus(true);
      }, 3000);
    }
  }, [successBw]);

  useEffect(() => {
    if (editResponse?.error) {
      HandleSuccessAndErrorMsg(setResponseError, editResponse.error.message);
      setSubmit(false);
    }
    if (editResponse?.data) {
      HandleSuccessAndErrorMsg(setSuccess, true);
    }
  }, [editResponse]);

  useEffect(() => {
    if (editResponseBwStatus?.error) {
      HandleSuccessAndErrorMsg(setResponseBwError, editResponseBwStatus?.error?.message);
      setSubmitBw(false);
    }

    if (editResponseBwStatus?.data) {
      HandleSuccessAndErrorMsg(setSuccessBw, true);
    }
  }, [editResponseBwStatus]);

  useEffect(() => {
    if (payload) {
      callEditStatus(true);
    }
  }, [payload]);

  useEffect(() => {
    if (currentDetails?.data) {
      setCurrentStatus(currentDetails?.data?.onlineBookings);
    }
    if (BwCurrentStatus?.data) {
      setCurrentBwStatus(BwCurrentStatus?.data?.data);
    }
  }, [currentDetails, BwCurrentStatus]);

  useEffect(() => {
    callCurrentDetails(callApi);
    callCurrentBwStatus(callApi);
    setSubmitBw(false);
    setSubmit(false);
  }, [callApi]);

  const handleSubmit = () => {
    setSubmit(true);
    setPayload({
      isOffline: currentStatus,
    });
  };
  const handleSubmitBw = () => {
    setSubmitBw(true);
    setQueryBwStatus(!currentBwStatus);
    callEditBwStatus(true);
  };
  const { messages } = useIntl();
  return (
    <div className="row">
      <div className="col-12">
        <h2 className="title mb-2">{messages[`${scope}.onlineBookingStatus`]}</h2>
        {success && (
          <div className={classes.root}>
            <Alert severity="success">{messages[`${scope}.onlineBooking.success`]}</Alert>
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
            ${messages[`${scope}.onlineBookingStatus.current`]} :
            ${currentStatus ? messages['common.Enable'] : messages['common.disable']}`}
          </div>

          <div className="alignBtn mt-3 mb-3 ml-2 mr-2">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={currentStatus === null || success || submit}
            >
              {submit && (
                <span
                  className="spinner-border spinner-border-sm spinnerMr"
                  role="status"
                  aria-hidden="true"
                ></span>
              )}{' '}
              {currentStatus
                ? messages['common.deactivate']
                : messages['common.activate']}
            </button>
          </div>
        </>
      </div>
      <div className="col-12">
        <h2 className="title mb-2">{messages[`${scope}.BookingWizardBookings`]}</h2>
        {successBw && (
          <div className={classes.root}>
            <Alert severity="success">
              {messages[`${scope}.BookingWizardBookings.success`]}
            </Alert>
          </div>
        )}
        {responseBwError && (
          <div className={classes.root}>
            <Alert severity="warning">{responseBwError}</Alert>
          </div>
        )}
        <>
          <div
            style={{ borderTop: `2px solid ${currentBwStatus ? 'green' : 'red'}` }}
            className="divBoxShadow"
          >
            {`
            ${messages[`${scope}.BookingWizardBookings.current`]} :
            ${currentBwStatus ? messages['common.Enable'] : messages['common.disable']}`}
          </div>

          <div className="alignBtn mt-3 mb-3 ml-2 mr-2">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmitBw}
              disabled={currentBwStatus === null || successBw || submitBw}
            >
              {submitBw && (
                <span
                  className="spinner-border spinner-border-sm spinnerMr"
                  role="status"
                  aria-hidden="true"
                ></span>
              )}{' '}
              {currentBwStatus
                ? messages['common.deactivate']
                : messages['common.activate']}
            </button>
          </div>
        </>
      </div>
    </div>
  );
}
