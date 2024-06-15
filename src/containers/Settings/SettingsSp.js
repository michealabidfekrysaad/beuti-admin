import React, { useState, useEffect } from 'react';
import { CircularProgress, FormControl } from '@material-ui/core';
import { useIntl } from 'react-intl';
import { Card, Row } from 'react-bootstrap';
import CloseBackIcon from 'components/shared/CloseBackIcon';
import GeneralInfoSettings from './SettingsSpSections/GeneralInfoSettings';
import SalonTime from './SettingsSpSections/Salontime';
import SloganCenter from './SettingsSpSections/SloganCenter';

export default function SettingsSp() {
  const { messages, locale } = useIntl();
  const [username, setUsername] = useState('');
  const [usernameEn, setUsernameEn] = useState('');
  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(true);
  const [changeMyCity, setChangeMyCity] = useState('');
  const [centerPhone, setCenterPhone] = useState('');
  const [personalPhone, setPersonalPhone] = useState('');
  const [getSearchPlace, setGetSearchPlace] = useState();
  const [salonLocation, setSalonLocation] = useState('');
  const [checked, setChecked] = useState(false);
  const [flexActive, setFlexActive] = useState('Active');
  const hrAlign = locale === 'ar' ? 'right' : 'left';
  const adding = false;
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
          <div className="title">{messages['admin.settings.SP.header']}</div>
        </Card.Header>
        <Card.Body>
          <Row className="container-box">
            <GeneralInfoSettings
              setUsername={setUsername}
              setUsernameEn={setUsernameEn}
              setEmail={setEmail}
              setCenterPhone={setCenterPhone}
              setPersonalPhone={setPersonalPhone}
              setSalonLocation={setSalonLocation}
              username={username}
              usernameEn={usernameEn}
              email={email}
              validEmail={validEmail}
              setValidEmail={setValidEmail}
              centerPhone={centerPhone}
              personalPhone={personalPhone}
              getSearchPlace={getSearchPlace}
              salonLocation={salonLocation}
              setGetSearchPlace={setGetSearchPlace}
              setChangeMyCity={setChangeMyCity}
              changeMyCity={changeMyCity}
            />
          </Row>

          <hr className="hr-style" align={hrAlign} />
          <Row className="container-box">
            <SalonTime
              setChecked={setChecked}
              checked={checked}
              setFlexActive={setFlexActive}
              flexActive={flexActive}
            />
          </Row>

          <hr className="hr-style" align={hrAlign} />
          <Row className="container-box">
            <SloganCenter />
          </Row>
        </Card.Body>
      </Card>
    </>
  );
}
