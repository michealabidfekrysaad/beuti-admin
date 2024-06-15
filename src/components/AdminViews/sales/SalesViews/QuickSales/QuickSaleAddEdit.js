import React, { useState } from 'react';
import NavbarForNoWrapViews from 'components/shared/NavbarForNoWrapViews';
import './QuickSaleAddEdit/QuickSaleAddEdit.scss';
import { useIntl } from 'react-intl';
import { CallAPI } from 'utils/API/APIConfig';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import _ from 'lodash';
import QuickSaleItems from './QuickSaleAddEdit/QuickSaleItems';
import QuickSaleHeader from './QuickSaleAddEdit/QuickSaleHeader';
import { dropDownTypesItems, typeOfItems } from './Helper/QuickSale.Helper';
import QSCustomeItemModal from './QuickSaleAddEdit/Modals/QSCustomItemModal';
const isListUpdated = (oldList, newList) => !_.isEqual(oldList, newList);
const AddEditQuickSale = ({ setOpenAddEditQuickSale, isPOS }) => {
  const { messages } = useIntl();
  const [quickSaleItems, setQuickSaleItems] = useState([]);
  const [openAddCustomItem, setOpenAddCustomItem] = useState(false);
  /* -------------------------------------------------------------------------- */
  /*                    Get Drop Down Items And Display List                    */
  /* -------------------------------------------------------------------------- */
  const { data: dropDownData } = CallAPI({
    name: 'getQuickSales',
    url: '/Service/GetQuickSellServices',
    baseURL: !isPOS
      ? `${process.env.REACT_APP_DOMAIN}1`
      : `${process.env.REACT_APP_POS_URL}/api/v1`,
    enabled: true,
    select: (data) => {
      const res = data.data.data;
      return Object.keys(res).map((key) => ({
        identify: dropDownTypesItems[key],
        name: key,
        items: res[key],
      }));
    },
  });

  const { data: quickSaleItemsReq, refetch: getItems } = CallAPI({
    name: 'getQuickSalesItems',
    url: '/Service/GetQuickSaleItems',
    enabled: true,
    baseURL: !isPOS
      ? `${process.env.REACT_APP_DOMAIN}1`
      : `${process.env.REACT_APP_POS_URL}/api/v1`,
    refetchOnWindowFocus: false,
    onSuccess: (res) => setQuickSaleItems(res),
    select: (data) =>
      data.data.data.list
        .sort((a, b) => +a?.order - +b?.order)
        .map((item) => ({ ...item, id: item.quickItemId })),
  });
  /* -------------------------------------------------------------------------- */
  /*                             Handle Select Item                             */
  /* -------------------------------------------------------------------------- */

  const handleSelect = (item) => {
    const isItemSelected = !!quickSaleItems.find(
      (selectedBefore) =>
        selectedBefore.id === item.id && selectedBefore.type === item.type,
    );
    if (isItemSelected) {
      return toast.warning('item Selected Before');
    }
    return setQuickSaleItems([...quickSaleItems, item]);
  };

  /* -------------------------------------------------------------------------- */
  /*                          Add New Item  And Delete                          */
  /* -------------------------------------------------------------------------- */

  const { refetch } = CallAPI({
    name: 'addOrEditOrDeleteQuickSale',
    url: '/Service/AddQuickSellItems',
    method: 'post',
    baseURL: !isPOS
      ? `${process.env.REACT_APP_DOMAIN}1`
      : `${process.env.REACT_APP_POS_URL}/api/v1`,
    body: [
      ...quickSaleItems.map((item, index) => ({
        type: item.type,
        ...(item.type !== dropDownTypesItems.customItem && {
          id: item.quickItemId || item.id,
        }),
        name: item.type !== dropDownTypesItems.customItem ? null : item.name,
        price: item.price,
        order: index + 1,
      })),
    ],
    onSuccess: (res) => {
      if (res.data.success) {
        getItems();
        toast.success(messages['common.edited.success']);
        setOpenAddEditQuickSale(false);
      }
    },
  });

  const handleDelete = (id) => {
    setQuickSaleItems(quickSaleItems.filter((item) => item.id !== id));
  };

  /* -------------------------------------------------------------------------- */
  /*                               Handle Add Fees                              */
  /* -------------------------------------------------------------------------- */
  const handleAddFees = () => {
    setQuickSaleItems([
      ...quickSaleItems,
      {
        type: dropDownTypesItems.fees,
        id: Math.random(),
        name: messages[typeOfItems[dropDownTypesItems.fees].translate],
        price: 0,
      },
    ]);
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          refetch();
        }}
      >
        <section className="addquicksale">
          <NavbarForNoWrapViews
            title={messages['sales.quicksale.edit.title']}
            hideBtn
            onClick={() => setOpenAddEditQuickSale(false)}
          />
          <QuickSaleHeader
            dropDownData={dropDownData}
            handleSelect={handleSelect}
            quickSaleItems={quickSaleItems}
            handleOpenCustomItemModal={() => setOpenAddCustomItem(true)}
            handleAddFees={handleAddFees}
          />
          <QuickSaleItems
            handleDelete={handleDelete}
            quickSaleItems={quickSaleItems}
            setQuickSaleItems={setQuickSaleItems}
            isPOS={isPOS}
          />
          {isListUpdated(quickSaleItemsReq, quickSaleItems) && (
            <section className="settings__submit">
              <button className="beutibutton action" type="submit">
                {messages['common.save']}
              </button>
            </section>
          )}
        </section>
      </form>
      <QSCustomeItemModal
        open={openAddCustomItem}
        setOpen={setOpenAddCustomItem}
        setQuickSaleItems={setQuickSaleItems}
        quickSaleItems={quickSaleItems}
      />
    </>
  );
};

AddEditQuickSale.propTypes = {
  setOpenAddEditQuickSale: PropTypes.func,
  isPOS: PropTypes.bool,
};
export default AddEditQuickSale;
