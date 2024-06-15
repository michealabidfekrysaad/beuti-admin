/* eslint-disable react/prop-types */
import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import moment from 'moment';
import { FormattedMessage, useIntl } from 'react-intl';
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import empAvatar from 'images/Avatarpurple.png';
import { statusColorForWord } from 'functions/statusColor';
import salon from '../../../../../assets/img/dashboard/salons.svg';
import home from '../../../../../assets/img/dashboard/homes.svg';

const TooltipCalendarContent = ({ data, empData }) => {
  const { locale, messages } = useIntl();
  function CovertTime(date) {
    const timeString12hr = new Date(`1970-01-01T${date}Z`).toLocaleTimeString(
      {},
      { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' },
    );
    return timeString12hr;
  }
  function durationBetweenToDate(date1, date2) {
    const duration = moment.duration(
      moment(`1970-01-01T${date2}Z`).diff(moment(`1970-01-01T${date1}Z`)),
    );
    const hours = duration.hours();
    const minutes = duration.minutes();
    if (locale === 'ar') return `${hours} ساعة ${minutes} دقيقة`;
    if (locale === 'en') return `${hours}h ${minutes}m`;
    return null;
  }
  return (
    <Card className="tooltip-calendar">
      <Card.Header className="justify-content-start tooltip-header ">
        {/* <div className="tooltip-calendar__image"> */}
        <img
          width="60"
          height="60"
          className="rounded-circle"
          src={empAvatar}
          alt={data?.customerName}
        />
        {/* </div> */}
        <div className="mx-2">
          <div className="tooltip-calendar__customerName">
            {data?.customerName || messages['calendar.customr.walk.in']}
          </div>
          <div className="tooltip-calendar__customerNumber">
            {data?.customerPhoneNumber}
          </div>
        </div>
      </Card.Header>
      <Card.Body className="mb-0">
        <Row>
          <Col className="tooltip-calendar__bookingdate" xs={6}>
            {`${CovertTime(data?.serviceStart?.split('T')[1])} - ${CovertTime(
              data?.serviceEnd?.split('T')[1],
            )}`}
          </Col>
          <Col
            className="tooltip-calendar__bookingdate text-right font-weight-bold"
            style={{ color: `${statusColorForWord(data?.statusId)}` }}
            xs={6}
          >
            {data?.statusName}
          </Col>
          <Col className="tooltip-calendar__bookingby" xs={12}>
            <FormattedMessage
              id="booking.calendar.servicewith"
              values={{
                date: data?.serviceName,
                name: empData?.employeeName,
              }}
            />
          </Col>
          <Col className="tooltip-calendar__serviceName" xs={12}>
            {data?.isHome
              ? messages['booking.calendar.home.booking']
              : messages['booking.calendar.salon.booking']}
            <SVG src={toAbsoluteUrl(`${data.isHome ? home : salon}`)} />
          </Col>
          {/* <Col className="tooltip-calendar__serviceName text-right" xs={6}>
            {data?.servicePrice || '200'} <FormattedMessage id="common.currency" />
          </Col> */}
        </Row>
      </Card.Body>
    </Card>
  );
};

export default TooltipCalendarContent;
