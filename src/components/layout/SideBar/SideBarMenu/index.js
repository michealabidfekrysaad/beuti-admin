import React, { useContext } from 'react';
import { Sidebar, Menu } from 'semantic-ui-react';
import { SideBarContext } from 'providers/SideBarProvider';
// import { UserContext } from 'providers/UserProvider';
import SideBarItems from '../SideBarMenuItems';
import SidebarCustomized from './SidebarCustomized';

function SideBarMenu() {
  const { sideBar } = useContext(SideBarContext);

  return <SidebarCustomized />;
}

export default SideBarMenu;
