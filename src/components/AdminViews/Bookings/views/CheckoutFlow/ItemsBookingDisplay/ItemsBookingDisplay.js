/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable indent */
/* eslint-disable react/prop-types */
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import { convertMinsToHours, convertTimeToMinuts } from 'utils/Helpers/TimeHelper';

export default function ItemsBookingDisplay({
  setOpenEditItemModal,
  setEditedItemClicked,
  breakDownRes,
}) {
  const { messages, locale } = useIntl();
  return (
    <>
      {breakDownRes?.services?.map((service) => (
        <div
          className="bookingserviceItem d-flex border-bottom-0"
          key={service?.id}
          onClick={() => {
            setEditedItemClicked({ item: service, serviceorNot: true });
            setOpenEditItemModal(true);
          }}
        >
          <div className="px-0">
            <div className="bookingserviceItem-info">
              <div>
                <button
                  className="checkout-details_item-each"
                  type="button"
                  onClick={() => {
                    setEditedItemClicked({ item: service, serviceorNot: true });
                    setOpenEditItemModal(true);
                  }}
                >
                  <div className="bookingserviceItem-info__name--bordered">
                    {service.quantity > 1 ? (
                      <>
                        <span>
                          {locale === 'ar' && 'x'}
                          {service.quantity > 1 ? service.quantity : ''}
                          {locale !== 'ar' && 'x'}
                        </span>
                        <span className="px-2">{service.name}</span>
                      </>
                    ) : (
                      <span>{service.name}</span>
                    )}
                  </div>
                </button>

                <div className="bookingserviceItem-info__time">
                  <FormattedMessage
                    id="booking.service.duration"
                    values={{
                      duration: convertMinsToHours(
                        convertTimeToMinuts('01:00:00'),
                        messages,
                      ),
                      employee: service?.employeeName,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="px-0">
            <div className="pricelabel">
              <span className="pricelabel_new">
                <FormattedMessage
                  id="booking.service.current"
                  values={{
                    price: service?.totalItemsPriceWithoutVat,
                  }}
                />
              </span>
            </div>
          </div>
        </div>
      ))}
      {breakDownRes?.packages?.map((pack) => (
        <Col
          xs={12}
          className="bookingserviceItem d-flex border-bottom-0"
          key={pack?.packageHistoryId}
        >
          <Col xs="8" className="px-0">
            <Row className="bookingserviceItem-info">
              <Col>
                <button
                  className="checkout-details_item-each"
                  type="button"
                  onClick={() => {
                    setEditedItemClicked({ item: pack, serviceorNot: false });
                    setOpenEditItemModal(true);
                  }}
                >
                  <div className="bookingserviceItem-info__name--bordered">
                    {pack.quantity > 1 ? (
                      <>
                        <span>
                          {locale === 'ar' && 'x'}
                          {pack.quantity > 1 ? pack.quantity : ''}
                          {locale !== 'ar' && 'x'}
                        </span>
                        <span className="px-2">{pack?.name}</span>
                      </>
                    ) : (
                      <span>{pack?.name}</span>
                    )}
                  </div>
                </button>

                <div className="bookingserviceItem-info__time">
                  <FormattedMessage
                    id="checkout.package.num.services"
                    values={{ num: pack?.serviceCount }}
                  />
                </div>
              </Col>
            </Row>
          </Col>
          <Col xs="auto" className="px-0">
            <div className="pricelabel">
              <span className="pricelabel_new">
                <FormattedMessage
                  id="booking.service.current"
                  values={{
                    price: pack?.totalItemsPriceWithoutVat,
                  }}
                />
              </span>
            </div>
          </Col>
        </Col>
      ))}
      {breakDownRes?.packages?.length === 0 && breakDownRes?.services?.length === 0 && (
        <Col xs={12} className="text-center font-weight-bold">
          <FormattedMessage id="booking.no.items" />
        </Col>
      )}
    </>
  );
}
