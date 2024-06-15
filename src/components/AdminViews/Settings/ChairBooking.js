/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import useAPI, { get, post } from 'hooks/useAPI';
import { isNumbersWithoutDash } from 'functions/validate';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '85%',
    margin: 'auto',

    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function ChariBookings({ callApi }) {
  const classes = useStyles();
  const [id, setId] = useState(null);
  const [isEnabled, setIsEnabled] = useState('');
  const [chairPrice, setChairPrice] = useState('');
  const [noOfChairs, setNoOfChairs] = useState('');
  const [responseError, setResponseError] = useState('');
  const [validationNumber, setValidationNumber] = useState(false);
  const [validationPrice, setValidationPrice] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [payload, setPayload] = useState(null);

  const { response: currentDetails, getting, setRecall: callCurrentDetails } = useAPI(
    get,
    'SPChair/Get',
  );

  const {
    response: editResponse,
    isLoading: editing,
    setRecall: callEditStatus,
  } = useAPI(post, 'SPChair/Update', payload);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(false);
        setSubmit(false);
        callCurrentDetails(true);
      }, 1500);
    }
    if (responseError) {
      setTimeout(() => {
        setResponseError('');
        setSubmit(false);
      }, 3000);
    }
  }, [success, responseError]);

  useEffect(() => {
    if (editResponse?.error) {
      setResponseError(editResponse.error.message);
      setSubmit(false);
    }
  }, [editResponse]);
  useEffect(() => {
    if (editResponse?.data?.success) {
      setSuccess(true);
      setSubmit(false);
    }
  }, [editResponse]);
  useEffect(() => {
    if (payload) {
      callEditStatus(true);
    }
  }, [payload]);

  useEffect(() => {
    if (currentDetails?.data) {
      setNoOfChairs(currentDetails.data.noOfChairs);
      setChairPrice(currentDetails.data.chairPrice);
      setIsEnabled(currentDetails.data.isEnabled);
      setId(currentDetails.data.id);
    }
  }, [currentDetails]);

  useEffect(() => {
    callCurrentDetails(callApi);
  }, [callApi]);
  const validateOnchairsNo = (e) => {
    if (+e.target.value >= 100) {
      setNoOfChairs(99);
    } else if (+e.target.value <= 0) {
      setNoOfChairs(null);
      setValidationNumber(true);
    } else {
      setNoOfChairs(+e.target.value);
      setValidationNumber(false);
    }
  };
  const validateOnChairsPrice = (e) => {
    if (+e.target.value <= 0) {
      setChairPrice(null);
      setValidationPrice(true);
    } else if (+e.target.value >= 1000) {
      setChairPrice(999);
    } else {
      setChairPrice(+e.target.value);
      setValidationPrice(false);
    }
  };

  const handleSubmit = () => {
    setSubmit(true);
    setPayload({ id, isEnabled, noOfChairs, chairPrice });
  };
  const { messages } = useIntl();
  return (
    <>
      <h3 className="title marginTitle">{messages['spAdmin.bookings.chairsList']}</h3>
      {success && (
        <div className={classes.root}>
          <Alert severity="success">
            {messages['admin.settings.onlineBookingChairs.success']}
          </Alert>
        </div>
      )}
      {responseError && (
        <div className={classes.root}>
          <Alert severity="warning">{responseError}</Alert>
        </div>
      )}
      {currentDetails && (
        <form>
          <div className="form-check">
            <input
              type="checkbox"
              checked={isEnabled}
              className="form-check-input"
              id="checkChair"
              onChange={() => setIsEnabled(!isEnabled)}
            />
            &nbsp;
            <label className="form-check-label" htmlFor="checkChair">
              {messages['settings.chairsBookings']}
            </label>
          </div>
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <h4 className="title" style={{ margin: 'calc(2rem - .14285714em) 0 1rem' }}>
                {messages['stAdmin.charis.chair.pricePerHour']}
              </h4>
              <div className="form-group">
                <input
                  disabled={submit}
                  placeholder={messages['stAdmin.charis.chair.pricePerHour']}
                  type="tel"
                  value={chairPrice}
                  className="form-control"
                  onChange={(e) =>
                    isNumbersWithoutDash(e.target.value) ? validateOnChairsPrice(e) : null
                  }
                />
              </div>
            </div>
            <div className="col-md-6 col-sm-12">
              <h4 className="title" style={{ margin: 'calc(2rem - .14285714em) 0 1rem' }}>
                {messages['settings.chairsNumber']}
              </h4>
              <div className="form-group">
                <input
                  disabled={submit}
                  placeholder={messages['settings.chairsNumber']}
                  type="tel"
                  value={noOfChairs}
                  className="form-control"
                  onChange={(e) =>
                    isNumbersWithoutDash(e.target.value) ? validateOnchairsNo(e) : null
                  }
                />
              </div>
            </div>
          </div>
          <div className="alignBtn">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={
                success || getting || editing || validationNumber || validationPrice
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
      )}
    </>
  );
}
