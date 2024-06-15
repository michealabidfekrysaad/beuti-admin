/* eslint-disable no-unused-expressions */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import moment from 'moment';
import {
  TextField,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { isNumbersOnly } from 'functions/validate';

import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
    width: '100%',
  },
  formControl: {
    minWidth: '100%',
    marginTop: theme.spacing(1),
  },
  selectEmpty: {
    flexDirection: 'row-reverse',
  },
}));

function ServiceProviderSearch({
  setQuery,
  listLoading,
  query: searchExists,
  countDataResponse,
  totalCountResponse,
}) {
  const classes = useStyles();
  moment.locale('en');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [registerationMethod, setRegisterationMethod] = useState('none');
  const [clearRegMethod, setClearRegMethod] = useState(false);
  const [hasBooking, setHasBooking] = useState(2);
  const [clearHasBooking, setClearHasBooking] = useState(false);
  const [hasBalance, setHasBalance] = useState(2);
  const [clearHasBalance, setClearHasBalance] = useState(false);
  const { messages } = useIntl();
  const dropDownScope = 'sAdmin.spList.search.dropdown';

  const clearSelect = {
    position: 'absolute',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: 'none',
    padding: '0px',
  };
  const btnStyle = {
    fontSize: '1rem',
    minHeight: '45%',
    pointerEvents: 'none',
  };
  function clearSearchFields() {
    const firstPageBtn = document.getElementById('first-page');
    if (firstPageBtn) {
      firstPageBtn.click();
    }
    // visitFirstPage();
    setName('');
    setMobile('');
    setEmail('');
    setRegisterationMethod('none');
    setClearRegMethod(false);
    setHasBooking('none');
    setClearHasBooking(false);
    setHasBalance('none');
    setClearHasBalance(false);
    setQuery('');
  }

  //   function visitFirstPage() {
  //     const firstPageBtn = document.getElementById('first-page');
  //     if (firstPageBtn) {
  //       firstPageBtn.click();
  //     }
  //   }

  const handleSearch = () => {
    // creating query
    let query = '';
    if (name) {
      query
        ? (query += ` and contains(name,'${name}') eq true`)
        : (query += `contains(name,'${name}') eq true`);
    }
    if (mobile) {
      query
        ? (query += ` and contains(phoneNumber,'${mobile}') eq true`)
        : (query += `contains(phoneNumber,'${mobile}') eq true`);
    }
    if (email) {
      query
        ? (query += ` and contains(email,'${email}') eq true`)
        : (query += `contains(email,'${email}') eq true`);
    }
    if (registerationMethod !== 'none') {
      query
        ? (query += ` and contains(registerationMethod,'${registerationMethod}') eq true`)
        : (query += `contains(registerationMethod,'${registerationMethod}') eq true`);
    }
    if (hasBooking !== 'none') {
      if (+hasBooking === 0) {
        query
          ? (query += ` and noOfClosedBookings eq 0 `)
          : (query += `noOfClosedBookings eq 0 `);
      } else if (+hasBooking === 1) {
        query
          ? (query += ` and noOfClosedBookings gt 0 `)
          : (query += `noOfClosedBookings gt 0 `);
      } else {
        query += '';
      }
    }
    if (hasBalance !== 'none') {
      if (+hasBalance === 0) {
        query ? (query += ` and walletBalance eq 0 `) : (query += `walletBalance eq 0 `);
      } else if (+hasBalance === 1) {
        query ? (query += ` and walletBalance gt 0 `) : (query += `walletBalance gt 0 `);
      } else {
        query += '';
      }
    }
    setQuery(`${query}`); // sets query & recall via useEffect in parent function
    // visitFirstPage();
  };

  // customer register by three ways
  const registerMethodDD = [
    { key: 0, value: 'Email', text: messages[`${dropDownScope}.email`] },
    { key: 1, value: 'Apple', text: messages[`${dropDownScope}.apple`] },
    { key: 2, value: 'Google', text: messages[`${dropDownScope}.google`] },
  ];
  // customer has booking or not by default
  const hasBookingDD = [
    { key: 2, value: 2, text: messages[`${dropDownScope}.hasBookingDefault`] },
    { key: 1, value: 1, text: messages[`${dropDownScope}.hasBooking`] },
    { key: 0, value: 0, text: messages[`${dropDownScope}.hasNotBooking`] },
  ];
  // cutomer has banlance or not by default
  const hasBalanceDD = [
    { key: 2, value: 2, text: messages[`${dropDownScope}.hasBalanceDefault`] },
    { key: 1, value: 1, text: messages[`${dropDownScope}.hasBalance`] },
    { key: 0, value: 0, text: messages[`${dropDownScope}.hasNotBalance`] },
  ];

  const handleRegisterationMethodSelection = ({ target }) => {
    setRegisterationMethod(target.value);
    setClearRegMethod(true);
  };
  const handleHasBookingSelection = ({ target }) => {
    setHasBooking(target.value);
    setClearHasBooking(true);
  };
  const handleHasBalanceSelection = ({ target }) => {
    setHasBalance(target.value);
    setClearHasBalance(true);
  };

  return (
    <>
      <div>
        {/* search by name, Mobile, email, registerationMethod */}
        <div className="row mb-1">
          <div className="col-lg-3 col-6">
            <form noValidate>
              <TextField
                type="text"
                className={`${classes.margin} paddingLef`}
                placeholder={messages[`${dropDownScope}.name`]}
                value={name}
                onChange={(e) => setName(e.target.value)}
                InputProps={{
                  startAdornment: <i className="flaticon2-user text-default px-2"></i>,
                }}
              />
            </form>
          </div>
          <div className="col-lg-3 col-6">
            <form noValidate>
              <TextField
                className={`${classes.margin} paddingLef`}
                placeholder={messages[`${dropDownScope}.mobile`]}
                value={mobile}
                onChange={(e) =>
                  isNumbersOnly(e.target.value) && e.target.value.length <= 10
                    ? setMobile(e.target.value)
                    : null
                }
                type="tel"
                InputProps={{
                  startAdornment: <i className="flaticon2-phone text-default px-2"></i>,
                }}
              />
            </form>
          </div>
          <div className="col-lg-3 col-6">
            <form noValidate>
              <TextField
                type="text"
                className={`${classes.margin} paddingLef`}
                placeholder={messages[`${dropDownScope}.email`]}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <i className="flaticon2-email text-default px-2 font-weight"></i>
                  ),
                }}
              />
            </form>
          </div>
          <div className="col-lg-3 col-6">
            <FormControl className={classes.formControl}>
              <Select
                defaultValue="none"
                autoWidth
                value={registerationMethod}
                onChange={handleRegisterationMethodSelection}
                className={`${classes.selectEmpty} ${!clearRegMethod && 'disableColor'}`}
                IconComponent={() => (
                  <>
                    <i className="flaticon-letter-g text-default px-2"></i>
                    {clearRegMethod && (
                      <button
                        type="button"
                        style={clearSelect}
                        onClick={() => {
                          setRegisterationMethod('none');
                          setClearRegMethod(false);
                        }}
                      >
                        <i className="flaticon-close text-default"></i>
                      </button>
                    )}
                  </>
                )}
              >
                <MenuItem value="none" disabled>
                  {messages[`${dropDownScope}.registerationMethod`]}
                </MenuItem>
                {registerMethodDD &&
                  registerMethodDD.map((stat) => (
                    <MenuItem
                      key={stat.key}
                      className="selectDropDown"
                      value={stat.value}
                    >
                      {stat.text}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>
        </div>
        <div className="row mb-1">
          <div className="col-lg-3 col-md-6 px-4">
            <FormControl className={classes.formControl}>
              <Select
                defaultValue="none"
                autoWidth
                value={hasBooking}
                onChange={handleHasBookingSelection}
                className={`${classes.selectEmpty} ${!clearHasBooking && 'disableColor'}`}
                IconComponent={() => (
                  <>
                    <i className="flaticon2-bell text-default px-2"></i>
                    {clearHasBooking && hasBooking !== 2 && (
                      <button
                        type="button"
                        style={clearSelect}
                        onClick={() => {
                          setHasBooking(2);
                          setClearHasBooking(false);
                        }}
                      >
                        <i className="flaticon-close text-default"></i>
                      </button>
                    )}
                  </>
                )}
              >
                {hasBookingDD &&
                  hasBookingDD.map((stat) => (
                    <MenuItem
                      key={stat.key}
                      className="selectDropDown"
                      value={stat.value}
                    >
                      {stat.text}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>
          <div className="col-lg-3 col-md-6 px-4">
            <FormControl className={classes.formControl}>
              <Select
                defaultValue="none"
                autoWidth
                value={hasBalance}
                onChange={handleHasBalanceSelection}
                className={`${classes.selectEmpty} ${!clearHasBalance && 'disableColor'}`}
                IconComponent={() => (
                  <>
                    <i className="flaticon-coins text-default px-2 font-weight"></i>
                    {clearHasBalance && hasBalance !== 2 && (
                      <button
                        type="button"
                        style={clearSelect}
                        onClick={() => {
                          setHasBalance(2);
                          setClearHasBalance(false);
                        }}
                      >
                        <i className="flaticon-close text-default"></i>
                      </button>
                    )}
                  </>
                )}
              >
                {hasBalanceDD &&
                  hasBalanceDD.map((stat) => (
                    <MenuItem
                      key={stat.key}
                      className="selectDropDown"
                      value={stat.value}
                    >
                      {stat.text}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>
          <div className="col-lg-6 col-md-12 col-sm-12 d-flex justify-content-center align-items-center mt-2">
            <>
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
                  {totalCountResponse} {messages['common.total']}
                </Button>
              )}
              {listLoading && (
                <Button variant="contained" style={btnStyle}>
                  <CircularProgress size={24} className="mx-auto" color="secondary" />
                </Button>
              )}
            </>
          </div>
        </div>
      </div>
    </>
  );
}

ServiceProviderSearch.propTypes = {
  setQuery: PropTypes.func,
  listLoading: PropTypes.bool,
  query: PropTypes.string,
  totalCountResponse: PropTypes.number,
  countDataResponse: PropTypes.number,
};

export default ServiceProviderSearch;
