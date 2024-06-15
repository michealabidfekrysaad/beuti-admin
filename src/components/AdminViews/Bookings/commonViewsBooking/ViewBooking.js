/* eslint-disable  */

import React, { useState } from 'react';
import NavbarForNoWrapViews from 'components/shared/NavbarForNoWrapViews';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import './Style/Booking.scss';
import ViewBookingSidebar from './viewBooking/ViewBookingSidebar';
import { useHistory, useParams } from 'react-router-dom';
import { Routes } from 'constants/Routes';
import { CallAPI } from 'utils/API/APIConfig';
import moment from 'moment';
import ServiceItem from './viewBooking/ServiceItem';
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
export default function ViewBooking() {
  const { messages, locale } = useIntl();
  const [actionHashMap, setActionsHashMap] = useState({});
  const history = useHistory();
  const { bookingId } = useParams();
  const { data: BookingDetails, refetch: getBookingDataCall } = CallAPI({
    name: ['GetBookingData', bookingId],
    url: 'Booking/GetBookingDetailsBySP',
    query: {
      bookingId: bookingId,
    },
    select: (data) => ({
      ...data?.data?.data,
    }),
    onSuccess: (res) => {
      setActionsHashMap(() => {
        const actionHash = {};
        for (let index in res?.actions) {
          !actionHash[res.actions[index]] && (actionHash[res.actions[index]] = index);
        }
        return actionHash;
      });
    },
    enabled: true,
  });
  const { data: inoviceImg } = CallAPI({
    name: ['getInvoice', bookingId, actionHashMap[2]],
    url: 'Booking/GeInvoiceByBookingId',
    enabled: !!actionHashMap[2],
    query: {
      bookingId: bookingId,
    },
    select: (data) => data?.data?.data,
  });

  const checkWhereToGoWhenClickCloseBtn = () => {
    if (history && history?.location?.state?.prevPath?.includes('customerProfile')) {
      return history.goBack();
    }
    return history.push(Routes.dayBookingsCalendarView);
  };

  return (
    <section className="booking ">
      <NavbarForNoWrapViews
        title={messages['booking.service.viewBoooking']}
        disabled="true"
        hideBtn
        onClick={() => checkWhereToGoWhenClickCloseBtn()}
      />
      <section className="booking-view container-fluid">
        <Row>
          <Col lg={8} md={12} className="booking-view__wrapper">
            <section className="fixed-layout">
              <section>
                {BookingDetails?.servicesDetails?.map((servicesGroup, index) => (
                  <section key={index} className="servicegroupbooking">
                    <Row className="align-items-center justify-content-between">
                      <Col xs="auto">
                        <section className="booking-view__date">
                          {servicesGroup?.serviceDate}
                        </section>
                      </Col>
                      {!!BookingDetails?.isHome && index === 0 && (
                        <Col xs="auto">
                          <section className="booking-view__place">
                            <SVG src={toAbsoluteUrl('/homeBooking.svg')} />
                            <span>{messages['booking.details.home']}</span>
                          </section>
                        </Col>
                      )}
                    </Row>
                    <section>
                      {servicesGroup?.services?.map((service, i) => (
                        <ServiceItem key={i} service={service} />
                      ))}
                    </section>
                  </section>
                ))}
              </section>
              {!!BookingDetails?.notes && (
                <section className="booking-view__note row">
                  <div className="booking-view__note-title">
                    {messages['booking.service.notes']}
                  </div>
                  <div className="booking-view__note-description">
                    {BookingDetails?.notes}
                  </div>
                </section>
              )}
              {!!BookingDetails?.appointmentHistory.length && (
                <section className="booking-view__note row">
                  <div className="booking-view__note-title">
                    {messages['booking.service.history']}
                  </div>
                  {BookingDetails?.appointmentHistory?.map((historyItem, i) => (
                    <div className="booking-view__note-description" key={i}>
                      {historyItem?.details}
                    </div>
                  ))}
                </section>
              )}
              {!!BookingDetails?.homeLocation && (
                <section className="booking-view__note row">
                  <div className="booking-view__note-title">
                    {messages['booking.details.location']}
                  </div>
                  <a
                    className="booking-view__note-description"
                    href={`http://maps.google.com/maps?q=${BookingDetails?.homeLocation?.latitude},${BookingDetails?.homeLocation?.longitude}`}
                    target="_blank"
                  >
                    {locale === 'ar'
                      ? BookingDetails?.homeLocation?.addressAr
                      : BookingDetails?.homeLocation?.addressEn}
                    {!BookingDetails?.homeLocation?.addressAr &&
                      !BookingDetails?.homeLocation?.addressEn &&
                      BookingDetails?.homeLocation?.addressDescription}
                    {!BookingDetails?.homeLocation?.addressAr &&
                      !BookingDetails?.homeLocation?.addressEn &&
                      !BookingDetails?.homeLocation?.addressDescription &&
                      messages['booking.details.location.on.map']}
                  </a>
                </section>
              )}
            </section>
          </Col>
          {/* the second card body for add client  */}
          <Col lg={4} md={12}>
            <section className="booking-sidebar">
              <ViewBookingSidebar
                BookingDetails={BookingDetails}
                actionHashMap={actionHashMap}
                getBookingDataCall={getBookingDataCall}
                inoviceImg={inoviceImg}
              />
            </section>
          </Col>
        </Row>
      </section>
    </section>
  );
}
