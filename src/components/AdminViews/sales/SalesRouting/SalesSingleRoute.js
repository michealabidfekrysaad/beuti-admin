/* eslint-disable */
import React from 'react';
import { useIntl } from 'react-intl';
import { NavLink } from 'react-router-dom';

export default function SalesSingleRoute({ routes }) {
  const { messages } = useIntl();

  return routes?.map((route) => {
    return (
      <NavLink
        to={route.link}
        key={route?.link}
        className="sales-route__container-single"
        activeClassName="active"
      >
        {messages[route?.message]}
      </NavLink>
    );
  });
}
