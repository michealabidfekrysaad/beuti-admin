import React from 'react';
import PropTypes from 'prop-types';

import CustomerItem from './CustomerItem';

const VoucherCustomers = ({ mode, selectedCustomers, handleSelect, customers }) => (
  <div className="customers-grid">
    {customers?.map((customer) => (
      <CustomerItem
        customer={customer}
        mode={mode}
        handleSelect={handleSelect}
        selected={!!selectedCustomers.find((id) => +id === +customer.customerId)}
      />
    ))}
  </div>
);

export default VoucherCustomers;

VoucherCustomers.propTypes = {
  mode: PropTypes.string,
  selectedCustomers: PropTypes.array,
  handleSelect: PropTypes.func,
  customers: PropTypes.array,
};
