/* eslint-disable react/prop-types */
import React from 'react';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';

export default function PaymentMethods({
  paymentMethods,
  setOpenPaymentModal,
  setSelectedPayMethod,
  toPayAmount,
  addedSelectedPayMethod,
}) {
  const { messages } = useIntl();
  return (
    <div className="quicksale_list">
      {paymentMethods?.map((method) => (
        <div key={method?.id}>
          <button
            type="button"
            onClick={() => {
              setSelectedPayMethod(method);
              if (toPayAmount > 0) {
                setOpenPaymentModal(true);
              } else {
                toast?.success(messages['sales.collect.amount.fully.paid']);
              }
            }}
            className={`checkout-method ${!!addedSelectedPayMethod?.find(
              (pay) => +pay?.paymentMethodId === +method?.id,
            ) && 'checkout-choose'}`}
          >
            {method?.name}
          </button>
        </div>
      ))}
    </div>
  );
}
