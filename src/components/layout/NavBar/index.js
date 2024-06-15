import React from 'react';
import { Menu } from 'semantic-ui-react';
import NavBarItems from './NavBarItems/NavBarItems';
import './NavBarItems/NavBar.scss';
function NavBar() {
  return (
    <nav fixed="top" inverted id="nav-bar">
      <NavBarItems />
    </nav>
  );
}

export default NavBar;
