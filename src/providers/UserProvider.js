import React, { useState } from 'react';
import PropTypes from 'prop-types';

export const UserContext = React.createContext();

const UserProvider = ({ children }) => {
  const [User, setUser] = useState({
    access_token: localStorage.getItem('access_token'),
    userData: JSON.parse(localStorage.getItem('userData')),
  });

  return (
    <UserContext.Provider value={{ User, setUser }}>
      {React.Children.only(children)}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export default UserProvider;
