/* eslint-disable no-param-reassign */
/* eslint-disable react/prop-types */
import {
  eventStatusClassServiceList,
  statusColorBackgroundForWord,
  statusColorForWord,
} from 'functions/statusColor';
import SVG from 'react-inlinesvg';
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import moment from 'moment';
import { useHistory } from 'react-router-dom';

export default function ListServiceComponent({ BookingListRes, fetchServiceList }) {
  const { locale, messages } = useIntl();
  const history = useHistory();

  const splitDurationService = (duration) => {
    const durationParts = duration?.split(':');
    let hour = null;
    let min = null;
    if (+durationParts[0] > 0) {
      hour = +durationParts[0];
    }
    if (+durationParts[1] > 0) {
      min = +durationParts[1];
    }
    if (hour && min) {
      if (locale === 'ar') return `${hour} ساعة ${min} دقيقة`;
      if (locale === 'en') return `${hour} h ${min} m`;
    }
    if (hour) {
      if (locale === 'ar') return `${hour} ساعة`;
      if (locale === 'en') return `${hour} h`;
    }
    if (min) {
      if (locale === 'ar') return `${min} دقيقة`;
      if (locale === 'en') return `${min} m`;
    }
    return 0;
  };
  return (
    <Row className="service">
      {BookingListRes &&
        BookingListRes.map((date) => (
          <>
            <Col xs={12} key={date?.bookingDate}>
              <div className="service_date">{date?.bookingDate}</div>
            </Col>
            {date &&
              date.services &&
              date.services.map((service) => (
                <Col xs={12} lg={6} className="my-3" key={service.bookingServicId}>
                  <button
                    type="button"
                    onClick={() => history.push(`/booking/view/${service?.bookingId}`)}
                    className={`service_body borderColor${
                      locale !== 'ar' ? '_left' : '_right'
                    }${eventStatusClassServiceList(service?.statusId)}`}
                  >
                    <Row className="service_body-sections">
                      <Col
                        className={`service_body-sections_time border-grey${
                          locale === 'ar' ? '_left' : '_right'
                        }`}
                        xs="2"
                      >
                        <div className="service_body-sections_time-format">
                          {moment(`1970-01-01T${service?.serviceStartTime}`)
                            .locale(locale)
                            .format('hh:mm a')}
                        </div>
                        <div className="service_body-sections_time-next">
                          {service?.isNextDay && messages['common.next.day']}
                        </div>
                      </Col>
                      <Col
                        className={`service_body-sections_data border-grey${
                          locale === 'ar' ? '_left' : '_right'
                        }`}
                        xs="7"
                      >
                        <div
                          className="service_body-sections_data-status"
                          style={{
                            color: `${statusColorForWord(service?.statusId)}`,
                            background: `${statusColorBackgroundForWord(
                              service?.statusId,
                            )}`,
                          }}
                        >
                          {service?.statusName}
                        </div>
                        <div className="service_body-sections_data-name">
                          {service?.serviceName}
                        </div>
                        <div className="service_body-sections_data-emp">
                          <FormattedMessage
                            id="booking.calendar.servicewith"
                            values={{
                              date: splitDurationService(service?.duration),
                              name: service?.employeeName,
                            }}
                          />
                        </div>
                      </Col>
                      <Col className="service_body-sections_customer" xs="3">
                        <div className="service_body-sections_customer-name">
                          <SVG src={toAbsoluteUrl('/assets/icons/beuti/user.svg')} />{' '}
                          <span>
                            {service?.customerName || (
                              <FormattedMessage id="calendar.customr.walk.in" />
                            )}
                          </span>
                        </div>
                        <div className="service_body-sections_customer-place">
                          <SVG
                            src={toAbsoluteUrl(
                              `/assets/icons/beuti/${
                                service?.isHome ? 'home' : 'salon'
                              }.svg`,
                            )}
                          />
                          <span>
                            {service?.isHome ? (
                              <FormattedMessage id="add.service.at.home" />
                            ) : (
                              <FormattedMessage id="add.service.at.salon" />
                            )}
                          </span>
                        </div>
                      </Col>
                    </Row>
                  </button>
                </Col>
              ))}
          </>
        ))}
      {!BookingListRes?.length && !fetchServiceList && (
        <Col xs="12" className="not-found">
          <FormattedMessage id="services.list.no.services" />
        </Col>
      )}
      {fetchServiceList && (
        <div className="lds-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      )}
    </Row>
  );
}
