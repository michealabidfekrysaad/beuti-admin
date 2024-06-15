/* eslint-disable */
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl, FormattedMessage } from 'react-intl';
import { convertMinsToHours, convertTimeToMinuts } from 'utils/Helpers/TimeHelper';

export default function SingleConfirmedBooking({
  singleItem,
  setOpenEditItemModal,
  setEditedItemClicked,
  setIdentfier,
  couponValueForBooking,
}) {
  const { messages } = useIntl();

  return (
    <Col xs="12" key={singleItem?.id}>
      <div className="cart--info-container d-block">
        {singleItem?.packages?.map((singlePack) => (
          <div
            key={singlePack?.packageHistoryId}
            className="cart--info-container__booking"
            onClick={() => {
              setOpenEditItemModal(true);
              setEditedItemClicked({
                item: {
                  ...singlePack,
                  name: singlePack?.packages[0]?.name,
                  quantity: singlePack?.count,
                  price: singlePack?.packages[0]?.price,
                  id: singlePack?.packageHistoryId,
                },
                serviceorNot: false,
                insideBooking: true,
              });
              setIdentfier(singlePack?.identify);
            }}
          >
            <div className="cart--info-container__data">
              <div className="cart--info-container__data-name">
                {singlePack?.count > 1 ? `${singlePack?.count}x ` : ''}
                {singlePack?.packages[0]?.name}{' '}
              </div>
              <div className="cart--info-container__data-desc">
                <FormattedMessage
                  id="checkout.package.num.services"
                  values={{
                    num: singlePack?.packages[0]?.noOfServices,
                  }}
                />
              </div>
            </div>
            <div className="cart--info-container__price">
              <FormattedMessage
                id="booking.service.current"
                values={{ price: singlePack?.packages[0]?.price }}
              />
            </div>
          </div>
        ))}

        {singleItem?.services?.map((singleSer) => (
          <div
            key={singleSer?.id}
            className="cart--info-container__booking"
            onClick={() => {
              setOpenEditItemModal(true);
              setEditedItemClicked({
                item: singleSer,
                serviceorNot: true,
                insideBooking: true,
              });
              setIdentfier(singleSer?.identify);
            }}
          >
            <div className="cart--info-container__data">
              <div className="cart--info-container__data-name">{singleSer?.name}</div>
              <div className="cart--info-container__data-desc">
                <FormattedMessage
                  id="booking.service.duration"
                  values={{
                    duration: convertMinsToHours(
                      convertTimeToMinuts('10:30:00'),
                      messages,
                    ),
                    employee: singleSer?.employeeName,
                  }}
                />
              </div>
            </div>
            <div className="cart--info-container__price">
              {singleSer?.from ? <FormattedMessage id="common.start.from" /> : ''}{' '}
              <FormattedMessage
                id="booking.service.current"
                values={{ price: singleSer?.price }}
              />
            </div>
          </div>
        ))}
        {+singleItem?.cityFees > 0 && (
          <div className="cart--info-container__coupon">
            <div>
              <FormattedMessage id="checkout.city.fees" />
            </div>
            <div>
              <FormattedMessage
                id="booking.service.current"
                values={{ price: singleItem?.cityFees }}
              />
            </div>
          </div>
        )}
        {couponValueForBooking > 0 && (
          <div className="cart--info-container__coupon">
            <div>
              <FormattedMessage id="checkout.coupon" />
            </div>
            <div>
              <FormattedMessage
                id="booking.service.current"
                values={{ price: -couponValueForBooking }}
              />
            </div>
          </div>
        )}
        {+singleItem?.voucherValue > 0 && (
          <div className="cart--info-container__coupon">
            <div>
              <FormattedMessage id="checkout.voucher" />
            </div>
            <div>
              <FormattedMessage
                id="booking.service.current"
                values={{ price: -singleItem?.voucherValue }}
              />
            </div>
          </div>
        )}
      </div>
    </Col>
  );
}
