/* eslint-disable */
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl, FormattedMessage } from 'react-intl';
import { convertMinsToHours, convertTimeToMinuts } from 'utils/Helpers/TimeHelper';
import { salesItemIds } from '../../Helper/ViewsEnum';
export default function SingleItemSelected({
  item,
  setOpenEditItemModal,
  setEditedItemClicked,
  EditedItemClicked,
  setIdentfier,
}) {
  const { messages } = useIntl();
  return (
    <Col xs="12" key={item?.serviceID + Math.floor(Math.random() * 10000)}>
      <div
        className="cart--info-container"
        onClick={() => {
          setIdentfier(item?.identify);
          setOpenEditItemModal(true);
          setEditedItemClicked({
            ...EditedItemClicked,
            item,
            serviceorNot: item.identify === salesItemIds.services,
            insideBooking: false,
          });
        }}
      >
        <div className="cart--info-container__data">
          <div className="cart--info-container__data-name">
            {item?.quantity > 1 ? `${item?.quantity}x ` : ''}
            {item?.name}
          </div>
          <div className="cart--info-container__data-desc">
            {item?.identify === salesItemIds.services && (
              <FormattedMessage
                id="booking.service.duration"
                values={{
                  duration: convertMinsToHours(
                    convertTimeToMinuts(item?.duration),
                    messages,
                  ),
                  employee: item?.employeeName,
                }}
              />
            )}
            {item.identify === salesItemIds.packages && (
              <FormattedMessage
                id="checkout.package.num.services"
                values={{
                  num: item?.count,
                }}
              />
            )}
            {item?.identify === salesItemIds.products && item?.freequantity > 0 && (
              <FormattedMessage
                id="sales.quantity.free"
                values={{
                  num: item?.freequantity,
                }}
              />
            )}
          </div>
        </div>
        <div className="cart--info-container__price">
          <FormattedMessage
            id="booking.service.current"
            values={{ price: item?.price }}
          />
        </div>
      </div>
    </Col>
  );
}
