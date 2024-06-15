import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Card, Row, Col } from 'react-bootstrap';
import NavbarForNoWrapViews from 'components/shared/NavbarForNoWrapViews';

export default function SettingsOnlineSections() {
  const { messages } = useIntl();
  const [communicationMethods, setCommunicationMethods] = useState({
    calling: true,
    messages: true,
    whatsapp: true,
  });
  const [maxLimit, setMaxLimit] = useState('');
  const [cancellBefore, setCancellBefore] = useState('');
  const [checked, setChecked] = useState({
    deposite: true,
    caBooking: true,
    bwBooking: true,
  });
  const [selectedRadio, setSelectedRadio] = useState({
    deposite: 'Active',
    caBooking: 'Active',
    bwBooking: 'Active',
  });

  return (
    <>
      <NavbarForNoWrapViews button={messages['common.save']} disabled="true" />
      <Card className="mb-5 p-5 card-special">
        <Card.Header>
          <div className="title"> {messages['admin.settings.online.reserve.header']}</div>
        </Card.Header>
        <Card.Body>
          <Row className="container-box">
            <Col xs={12}>
              <p className="container-box__controllers--header">
                {messages['admin.settings.online.reserve.commun']}
              </p>
            </Col>
            <Col xs={12} className="d-flex container-box__controllers mt-2 mb-2">
              <div className="form-check container-box__controllers--checkDiv">
                <input
                  className="form-check-input custom-color"
                  type="checkbox"
                  checked={communicationMethods.calling}
                  onChange={() =>
                    setCommunicationMethods({
                      ...communicationMethods,
                      calling: !communicationMethods.calling,
                    })
                  }
                  id="calling"
                />
                <label className="form-check-label" htmlFor="calling">
                  {messages['admin.settings.online.reserve.commun.call']}
                </label>
              </div>
              <div className="form-check container-box__controllers--checkDiv">
                <input
                  className="form-check-input custom-color"
                  type="checkbox"
                  checked={communicationMethods.messages}
                  onChange={() =>
                    setCommunicationMethods({
                      ...communicationMethods,
                      messages: !communicationMethods.messages,
                    })
                  }
                  id="messages"
                />
                <label className="form-check-label" htmlFor="messages">
                  {messages['admin.settings.online.reserve.commun.mess']}
                </label>
              </div>
              <div className="form-check container-box__controllers--checkDiv">
                <input
                  className="form-check-input custom-color"
                  type="checkbox"
                  checked={communicationMethods.whatsapp}
                  onChange={() =>
                    setCommunicationMethods({
                      ...communicationMethods,
                      whatsapp: !communicationMethods.whatsapp,
                    })
                  }
                  id="whatsapp"
                />
                <label className="form-check-label" htmlFor="whatsapp">
                  {messages['admin.settings.online.reserve.commun.whats']}
                </label>
              </div>
            </Col>
            <Col className="container-box__controllers mt-2 mb-2" xs={12}>
              <label htmlFor="maxLimit" className="container-box__controllers--label">
                {messages['admin.settings.online.reserve.limit.label']}
              </label>
              <select
                id="maxLimit"
                className="form-select w-25 container-box__controllers-select"
                onChange={(e) => setMaxLimit(e.target.value)}
                value={maxLimit || ''}
              >
                <option
                  value={null}
                  className="container-box__controllers-select__pre-choosen"
                  // selected
                  defaultValue
                >
                  {messages['admin.settings.online.reserve.limit.label']}
                </option>
                {/* {gctDD?.map((ser) => (
                  <option
                    className="font-size container-box__controllers-select__options"
                    key={ser.id}
                    value={ser.id}
                  >
                    {ser.name}
                  </option>
                ))} */}
              </select>
            </Col>
            <Col className="container-box__controllers mt-2 mb-2" xs={12}>
              <label
                htmlFor="cancellappoitment"
                className="container-box__controllers--label"
              >
                {messages['admin.settings.online.reserve.cancell.label']}
              </label>
              <select
                id="cancellappoitment"
                className="form-select w-25 container-box__controllers-select"
                onChange={(e) => setCancellBefore(e.target.value)}
                value={cancellBefore || ''}
              >
                <option
                  value={null}
                  className="container-box__controllers-select__pre-choosen"
                  // selected
                  defaultValue
                >
                  {messages['admin.settings.online.reserve.cancell.label']}
                </option>
                {/* {gctDD?.map((ser) => (
                  <option
                    className="font-size container-box__controllers-select__options"
                    key={ser.id}
                    value={ser.id}
                  >
                    {ser.name}
                  </option>
                ))} */}
              </select>
            </Col>
            <Col xs="auto" className="container-box__controllers mt-2">
              <p className="container-box__controllers--header">
                {messages['admin.settings.online.reserve.deposite.label']}
              </p>
            </Col>
            <Col xs={7} lg={9} className="container-box__controllers mt-2">
              <div>
                <p className="d-inline pl-3 pr-3">
                  <input
                    type="radio"
                    id="activeDeposite"
                    value="Active"
                    onChange={(e) => {
                      setChecked({ ...checked, deposite: !checked.deposite });
                      setSelectedRadio({ ...selectedRadio, deposite: e.target.value });
                    }}
                    checked={checked.deposite}
                  />
                  <label htmlFor="activeDeposite">{messages['common.Active']}</label>
                </p>
                <p className="d-inline pl-3 pr-3">
                  <input
                    type="radio"
                    id="notActiveDeposite"
                    value="notActive"
                    checked={!checked.deposite}
                    onChange={(e) => {
                      setChecked({ ...checked, deposite: !checked.deposite });
                      setSelectedRadio({ ...selectedRadio, deposite: e.target.value });
                    }}
                  />
                  <label htmlFor="notActiveDeposite">{messages['common.InActive']}</label>
                </p>
              </div>
            </Col>
            <Col xs="auto" className="container-box__controllers mt-2">
              <p className="container-box__controllers--header">
                {messages['admin.settings.onlineBookingStatus.current']}
              </p>
            </Col>
            <Col xs={7} lg={9} className="container-box__controllers mt-2">
              <div>
                <p className="d-inline pl-3 pr-3">
                  <input
                    type="radio"
                    id="activeCaBookings"
                    value="Active"
                    onChange={(e) => {
                      setChecked({ ...checked, caBooking: !checked.caBooking });
                      setSelectedRadio({ ...selectedRadio, caBooking: e.target.value });
                    }}
                    checked={checked.caBooking}
                  />
                  <label htmlFor="activeCaBookings">{messages['common.Active']}</label>
                </p>
                <p className="d-inline pl-3 pr-3">
                  <input
                    type="radio"
                    id="notActiveCaBooking"
                    value="notActive"
                    checked={!checked.caBooking}
                    onChange={(e) => {
                      setChecked({ ...checked, caBooking: !checked.caBooking });
                      setSelectedRadio({ ...selectedRadio, caBooking: e.target.value });
                    }}
                  />
                  <label htmlFor="notActiveCaBooking">
                    {messages['common.InActive']}
                  </label>
                </p>
              </div>
            </Col>
            <Col xs="auto" className="container-box__controllers mt-2">
              <p className="container-box__controllers--header">
                {messages['admin.settings.BookingWizardBookings.current']}
              </p>
            </Col>
            <Col xs={7} lg={9} className="container-box__controllers mt-2">
              <div>
                <p className="d-inline pl-3 pr-3">
                  <input
                    type="radio"
                    id="activeBwBookings"
                    value="Active"
                    onChange={(e) => {
                      setChecked({ ...checked, bwBooking: !checked.bwBooking });
                      setSelectedRadio({ ...selectedRadio, bwBooking: e.target.value });
                    }}
                    checked={checked.bwBooking}
                  />
                  <label htmlFor="activeBwBookings">{messages['common.Active']}</label>
                </p>
                <p className="d-inline pl-3 pr-3">
                  <input
                    type="radio"
                    id="notActiveBwBooking"
                    value="notActive"
                    checked={!checked.bwBooking}
                    onChange={(e) => {
                      setChecked({ ...checked, bwBooking: !checked.bwBooking });
                      setSelectedRadio({ ...selectedRadio, bwBooking: e.target.value });
                    }}
                  />
                  <label htmlFor="notActiveBwBooking">
                    {messages['common.InActive']}
                  </label>
                </p>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
}
