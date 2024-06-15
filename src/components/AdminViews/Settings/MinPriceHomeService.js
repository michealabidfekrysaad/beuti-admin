/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import useAPI, { get, put } from 'hooks/useAPI';
import Loading from 'components/LoadingIndicator/index';
import { isNumbersWithoutDash } from 'functions/validate';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '85%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
    marginBottom: '2px',
  },
}));

export default function MinPriceHomeService({ callApi }) {
  // constant for minPrice
  const classes = useStyles();
  const [minimumPrice, setMinimumPrice] = useState(0);
  const [responseErrorPrice, setResponseErrorPrice] = useState('');
  const [successPrice, setSuccessPrice] = useState(false);
  const [submitPrice, setSubmitPrice] = useState(false);
  const [payloadPrice, setPayloadPrice] = useState(false);
  const [priceFromApi, setPriceFromApi] = useState(null);

  /* -------------------------------------------------------------------------- */
  /*                      API to get and send the minPrice                      */
  /* -------------------------------------------------------------------------- */
  const {
    response: currentMinimumChargeValue,
    gettingPrice,
    setRecall: callCurrentMinimumCharge,
  } = useAPI(get, 'ServiceProvider/GetHomeServicesMinimumCharge');

  const {
    response: editResponsePrice,
    isLoading: editingPrice,
    setRecall: callEditMinimumChargeNumber,
  } = useAPI(put, 'ServiceProvider/UpdateHomeServicesMinimumCharge', payloadPrice);

  useEffect(() => {
    if (successPrice) {
      setTimeout(() => {
        setSuccessPrice(false);
        setSubmitPrice(false);
      }, 3000);
    }
  }, [successPrice]);

  /* -------------------------------------------------------------------------- */
  /*                    the response of minPrice after submit                   */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (editResponsePrice?.error) {
      setResponseErrorPrice(editResponsePrice.error.message);
      setSubmitPrice(false);
    }
    if (editResponsePrice?.data?.success) {
      setPriceFromApi(minimumPrice);
      setSuccessPrice(true);
      setSubmitPrice(false);
    }
  }, [editResponsePrice]);

  /* -------------------------------------------------------------------------- */
  /*                      for the minPrice payload calling                      */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (payloadPrice) {
      callEditMinimumChargeNumber(true);
    }
  }, [payloadPrice]);

  useEffect(() => {
    if (currentMinimumChargeValue?.data) {
      setMinimumPrice(currentMinimumChargeValue?.data);
      setPriceFromApi(currentMinimumChargeValue?.data);
    }
  }, [currentMinimumChargeValue]);

  useEffect(() => {
    callCurrentMinimumCharge(callApi);
  }, [callApi]);

  /* -------------------------------------------------------------------------- */
  /*                          handle submit of minPric                          */
  /* -------------------------------------------------------------------------- */
  const handleSubmitPrice = () => {
    setSubmitPrice(true);
    setPayloadPrice({
      minimumCharge: minimumPrice,
    });
  };
  const { messages } = useIntl();
  return (
    <>
      <h2 className="mb-2 title">{messages['admin.settings.minimumPrice.header']}</h2>
      {successPrice && (
        <div className={classes.root}>
          <Alert severity="success">
            {messages['admin.settings.minimumPrice.success']}
          </Alert>
        </div>
      )}
      {responseErrorPrice && (
        <div className={classes.root}>
          <Alert severity="warning">{responseErrorPrice}</Alert>
        </div>
      )}
      {currentMinimumChargeValue ? (
        <form>
          <div className="form-group">
            <input
              disabled={submitPrice}
              placeholder={messages['admin.settings.minimumPrice.placeholder']}
              className="form-control"
              type="tel"
              value={minimumPrice}
              onChange={(e) => {
                setResponseErrorPrice(false);
                return isNumbersWithoutDash(e.target.value)
                  ? setMinimumPrice(e.target.value)
                  : null;
              }}
            />
            <small>{messages['admin.settings.minimumPrice.description']}</small>
            <small
              className={`form-text ${
                minimumPrice?.length > 6 ? 'text-danger' : 'text-muted'
              }`}
            >
              {messages['admin.setttings.minimumPrice.error']}
            </small>
          </div>
          <div className="alignBtn">
            <button
              type="button"
              onClick={handleSubmitPrice}
              disabled={
                !minimumPrice ||
                successPrice ||
                minimumPrice?.length < 1 ||
                minimumPrice?.length > 6 ||
                gettingPrice ||
                editingPrice ||
                +priceFromApi === +minimumPrice
              }
              className="btn btn-primary"
            >
              {submitPrice && (
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
      ) : (
        <div style={{ height: '100px' }}>
          <Loading />
        </div>
      )}
    </>
  );
}
