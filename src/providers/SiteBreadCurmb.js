/* eslint-disable  */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import MultiSelectionBranches from 'components/layout/MultiSelectionBranches/MultiSelectionBranches';
import { UserContext } from 'providers/UserProvider';
import { Routes } from 'constants/Routes';
import BreadCrumbTabs from '../Shared/BreadCrumb/BreadCrumbTabs';

export const breadCrumbContext = createContext();

const BeutiBreadCrumbProvider = ({ children }) => {
  const history = useHistory();
  const { User } = useContext(UserContext);

  const [breadCrumbController, setBreadCrumbController] = useState({ type: 0, tabs: [] });
  const [breadCrumb, setBreadCrumb] = useState({
    enabled: true,
    tabs: location.pathname.split('/').filter((path) => path),
  });
  // 0 === dynamic tabs
  // 1 === static tabs
  // 2 === no tabs
  useEffect(() => {
    if (breadCrumbController.type === 0) {
      history.listen((location) => {
        const RoutesArray = location.pathname.split('/').filter((path) => path);
        setBreadCrumb({
          ...breadCrumb,
          tabs: [...RoutesArray],
        });
      });
    }

    if (breadCrumbController.type === 1) {
      setBreadCrumb({ enabled: true, tabs: breadCrumbController.tabs });
    }
    if (breadCrumbController.type === 2) {
      setBreadCrumb({ enabled: false, tabs: [] });
    }
  }, [breadCrumbController]);
  return (
    <breadCrumbContext.Provider value={{ breadCrumbController, setBreadCrumbController }}>
      {breadCrumb.tabs.length > 1 && (
        <div>
          <BreadCrumbTabs tabsArray={[...breadCrumb.tabs.filter((tab) => Routes[tab])]} />
          {/* {!User?.userData?.isSuperAdmin && <MultiSelectionBranches />} */}
        </div>
      )}

      {children}
    </breadCrumbContext.Provider>
  );
};

export default BeutiBreadCrumbProvider;
