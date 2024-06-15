/* eslint-disable  */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useIntl } from 'react-intl';
const TabsNavigateSetting = ({ tabsArray }) => {
  const { messages } = useIntl();
  return (
    <p className="py-2">
      {tabsArray.map((tab, index) => (
        <span key={tab.key} className="path">
          <NavLink to={tab.link} key={tab.key} exact>
            <span>{messages[tab.message]}</span>
          </NavLink>
          {index !== tabsArray.length - 1 && '/'}
        </span>
      ))}
    </p>
  );
};

export default TabsNavigateSetting;
