import React from 'react';
import { Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import moment from 'moment';
import {
  convertMinsToHours,
  convertTimeToMinuts,
} from '../../../../../utils/Helpers/TimeHelper';

const ServiceItem = ({ service }) => {
  const { messages, locale } = useIntl();

  return (
    <Row className="bookingserviceItem">
      <Col xs="8">
        <Row className="bookingserviceItem-info">
          <Col className="bookingserviceItem-info__date" xs="auto">
            {moment(service?.serviceStartTime, 'HHmmss')
              .locale(locale)
              .format('hh:mm a')}
          </Col>
          <Col>
            <div className="bookingserviceItem-info__name">{service?.serviceName}</div>
            <div className="bookingserviceItem-info__time">
              {' '}
              <FormattedMessage
                id="booking.service.duration"
                values={{
                  duration: convertMinsToHours(
                    convertTimeToMinuts(service?.duration),
                    messages,
                  ),
                  employee: service?.employeeName,
                }}
              />
            </div>
          </Col>
        </Row>
      </Col>
      <Col xs="auto">
        <div className="pricelabel">
          {service?.hasOffer && (
            <span className="pricelabel_old">
              <FormattedMessage
                id="booking.service.current"
                values={{ price: service?.priceBeforeOffer }}
              />
            </span>
          )}
          <span className="pricelabel_new">
            <FormattedMessage
              id={
                service?.isFromPrice ? 'booking.service.from' : 'booking.service.current'
              }
              values={{ price: service?.priceWithVat || service?.priceBeforeOffer }}
            />
          </span>
        </div>
      </Col>
    </Row>
  );
};

export default ServiceItem;
ServiceItem.propTypes = {
  service: PropTypes.object,
};
