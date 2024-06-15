import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

// This Provider To Share addNew service with predefined centertype, category
export const AddNewServiceContext = createContext();

const AddNewServiceProvider = ({ children }) => {
  const [selectedService, setSelectedService] = useState({
    serviceIDFromSameLevel: localStorage.getItem('serviceIDFromSameLevel') || null,
    selectedGCT: null,
  });
  return (
    <AddNewServiceContext.Provider value={{ selectedService, setSelectedService }}>
      {children}
    </AddNewServiceContext.Provider>
  );
};
AddNewServiceProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export default AddNewServiceProvider;

export const ClearLocalStorage = (name) => {
  localStorage.removeItem(name);
};

export const SetLocalStorage = (name, data) => {
  localStorage.setItem(name, data);
};
