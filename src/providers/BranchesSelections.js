/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Routes } from 'constants/Routes';

export const BranchesContext = React.createContext();

const singleBranchesArr = [
  Routes.changeManager,
  Routes.settingAllBrsanches,
  Routes.onlineBooking,
  Routes.financial,
  Routes.settingUpdateBranchInfo,
  Routes.settingUpdateBranchInfoDetails,
  Routes.settingVerifySpFreeLance,
  Routes.settings,
  Routes.photos,
  Routes.workingHours,
  Routes.defaultWorkingHours,
  Routes.settinghome,
  Routes.editSeasonalWorkingHours,
  Routes.EditCategory,
  Routes.newService,
  Routes.servicesList,
  Routes.chairSettings,
  Routes.productList,
  Routes.AddPackage,
  Routes.settingEmployeesWH,
  Routes.EditService,
  Routes.addOffer,
  Routes.voucherList,
  Routes.addVoucher,
  Routes.bookingEdit,
  Routes.bookingFlow,
  Routes.dayBookingsCalendarView,
  Routes.bookingFlow,
  Routes.bookingEdit,
  Routes.checkoutBooking,
  Routes.roles,
  Routes.permissions,
];

const hideBranchesArr = [
  Routes.productedit,
  Routes.closingPeriodEdit,
  Routes.settingCustomers,
  Routes.customerProfile,
  Routes.addCustomer,
  Routes.editCustomer,
  Routes.EditPackage,
  Routes.editEmployee,
  Routes.EditService,
];

const BranchesSelections = ({ children }) => {
  const [branchesDDChanges, setBranchesDDChanges] = useState(false);
  const [callProfileCompleted, setCallProfileCompleted] = useState(false);
  const [branches, setBranches] = useState([]);
  const [allBranchesData, setAllBranchesData] = useState([]);

  useEffect(() => {
    if (localStorage.getItem('userData') && localStorage.getItem('selectedBranches')) {
      setCallProfileCompleted(true);
    }
  }, [localStorage.getItem('userData'), localStorage.getItem('selectedBranches')]);

  return (
    <BranchesContext.Provider
      value={{
        branchesDDChanges,
        setBranchesDDChanges,
        singleBranchesArr,
        hideBranchesArr,
        callProfileCompleted,
        setCallProfileCompleted,
        branches,
        setBranches,
        allBranchesData,
        setAllBranchesData,
      }}
    >
      {React.Children.only(children)}
    </BranchesContext.Provider>
  );
};

BranchesSelections.propTypes = {
  children: PropTypes.element.isRequired,
};

export default BranchesSelections;
