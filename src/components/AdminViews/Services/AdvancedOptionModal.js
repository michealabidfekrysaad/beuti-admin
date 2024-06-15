/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { Modal, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { hoursWithMinutes } from 'constants/hours';
import { isPrice } from 'functions/validate';

export default function AdvancedOptionModal({
  open,
  setOpen,
  setUserSelection,
  priceNameAr,
  setPriceNameAr,
  priceNameEn,
  setPriceNameEn,
  setTimeInAdvancedOption,
  timeInAdvancedOption,
  priceOptions,
  choosenPriceOption,
  setChoosenPriceOption,
  setFixedPriceAdvanced,
  fixedPriceAdvanced,
  setSpecialFixedPriceAdvance,
  specialFixedPriceAdvance,
}) {
  const { messages } = useIntl();

  const closeModal = () => {
    setOpen(false);
  };
  return (
    <Modal
      onHide={() => {
        closeModal();
      }}
      show={open}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="bootstrap-modal-customizing"
    >
      <div className="employee-box">
        <div className="employee-box__title mb-3">
          {messages['spAdmin.advanced.pricing.header']}
        </div>
        <Modal.Body>
          <div className="employee-box__controllers--advanced-option">
            <Row>
              <Col xs={12}>
                <h6 className="employee-box__controllers--advanced-option__header">
                  {messages['spAdmin.advanced.pricing.general.price']}
                </h6>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col xs={12} lg={3} className="mt-3">
                <label htmlFor="service" className="input-box__controllers__label w-100">
                  {messages[`spAdmin.advanced.pricing.ar.name`]}
                </label>
                <input
                  className="input-box__controllers-input w-100"
                  name="priceArName"
                  type="text"
                  placeholder={messages[`spAdmin.advanced.pricing.ar.name`]}
                  value={priceNameAr || ''}
                  onChange={(e) => setPriceNameAr(e.target.value)}
                />
              </Col>
              <Col xs={12} lg={3} className="mt-3">
                <label htmlFor="service" className="input-box__controllers__label w-100">
                  {messages[`spAdmin.advanced.pricing.en.name`]}
                </label>
                <input
                  className={`input-box__controllers-input w-100 `}
                  name="priceEnName"
                  type="text"
                  placeholder={messages[`spAdmin.advanced.pricing.en.name`]}
                  value={priceNameEn || ''}
                  onChange={(e) => setPriceNameEn(e.target.value)}
                />
              </Col>
            </Row>
            <Row className="mt-3 mb-5">
              <Col sm={12} md={6} lg={3} className="mt-3">
                <label htmlFor="hours" className="input-box__controllers__label">
                  {messages['admin.homePage.bookingTime']}
                </label>

                <select
                  id="hours"
                  name="hours"
                  className="form-select w-100 container-box__controllers-select"
                  onChange={(e) => setTimeInAdvancedOption(e.target.value)}
                  value={timeInAdvancedOption}
                >
                  {/* femoshkela fe el value hena eb2a ezbotha */}
                  <option
                    value={null}
                    className="container-box__controllers-select__pre-choosen"
                    defaultValue
                  >
                    {messages['admin.homePage.bookingTime']}
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
              <Col sm={12} md={6} lg={3} className="mt-3">
                <label htmlFor="priceOption" className="input-box__controllers__label">
                  {messages['common.searchBy.price']}
                </label>
                <select
                  id="priceOption"
                  name="selectedOption"
                  className="form-select w-100 container-box__controllers-select"
                  onChange={(e) => setChoosenPriceOption(e.target.value)}
                  value={choosenPriceOption}
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
              <Col sm={12} md={6} lg={3} className="mt-3">
                <label htmlFor="fixedPrice" className="input-box__controllers__label">
                  {messages['common.searchBy.price']}
                </label>
                <input
                  name="fixedPrice"
                  className="form-select w-100 input-box__controllers-input"
                  id="fixedPrice"
                  placeholder={messages['common.searchBy.price']}
                  onChange={(e) =>
                    isPrice(e.target.value) || !e.target.value
                      ? setFixedPriceAdvanced(e.target.value)
                      : null
                  }
                  value={fixedPriceAdvanced || ''}
                ></input>
              </Col>
              <Col sm={12} md={6} lg={3} className="mt-3">
                <label
                  htmlFor="specialFixedPrice"
                  className="input-box__controllers__label"
                >
                  {messages['common.searchBy.price.optional']}
                </label>
                <input
                  name="specialFixedPrice"
                  className="form-select w-100 input-box__controllers-input"
                  id="specialFixedPrice"
                  placeholder={messages['common.searchBy.price.optional']}
                  onChange={(e) =>
                    isPrice(e.target.value) || !e.target.value
                      ? setSpecialFixedPriceAdvance(e.target.value)
                      : null
                  }
                  value={specialFixedPriceAdvance || ''}
                ></input>
              </Col>
            </Row>

            <hr className="hr-style" />

            <Row className="mt-5">
              <Col xs={12}>
                <h6 className="employee-box__controllers--advanced-option__header">
                  {messages['spAdmin.advanced.pricing.emp']}
                </h6>
              </Col>
            </Row>
            <section className="mt-5 employee-box__controllers--advanced-option__emp-section">
              {/* el row hwa ale 7ayet3amal 3aleh map lel emp */}
              <Row className="mt-3 d-flex">
                <div className="employee-box__controllers--advanced-option__emp-section--wrapper d-flex align-items-center">
                  <div className="employee-box__controllers--advanced-option__emp-section--wrapper__image">
                    im
                  </div>
                  <p className="pl-2 pr-2">emp-name</p>
                </div>
                <div className="employee-box__controllers--advanced-option__emp-section--wrapper">
                  <div>
                    <label
                      htmlFor="optionalTime"
                      className="input-box__controllers__label"
                    >
                      {messages['spAdmin.advanced.time.optional']}
                    </label>
                    <input
                      name="optionalTime"
                      className="form-select w-100 input-box__controllers-input"
                      id="optionalTime"
                      placeholder={messages['spAdmin.advanced.time.optional']}
                      // onChange={(e) =>
                      //   isPrice(e.target.value) || !e.target.value
                      //     ? setSpecialFixedPriceAdvance(e.target.value)
                      //     : null
                      // }
                      // value={specialFixedPriceAdvance || ''}
                    ></input>
                  </div>
                </div>
                <div className="employee-box__controllers--advanced-option__emp-section--wrapper">
                  <div className="">
                    <label
                      htmlFor="optionalTime"
                      className="input-box__controllers__label"
                    >
                      {messages['spAdmin.advanced.price.optional']}
                    </label>
                    <input
                      name="optionalTime"
                      className="form-select w-100 input-box__controllers-input"
                      id="optionalTime"
                      placeholder={messages['spAdmin.advanced.price.optional']}
                      // onChange={(e) =>
                      //   isPrice(e.target.value) || !e.target.value
                      //     ? setSpecialFixedPriceAdvance(e.target.value)
                      //     : null
                      // }
                      // value={specialFixedPriceAdvance || ''}
                    ></input>
                  </div>
                </div>
                <div className="employee-box__controllers--advanced-option__emp-section--wrapper">
                  <div>
                    <label
                      htmlFor="priceFixedForEmp"
                      className="input-box__controllers__label"
                    >
                      {messages['common.searchBy.price']}
                    </label>
                    <input
                      name="priceFixedForEmp"
                      className="form-select w-100 input-box__controllers-input"
                      id="priceFixedForEmp"
                      placeholder={messages['common.searchBy.price']}
                      // onChange={(e) =>
                      //   isPrice(e.target.value) || !e.target.value
                      //     ? setFixedPriceAdvanced(e.target.value)
                      //     : null
                      // }
                      // value={fixedPriceAdvanced || ''}
                    ></input>
                  </div>
                </div>
                <div className="employee-box__controllers--advanced-option__emp-section--wrapper">
                  <div>
                    <label
                      htmlFor="specialFixedPriceForEmp"
                      className="input-box__controllers__label"
                    >
                      {messages['common.searchBy.price.optional']}
                    </label>
                    <input
                      name="specialFixedPriceForEmp"
                      className="form-select w-100 input-box__controllers-input"
                      id="specialFixedPriceForEmp"
                      placeholder={messages['common.searchBy.price.optional']}
                      // onChange={(e) =>
                      //   isPrice(e.target.value) || !e.target.value
                      //     ? setSpecialFixedPriceAdvance(e.target.value)
                      //     : null
                      // }
                      // value={specialFixedPriceAdvance || ''}
                    ></input>
                  </div>
                </div>
              </Row>
            </section>
          </div>
        </Modal.Body>
        <Modal.Footer style={{ display: 'block' }}>
          <div className="d-flex justify-content-between pl-2 pr-2">
            <div>
              <button
                type="button"
                className="btn btn-primary pl-5 pr-5 ml-1 mr-1"
                onClick={() => closeModal()}
              >
                {messages['common.save']}
              </button>
              <button
                type="button"
                className="btn btn-outline-primary pl-5 pr-5 ml-1 mr-1"
                onClick={() => closeModal()}
              >
                {messages['common.cancel']}
              </button>
            </div>
            <div>إستعادة الإعدادات العامة</div>
          </div>
        </Modal.Footer>
      </div>
    </Modal>
  );
}

AdvancedOptionModal.propTypes = {
  setUserSelection: PropTypes.func,
  setOpen: PropTypes.func,
  open: PropTypes.bool,
  priceNameAr: PropTypes.string,
  setPriceNameAr: PropTypes.func,
  priceNameEn: PropTypes.string,
  setPriceNameEn: PropTypes.func,
  timeInAdvancedOption: PropTypes.string,
  setTimeInAdvancedOption: PropTypes.func,
  priceOptions: PropTypes.array,
  choosenPriceOption: PropTypes.string,
  setChoosenPriceOption: PropTypes.func,
  setFixedPriceAdvanced: PropTypes.func,
  fixedPriceAdvanced: PropTypes.number,
  specialFixedPriceAdvance: PropTypes.number,
  setSpecialFixedPriceAdvance: PropTypes.func,
};
