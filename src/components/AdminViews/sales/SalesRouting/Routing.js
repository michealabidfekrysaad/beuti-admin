import React from 'react';
import PropTypes from 'prop-types';
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import { Routes } from 'constants/Routes';
import { useIntl } from 'react-intl';
import SalesSingleRoute from './SalesSingleRoute';
export default function Routing({ collapseWidth, setCollapseWidth }) {
  const { messages } = useIntl();
  const routes = [
    {
      message: 'new.sale',
      link: Routes.newSale || Routes.editSale,
    },
    {
      message: 'sale.invoices',
      link: '/sales/invoicesList',
    },
  ];
  return (
    <div
      className={`${collapseWidth ? 'sales-route__collapse sales-route' : 'sales-route'}`}
    >
      <div className="sales-route__header">{messages['admin.reports.sales']}</div>
      <div className="sales-route__container">
        <SalesSingleRoute routes={routes} />
      </div>
      <button
        type="button"
        className={`sales-collapse--btn ${collapseWidth ? 'disappear' : ''}`}
        onClick={() => setCollapseWidth(!collapseWidth)}
      >
        <SVG src={toAbsoluteUrl('/sm-arrow.svg')} />
      </button>
    </div>
  );
}

Routing.propTypes = {
  collapseWidth: PropTypes.bool,
  setCollapseWidth: PropTypes.func,
};
