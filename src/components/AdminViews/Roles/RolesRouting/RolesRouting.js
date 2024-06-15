import React from 'react';
import PropTypes from 'prop-types';
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import { Routes } from 'constants/Routes';
import { useIntl } from 'react-intl';
import SalesSingleRoute from 'components/AdminViews/sales/SalesRouting/SalesSingleRoute';
export default function RolesRouting({ collapseWidth, setCollapseWidth }) {
  const { messages } = useIntl();
  const routes = [
    {
      message: 'roles.route.roles',
      link: Routes.roles,
    },
    {
      message: 'roles.route.roles.permissions',
      link: Routes.permissions,
    },
  ];
  return (
    <div
      className={`${collapseWidth ? 'roles-route__collapse roles-route' : 'roles-route'}`}
    >
      <div className="sales-route__header">{messages['roles.route.authorization']}</div>
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

RolesRouting.propTypes = {
  collapseWidth: PropTypes.bool,
  setCollapseWidth: PropTypes.func,
};
