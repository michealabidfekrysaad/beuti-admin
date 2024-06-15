import React, { useState, useEffect } from 'react';
import { CircularProgress, FormControl } from '@material-ui/core';
import { useIntl } from 'react-intl';
import { Card, Row, Col } from 'react-bootstrap';
import CloseBackIcon from 'components/shared/CloseBackIcon';
import { isPrice } from 'functions/validate';
import AddCityModal from './AddCityModal';

export default function SettingsWorkHome() {
  const { messages, locale } = useIntl();
  const adding = false;
  const [checked, setChecked] = useState(false);
  const [flexActive, setFlexActive] = useState('Active');
  const [open, setOpen] = useState(false);
  const [priceValue, setPriceValue] = useState('');
  const [colorChange, setColorchange] = useState(false);
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

  const activeOrNot = (e) => {
    setChecked(!checked);
    setFlexActive(e.target.value);
  };

  return (
    <>
      <div className={`close-save-nav ${colorChange ? 'nav__white' : ''}`}>
        <div className="d-flex justify-content-between">
          <div>
            <FormControl component="fieldset" fullWidth>
              <button
                type="submit"
                className="btn btn-primary"
                //   onClick={() => {
                //     ClearLocalStorage('serviceIDFromSameLevel');
                //     setSubmit(true);
                //   }}
              >
                {adding ? (
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

      <Card className="mb-5 p-5 card-special">
        <Card.Header>
          <div className="title">{messages['admin.settings.general.home']}</div>
        </Card.Header>
        <Card.Body>
          <Row className="container-box">
            <Col xs={4} lg={3}>
              <p className="container-box__controllers--header">
                {messages['admin.settings.TogglePrivatePlacesStatus']}
              </p>
            </Col>
            <Col xs={8} lg={9}>
              <div>
                <p className="d-inline pl-3 pr-3">
                  <input
                    type="radio"
                    id="active"
                    value="Active"
                    name="radio-group"
                    onChange={(e) => activeOrNot(e)}
                    checked={!checked}
                  />
                  <label htmlFor="active">
                    {messages['admin.settings.work.home.freeLance']}
                  </label>
                </p>
                <p className="d-inline pl-3 pr-3">
                  <input
                    type="radio"
                    id="notActive"
                    value="notActive"
                    name="radio-group"
                    checked={checked}
                    onChange={(e) => activeOrNot(e)}
                  />
                  <label htmlFor="notActive">
                    {messages['admin.settings.work.home.company']}
                  </label>
                </p>
              </div>
            </Col>
            <Col className="input-box__controllers  mb-2" lg={6} xs={12}>
              <label htmlFor="prodPrice" className="input-box__controllers__label w-100">
                {messages['admin.settings.work.home.limit.min']}
              </label>
              <input
                id="prodPrice"
                className={`input-box__controllers-input w-75 ${
                  +priceValue > 9999 ? 'input-box__controllers-input--error' : ''
                }`}
                placeholder={messages['admin.settings.work.home.limit.min']}
                onChange={(e) =>
                  isPrice(e.target.value) || !e.target.value
                    ? setPriceValue(e.target.value)
                    : null
                }
                value={priceValue}
              />
              {+priceValue > 9999 && (
                <p className="pt-2 text-danger">
                  {messages['product.add.price.validationMessage']}
                </p>
              )}
            </Col>
          </Row>
          <Row className="container-box">
            <Col xs={4} lg={3}>
              <p className="container-box__controllers--header">
                {messages['admin.settings.general.city.enabled']}
              </p>
            </Col>
            <Col xs={12}>
              <div className="container-box__controllers--header-second pl-0 pr-0">
                <input
                  type="text"
                  className="container-box__controllers--header-second__input-hidden"
                  onClick={() => setOpen(true)}
                  id="addCity"
                />
                <label
                  className="form-check-label container-box__controllers--header-second__label"
                  htmlFor="addCity"
                >
                  {messages['admin.settings.general.city.add']}
                </label>
              </div>
            </Col>
          </Row>

          <Row className="container-box"></Row>
        </Card.Body>
        <AddCityModal
          setOpen={setOpen}
          open={open}
          header="admin.settings.general.city.choose"
        />
      </Card>
    </>
  );
}
