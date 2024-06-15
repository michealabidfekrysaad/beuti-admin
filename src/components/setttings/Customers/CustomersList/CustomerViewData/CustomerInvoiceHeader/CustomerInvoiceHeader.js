/* eslint-disable  */
import React from 'react';
import { useIntl } from 'react-intl';
import CustomerInvoiceDD from '../CustomerInoiveView/CustomerInvoiceDD';

export default function CustomerInvoiceHeader({
  customerInoicesRes,
  setSelectedStatus,
  selectedStatus,
}) {
  const { messages } = useIntl();
  return (
    <div className="d-flex align-items-center justify-content-between">
      <div>
        {customerInoicesRes?.length > 0 && messages['setting.customer.profile.invoices']}
      </div>
      <div>
        <CustomerInvoiceDD
          setSelectedStatus={setSelectedStatus}
          selectedStatus={selectedStatus}
        />
      </div>
    </div>
  );
}
