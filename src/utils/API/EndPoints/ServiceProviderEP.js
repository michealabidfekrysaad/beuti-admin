/* eslint-disable no-irregular-whitespace */

/* -------------------------------------------------------------------------- */
/*                         ServiceProvider End Points                         */
/* -------------------------------------------------------------------------- */
export const SP_LIST_EP = 'ServiceProvider/GetServiceProviders';
export const SP_LIST_COUNT_EP = 'ServiceProvider/GetServiceProvidersCount';
export const SP_DETAILS_BY_ID_EP = 'ServiceProvider/GetSPDetails';
export const SP_ACTIVE_DEACTIVE_EP = 'ServiceProvider/ActivateDeactivateServiceProvider';
export const SP_DISABLE_ONLINE_BOOKING_EP = 'ServiceProvider/enableDisableOnlineBooking';
export const SP_WORKING_TIME_EP = 'ServiceProvider/WorkingTime';
export const SP_ADD_WORKING_TIME_EP = 'ServiceProvider/addWorkingTime';
export const SP_UPDATE_WORKING_TIME_EP = 'ServiceProvider/UpdateWorkingTime';
export const SP_EMPLOYEE_VALIDATE_WORKING_TIME_EP =
  'ServiceProvider/IsAnySPEmployeeWorkingTimenNotWithinPeriod';
export const SP_DELETE_WORKING_TIME_EP = 'ServiceProvider/deleteWorkingTime';
export const SP_SET_VAT = 'ServiceProvider/SetSPVAT';
export const SP_VAT = 'ServiceProvider/GetSPVAT';
export const SP_DETAILS_EP = 'ServiceProvider/ServiceProviderDetail';
export const SP_OFFDAYS_EP = 'ServiceProvider/GetSPOffDays';
export const SP_CUSTOMERS_EP = 'ServiceProvider/GetServiceProviderCustomers';
export const SP_AVAILABLE_CHAIRS_EP = 'ServiceProvider/GetAvailableChairs';
export const SP_UPDATE_GO_PRIVATE_PLACE_EP = 'ServiceProvider/goPrivatPlace';
export const SP_GO_PRIVATE_PLACE_EP = 'ServiceProvider/isGoPrivatPlace';
export const SP_COUNTS_EP = 'ServiceProvider/GetSPCounts';
export const SP_PROFILE_EP = 'ServiceProvider/serviceProviderProfile';
export const SP_UPDATE_ADDRESS_EP = 'ServiceProvider/UpdateAddress';
export const SP_UPDATE_CITY_EP = 'ServiceProvider/UpdateCity';
export const SP_UPDATE_EMAIL_EP = 'ServiceProvider/changeProviderEmail';
export const SP_UPDATE_NAME_EP = 'ServiceProvider/changeName';
export const SP_WALLET_INFO_EP = 'ServiceProvider/WalletInfo';
export const SP_UPDATE_HOME_SERVCIES_MINIMUM_CHARGE_EP =
  'ServiceProvider/UpdateHomeServicesMinimumCharge';
export const SP_HOME_SERVCIES_MINIMUM_CHARGE_EP =
  'ServiceProvider/GetHomeServicesMinimumCharge';
export const SP_BOOKING_WIZARD_IS_ENABLE_EP = 'ServiceProvider/BookingWizardEnabled';
export const SP_UPDATE_PHONE_EP = 'ServiceProvider/ChangeServiceProviderPhone';
export const SP_UPDATE_SLOGAN_EP = 'ServiceProvider/SetSpSlogan';
export const SP_SLOGAN_EP = 'ServiceProvider/GetSpSlogan';
export const SP_UPDATE_STATUS_EP = 'ServiceProvider/UpdateEnableServiceProvider';
export const SP_BASICS_STAT_EP = 'ServiceProvider/GetBasicStatistics';
export const SP_CURRENT_DAILY_INCOME_EP = 'ServiceProvider/GetCurrentDailyIncome';
export const SP_IS_PROFILE_COMPELETE_EP = 'ServiceProvider/IsSpProfileompleted';
export const SERVICE_PROVIDER_CATEGORIES = 'ServiceProviderCategory/Categories';
export const SERVICE_PROVIDER_CATEGORIES_AUTO_COMPLETE =
  'ServiceProviderCategory/SearchCategory';
