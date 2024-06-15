/* eslint-disable */
import React from 'react';
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import { FormattedMessage, useIntl } from 'react-intl';
import { typeOfItems } from '../../Helper/QuickSale.Helper';
const QuickSaleItem = ({ item, undraggable, handleDelete }) => {
  const { messages } = useIntl();
  return (
    <div className="addquicksale_list-item">
      {!undraggable && (
        <>
          <section className="addquicksale_list-item__header">
            <div>
              <h2>{item.name}</h2>
              <p>{messages[typeOfItems[item?.type]?.translate]}</p>
            </div>
            <button type="button" onClick={() => handleDelete(item.id)}>
              <SVG src={toAbsoluteUrl('/Trash.svg')} />
            </button>
          </section>
          <section className="addquicksale_list-item__price">
            {!!item?.priceAfterOffer || !!item?.price ? (
              <FormattedMessage
                id={item?.isFrom ? 'booking.service.from' : 'booking.service.current'}
                values={{
                  price: item?.priceAfterDiscount || item?.price,
                }}
              />
            ) : (
              messages['booking.service.free']
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default QuickSaleItem;
