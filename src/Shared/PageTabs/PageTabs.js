/* eslint-disable  */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useIntl } from 'react-intl';
import './PageTabs.scss';
const PageTabs = ({ tabsArray }) => {
  const { messages } = useIntl();
  return (
    <div className="pagetab">
      {tabsArray.map((tab) => (
        <NavLink
          to={tab.link}
          key={tab.key}
          activeClassName="pagetab-link-active"
          className="pagetab-link"
          exact
        >
          <div className="sidebar-links_title">{messages[tab.message]}</div>
        </NavLink>
      ))}
    </div>
  );
};

export default PageTabs;
