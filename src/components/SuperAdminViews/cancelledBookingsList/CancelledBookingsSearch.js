import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Button, TextField, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddToCalendarSelect from 'components/shared/AddToCalendarSelect';
import moment from 'moment';
import { isNumbersOnly } from 'functions/validate';
const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
    width: '100%',
  },
}));
function CancelledBookingSearch({
  setQuery,
  query: searchExists,
  countDataResponse,
  totalCountResponse,
  listLoading,
}) {
  const classes = useStyles();
  moment.locale('en');
  const [name, setName] = useState(''); // sp_name
  const [number, setNumber] = useState(''); // sp_number
  const [customerName, setCustomerName] = useState(''); // customer_name
  const [customerNumber, setCustomerNumber] = useState(''); // customer_number
  const [durationDate, setDurationDate] = useState({
    from: null,
    to: null,
  });
  const { messages } = useIntl();
  const btnStyle = {
    fontSize: '1rem',
    minHeight: '45%',
    pointerEvents: 'none',
  };

  function visitFirstPage() {
    const firstPageBtn = document.getElementById('first-page');
    if (firstPageBtn) {
      firstPageBtn.click();
    }
  }

  function clearSearchFields() {
    const firstPageBtn = document.getElementById('first-page');
    if (firstPageBtn) {
      firstPageBtn.click();
    }
    visitFirstPage();
    setName('');
    setNumber('');
    setCustomerName('');
    setCustomerNumber('');
    setDurationDate({
      from: null,
      to: null,
    });
    setQuery('');
  }

  const handleSearch = () => {
    let query = '';
    if (name) query += `&sPName=${name}`;
    if (number) query += `&sPNumber=${number}`;
    if (customerName) query += `&customerName=${customerName}`;
    if (customerNumber) query += `&customerNumber=${customerNumber}`;
    if (durationDate.from && durationDate.to) {
      query += `&bookingDateFrom=${durationDate.from}`;
      query += `&bookingDateTo=${durationDate.to}`;
    }
    setQuery(query); // sets query & recall via useEffect in parent function
    visitFirstPage();
  };

  return (
    <div className="w-100">
      <div className="row">
        <div className="col-6">
          <TextField
            id="outlined-basic"
            className={`${classes.margin} paddingLef`}
            placeholder={messages[`common.spName`]}
            value={name}
            onChange={(e) => e.target.value.length <= 50 && setName(e.target.value)}
            InputProps={{
              startAdornment: <i className="flaticon2-user text-default px-2"></i>,
            }}
          />
        </div>
        <div className="col-6">
          <TextField
            id="outlined-basic"
            className={`${classes.margin} paddingLef`}
            placeholder={messages[`common.spNumber`]}
            value={number}
            onChange={(e) =>
              isNumbersOnly(e.target.value) && e.target.value.length <= 10
                ? setNumber(e.target.value)
                : null
            }
            type="tel"
            InputProps={{
              startAdornment: <i className="flaticon2-phone text-default px-2"></i>,
            }}
          />
        </div>
        {/* Mobile search entry */}
      </div>
      <div className="row">
        <div className="col-6">
          <TextField
            id="outlined-basic"
            className={`${classes.margin} paddingLef`}
            value={customerName}
            placeholder={messages[`common.customerName`]}
            onChange={(e) =>
              e.target.value.length <= 50 && setCustomerName(e.target.value)
            }
            InputProps={{
              startAdornment: <i className="flaticon2-user text-default px-2"></i>,
            }}
          />
        </div>
        <div className="col-6">
          <TextField
            id="outlined-basic"
            className={`${classes.margin} paddingLef`}
            placeholder={messages[`common.customerNumber`]}
            value={customerNumber}
            onChange={(e) =>
              isNumbersOnly(e.target.value) && e.target.value.length <= 10
                ? setCustomerNumber(e.target.value)
                : null
            }
            type="tel"
            InputProps={{
              startAdornment: <i className="flaticon2-phone text-default px-2"></i>,
            }}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-lg-6 col-md-12 px-4">
          <AddToCalendarSelect
            duration={durationDate}
            setDuration={setDurationDate}
            allowPast
          />
        </div>
        <div className="col-lg-6 col-md-12 col-sm-12 d-flex justify-content-center align-items-center">
          <button
            onClick={handleSearch}
            type="button"
            className="icon-wrapper-btn btn-icon-primary mx-2 font-col text-primary"
            title={messages['common.search']}
          >
            <i className="flaticon2-search  la-1x text-primary"></i>{' '}
            {messages['common.search']}
          </button>

          <button
            onClick={clearSearchFields}
            type="button"
            className="icon-wrapper-btn btn-icon-danger mx-2 font-col text-danger"
            title={messages['common.clear']}
          >
            <i className="flaticon2-refresh-button la-1x text-danger"></i>{' '}
            {messages['common.clear']}
          </button>

          {/* eslint-disable-next-line no-nested-ternary */}
          {searchExists.length > 0 && countDataResponse === 0 && !listLoading && (
            <Button variant="contained" style={btnStyle}>
              <i className="flaticon-exclamation-2 text-warning"></i>&nbsp;
              {messages['common.noDataFound']}
            </Button>
          )}
          {searchExists.length > 0 && countDataResponse > 0 && !listLoading && (
            <Button variant="contained" style={btnStyle}>
              <i className="flaticon2-checkmark text-success"></i>&nbsp;
              {`${countDataResponse} ${messages['common.results']}`}
            </Button>
          )}
          {searchExists.length === 0 && !listLoading && (
            <Button variant="contained" style={btnStyle}>
              <i className="flaticon-more-1 text-default"></i>&nbsp;
              {totalCountResponse} {messages['common.total']}
            </Button>
          )}
          {listLoading && (
            <Button variant="contained" style={btnStyle}>
              <CircularProgress size={24} className="mx-auto" color="secondary" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

CancelledBookingSearch.propTypes = {
  setQuery: PropTypes.func,
  query: PropTypes.string,
  totalCountResponse: PropTypes.number,
  countDataResponse: PropTypes.number,
  listLoading: PropTypes.bool,
};

export default CancelledBookingSearch;

// {searchExists && totalCountResponse > 0 && countDataResponse > 0 ? (
