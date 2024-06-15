/* eslint-disable  */

import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Routes } from 'constants/Routes';
// import { NavLink } from 'react-bootstrap';
const BreadCrumbTabs = ({ tabsArray }) => {
  const { messages } = useIntl();
  return (
    <>
      {tabsArray.length > 1 && (
        <p className="mb-0 d-flex align-items-center  pb-3">
          {tabsArray.map((tab, index) => {
            return (
              <span key={Math.floor(Math.random() * 100)} className="path">
                {Routes[tab] && (
                  <NavLink
                    to={index !== tabsArray.length - 1 && Routes[tab]}
                    key={Math.floor(Math.random() * 100)}
                    exact
                  >
                    <span>{messages[`routes.${tab}`]}</span>
                  </NavLink>
                )}
                {index !== tabsArray.length - 1 && '/'}
              </span>
            );
          })}
        </p>
      )}
    </>
  );
};

export default BreadCrumbTabs;
