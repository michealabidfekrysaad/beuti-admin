import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import moment from 'moment';
import AddToCalendarSelect from 'components/shared/AddToCalendarSelect';
import {
  TextField,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import useAPI, { get } from 'hooks/useAPI';
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
  const [status, setStatus] = useState('none');
  const [clearStatus, setClearStatus] = useState(false);
  const [comission, setComission] = useState('none');
  const [clearComission, setClearComission] = useState(false);
  const [information, setInformation] = useState('none');
  const [clearInfo, setClearInfo] = useState(false);
  const [businessType, setBusinessType] = useState('none');
  const [cityDD, setCityDD] = useState([]);
  const [businessDD, setBusiness] = useState([]);
  const [clearBusiness, setClearBusiness] = useState(false);
  const [city, setCity] = useState('none');
  const [clearCity, setClearCity] = useState(false);
  const [cityAPI, bussinessCat] = [
    'City/ViewCityList',
    'BusinessCategory/GetAllBussinessCategories',
  ];
  const { response: cityList, setRecall: recallCities } = useAPI(get, cityAPI);
  const { response: businessCategory, setRecall: callBuisness } = useAPI(
    get,
    bussinessCat,
  );
  const [durationDate, setDurationDate] = useState({
    from: null,
    to: null,
  });
  const { locale, messages } = useIntl();
  const dropDownScope = 'sAdmin.spList.search.dropdown';
  const imageStyle = {
    display: 'inline',
    marginLeft: `${locale === 'ar' ? '0.2em' : ''}`,
    marginRight: `${locale === 'ar' ? '' : '0.2em'}`,
    width: '22px',
  };
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
    visitFirstPage();
    setName('');
    setMobile('');
    setStatus('none');
    setClearStatus(false);
    setComission('none');
    setClearComission(false);
    setInformation('none');
    setClearInfo(false);
    setBusinessType('none');
    setClearBusiness(false);
    setCity('none');
    setClearCity(false);
    setDurationDate({
      from: null,
      to: null,
    });
    setQuery('');
  }

  function visitFirstPage() {
    const firstPageBtn = document.getElementById('first-page');
    if (firstPageBtn) {
      firstPageBtn.click();
    }
  }

  const handleSearch = () => {
    // creating query
    let query = '';
    if (name) query += `&name=${name}`;
    if (mobile) query += `&mobile=${mobile}`;
    if (city !== 'none') query += `&city=${city}`;
    if (+status === 1) {
      query += `&status=true`;
    } else if (+status === 0) {
      query += `&status=false`;
    } else {
      query += '';
    }
    if (+comission === 0) {
      query += `&HasCommission=true`;
    } else if (+comission === 1) {
      query += `&HasCommission=false`;
    } else {
      query += '';
    }
    if (+information === 0) {
      query += `&notActivatedCompleted=true`;
    } else if (+information === 1) {
      query += `&notActivatedCompleted=false`;
    } else {
      query += '';
    }
    if (businessType !== 'none') query += `&BusinessCategoryId=${businessType}`;
    if (durationDate.from && durationDate.to) {
      query += `&registrationDateFrom=${durationDate.from}`;
      query += `&registrationDateTo=${durationDate.to}`;
    }
    setQuery(query); // sets query & recall via useEffect in parent function
    visitFirstPage();
  };

  // Status dropdown
  const statusDD = [
    { key: 0, value: 0, text: messages[`${dropDownScope}.inactiveOnly`] },
    { key: 1, value: 1, text: messages[`${dropDownScope}.activeOnly`] },
  ];
  // Comission dropdown
  const comissionDD = [
    { key: 0, value: 0, text: messages[`${dropDownScope}.withComission`] },
    { key: 1, value: 1, text: messages[`${dropDownScope}.withoutComission`] },
  ];
  // complete data and not activated  drop-down
  const informationDD = [
    { key: 0, value: 0, text: messages[`${dropDownScope}.informattionCompleted`] },
    { key: 1, value: 1, text: messages[`${dropDownScope}.informattionNotCompleted`] },
  ];

  useEffect(() => {
    if (cityList && cityList.data && cityList.data.list) {
      const cityDDGen = cityList.data.list.map((cityData, i) => ({
        key: i,
        text: cityData.name,
        value: cityData.id,
      }));
      setCityDD(cityDDGen);
    }
    if (businessCategory && businessCategory.data && businessCategory.data.list) {
      const businessCatGenerate = businessCategory.data.list.map((businessCat, i) => ({
        key: i,
        text: businessCat.name,
        value: businessCat.id,
        image: { avatar: true, src: businessCat.image },
      }));
      setBusiness(businessCatGenerate);
    }
  }, [cityList, businessCategory]);

  useEffect(() => {
    recallCities(true);
    callBuisness(true);
  }, []);

  const handleCitySelection = ({ target }) => {
    setCity(target.value);
    setClearCity(true);
  };
  const handleStatusSelection = ({ target }) => {
    setStatus(target.value);
    setClearStatus(true);
  };
  const handleComissionSelection = ({ target }) => {
    setComission(target.value);
    setClearComission(true);
  };
  const handleInformationSelection = ({ target }) => {
    setInformation(target.value);
    setClearInfo(true);
  };
  const handleGctSelection = ({ target }) => {
    setBusinessType(target.value);
    setClearBusiness(true);
  };

  return (
    <>
      <div className="search-sp-list">
        {/* search by name, Mobile, city, status */}
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
            <FormControl className={classes.formControl}>
              <Select
                defaultValue="none"
                autoWidth
                value={city}
                onChange={handleCitySelection}
                className={`${classes.selectEmpty} ${!clearCity && 'disableColor'}`}
                IconComponent={() => (
                  <>
                    <i className="flaticon-placeholder-3 text-default px-2"></i>{' '}
                    {clearCity && (
                      <button
                        type="button"
                        style={clearSelect}
                        onClick={() => {
                          setCity('none');
                          setClearCity(false);
                        }}
                      >
                        <i className="flaticon-close text-default"></i>
                      </button>
                    )}
                  </>
                )}
              >
                <MenuItem value="none" disabled>
                  {messages[`${dropDownScope}.city`]}
                </MenuItem>
                {cityDD &&
                  cityDD.map((singleCity) => (
                    <MenuItem
                      className="selectDropDown"
                      key={singleCity.key}
                      value={singleCity.value}
                    >
                      {singleCity.text}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>
          <div className="col-lg-3 col-6">
            <FormControl className={classes.formControl}>
              <Select
                defaultValue="none"
                autoWidth
                value={status}
                onChange={handleStatusSelection}
                className={`${classes.selectEmpty} ${!clearStatus && 'disableColor'}`}
                IconComponent={() => (
                  <>
                    <i className="flaticon2-bell text-default px-2"></i>
                    {clearStatus && (
                      <button
                        type="button"
                        style={clearSelect}
                        onClick={() => {
                          setStatus('none');
                          setClearStatus(false);
                        }}
                      >
                        <i className="flaticon-close text-default"></i>
                      </button>
                    )}
                  </>
                )}
              >
                <MenuItem value="none" disabled>
                  {messages[`${dropDownScope}.status`]}
                </MenuItem>
                {statusDD &&
                  statusDD.map((stat) => (
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
        {/* search by GCt, information, comission */}
        <div className="row mb-1">
          <div className="col-4">
            <FormControl className={classes.formControl}>
              <Select
                defaultValue="none"
                autoWidth
                value={businessType}
                onChange={handleGctSelection}
                className={`${classes.selectEmpty} ${!clearBusiness && 'disableColor'}`}
                IconComponent={() => (
                  <>
                    <i className="flaticon2-favourite text-default px-2"></i>{' '}
                    {clearBusiness && (
                      <button
                        type="button"
                        style={clearSelect}
                        onClick={() => {
                          setBusinessType('none');
                          setClearBusiness(false);
                        }}
                      >
                        <i className="flaticon-close text-default"></i>
                      </button>
                    )}
                  </>
                )}
              >
                <MenuItem value="none" disabled>
                  {messages[`${dropDownScope}.gct`]}
                </MenuItem>
                {businessDD &&
                  businessDD.map((singleGCT) => (
                    <MenuItem
                      className="selectDropDown"
                      key={singleGCT.key}
                      value={singleGCT.value}
                    >
                      <img
                        src={singleGCT?.image?.src}
                        width="30px"
                        style={imageStyle}
                        alt="-"
                      />
                      {singleGCT.text}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>
          <div className="col-4">
            <FormControl className={classes.formControl}>
              <Select
                defaultValue="none"
                autoWidth
                value={comission}
                onChange={handleComissionSelection}
                className={`${classes.selectEmpty} ${!clearComission && 'disableColor'}`}
                IconComponent={() => (
                  <>
                    <i className="flaticon2-percentage text-default px-2"></i>{' '}
                    {clearComission && (
                      <button
                        type="button"
                        style={clearSelect}
                        onClick={() => {
                          setComission('none');
                          setClearComission(false);
                        }}
                      >
                        <i className="flaticon-close text-default"></i>
                      </button>
                    )}
                  </>
                )}
              >
                <MenuItem value="none" disabled>
                  {messages[`${dropDownScope}.comission`]}
                </MenuItem>
                {comissionDD &&
                  comissionDD.map((singleComission) => (
                    <MenuItem
                      className="selectDropDown"
                      key={singleComission.key}
                      value={singleComission.value}
                    >
                      {singleComission.text}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>
          <div className="col-4">
            <FormControl className={classes.formControl}>
              <Select
                defaultValue="none"
                autoWidth
                value={information}
                onChange={handleInformationSelection}
                className={`${classes.selectEmpty} ${!clearInfo && 'disableColor'}`}
                IconComponent={() => (
                  <>
                    <i className="flaticon2-pie-chart-1 text-default px-2"></i>
                    {clearInfo && (
                      <button
                        type="button"
                        style={clearSelect}
                        onClick={() => {
                          setInformation('none');
                          setClearInfo(false);
                        }}
                      >
                        <i className="flaticon-close text-default"></i>
                      </button>
                    )}
                  </>
                )}
              >
                <MenuItem value="none" disabled>
                  {messages[`${dropDownScope}.information`]}
                </MenuItem>
                {informationDD &&
                  informationDD.map((info) => (
                    <MenuItem
                      key={info.key}
                      className="selectDropDown"
                      value={info.value}
                    >
                      {info.text}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>
        </div>
        <div className="row mb-1">
          <div className="col-lg-6 col-md-12 px-4">
            <AddToCalendarSelect
              duration={durationDate}
              setDuration={setDurationDate}
              allowPast
            />
          </div>
          <div className="col-lg-6 col-md-12 col-sm-12 d-flex justify-content-center align-items-center">
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
                  <i className="flaticon-more-1 text-default"></i>&nbsp;
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
