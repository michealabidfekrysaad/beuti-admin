import React from 'react';
import PropTypes from 'prop-types';

const SelectedQuickSaleItem = ({ item, handleSelect }) => (
  <button
    type="button"
    className="quicksale_list-item"
    onClick={() => handleSelect(item)}
  >
    <h2>{item.name}</h2>
    <p>{item.priceAfterOffer || item.price} SAR</p>
  </button>
);

SelectedQuickSaleItem.propTypes = {
  item: PropTypes.object,
  handleSelect: PropTypes.func,
};
export default SelectedQuickSaleItem;
