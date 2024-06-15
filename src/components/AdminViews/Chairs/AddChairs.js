/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { CircularProgress, FormControl } from '@material-ui/core';
import CloseBackIcon from 'components/shared/CloseBackIcon';
import { toast } from 'react-toastify';
import { isValidEmail } from 'validations/validate';
import { Card, Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import useAPI, { post, get } from 'hooks/useAPI';
import { isNumbersOnly, isPhoneLengthValid, startsWith05 } from 'functions/validate';
import moment from 'moment';
import AddToCalendarSelect from '../../shared/AddToCalendarSelect';

function AddChairs() {
  moment.locale('en');
  const history = useHistory();
  const { messages } = useIntl();
  const [customerArName, setCustomerArName] = useState('');
  const [customerEnName, setCustomerEnName] = useState('');
  const [phone, setPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [validEmail, setValidEmail] = useState(true);
  const [nameArSp, setNameArSp] = useState('');
  const [nameEnSp, setNameEnSp] = useState('');
  const [phoneSp, setPhoneSp] = useState('');
  const [emailSp, setEmailSp] = useState('');
  const [emailValidSp, setEmailValidSp] = useState('');
  const [chairPrice, setChairPrice] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [activeChair, setActiveChair] = useState(true);
  const [payload, setPayload] = useState(null);
  const [description, setDescription] = useState('');
  const [colorChange, setColorchange] = useState(false);
  const [durationDate, setDurationDate] = useState({
    from: moment(new Date()).format('YYYY-MM-DD'),
    to: moment(new Date()).format('YYYY-MM-DD'),
  });
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
    offerName: true,
    offerStart: durationDate.from,
    offerEnd: durationDate.to,
    offerPercentage: true,
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
  /* -------------------------------------------------------------------------- */
  /*                           Add OFFer And RESPONSE                           */
  /* -------------------------------------------------------------------------- */
  function generatePayLoad() {
    const payloadObject = {
      name: true,
      value: true,
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
      notify(messages[`chairs.add.new.success`]);
      setTimeout(() => {
        history.goBack();
      }, 2000);
    }
    if (response?.error) {
      notify(response?.error?.message, 'err');
    }
  }, [response]);

  const notify = (message, err) => {
    if (err) {
      toast.error(message);
    } else {
      toast.success(message);
    }
  };

  const validateCorrectPhone = (e) => {
    if (
      isPhoneLengthValid(e.target.value) &&
      startsWith05(e.target.value) &&
      isNumbersOnly(e.target.value)
    ) {
      setPhoneError(false);
    } else {
      setPhoneError(true);
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
                  !durationDate.to || !durationDate.from || isLoading || addloading
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
          <div className="title"> {messages['chairs.add.title']}</div>
        </Card.Header>
        <Card.Body>
          <Row className="container-box">
            <Col xs={12}>
              <p className="container-box__controllers--header">
                {messages['chairs.add.customer.info']}
              </p>
            </Col>
            <Col lg={6} sm={12} className="mt-2 mb-2">
              <label
                htmlFor="customerArName"
                className="container-box__controllers--label w-100"
              >
                {messages[`admin.customer.new.ar.name`]}
              </label>
              <input
                className={`input-box__controllers-input w-75 ${
                  customerArName.length >= 50 ? 'input-box__controllers-input--error' : ''
                }`}
                id="customerArName"
                placeholder={messages[`admin.customer.new.ar.name`]}
                value={customerArName}
                onChange={(e) => setCustomerArName(e.target.value)}
              ></input>
              {customerArName.length >= 50 && (
                <p className="pt-2 text-danger">{messages['common.maxLength']}</p>
              )}
            </Col>
            <Col lg={6} sm={12} className="mt-2 mb-2">
              <label
                htmlFor="customerEnName"
                className="container-box__controllers--label w-100"
              >
                {messages['admin.customer.new.en.name']}
              </label>
              <input
                className={`input-box__controllers-input w-75 ${
                  customerEnName.length >= 50 ? 'input-box__controllers-input--error' : ''
                }`}
                id="customerEnName"
                placeholder={messages['admin.customer.new.en.name']}
                value={customerEnName}
                onChange={(e) => setCustomerEnName(e.target.value)}
              ></input>
              {customerEnName.length >= 50 && (
                <p className="pt-2 text-danger">{messages['common.maxLength']}</p>
              )}
            </Col>
            <Col lg={6} sm={12} className="mt-2 mb-2">
              <label
                htmlFor="service"
                className="container-box__controllers--label w-100"
              >
                {messages[`common.customerNumber`]}
              </label>
              <input
                className={`input-box__controllers-input w-75 ${
                  phone && phoneError ? 'input-box__controllers-input--error' : ''
                }`}
                type="tel"
                placeholder={messages[`common.customerNumber`]}
                value={phone}
                onChange={(e) =>
                  isNumbersOnly(e.target.value) && e.target.value.length <= 10
                    ? setPhone(e.target.value)
                    : null
                }
                onBlur={(e) => validateCorrectPhone(e)}
              />
            </Col>
            <Col lg={6} sm={12} className="mt-2 mb-2">
              <label
                htmlFor="emailCustomer"
                className="input-box__controllers__label w-100"
              >
                {messages['chairs.add.customer.email']}
              </label>
              <input
                className={`input-box__controllers-input w-75 ${
                  customerEmail && !validEmail
                    ? 'input-box__controllers-input--error'
                    : ''
                }`}
                id="emailCustomer"
                placeholder={messages['chairs.add.customer.email']}
                onChange={(e) => {
                  setCustomerEmail(e.target.value);
                  setValidEmail(true);
                }}
                value={customerEmail || ''}
                onBlur={() => {
                  setValidEmail(isValidEmail(customerEmail));
                }}
              ></input>
              {customerEmail && !validEmail && (
                <p className="pt-2 text-danger">
                  {messages['admin.setttings.ChangeEmail.error']}
                </p>
              )}
            </Col>
          </Row>
          <Row className="container-box">
            <Col xs={12}>
              <p className="container-box__controllers--header">
                {messages['chairs.add.SP.info']}
              </p>
            </Col>
            <Col lg={6} sm={12} className="mt-2 mb-2">
              <label
                htmlFor="SpArName"
                className="container-box__controllers--label w-100"
              >
                {messages[`chairs.add.SP.name.ar`]}
              </label>
              <input
                className={`input-box__controllers-input w-75 ${
                  nameArSp.length >= 50 ? 'input-box__controllers-input--error' : ''
                }`}
                id="SpArName"
                placeholder={messages[`chairs.add.SP.name.ar`]}
                value={nameArSp}
                onChange={(e) => setNameArSp(e.target.value)}
              ></input>
              {nameArSp.length >= 50 && (
                <p className="pt-2 text-danger">{messages['common.maxLength']}</p>
              )}
            </Col>
            <Col lg={6} sm={12} className="mt-2 mb-2">
              <label
                htmlFor="SpEnName"
                className="container-box__controllers--label w-100"
              >
                {messages['chairs.add.SP.name.en']}
              </label>
              <input
                className={`input-box__controllers-input w-75 ${
                  nameEnSp.length >= 50 ? 'input-box__controllers-input--error' : ''
                }`}
                id="SpEnName"
                placeholder={messages['chairs.add.SP.name.en']}
                value={nameEnSp}
                onChange={(e) => setNameEnSp(e.target.value)}
              ></input>
              {nameEnSp.length >= 50 && (
                <p className="pt-2 text-danger">{messages['common.maxLength']}</p>
              )}
            </Col>
            <Col lg={6} sm={12} className="mt-2 mb-2">
              <label
                htmlFor="service"
                className="container-box__controllers--label w-100"
              >
                {messages[`common.spNumber`]}
              </label>
              <input
                className={`input-box__controllers-input w-75 ${
                  phoneSp.length > 10 ? 'input-box__controllers-input--error' : ''
                }`}
                type="tel"
                placeholder={messages[`common.spNumber`]}
                value={phoneSp}
                onChange={(e) =>
                  isNumbersOnly(e.target.value) && e.target.value.length <= 10
                    ? setPhoneSp(e.target.value)
                    : null
                }
              />
            </Col>
            <Col lg={6} sm={12} className="mt-2 mb-2">
              <label htmlFor="emailSp" className="input-box__controllers__label w-100">
                {messages['chairs.add.SP.email']}
              </label>
              <input
                className={`input-box__controllers-input w-75 ${
                  emailSp && !emailValidSp ? 'input-box__controllers-input--error' : ''
                }`}
                id="emailSp"
                placeholder={messages['admin.settings.ChangeEmail.placeholder']}
                onChange={(e) => {
                  setEmailSp(e.target.value);
                  setEmailValidSp(true);
                }}
                value={emailSp || ''}
                onBlur={() => {
                  setEmailValidSp(isValidEmail(emailSp));
                }}
              ></input>
              {emailSp && !emailValidSp && (
                <p className="pt-2 text-danger">
                  {messages['admin.setttings.ChangeEmail.error']}
                </p>
              )}
            </Col>
            <Col lg={6} sm={12} className="mt-2 mb-2">
              <label
                htmlFor="SpArName"
                className="container-box__controllers--label w-100"
              >
                {messages[`chairs.add.SP.duration.chair`]}
              </label>
              <input
                className={`input-box__controllers-input w-75 `}
                id="SpArName"
                placeholder={messages[`chairs.add.SP.duration.chair`]}
                // value={nameArSp}
                // onChange={(e) => setNameArSp(e.target.value)}
              ></input>
              {/* {nameArSp.length >= 50 && (
                <p className="pt-2 text-danger">{messages['common.maxLength']}</p>
              )} */}
            </Col>
          </Row>
          <Row className="container-box">
            <Col xs={12}>
              <p className="container-box__controllers--header">
                {messages['chairs.add.chair.info']}
              </p>
            </Col>
            <Col lg={6} sm={12} className="mt-2 mb-2 ">
              <label
                htmlFor="chairDuration"
                className="input-box__controllers__label w-100"
              >
                {/* {messages[`chairs.add.chair.price.hr`]} */}
                chair duration
              </label>
              <input
                name="chairDuration"
                className="w-75 input-box__controllers-input"
                id="chairDuration"
                type="tel"
                placeholder={messages[`chairs.add.chair.price.hr`]}
                // onChange={(e) =>
                //   isNumbersOnly(e.target.value) && e.target.value.length <= 4
                //     ? setChairPrice(e.target.value)
                //     : null
                // }
                // value={chairPrice}
              ></input>
            </Col>
            <Col lg={6} sm={12} className="mt-2 mb-2 ">
              <label
                htmlFor="chairPriceHr"
                className="input-box__controllers__label w-100"
              >
                {messages[`chairs.add.chair.price.hr`]}
              </label>
              <input
                className="w-75 input-box__controllers-input"
                id="chairPriceHr"
                type="tel"
                placeholder={messages[`chairs.add.chair.price.hr`]}
                onChange={(e) =>
                  isNumbersOnly(e.target.value) && e.target.value.length <= 4
                    ? setChairPrice(e.target.value)
                    : null
                }
                value={chairPrice}
              ></input>
            </Col>
            <Col lg={6} sm={12} className="mt-2 mb-2 ">
              <div className="form-check container-box__controllers--checkDiv">
                <input
                  className="form-check-input custom-color"
                  type="checkbox"
                  checked={activeChair}
                  onChange={() => setActiveChair(!activeChair)}
                  id="activeChairAllow"
                />
                <label className="form-check-label" htmlFor="activeChairAllow">
                  {messages['chairs.add.chair.active']}
                </label>
              </div>
            </Col>
          </Row>

          <Row className="container-box">
            <Col lg={10} xs={12} className="mt-2 mb-2">
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

          {/* <div className="container-box">
            <AddToCalendarSelect
              duration={durationDate}
              setDuration={setDurationDate}
              width75="true"
            />
          </div> */}
        </Card.Body>
      </Card>
    </>
  );
}

export default AddChairs;
