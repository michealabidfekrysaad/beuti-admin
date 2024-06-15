/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import useAPI, { get, post } from 'hooks/useAPI';
import Loading from 'components/LoadingIndicator/index';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '85%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
    marginBottom: '2px',
  },
}));

export default function CertificateNumber({ callApi }) {
  const classes = useStyles();
  const [certificateNumber, setCertificateNumber] = useState('');
  const [responseError, setResponseError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [payloadVerifyPhone, setPayloadVerifyPhone] = useState(null);
  const [payloadConfirmPhone, setPayloadConfirmPhone] = useState(null);
  const [openCode, setOpenCode] = useState(false);
  const [counterTime, setCounterTime] = useState(false);
  const [verificationCode, setVerificationCode] = useState(null);
  const [successCodeverifyMessage, setSuccessCodeverifyMessage] = useState(null);
  const [errorCodeverify, setErrorCodeverify] = useState(null);
  const [stoptimer, setStopTimer] = useState(null);

  const {
    response: serviceProviderDetails,
    getting,
    setRecall: recallServiceProviderDetails,
  } = useAPI(get, 'ServiceProvider/serviceProviderProfile');

  const {
    response: verifyPhoneREs,
    isLoading: loadVerifyPhone,
    setRecall: callVerifyPhone,
  } = useAPI(
    post,
    'FreelanceCertificate/VerifyPortalRegisteredPhone',
    payloadVerifyPhone,
  );

  const {
    response: confirmRegisteredPhoneRes,
    isLoading: loadConfirmPhone,
    setRecall: callConfirmPhone,
  } = useAPI(
    post,
    'FreelanceCertificate/ConfirmPortalRegisteredPhone',
    payloadConfirmPhone,
  );

  useEffect(() => {
    resetComponent();
    recallServiceProviderDetails(callApi);
  }, [callApi]);

  useEffect(() => {
    if (counterTime > 1 && +counterTime <= 3600) {
      setStopTimer(setTimeout(() => setCounterTime(counterTime - 1), 1000));
    }
  }, [counterTime]);

  /* -------------------------------------------------------------------------- */
  /*                      handle API to first verify phone                      */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (payloadVerifyPhone) {
      setCounterTime(false);
      callVerifyPhone(true);
    }
  }, [payloadVerifyPhone]);

  useEffect(() => {
    if (verifyPhoneREs?.error) {
      setResponseError(verifyPhoneREs.error.message);
      setTimeout(() => setResponseError(false), [3000]);
      setSubmit(false);
      setOpenCode(false);
      setCounterTime(false);
      setVerificationCode(null);
    }
    if (verifyPhoneREs?.data?.isSuccess) {
      setCounterTime(+verifyPhoneREs?.data?.remainingBlockTime);
      if (!verifyPhoneREs?.data?.isPhoneConfirmationRequired) {
        setSuccess(verifyPhoneREs?.data?.message);
      } else {
        setSuccess(messages['admin.settings.certificateNumber.success']);
        setOpenCode(
          verifyPhoneREs?.data?.isSuccess &&
            verifyPhoneREs?.data?.isPhoneConfirmationRequired,
        );
      }
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
      setSubmit(false);
    }
  }, [verifyPhoneREs]);

  /* -------------------------------------------------------------------------- */
  /*                 handle API for send code and confirm phone                 */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (payloadConfirmPhone) {
      callConfirmPhone(true);
    }
  }, [payloadConfirmPhone]);

  useEffect(() => {
    if (confirmRegisteredPhoneRes?.error) {
      setErrorCodeverify(confirmRegisteredPhoneRes?.error?.message);
      setTimeout(() => {
        setErrorCodeverify(false);
      }, 3000);
    }
    if (confirmRegisteredPhoneRes?.data) {
      setCounterTime(false);
      setSuccessCodeverifyMessage(confirmRegisteredPhoneRes?.data?.message);
      setOpenCode(false);
      setTimeout(() => {
        setSuccessCodeverifyMessage(false);
      }, 3000);
      resetComponent();
    }
  }, [confirmRegisteredPhoneRes]);

  useEffect(() => {
    if (serviceProviderDetails?.data) {
      setCertificateNumber(
        serviceProviderDetails?.data?.freeLancePortalRegisteredPhone ||
          serviceProviderDetails?.data?.userPhone,
      );
    }
  }, [serviceProviderDetails]);

  const verifyCode = () => {
    if (verificationCode) {
      setPayloadConfirmPhone({
        phone: certificateNumber,
        code: verificationCode,
      });
    }
  };

  const resetComponent = () => {
    setSuccess(false);
    setSubmit(false);
    setPayloadVerifyPhone(null);
    setPayloadConfirmPhone(null);
    setOpenCode(false);
    setCounterTime(false);
    setVerificationCode(null);
    clearTimeout(stoptimer);
  };

  const handleSubmit = () => {
    clearTimeout(stoptimer);
    setSubmit(true);
    setPayloadVerifyPhone({
      phone: certificateNumber,
    });
  };

  const { messages } = useIntl();
  return (
    <>
      {successCodeverifyMessage && (
        <Alert severity="success">{successCodeverifyMessage}</Alert>
      )}
      {errorCodeverify && <Alert severity="error">{errorCodeverify}</Alert>}
      {success && (
        <div className={classes.root}>
          <Alert severity="success">{success}</Alert>
        </div>
      )}
      {responseError && (
        <div className={classes.root}>
          <Alert severity="warning">{responseError}</Alert>
        </div>
      )}
      <h2 className="title mb-2 mt-2">
        {messages['admin.settings.certificateNumber.header']}
      </h2>
      {serviceProviderDetails ? (
        <form>
          <div className="form-group">
            <input
              disabled={submit || verificationCode || openCode}
              placeholder={messages['admin.settings.certificateNumber.placeholder']}
              className="form-control"
              type="tel"
              value={certificateNumber}
              onChange={(e) => {
                setResponseError(false);
                return setCertificateNumber(e.target.value);
              }}
            />
            {certificateNumber?.length > 10 && (
              <small className="text-danger">
                {messages['admin.setttings.certificateNumber.error']}
              </small>
            )}
          </div>
          {openCode && (
            <>
              <h2 className="title mb-2">
                {messages['admin.settings.certificateNumber.header.code']}
              </h2>
              <div className="form-group">
                <input
                  disabled={submit}
                  placeholder={
                    messages['admin.settings.certificateNumber.placeholder.code']
                  }
                  className="form-control"
                  type="tel"
                  value={verificationCode}
                  onChange={(e) => {
                    setResponseError(false);
                    return e.target.value.length <= 4
                      ? setVerificationCode(e.target.value)
                      : null;
                  }}
                />
                {verificationCode?.length > 4 && (
                  <small className="text-danger">
                    {messages['admin.setttings.certificateNumber.code.error']}
                  </small>
                )}
              </div>
            </>
          )}
          <a href="https://freelance.sa/app/ar/users/sign_up">
            {messages['admin.settings.certificateNumber.noCertificate']}
          </a>
          <div className="alignBtn">
            <button
              type="button"
              onClick={!openCode ? handleSubmit : verifyCode}
              disabled={
                !certificateNumber ||
                certificateNumber?.length < 10 ||
                certificateNumber?.length > 10 ||
                getting ||
                loadVerifyPhone ||
                (openCode && verificationCode?.length !== 4)
              }
              className="btn btn-primary ml-2 mr-2"
            >
              {submit && (
                <span
                  className="spinner-border spinner-border-sm spinnerMr"
                  role="status"
                  aria-hidden="true"
                ></span>
              )}{' '}
              {messages['admin.settings.certificateNumber.btn']}
            </button>
            {openCode && counterTime >= 1 && (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={+counterTime !== 1 || loadConfirmPhone || loadVerifyPhone}
                className="btn btn-primary ml-2 mr-2"
              >
                {submit && (
                  <span
                    className="spinner-border spinner-border-sm spinnerMr"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )}
                {+counterTime !== 1
                  ? `${messages['admin.settings.certificateNumber.resend']}(${counterTime})`
                  : `${messages['admin.settings.certificateNumber.resend']}`}
              </button>
            )}
          </div>
        </form>
      ) : (
        <div style={{ height: '100px' }}>
          <Loading />
        </div>
      )}
    </>
  );
}
