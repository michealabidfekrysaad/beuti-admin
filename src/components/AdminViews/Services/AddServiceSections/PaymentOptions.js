/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable indent */
import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { isPrice } from 'functions/validate';

import {
  hours,
  minutes,
  hoursWithMinutes,
  hoursMinutesDropDown,
  hoursMinutesDropDownAr,
} from 'constants/hours';
import PropTypes from 'prop-types';
import AdvancedOptionModal from '../AdvancedOptionModal';

export default function PaymentOptions({
  setInputList,
  inputList,
  minutesSelection,
  setFromTime,
  fromTime,
  setToTime,
  toTime,
  fixedPrice,
  setFixedPrice,
  setSpecialFixedPrice,
  specialFixedPrice,
}) {
  const { locale, messages } = useIntl();
  const [advancedOptionOpen, setAdvancedOption] = useState(false);
  const [priceNameAr, setPriceNameAr] = useState('');
  const [priceNameEn, setPriceNameEn] = useState('');
  const [timeInAdvancedOption, setTimeInAdvancedOption] = useState('');
  const [choosenPriceOption, setChoosenPriceOption] = useState('');
  const [fixedPriceAdvanced, setFixedPriceAdvanced] = useState(0);
  const [specialFixedPriceAdvance, setSpecialFixedPriceAdvance] = useState(0);

  const [dropDownOption, setDropDownOption] = useState([
    {
      paymentOptionChoosen: null,
      index: 0,
    },
    {
      paymentOptionChoosen: null,
      index: 1,
    },
    {
      paymentOptionChoosen: null,
      index: 2,
    },
  ]);

  const hoursDD = locale === 'ar' ? hoursMinutesDropDownAr : hoursMinutesDropDown;

  const priceOptions = [
    {
      key: 0,
      text: messages['spAdmin.service.add.option.free'],
      value: 0,
    },
    {
      key: 1,
      text: messages['spAdmin.service.add.option.fixed'],
      value: 1,
    },
    {
      key: 2,
      text: messages['spAdmin.service.add.option.fromTo'],
      value: 2,
    },
  ];
  const addAnotherPaymentOption = () => {
    if (inputList.length < 3)
      setInputList([
        ...inputList,
        {
          hours: null,
          selectedOption: null,
          from: null,
          to: null,
          fixedPrice: 0,
          specialFixedPrice: 0,
          advancedOptionModal: {},
        },
      ]);
  };

  const deletePAymentOption = (index) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };
  const handleChangeHour = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };

  const handlePaymentOption = (e, index) => {
    const { name, value } = e.target;
    //   setDropDownOption(+value);
    const dropDownList = [...dropDownOption];
    dropDownList[index].paymentOptionChoosen = +value;
    setDropDownOption(dropDownList);
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };

  const handleFrom = (e, index) => {
    const { name, value } = e.target;
    setFromTime(value);
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };

  const handleTo = (e, index) => {
    const { name, value } = e.target;
    setToTime(value);
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };

  const handleFixedPrice = (e, index) => {
    const { name, value } = e.target;
    setFixedPrice(value);
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };

  const handleSpecialFixedPrice = (e, index) => {
    const { name, value } = e.target;
    setSpecialFixedPrice(value);
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };

  return (
    <>
      {/* <pre>{JSON.stringify(inputList, null, 2)}</pre> */}
      <Col xs={12}>
        <p className="container-box__controllers--header d-inline-block">
          {messages['spAdmin.service.add.Prices']}
          <span className="container-box__controllers--label__required">*</span>
        </p>
        <div className="container-box__controllers--header-second">
          <input
            type="checkbox"
            className="container-box__controllers--header-second__input-hidden"
            //   checked={selectedUsers.length === empDD.length}
            onChange={addAnotherPaymentOption}
            id="addPriceOption"
          />
          <label
            className="form-check-label container-box__controllers--header-second__label"
            htmlFor="addPriceOption"
          >
            {messages['spAdmin.service.add.Price.option']}
          </label>
        </div>
      </Col>
      <Col xs={12}>
        {inputList.map((item, index) => (
          <div className="container-box__paymentOption" key={item}>
            <Row className="d-flex justify-content-between pl-2 pr-2">
              <label
                htmlFor="GCT"
                className="container-box__controllers--header primary-color"
              >
                {messages['spAdmin.service.add.option']}&nbsp;
                {index + 1}
              </label>
              {inputList.length !== 1 && (
                <i
                  className="flaticon-delete primary-color ml-4 mr-4"
                  onClick={() => deletePAymentOption(index)}
                  style={{ cursor: 'pointer' }}
                ></i>
              )}
            </Row>
            <Row>
              <Col sm={3} xs={12}>
                <label htmlFor="hours" className="container-box__controllers--label">
                  {messages['time.hours']}
                </label>

                <select
                  id="hours"
                  name="hours"
                  className="form-select w-75 container-box__controllers-select"
                  onChange={(e) => handleChangeHour(e, index)}
                  value={item.hours || ''}
                >
                  {/* found problem value here check it */}
                  <option
                    value={null}
                    className="container-box__controllers-select__pre-choosen"
                    defaultValue
                  >
                    {messages['time.hours']}
                  </option>
                  {hoursWithMinutes?.map((hour) => (
                    <option
                      className="font-size container-box__controllers-select__options"
                      key={hour.key}
                      value={hour.value}
                    >
                      {hour.text}
                    </option>
                  ))}
                </select>
              </Col>
              <Col sm={3} xs={12}>
                <label
                  htmlFor="priceOption"
                  className="container-box__controllers--label"
                >
                  {messages['common.searchBy.price']}
                </label>
                <select
                  id="priceOption"
                  name="selectedOption"
                  className="form-select w-75 container-box__controllers-select"
                  onChange={(e) => handlePaymentOption(e, index)}
                  value={item.selectedOption || ''}
                >
                  <option
                    value={null}
                    className="container-box__controllers-select__pre-choosen"
                    // selected
                    defaultValue
                  >
                    {messages['common.servicePrice']}{' '}
                  </option>
                  {priceOptions?.map((addPriceOption) => (
                    <option
                      className="font-size container-box__controllers-select__options"
                      key={addPriceOption.id}
                      value={addPriceOption.value}
                    >
                      {addPriceOption.text}
                    </option>
                  ))}
                </select>
              </Col>
              {/* options for fixed price */}
              {dropDownOption[index].paymentOptionChoosen === 1 &&
                dropDownOption[index].index === index && (
                  <>
                    <Col sm={3} xs={12}>
                      <div className="form-check container-box__controllers">
                        <label
                          htmlFor="fixedPrice"
                          className="container-box__controllers--label"
                        >
                          {messages['common.searchBy.price']}
                        </label>
                        <input
                          name="fixedPrice"
                          className="form-select w-100 container-box__controllers-input"
                          id="fixedPrice"
                          placeholder={messages['common.searchBy.price']}
                          onChange={(e) =>
                            isPrice(e.target.value) || !e.target.value
                              ? handleFixedPrice(e, index)
                              : null
                          }
                          value={item.fixedPrice || ''}
                        ></input>
                      </div>
                    </Col>
                    <Col sm={3} xs={12}>
                      <div className="form-check container-box__controllers">
                        <label
                          htmlFor="specialFixedPrice"
                          className="container-box__controllers--label"
                        >
                          {messages['common.searchBy.price.optional']}
                        </label>
                        <input
                          name="specialFixedPrice"
                          className="form-select w-100 container-box__controllers-input"
                          id="specialFixedPrice"
                          placeholder={messages['common.searchBy.price.optional']}
                          onChange={(e) =>
                            isPrice(e.target.value) || !e.target.value
                              ? handleSpecialFixedPrice(e, index)
                              : null
                          }
                          value={item.specialFixedPrice || ''}
                        ></input>
                      </div>
                    </Col>
                  </>
                )}
              {/* options for from to price */}
              {dropDownOption[index].paymentOptionChoosen === 2 &&
                dropDownOption[index].index === index && (
                  <>
                    <Col sm={3} xs={12}>
                      <label
                        htmlFor="fromOption"
                        className="container-box__controllers--label"
                      >
                        {messages['common.from']}
                      </label>
                      <select
                        id="fromOption"
                        name="from"
                        className="form-select w-75 container-box__controllers-select"
                        onChange={(e) => handleFrom(e, index)}
                        value={item.from || ''}
                      >
                        <option
                          value={null}
                          className="container-box__controllers-select__pre-choosen"
                          // selected
                          defaultValue
                        >
                          {messages['common.from']}
                        </option>
                        {hoursDD?.map((from) => (
                          <option
                            className="font-size container-box__controllers-select__options"
                            key={from.id}
                            value={from.id}
                          >
                            {from.text}
                          </option>
                        ))}
                      </select>
                    </Col>
                    <Col sm={3} xs={12}>
                      <label
                        htmlFor="toOption"
                        className="container-box__controllers--label"
                      >
                        {messages['common.to']}
                      </label>
                      <select
                        id="toOption"
                        name="to"
                        className="form-select w-75 container-box__controllers-select"
                        onChange={(e) => handleTo(e, index)}
                        value={item.to || ''}
                      >
                        <option
                          value={null}
                          className="container-box__controllers-select__pre-choosen"
                          // selected
                          defaultValue
                        >
                          {messages['common.to']}
                        </option>
                        {hoursDD?.map((to) => (
                          <option
                            className="font-size container-box__controllers-select__options"
                            key={to.id}
                            value={to.id}
                          >
                            {to.text}
                          </option>
                        ))}
                      </select>
                    </Col>
                  </>
                )}
            </Row>

            <Row className="pt-4">
              <Col lg={5} sm={3} xs={12}>
                <label
                  htmlFor="paymentName"
                  className="container-box__controllers--label"
                >
                  {messages['spAdmin.service.name.optional']}
                </label>
                <input
                  className="form-select w-100 container-box__controllers-input"
                  id="paymentName"
                  placeholder={messages['spAdmin.service.option.name']}
                  value=""
                ></input>
              </Col>
              <Col lg={5} sm={7} xs={12} className="d-flex  align-items-end">
                <label
                  htmlFor="paymentName"
                  className="form-check-label container-box__controllers--header-second__label"
                  onClick={() => setAdvancedOption(true)}
                  onKeyDown={() => setAdvancedOption(true)}
                  role="presentation"
                >
                  {messages['spAdmin.service.advanced.options']}
                </label>
              </Col>
            </Row>
          </div>
        ))}
        {advancedOptionOpen && (
          <AdvancedOptionModal
            open={advancedOptionOpen}
            setOpen={setAdvancedOption}
            priceNameAr={priceNameAr}
            setPriceNameAr={setPriceNameAr}
            priceNameEn={priceNameEn}
            setPriceNameEn={setPriceNameEn}
            setTimeInAdvancedOption={setTimeInAdvancedOption}
            timeInAdvancedOption={timeInAdvancedOption}
            priceOptions={priceOptions}
            choosenPriceOption={choosenPriceOption}
            setChoosenPriceOption={setChoosenPriceOption}
            setFixedPriceAdvanced={setFixedPriceAdvanced}
            fixedPriceAdvanced={fixedPriceAdvanced}
            specialFixedPriceAdvance={specialFixedPriceAdvance}
            setSpecialFixedPriceAdvance={setSpecialFixedPriceAdvance}
          />
        )}
      </Col>
    </>
  );
}

PaymentOptions.propTypes = {
  setInputList: PropTypes.func,

  inputList: PropTypes.array,
  minutesSelection: PropTypes.string,
  setFromTime: PropTypes.func,
  fromTime: PropTypes.string,
  setToTime: PropTypes.func,
  toTime: PropTypes.string,
  setFixedPrice: PropTypes.func,
  fixedPrice: PropTypes.number,
  setSpecialFixedPrice: PropTypes.func,
  specialFixedPrice: PropTypes.number,
};
