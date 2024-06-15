import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Card, Row, Col } from 'react-bootstrap';
import NavbarForNoWrapViews from 'components/shared/NavbarForNoWrapViews';

export default function SettingsStatusSections() {
  const { messages } = useIntl();
  const [BookingLink, setBookingLink] = useState('');

  useEffect(() => {
    setBookingLink(`https://booking-wizard.beuti.co/Booking/OnlineBooking/numberofSP`);
  }, []);

  return (
    <>
      <NavbarForNoWrapViews button={messages['common.save']} disabled="true" />
      <Card className="card-special">
        <Card.Header>
          <div className="title"> {messages['admin.settings.status.settings']}</div>
        </Card.Header>
        <Card.Body>
          <Row className="container-box">
            <Col xs={12} className="container-box__controllers mt-2">
              <p className="container-box__controllers--header">
                {messages['admin.settings.bookinglink']}
              </p>
            </Col>
            <Col xs={12} className="container-box__controllers mb-2">
              <label
                style={{ cursor: 'pointer' }}
                role="presentation"
                onClick={() => {
                  window.open(BookingLink, '_blank');
                }}
                className="container-box__controllers--label"
              >
                {BookingLink}
              </label>
            </Col>
            <Col xs={12} className="container-box__controllers mt-2">
              <p className="container-box__controllers--header">
                {messages['admin.settings.general.bookings']}
              </p>
            </Col>
            <Col xs={12} className="container-box__controllers mb-2">
              <label className="container-box__controllers--label">{BookingLink}</label>
            </Col>
            <Col xs={12} className="container-box__controllers mt-2">
              <p className="container-box__controllers--header">
                {messages['admin.settings.general.bookings.income']}
              </p>
            </Col>
            <Col xs={12} className="container-box__controllers mb-2">
              <label className="container-box__controllers--label">
                {200} {messages['common.currency']}
              </label>
            </Col>
            <Col xs={12} className="container-box__controllers mt-2">
              <p className="container-box__controllers--header">
                {messages['admin.settings.general.status.SP']}
              </p>
            </Col>
            <Col xs={12} className="container-box__controllers mb-2">
              <label className="container-box__controllers--label">{200}</label>
            </Col>
            <Col xs={12} className="container-box__controllers mt-2">
              <p className="container-box__controllers--header">
                {messages['admin.settings.general.status.SP.income']}
              </p>
            </Col>
            <Col xs={12} className="container-box__controllers mb-2">
              <label className="container-box__controllers--label">
                {200} {messages['common.currency']}
              </label>
            </Col>
            <Col xs={12} className="container-box__controllers mt-2">
              <p className="container-box__controllers--header">
                {messages['admin.settings.general.status.total.income']}
              </p>
            </Col>
            <Col xs={12} className="container-box__controllers mb-2">
              <label className="container-box__controllers--label">
                {11200} {messages['common.currency']}
              </label>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
}
