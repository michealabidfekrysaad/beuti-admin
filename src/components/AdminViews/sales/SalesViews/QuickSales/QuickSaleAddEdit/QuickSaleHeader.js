import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import QuickSaleSearch from './QuickSaleHeader/QuickSaleSearch';
import { dropDownTypesItems } from '../Helper/QuickSale.Helper';

const QuickSaleHeader = ({
  dropDownData,
  handleSelect,
  quickSaleItems,
  handleOpenCustomItemModal,
  handleAddFees,
}) => {
  const { messages } = useIntl();
  return (
    <section className="addquicksale_search">
      <p className="addquicksale_search-title">
        {messages['sales.quicksale.edit.subtitle']}
      </p>
      <div className="addquicksale_search-wrapper">
        <section className="addquicksale_search-wrapper__input">
          <QuickSaleSearch
            list={dropDownData}
            handleSelect={handleSelect}
            disabled={quickSaleItems.length === 16}
          />
        </section>
        <section className="addquicksale_search-wrapper__actions">
          <button
            type="button"
            className="addquicksale_search-wrapper__actions-custom"
            onClick={() => handleOpenCustomItemModal()}
          >
            {messages['custom.item']}
          </button>
          <button
            type="button"
            className="addquicksale_search-wrapper__actions-fees"
            onClick={() => handleAddFees()}
            disabled={quickSaleItems.find(
              (item) => item.type === dropDownTypesItems.fees,
            )}
          >
            {messages['sales.quicksale.transportationFees']}
          </button>
        </section>
      </div>
    </section>
  );
};

export default QuickSaleHeader;
QuickSaleHeader.propTypes = {
  dropDownData: PropTypes.object,
  handleSelect: PropTypes.func,
  handleOpenCustomItemModal: PropTypes.func,
  handleAddFees: PropTypes.func,

  quickSaleItems: PropTypes.array,
};
