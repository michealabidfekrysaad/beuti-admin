/* eslint-disable  */

import React from 'react';
import { useIntl } from 'react-intl';
const CustomerViewList = ({
  setActiveCustomerView,
  allCustomerViews,
  activeCustomerView,
}) => {
  const { messages } = useIntl();
  return (
    <section className="customerprofile-viewlist">
      <button
        type="button"
        className={`customerprofile-viewlist__item ${activeCustomerView ===
          allCustomerViews?.booking && 'active'}`}
        onClick={() => setActiveCustomerView(allCustomerViews?.booking)}
      >
        {messages['setting.customer.profile.bookings']}
      </button>
      {/* <button
        type="button"
        className={`customerprofile-viewlist__item ${activeCustomerView ===
          allCustomerViews?.products && 'active'}`}
        onClick={() => setActiveCustomerView(allCustomerViews?.products)}
      >
        {messages['setting.customer.profile.products']}
      </button> */}
      <button
        type="button"
        className={`customerprofile-viewlist__item ${activeCustomerView ===
          allCustomerViews?.invoices && 'active'}`}
        onClick={() => setActiveCustomerView(allCustomerViews?.invoices)}
      >
        {messages['setting.customer.profile.invoices']}
      </button>
      {/* <button
        type="button"
        className={`customerprofile-viewlist__item ${activeCustomerView ===
          allCustomerViews?.reviews && 'active'}`}
        onClick={() => setActiveCustomerView(allCustomerViews?.reviews)}
      >
        {messages['setting.customer.profile.reviews']}
      </button> */}
      {/* <button
        type="button"
        className={`customerprofile-viewlist__item ${activeCustomerView ===
          allCustomerViews?.Address && 'active'}`}
        onClick={() => setActiveCustomerView(allCustomerViews?.Address)}
      >
        {messages['setting.customer.profile.addresses']}
      </button> */}
    </section>
  );
};

export default CustomerViewList;
