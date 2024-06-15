/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Routes } from 'constants/Routes';
import React, { useEffect, useMemo, useState } from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import InvoicessList from '../Invoices/InvoicesList';
import { salesViews } from './Helper/ViewsEnum';
import Routing from './SalesRouting/Routing';
import QuickSaleAddEdit from './SalesViews/QuickSales/QuickSaleAddEdit';
import SalesViews from './SalesViews/SalesViews';

export default function Sales() {
  const [collapseWidth, setCollapseWidth] = useState(false);
  const history = useHistory();
  const [selectedsaleView, setSelectedSaleView] = useState(
    history?.location?.state?.prevPath?.includes(salesViews?.confirmedBooking)
      ? salesViews?.confirmedBooking
      : salesViews?.quickSale,
  );
  const [salesData, setSalesData] = useState({
    itemsSelected: [],
    calculations: {
      subtotal: 0,
      vat: 0,
      bookingVat: 0,
      total: 0,
      vatPercentage: 0,
    },
    paymentMethodAmounts: [],
  });
  const [subTotalPriceForSale, setSubTotalPriceForSale] = useState(0);
  const [searchFoucs, setSearchFoucs] = useState('');
  const [collectPhase, setCollectPhase] = useState(false);
  const [openAddEditQuickSale, setOpenAddEditQuickSale] = useState(false);
  const isPOS = useMemo(
    () => !!new URLSearchParams(history?.location?.search).get('pos'),
  );

  /* -------------------------------------------------------------------------- */
  /*       to return to default behaviuor if  come  from edit booking page      */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (history?.location?.state?.prevPath?.includes(salesViews?.confirmedBooking)) {
      history.push(`/sales/new`);
    }
  }, [history?.location]);

  return (
    <section style={{ marginTop: '-15px' }} className={`${isPOS ? 'pos-sale' : ''}`}>
      <div className={`minmiz-sales ${!collapseWidth ? 'push-sales' : 'no-push'}`}>
        <Routing collapseWidth={collapseWidth} setCollapseWidth={setCollapseWidth} />
        <Switch>
          <Route
            exact
            path={Routes.newSale}
            render={() => (
              <SalesViews
                selectedsaleView={selectedsaleView}
                setSelectedSaleView={setSelectedSaleView}
                collapseWidth={collapseWidth}
                salesData={salesData}
                setSalesData={setSalesData}
                setCollectPhase={setCollectPhase}
                collectPhase={collectPhase}
                setSubTotalPriceForSale={setSubTotalPriceForSale}
                subTotalPriceForSale={subTotalPriceForSale}
                setOpenAddEditQuickSale={setOpenAddEditQuickSale}
                isPOS={isPOS}
              />
            )}
          />
          <Route
            exact
            path={Routes.editSale}
            render={() => (
              <SalesViews
                selectedsaleView={selectedsaleView}
                setSelectedSaleView={setSelectedSaleView}
                collapseWidth={collapseWidth}
                salesData={salesData}
                setSalesData={setSalesData}
                setCollectPhase={setCollectPhase}
                collectPhase={collectPhase}
                setSubTotalPriceForSale={setSubTotalPriceForSale}
                subTotalPriceForSale={subTotalPriceForSale}
                isPOS={isPOS}
              />
            )}
          />
          <Route exact path={Routes.invoicesList} render={() => <InvoicessList />} />
          <Redirect from="/sales/invoicesList" to="/sales/invoicesList/0" />
          <Redirect from="/" to={Routes.newSale} />
        </Switch>
        {searchFoucs && (
          <div className="layout-booking" onClick={() => setSearchFoucs(false)}></div>
        )}
      </div>
      {openAddEditQuickSale && (
        <QuickSaleAddEdit
          setOpenAddEditQuickSale={setOpenAddEditQuickSale}
          isPOS={isPOS}
        />
      )}
    </section>
  );
}
