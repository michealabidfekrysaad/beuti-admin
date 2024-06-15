/**
 * @constant {Object} Routes
 * @description List of websites routes
 * Accessibile by importing 'Routes' in any place but './Routes' in the main index.js
 * You should not need to import it there
 */
const Routes = {
  home: '/',
  reportsStatisctics: '/reports',
  login: '/login',
  forgotPassword: '/forgot-password',
  notAllowed: '/not-allowed',
  loading: '/LoadingIndicator',
  testing: '/testing',
  // super Admin
  // Note: sp => service provider
  announces: '/announces',
  advertisers: '/advertisers',

  promoCodes: '/promocodes',
  promoCodesAdd: '/promocodes/add',
  settingsPromo: '/sppromocodes',
  spsList: '/service-providers/view/:splistpage',
  customerList: '/customer-list/view/',
  CustomerDetails: '/customer-list/view/:customerId',
  WalletRechargeTransaction: '/wallet-recharge/view/:walletlistpage',
  giftCard: '/giftCard/view',
  bookingsList: '/admin-bookings',
  cancelledBookingsList: '/cancelledBookings',
  spDetails: '/service-providers/sp/:serviceProviderId',
  bookingDetails: '/admin-bookings/:bookingId',
  cancelledBookingDetails: '/cancelledBookings/:bookingId',
  businessCategory: '/businessCategory',
  businessCategoryAdd: '/businessCategory/add/',
  businessCategoryEdit: '/businessCategory/edit/:id',
  centerType: '/centerType',
  centerTypeAdd: '/centerType/add/',
  centerTypeEdit: '/centerType/edit/:ctid',
  FreelanceCertificates: '/freelancerCertificates',
  categories: '/categories',
  cabanners: '/cabanners',
  cabannersAdd: '/cabanners/cabannersAdd',

  reportedReviews: '/reported-reviews',
  categoriesAdd: '/categories/add/',
  categoriesMove: '/categories/move/',
  categoriesEdit: '/categories/edit/:categoryId',
  cities: '/cities',
  citiesAdd: '/cities/add/',
  citiesEdit: '/cities/edit/:cityId',
  citiesAddPolygon: '/cities/polygon/:cityId',
  // Admin
  mainPage: '/main',
  setting: '/settings',
  settingsSP: '/settings/SP',
  settingsSPChangePass: '/settings/SP/change-pass',
  settingSectionCenter: '/settings/center',
  settingSectionImages: '/settings/images',
  settingSectionFinance: '/settings/finance',
  settingSectionStatus: '/settings/status',
  settingSectionChairs: '/settings/chairs',
  //   new settings  routes
  settingAll: '/settings',
  settingUpdateBranchInfo: '/settings/Branch',
  settingUpdateBranchInfoDetails: '/settings/Branch/Edit',
  settings: '/settings',
  settinghome: '/settings/settinghome',
  addEmployee: '/settings/settingEmployees/addEmployee',
  editEmployee: '/settings/settingEmployees/editEmployee/:employeeID',

  settingEmployees: '/settings/settingEmployees/:page',
  // Working Hours
  settingEmployeesWH: '/settings/settingEmployeesWH/:page',

  settingAllBrsanches: '/settings/branches',
  settingAllBrsanchesAdd: '/settings/branches/add',
  chairSettings: '/settings/chairSettings',
  changeManager: '/settings/changeManager',
  changeOwnerPhone: '/settings/changeOwnerPhone',
  onlineBooking: '/settings/onlineBooking',
  financial: '/settings/financial',
  workingHours: '/settings/workingHours',
  defaultWorkingHours: '/settings/workingHours/defaultWorkingHours',
  seasonalWorkingHours: '/settings/workingHours/seasonalWorkingHours',
  editSeasonalWorkingHours: '/settings/workingHours/Edit',
  settingVerifySpFreeLance: '/settings/freeLance',
  chairsList: '/charis',
  AddChairs: '/charis/add',
  offersList: '/offers',
  addOffers: '/offers/add',
  photos: '/settings/photos/',

  // settingsVat: '/settings/vat',
  // settingsEmployeeCommission: '/settings/employee-commision',
  // chairBooking: '/chair-booking',
  // workingHours: '/settings/working-hours',
  // onlineBookingStatus: '/settings/online-booking',
  // TogglePrivatePlacesStatus: '/settings/home-service',
  // CertificateNumber: '/settings/certificate-number',
  // ChangeEmail: '/settings/profile-email',
  // ChangeCity: '/settings/profile-city',
  // ChangeUsername: '/settings/profile-username',
  // SPImages: '/settings/profile-images',
  // ReferralCode: '/settings/referral-code',
  // SPBookingWizard: '/settings/bookingwizard-url',
  // SalonLocation: '/setting/change-location',
  workingHoursEdit: '/settings/working-hours-edit',
  employeesList: '/employees',
  employeeAllDetails: '/employees/employeeAllDetails',
  employeeWorkingHours: '/employees/employeeWorkingHours',
  closingPeriod: '/employees/closingPeriod',
  closingPeriodAdd: '/settings/workingHours/closingPeriodAdd',
  closingPeriodEdit: '/settings/workingHours/closingPeriodEdit/:closingPeriodId',

  employeeDetails: '/employees/:employeeId',
  employeeAdd: '/employees/add/',
  employeeEdit: '/employees/edit/:employeeId',
  customersList: '/customersList/',
  customerAdd: '/customersList/add/',
  customerEdti: '/customersList/edit/:customerId',
  customerDetails: '/customers/:customerId/',
  customerEdit: '/customers/edit/:customer/',

  // Services
  servicesList: '/servicesList',
  newCategory: '/servicesList/newCategory',
  newService: '/servicesList/newService',
  EditService: '/servicesList/EditService/:servID',
  EditPackage: '/servicesList/EditPackage/:packID',
  AddPackage: '/servicesList/AddPackage',
  EditCategory: '/servicesList/EditCategory',
  servicesAdd: '/services/add',
  servicesAddPackage: '/services/add/Package',
  servicesEdit: '/services/edit/:serviceId',
  servicesDetails: '/services/service/:serviceId',
  // Day bookings
  dayBookingsCalendarView: '/booking',
  bookingsCalendarViewIos: '/calendar/sp/',
  dayBookingsCalendarViewMobile: '/booking/calendar/',
  // http://localhost:3612/booking/calendar/?mobileView=true&&startDate=2022-10-16&&endDate=2022-10-18&&status=[]&&selectedEmpIds=[]&&allEmpSelection=false&&workingEmpSelection=false&&locale=en&&selectedBranches=[72925]&&initialView=timeGridFourDay&&auth=eyJhbGciOiJSUzI1NiIsImtpZCI6IjQ5Mzk0MzIzNDVFQjlEMkZGODk1RjM2QTRBRTM2QUM4NUE2MjE2NzYiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJTVGxESTBYcm5TXzRsZk5xU3VOcXlGcGlGblkifQ.eyJuYmYiOjE2Njc3MjczNzcsImV4cCI6MTY2ODMzMjE3NywiaXNzIjoiaHR0cHM6Ly90ZXN0LWF1dGguYmV1dGkubWUiLCJhdWQiOlsiaHR0cHM6Ly90ZXN0LWF1dGguYmV1dGkubWUvcmVzb3VyY2VzIiwiUE9TIl0sImNsaWVudF9pZCI6IlBPUyIsInN1YiI6IjYxNjQ3YTRjLTI3YmQtNDlhZC1hOTlmLTFmN2NlOWU1ZmI5OCIsImF1dGhfdGltZSI6MTY2NzcyNzM3NywiaWRwIjoibG9jYWwiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiIwNTU1NTY2Njc3IiwidW5pcXVlX25hbWUiOiIwNTU1NTY2Njc3IiwiZW1haWwiOiIiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsInBob25lX251bWJlciI6IjA1NTU1NjY2NzciLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOnRydWUsInVzcl90eXBlIjoiYWRtaW4iLCJzY29wZSI6WyJwb3MiLCJvZmZsaW5lX2FjY2VzcyJdLCJhbXIiOlsicHdkIl19.SlXCQQ3EZzJocWgx8MYQ6-HQweW5H_Nd62UYBkScGsnl8UqaNqX2PibJMKPUAmU0ar1x2honAnsKFKsHHARiLKXKz7Q5h41bdQbN9if2fxSDKFxg4VPjcNeUL2ukBedprOw8lqJSjKas1MiX8GU40hdssqAG0NRMTnPZw5smuzEvDglruXOpdeMC8DH1J-WjCAKH89WHW2oMDQYKno9FK26q4orQsAbzW2NBhFOH0UlSxw7xMBaupK2aIdExSoS76IKubAUROngR9bB973BQ9KlUKhNqhz_F3YvNsUpcB6Rq8rRtPmjBuXrULEplYZQhTPXTIoGqYpNmILuFKao7Jw
  // http://localhost:3612/calendar/sp/?mobileView=true&&startDate=2022-10-16&&endDate=2022-10-18&&initialView=timeGridFourDay&&status=[]&&selectedEmpIds=[]&&allEmpSelection=false&&workingEmpSelection=false&&locale=en&&selectedBranches=[72925]&&auth=eyJhbGciOiJSUzI1NiIsImtpZCI6IjQ5Mzk0MzIzNDVFQjlEMkZGODk1RjM2QTRBRTM2QUM4NUE2MjE2NzYiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJTVGxESTBYcm5TXzRsZk5xU3VOcXlGcGlGblkifQ.eyJuYmYiOjE2Njc3MzE3MTMsImV4cCI6MTY2ODMzNjUxMywiaXNzIjoiaHR0cHM6Ly90ZXN0LWF1dGguYmV1dGkubWUiLCJhdWQiOlsiaHR0cHM6Ly90ZXN0LWF1dGguYmV1dGkubWUvcmVzb3VyY2VzIiwic2VydmljZS1wcm92aWRlciJdLCJjbGllbnRfaWQiOiJTZXJ2aWNlUHJvdmlkZXIiLCJzdWIiOiI2MTY0N2E0Yy0yN2JkLTQ5YWQtYTk5Zi0xZjdjZTllNWZiOTgiLCJhdXRoX3RpbWUiOjE2Njc3MzE3MTMsImlkcCI6ImxvY2FsIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiMDU1NTU2NjY3NyIsInVuaXF1ZV9uYW1lIjoiMDU1NTU2NjY3NyIsImVtYWlsIjoiIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJwaG9uZV9udW1iZXIiOiIwNTU1NTY2Njc3IiwicGhvbmVfbnVtYmVyX3ZlcmlmaWVkIjp0cnVlLCJ1c3JfdHlwZSI6ImFkbWluIiwic2NvcGUiOlsic2VydmljZS1wcm92aWRlciIsIm9mZmxpbmVfYWNjZXNzIl0sImFtciI6WyJwd2QiXX0.GF7ifQNFwhXbq6tW6SFGSrdhKaLwesZfMT1ehqm3CVsTEGlh4ooYyDqOtQB6f5Lq43sn8j-C49LhqRwsRPidJhm8i-M6z3wa_0-oo5RkvSvPsBfGF-GQFsu1k51fqmyNRJQF79mksXtgObbdYOxlVfp-EpiQTaUNi3yG7YND7D_YxiINE5pmqRGS4T7XCTkL6MKpFqEqwWWJrV8i0UZl_kIu4ziu2WPTy2Q5FZNdEGOrHbzX-04jlG7UA9xOeQKdDzCqOEt7GFN9ASZQpvmUqJhvyElFd-Ocwpi6m2XVbM-eMLQ-fyIlnVo749Ap12xyfNX2wxA__4nF9dqtK1DJ6g
  dayBookingsListView: '/bookings/list',
  dayBookingsQueueView: '/bookings/queueView',
  //
  quickBooking: '/quick-booking',
  //   new booking flow from calendar
  bookingFlow: '/booking/bookingFlow',
  bookingEdit: '/booking/bookingFlow/:bookingId',
  viewBooking: '/booking/view/:bookingId',
  checkoutBooking: '/sale/checkout/:bookingId',
  // products
  productList: '/productList/:page',
  productadd: '/productList/productadd',
  productedit: '/productList/productedit/:productId',

  productDetails: '/products/:productId',
  productListStock: '/products/stock/list',
  // supilers
  suplierslist: '/products/list/supilers',
  supplierAdd: '/suppliers/add/',
  supplierEdit: '/suppliers/edit/:supplierId',
  productListStockOrders: '/products/stock/orders',

  maptest: '/maptest',
  //   sales
  salesList: '/sales',
  salesAppoitment: '/sales/appoitment',
  salesInvoice: '/sales/invoice',
  salesVoucher: '/sales/voucher',
  spinformationwizard: '/information/:step',
  spinformationwizardStepOne: '/information/0/',
  spinformationwizardStepTwo: '/information/1/',
  spinformationwizardStepThree: '/information/2/',
  spinformationwizardStepFour: '/information/3/',
  spinformationwizardStepFive: '/information/4/',
  // customer list
  addCustomer: '/settingCustomers/addCustomer',
  editCustomer: '/settingCustomers/editCustomer/:customerId',
  customerProfile: '/settingCustomers/customerProfile/:customerId',

  settingCustomers: '/settingCustomers/:page',
  // offers List
  addOffer: '/allOffers/addOffer',
  editOffer: '/allOffers/editOffer/:offerId',
  allOffers: '/allOffers/:page',
  // Voucher list
  addVoucher: '/voucherList/addVoucher',
  voucherList: '/voucherList/:page',
  viewVoucher: '/voucherList/viewVoucher/:VoucherId',
  voucherEdit: '/vouchers/edit/:VoucherId/',
  newSale: '/sales/new',
  editSale: '/sales/new/:checkoutId',
  rolesPage: '/roles',
  roles: '/roles/new',
  permissions: '/roles/edit',

  // invoices
  invoicesList: '/sales/invoicesList/:page',

  //   to  handle breadCrumb
  add: '/add',
  branches: '/settings/branches',
  Branch: '/settings/Branch',
  Edit: '/Edit',
};

/**
 * @constant {String} version
 * @description API Version
 * before change note that it might be a change in one environment
 * Ask backend developers about the change.
 */
const version = '1';

/**
 * @constant {String} DOMAIN
 * @description API base url - it's change depends on environment (dev, stage or production)
 */
const DOMAIN = `${process.env.REACT_APP_DOMAIN}1/`;
const ODOMAIN = `${process.env.REACT_APP_ODOMAIN}/`;

/**
 * @constant {String} ASSETS
 * @description Assets base URL
 */
const ASSETS = `${process.env.REACT_APP_ASSETS}/`;
module.exports = {
  DOMAIN,
  ASSETS,
  Routes,
  ODOMAIN,
};
