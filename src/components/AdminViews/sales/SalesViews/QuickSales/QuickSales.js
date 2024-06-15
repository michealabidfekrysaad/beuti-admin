import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { CallAPI } from 'utils/API/APIConfig';
import EmptyData from '../../EmptyData/EmptyData';
import SelectedQuickSaleItem from './list/SelectedQuickSaleItem';

import './QuickSale.scss';
import { handleAddServiceOrQuantity, typeOfItems } from './Helper/QuickSale.Helper';
import { salesItemIds } from '../../Helper/ViewsEnum';
export default function QuickSale({
  setOpenAddEditQuickSale,
  setSalesData,
  salesData,
  isPOS,
}) {
  const { messages } = useIntl();
  const [tempServiceForEmpData, setTempServiceForEmpData] = useState({});
  const { data: QuickSaleList, isFetching: QuickSaleLoading } = CallAPI({
    name: 'getQuickSalesItems',
    url: '/Service/GetQuickSaleItems',
    baseURL: !isPOS
      ? `${process.env.REACT_APP_DOMAIN}1`
      : `${process.env.REACT_APP_POS_URL}/api/v1`,
    refetchOnWindowFocus: false,
    enabled: true,
    select: (data) => data.data.data.list.sort((a, b) => +a?.order - +b?.order),
  });
  CallAPI({
    name: ['getEmpForServiceByOptionId', tempServiceForEmpData?.quickItemId],
    url: 'Service/GetServiceEmployees',
    baseURL: !isPOS
      ? `${process.env.REACT_APP_DOMAIN}1`
      : `${process.env.REACT_APP_POS_URL}/api/v1`,
    refetchOnWindowFocus: false,
    enabled: !!tempServiceForEmpData?.quickItemId,
    query: {
      serviceOptionId: tempServiceForEmpData?.quickItemId,
    },
    select: (data) => data?.data?.data,
    onSuccess: (res) => {
      if (res?.length && tempServiceForEmpData?.quickItemId) {
        const newItem = {
          ...tempServiceForEmpData,
          ...res[0],
          id: tempServiceForEmpData?.quickItemId,
        };
        setSalesData({
          ...handleAddServiceOrQuantity({
            selectedData: salesData,
            newItem,
          }),
        });
        setTempServiceForEmpData({});
      }
    },
  });
  /* -------------------------------------------------------------------------- */
  /*                             HandleSelectService                            */
  /* -------------------------------------------------------------------------- */
  const handleSelectItem = (newItem) => {
    if (typeOfItems[newItem.type]?.identify !== salesItemIds?.services) {
      return setSalesData({
        ...handleAddServiceOrQuantity({
          selectedData: salesData,
          newItem: { ...newItem, id: newItem?.quickItemId },
        }),
      });
    }
    return setTempServiceForEmpData(newItem);
  };
  return (
    <>
      <section className="quicksale_list">
        {QuickSaleList?.map((item) => (
          <SelectedQuickSaleItem
            key={item.id}
            item={item}
            handleSelect={handleSelectItem}
          />
        ))}
      </section>
      {!QuickSaleLoading && !QuickSaleList?.length && (
        <EmptyData
          image="/quicksaleempty.svg"
          title={messages['sales.quicksale.empty.title']}
          subTitle={messages['sales.quicksale.empty.subtitle']}
          btnName={messages['sales.quicksale.empty.add']}
          onClickBtn={() => setOpenAddEditQuickSale(true)}
        />
      )}
      {QuickSaleList?.length > 0 && (
        <button
          type="button"
          className="quicksale_editbtn"
          onClick={() => setOpenAddEditQuickSale(true)}
        >
          {messages['sales.quicksale.edit.item']}
        </button>
      )}
      {QuickSaleLoading && !QuickSaleList?.length && <div className="loading mt-5"></div>}
    </>
  );
}

QuickSale.propTypes = {
  setOpenAddEditQuickSale: PropTypes.func,
  setSalesData: PropTypes.func,
  salesData: PropTypes.object,
  isPOS: PropTypes?.bool,
};
