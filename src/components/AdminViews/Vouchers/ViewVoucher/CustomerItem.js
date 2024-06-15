import React from 'react';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import RoundedCheckbox from 'components/shared/RoundedCheckbox';
import { EDIT_VOUCHER_MODE, VIEW_VOUCHER_MODE } from '../Helper/Modes';
const handleClasses = (selected, mode) => {
  if (mode === VIEW_VOUCHER_MODE) {
    return 'customers-grid__item viewmode';
  }
  if (selected) {
    return 'customers-grid__item active';
  }
  return 'customers-grid__item';
};
const CustomerItem = ({ customer, mode, selected, handleSelect = () => null }) => {
  const { messages } = useIntl();
  return (
    <label htmlFor={customer.customerId} className={handleClasses(selected, mode)}>
      <section className="customerItem">
        {mode === EDIT_VOUCHER_MODE && (
          <RoundedCheckbox
            className="customerItem__checkbox"
            name={customer.customerId}
            onChange={handleSelect}
            value={selected}
          />
        )}
        <div className="round">
          <img className="round-img" src={toAbsoluteUrl('/Avatar.png')} alt="circle" />
        </div>
        <div className="customerItem__info">
          <div className="customerItem__info-name">{customer?.customerName || '-'}</div>
          <div className="customerItem__info-number">
            {customer?.customerMobileNumber}
          </div>
        </div>
        {mode === VIEW_VOUCHER_MODE && (
          <p
            className={
              customer?.voucherUsed
                ? 'customers-grid__item-used'
                : 'customers-grid__item-valid'
            }
          >
            {customer?.voucherUsed ? messages['voucher.used'] : messages['voucher.valid']}
          </p>
        )}
      </section>
    </label>
  );
};

CustomerItem.propTypes = {
  customer: PropTypes.object,
  mode: PropTypes.string,
  selected: PropTypes.bool,
  handleSelect: PropTypes.func,
};
export default CustomerItem;