export const SERVICE_PROVIDER_ADD_CATEGORIES = 'ServiceProviderCategory/Add';
export const ADD_BRANCHES_CATEGORY = 'ServiceProviderCategory/AddBranchesCategory';
export const SERVICE_PROVIDER_DELETE_CATEGORY = 'ServiceProviderCategory/DeleteCategorey';
export const SERVICE_PROVIDER_EDIT_CATEGORY = 'ServiceProviderCategory/Get';
export const SERVICE_PROVIDER_UPDATE_CATEGORY = 'ServiceProviderCategory/UpdateCategorey';
export const SERVICE_PROVIDER_SERVICES = 'Service/GetServices';
export const SERVICE_PROVIDER_DELETE_SERVICE = 'Service/Delete';
export const SERVICE_PROVIDER_ADD_SERVICE = 'Service/Add';
export const SERVICE_PROVIDER_EDIT_SERVICE = 'Service/getServiceById';
export const SERVICE_PROVIDER_UPDATE_SERVICE = 'Service/Edit';
export const SERVICE_PROVIDER_SERVICES_AUTO_COMPLETE = 'Service/SearchbyServiceName';
export const SERVICE_PROVIDER_PACKAGES_AUTO_COMPLETE = 'Package/SearchbyPackageName';
export const SERVICE_CATEGORIES_GET = 'ServiceProviderCategory/GetCategoriesServices';
export const SP_GET_CATEGORIES_BY_BRANCH = 'ServiceProviderCategory/GetBranchCategories';
export const SP_GET_EMP_BT_BRANCH = 'Employee/GetBranchEmployees';
export const SP_ADD_NEW_SERVICE = 'Service/AddBranchesService';
export const SP_DELETE_SERVICE = 'Service/DeleteService';
export const SP_DELETE_PACKAGE = 'package/DeletePackage';
export const SP_CHECK_SERVICE_INSIDE_PACKAGE = 'Package/GetServicePackageOptions';
export const SP_CHECK_BEFORE_DELETE_SERVICE_INSIDE_PACKAGE = 'Service/GetPackageOptions';
export const SERVICE_BY_LOCATION = 'Service/GetServicesByLocation';
export const ADD_NEW_PACKAGE = 'Package/Add';
export const GET_PACKAGE_DETAILS = 'Package/GetPackageDetails';
export const EDIT_PACKAGE = 'Package/Edit';
export const SP_GET_CATEGORY_OPTIONS = 'ServiceProviderCategory/GetCategoryOptions';
export const SP_GET_SERVICE_BY_ID = 'Service/GetSPServiceById';
export const SP_CAN_CHANGE_SER_LOCATION = 'Service/CanChangeServiceLocation';
export const SP_CAN_DELETE_PRICE_OPTION = 'Package/GetPackagesHaveServiceOption';
export const SP_EDIT_SERVICE = 'Service/EditBranchService';
export const SP_REQUIRE_LOCATION_UPDATE = 'Service/ServicesReqireLocationUpdate';

/* -------------------------------------------------------------------------- */
/*                       ServiceProviderOdata End Point                       */
/* -------------------------------------------------------------------------- */

export const SP_ODATA_EP = 'ServiceProviderOdata';

/* -------------------------------------------------------------------------- */
/*                         SP_WalletHistory End Point                         */
/* -------------------------------------------------------------------------- */

export const SP_WALLET_HISTORY_UPDATE_EP = 'SP_WalletHistory/UpdateSPWalletByAdmin';

/* -------------------------------------------------------------------------- */
/*                              SPChair End Point                             */
/* -------------------------------------------------------------------------- */

export const SPCHAIR_EP = 'SPChair/Get';
export const SPCHAIR_VALUE_EP = 'SPChair/GetChairValue';
export const SPCHAIR_UPDATE_EP = 'SPChair/Update';

/* -------------------------------------------------------------------------- */
/*                          SPClosingPeriod End Point                         */
/* -------------------------------------------------------------------------- */

export const SP_CLOSING_PERIOD_ADD_EP = 'SPClosingPeriod/Add';
export const SP_CLOSING_PERIOD_EP = 'SPClosingPeriod/GetSPClosingPeriods';
export const SP_CLOSING_PERIOD_DELETE_EP = 'SPClosingPeriod/Delete';

/* -------------------------------------------------------------------------- */
/*                          SPCustomerOdata End Point                         */
/* -------------------------------------------------------------------------- */

export const SP_CUSTOMER_ODATA_EP = 'SPCustomerOdata';
export const SP_CUSTOMER_ODATA_COUNT_EP = 'SPCustomerOdata/count';

/* -------------------------------------------------------------------------- */
/*                            SPPromoCode End Point                           */
/* -------------------------------------------------------------------------- */

export const SP_PROMOCODE_ADD_EP = 'SPPromoCode/Add';
export const SP_PROMOCODE_EP = 'SPPromoCode/Get';

/* -------------------------------------------------------------------------- */
/*                          SPReviewReport End Point                          */
/* -------------------------------------------------------------------------- */

export const SP_REVIEW_REPORT_UPDATE_EP = 'SPReviewReport/UpdateReportStatus';

/* -------------------------------------------------------------------------- */
/*                             SPReviewReportOData                            */
/* -------------------------------------------------------------------------- */

export const SP_REVIEW_REPORT_ODATA_EP = 'SPReviewReportOData';

/* -------------------------------------------------------------------------- */
/*                                  SP WIZARD                                 */
/* -------------------------------------------------------------------------- */

export const SP_GENERAL_INFO_EP = 'ServiceProvider/GetSPGeneralInfo';
export const SP_GET_WIZARD_WORKING_TIME_EP = 'ServiceProvider/wizard/WorkingTime';
export const SP_ADD_WIZARD_WORKING_TIME_EP = 'ServiceProvider/wizard/addWorkingDays';
export const SP_GET_WIZARD_EMPLOYEES_EP = 'Employee/viewEmployees';
export const SP_ADD_WIZARD_EMPLOYEES_EP = 'Employee/Wizard/AddEmployee';
export const SP_EDIT_WIZARD_EMPLOYEES_EP = 'Employee/Wizard/EditEmployee';
export const SP_DELETE_WIZARD_EMPLOYEES_EP = 'Employee/DeleteEmployee';

/* -------------------------------------------------------------------------- */
/*                               SP HOME SETTING                              */
/* -------------------------------------------------------------------------- */

export const SP_GET_HOME_INFO_EP = 'ServiceProvider/GetHomeSrvicesSettings';
export const SP_PUT_HOME_INFO_EP = 'ServiceProvider/HomeSrvicesSettings';
export const SP_PUT_SUPPORTED_CITY_EP = '/ServiceProvider/UpdateServicableCity';
export const SP_DELETE_SUPPORTED_CITY_EP = '/ServiceProvider/DeleteServicableCity';
export const SP_GET_SUPPORTED_CITY_EP = '/ServiceProvider/GetSPServiceableCities';
export const SP_ADD_SUPPORTED_CITY_EP = '/ServiceProvider/AddServicableCity';
