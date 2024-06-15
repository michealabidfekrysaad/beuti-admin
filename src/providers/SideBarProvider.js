import React, { useState } from 'react';
import PropTypes from 'prop-types';

export const SideBarContext = React.createContext();

const SideBarProvider = ({ children }) => {
  const [sideBar, setsideBar] = useState(false);

  function toggleSideBar() {
    setsideBar((state) => !state);
  }

  return (
    <SideBarContext.Provider value={{ sideBar, toggleSideBar }}>
      {React.Children.only(children)}
    </SideBarContext.Provider>
  );
};

SideBarProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export default SideBarProvider;
