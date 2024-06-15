/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import CloseBackIcon from 'components/shared/CloseBackIcon';
import { toast } from 'react-toastify';
import { Card, Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import useAPI, { post, get } from 'hooks/useAPI';
import { isNumbersOnly, validateLettersAndNumbersOnly } from 'functions/validate';
import moment from 'moment';
import AddToCalendarSelect from '../../shared/AddToCalendarSelect';

function AddOffer() {
  moment.locale('en');
  const history = useHistory();
  const { messages } = useIntl();
  const [offerNameAr, setOfferNameAr] = useState('');
  const [limitSaleAllow, setLimitSaleAllow] = useState(true);
  const [salesNum, setSalesNum] = useState('');
  const [nameError, setNameError] = useState(false);
  const [cardValue, setCardValue] = useState('');
  const [payload, setPayload] = useState(null);
  const [services, setServices] = useState([]);
  const [description, setDescription] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [colorChange, setColorchange] = useState(false);
  const [durationDate, setDurationDate] = useState({
    from: moment(new Date()).format('YYYY-MM-DD'),
    to: moment(new Date()).format('YYYY-MM-DD'),
  });
  const styleLabel = { minWidth: '11em' };
  const changeNavbarColor = () => {
    if (window.scrollY >= 80) {
      setColorchange(true);
    } else {
      setColorchange(false);
    }
  };
  useEffect(() => {
    window.addEventListener('scroll', changeNavbarColor);
  });

  /* -------------------------------------------------------------------------- */
  /*                              Preapre API CALLS                             */
  /* -------------------------------------------------------------------------- */

  const { response, isLoading, setRecall } = useAPI(post, 'Offer/addOffer', {
    offerName: offerNameAr,
    offerStart: durationDate.from,
    offerEnd: durationDate.to,
    offerPercentage: cardValue,
    serviceListIds: selectedServices.map((service) => service.value),
  });
  const getSPservicesApi = `Service/GetSPServices`;
  const { response: servicesRes, isLoading: addloading, setRecall: getServices } = useAPI(
    get,
    getSPservicesApi,
  );

  /* -------------------------------------------------------------------------- */
  /*                             Handle API RESPONSE                            */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    getServices(true);
  }, []);

  useEffect(() => {
    if (servicesRes) {
      const ser = servicesRes.data.list;
      const catList = ser.map((ser) => ser.centerTypeCategoryList);
      const services = catList
        .flat()
        .map((ser) => ser.serviceList)
        .flat();
      const servicesList = [];
      services.map((service) =>
        servicesList.push({
          key: service.id,
          name: `${service.name} - ${service.price} ${messages['common.currency']}`,
          value: service.id,
        }),
      );
      setServices(servicesList);
    }
  }, [servicesRes]);

  /* -------------------------------------------------------------------------- */
  /*                           Add OFFer And RESPONSE                           */
  /* -------------------------------------------------------------------------- */
  function generatePayLoad() {
    const payloadObject = {
      name: offerNameAr,
      value: cardValue,
      startDate: durationDate.from,
      endDate: durationDate.to,
    };
    setPayload(payloadObject);
  }

  useEffect(() => {
    if (payload) {
      setRecall(true);
    }
  }, [payload]);

  useEffect(() => {
    if (response?.data) {
      notify(messages[`offers.offer.added.successfully`]);
      setTimeout(() => {
        history.goBack();
      }, 2000);
    }
    if (response?.error) {
      notify(response?.error?.message, 'err');
    }
  }, [response]);

  useEffect(() => {
    if (offerNameAr) validateLettersAndNumbersOnly(offerNameAr, setNameError);
  }, [offerNameAr]);

  const notify = (message, err) => {
    if (err) {
      toast.error(message);
    } else {
      toast.success(message);
    }
  };

  return (
    <>
      <div className={`close-save-nav ${colorChange ? 'nav__white' : ''}`}>
        <div className="d-flex justify-content-between">
          <div>
            <FormControl component="fieldset" fullWidth>
              <button
                className="btn btn-primary"
                type="button"
                disabled={
                  !cardValue ||
                  !offerNameAr ||
                  !durationDate.to ||
                  !durationDate.from ||
                  isLoading ||
                  addloading
                }
                onClick={generatePayLoad}
              >
                {isLoading || addloading ? (
                  <CircularProgress size={24} style={{ color: '#fff' }} />
                ) : (
                  messages['common.save']
                )}
              </button>
            </FormControl>
          </div>

          <CloseBackIcon />
        </div>
      </div>
      <Card className="p-5 card-special">
        <Card.Header>
          <div className="title"> {messages['offers.AddOffer']}</div>
        </Card.Header>
        <Card.Body>
          <Row className="container-box">
            <Col lg={6} sm={12} className="mt-4">
              <label
                htmlFor="offerArName"
                className="container-box__controllers--label w-100"
              >
                {messages['offers.addOffer.name.ar']}
              </label>
              <input
                className={`input-box__controllers-input w-75 ${
                  offerNameAr.length >= 50 || nameError
                    ? 'input-box__controllers-input--error'
                    : ''
                }`}
                id="offerArName"
                placeholder={messages['offers.addOffer.name.ar']}
                value={offerNameAr}
                onChange={(e) => setOfferNameAr(e.target.value)}
              ></input>
              {offerNameAr.length >= 50 && (
                <p className="pt-2 text-danger">{messages['common.maxLength']}</p>
              )}
              {nameError && (
                <p className="pt-2 text-danger">
                  {messages['spAdmin.categories.add.nameError']}
                </p>
              )}
            </Col>
            <Col lg={6} sm={12} className="mt-4">
              <label
                htmlFor="cardPercentage"
                className="container-box__controllers--label w-100"
              >
                {messages['promocodes.percentage']}
              </label>
              <input
                className={`input-box__controllers-input w-75 ${
                  cardValue.length > 5 ? 'input-box__controllers-input--error' : ''
                }`}
                id="cardPercentage"
                placeholder={messages['promocodes.percentage']}
                value={cardValue}
                onChange={(e) => {
                  const num = e.target.value;
                  if (num.length > 2) return;
                  return isNumbersOnly(Number(e.target.value))
                    ? setCardValue(e.target.value)
                    : null;
                }}
              ></input>
              {cardValue.length > 5 && (
                <p className="pt-2 text-danger">{messages['common.maxLength']}</p>
              )}
            </Col>
          </Row>
          <div className="container-box">
            <AddToCalendarSelect
              duration={durationDate}
              setDuration={setDurationDate}
              width75="true"
            />
          </div>
          <Row className="container-box">
            <Col
              lg={6}
              sm={12}
              className="d-flex justify-content-start align-items-center"
            >
              <div
                className="form-check container-box__controllers--checkDiv d-inline pl-0 pr-0"
                style={styleLabel}
              >
                <input
                  className="custom-color"
                  type="checkbox"
                  checked={limitSaleAllow}
                  onChange={() => setLimitSaleAllow(!limitSaleAllow)}
                  id="allowSaleLimit"
                />
                <label className="ml-2 mr-2 text-secondary" htmlFor="allowSaleLimit">
                  {messages['vouchers.new.sale.limit']}
                </label>
              </div>
              <input
                className={`input-box__controllers-input w-50 ml-3 mr-3 ${
                  salesNum.length >= 3 ? 'input-box__controllers-input--error' : ''
                }`}
                id="salesNumber"
                placeholder={messages['vouchers.new.sale.limit']}
                value={salesNum}
                onChange={(e) =>
                  isNumbersOnly(+e.target.value) ? setSalesNum(e.target.value) : null
                }
              ></input>
              {salesNum.length >= 3 && (
                <p className="pt-2 text-danger">{messages['common.maxLength']}</p>
              )}
            </Col>
          </Row>
          <Row className="container-box">
            <Col lg={10} sm={12}>
              {/* service */}
              <FormControl fullWidth className="">
                <InputLabel id="services">
                  {messages['reservationSteps.summary.Services']}
                </InputLabel>
                <Select
                  labelId="services"
                  className="mb-3"
                  value={selectedServices}
                  disabled={isLoading || addloading}
                  onChange={(e) => {
                    setSelectedServices(e.target.value);
                  }}
                  multiple
                  renderValue={(selected) => (
                    <div>
                      {selected.map((value) => (
                        <Chip key={value.key} label={value.name} className="mx-1" />
                      ))}
                    </div>
                  )}
                  MenuProps={{
                    getContentAnchorEl: () => null,
                  }}
                >
                  {services.map((service) => (
                    <MenuItem key={service.id} value={service}>
                      {service.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Col>
            <Col lg={10} xs={12} className="mt-4">
              <label htmlFor="desc" className="container-box__controllers--label">
                {messages['common.notes']}
              </label>
              <textarea
                id="desc"
                className={`input-box__controllers-textarea w-75 ${
                  description.length > 500 ? 'input-box__controllers-textarea--error' : ''
                }`}
                placeholder={messages['common.notes']}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                value={description}
              />
              {description.length > 500 && (
                <p className="pt-2 text-danger">
                  {messages['product.add.descriptionMax']}
                </p>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
}

export default AddOffer;
