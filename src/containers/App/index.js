import React, { Suspense, useContext, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Routes } from 'constants/Routes';
import { SuperAdminRoute, PrivateRoute, AdminRoute } from 'Routes/PrivateRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';

import 'App.scss';

import {
  wrapWithMainLayout as wrapped,
  wrapWithFullLayout,
  withoutWrap,
} from 'functions/wrappers';
import HomePage from 'components/AdminViews/HomePage/HomePage';
import LoginForm from 'components/LoginForm';
import HomaPage from 'components/HomaPage/Loadable';
import { SPsList } from 'components/SuperAdminViews/ServicePrivedersList';
import { SPDetails } from 'components/SuperAdminViews/ServiceProviderDetails/index';
import { CategoriesList } from 'components/SuperAdminViews/CategoriesList';
import ForgotPassword from 'components/ForgotPassword';
import CategoriesEdit from 'components/SuperAdminViews/CategoriesList/CategoriesEdit';
import CategoriesAdd from 'components/SuperAdminViews/CategoriesList/CategoryAdd';
import CategoriesMove from 'components/SuperAdminViews/CategoriesList/CategoriesMove';
import Cities from 'components/SuperAdminViews/CitiesList';
import CitiesAdd from 'components/SuperAdminViews/CitiesList/CitiesAdd';
import CitiesEdit from 'components/SuperAdminViews/CitiesList/CitiesEdit';
import { BookingsList } from 'components/SuperAdminViews/BookingsList';
import { BookingDetails } from 'components/SuperAdminViews/BookingDetails';
import { CancelledBookingDetails } from 'components/SuperAdminViews/cancelledBookingDetails';
import { CancelledBookingsList } from 'components/SuperAdminViews/cancelledBookingsList';
// import EmployeesList from 'components/AdminViews/EmployeesList';

import SPPromo from 'components/SuperAdminViews/PromoCodes/SPPromo';
import AddNewService from 'components/AdminViews/Services/AddNewService/AddNewService';
import Services from 'components/AdminViews/Services';
import EditServiceNewBranches from 'components/AdminViews/Services/EditNewService/EditServiceNewBranches';
import EditPackage from 'components/AdminViews/Services/EditPackage/EditPackage';
import AddNewPackage from 'components/AdminViews/Services/AddNewPackage/AddNewPackage';
import AddNewCategory from 'components/AdminViews/Services/AddNewCategory/AddNewCategory';
import EditCategoryAdded from 'components/AdminViews/Services/EditCategoryAdded/EditCategoryAdded';

import AddService from 'components/AdminViews/Services/AddService';
import { ServiceDetails } from 'components/AdminViews/Services/ServiceDetail';

import BookingProvider from 'providers/BookingProvider';
import { PromoCodesList, AddPromoCodes } from 'components/SuperAdminViews/PromoCodes';
// import { CustomersList } from 'components/AdminViews/CustomersList';
import { ChairsList } from 'components/AdminViews/Chairs/ChairsList';
import AddChairs from 'components/AdminViews/Chairs/AddChairs';

import VoucherList from 'components/AdminViews/Vouchers/VouchersList';
import Sales from 'components/AdminViews/sales/Sales';
import AddVoucher from 'components/AdminViews/Vouchers/AddVoucher';
import { AnnounceList } from 'components/SuperAdminViews/AnnouncesList/AnnouncesList';
import BusinessCategory from 'components/BusinessCategory';
import BusinessCategoryAdd from 'components/BusinessCategory/BusinessCategoryAdd/BusinessCategoryAdd';
import BusinessCategoryEdit from 'components/BusinessCategory/BusinessCategoryEdit/BusinessCategoryEdit';
import ChangePassword from 'containers/Settings/SettingsSpSections/ChangePassword';
import SettingsNewDesgin from 'containers/Settings-new-design';
import BranchesAll from 'containers/Settings-new-design/Branches/BranchesAll';
import AddNewBranch from 'containers/Settings-new-design/Branches/AddNewBranch';
import BranchManager from 'containers/Settings-new-design/BranchManager';
import UpdateChairSettings from 'containers/Settings-new-design/UpdateChairSettings';
import BrandOwnerChangePhone from 'containers/Settings-new-design/BrandOwnerChangePhone';
import UpdateOnlineBookingStatus from 'containers/Settings-new-design/UpdateOnlineBookingStatus';
import FinancialSettings from 'containers/Settings-new-design/Financial';
import VerifyFreelanceNumber from 'containers/Settings-new-design/VerifyFreelanceNumber';
import BranchInfoSettings from 'containers/Settings-new-design/BranchInfoSetting';
import BranchInfoEditDetails from 'containers/Settings-new-design/BranchInfoSetting/BranchInfoEditDetails';
import UpdateDefaultWorkingHours from 'containers/Settings-new-design/UpdateDefaultWorkingHours/UpdateDefaultWorkingHours';
import SeasonalTime from 'containers/Settings-new-design/SeasonalTime/SeasonalTime';
import WorkingHoursMain from 'containers/Settings-new-design/WorkingHoursMain/WorkingHoursMain';
import EditSeasonalTime from 'containers/Settings-new-design/SeasonalTime/EditSeasonalTime';
import SettingsSp from 'containers/Settings/SettingsSp';
import SettingsWorkHome from 'containers/Settings/SettingsWorkHomeSections/SettingsWorkHome';
import SettingsImage from 'containers/Settings/SettingsImageSections/SettingsImage';
import SettingsFinance from 'containers/Settings/SettingsFinanceSections/SettingsFinance';
import CustomersList from 'components/setttings/Customers/CustomersList';
import SettingsOnlineSections from 'containers/Settings/SettingsOnlineSections';
import SettingsStatusSections from 'containers/Settings/SettingsStatusSections';
import SettingsChairsSections from 'containers/Settings/SettingsChairsSections';
import ChangeUsername from 'components/AdminViews/Settings/ChangeUsername';
import ChangeEmail from 'components/AdminViews/Settings/ChangeEmail';
import { ReportedReviewsList } from 'components/SuperAdminViews/ReportedReviews';
import GiftCardList from 'components/SuperAdminViews/GiftCardList';
import FreelanceCertificates from 'components/SuperAdminViews/FreelanceCertificates';
import WalletRechargeTransaction from 'components/SuperAdminViews/WalletRechargeTransaction';
import CheckoutView from 'components/AdminViews/Bookings/views/CheckoutFlow/CheckoutView';
import BookingPosView from 'components/AdminViews/Bookings/BookingPosView';
import BookingSpView from 'components/AdminViews/Bookings/BookingSpView';
import Roles from 'components/AdminViews/Roles/Roles';
import { CustomerListIndex } from '../../components/SuperAdminViews/CustomerList';
import CustomerInfo from '../../components/SuperAdminViews/customerDetails';
import AdvertiserList from '../../components/AdvertisersList/AdvertiserList';
import CityPolygon from '../../components/SuperAdminViews/CitiesList/CitiesPolygon/CityPolygon';
import Booking from '../../components/AdminViews/Bookings/Booking';
import SPInformationWizard from '../../components/SPInformationWizard/SPInformationWizard';
import UpdatePhotos from '../../components/setttings/photos/UpdatePhotos';
import HomeSetting from '../../components/setttings/Home/HomeSetting';
import EmployeesList from '../../components/setttings/Employees/EmployeesList';
import AddEmployee from '../../components/setttings/Employees/AddEmployee';
import ProductsList from '../../components/AdminViews/Products/ProductsList';
import AddProduct from '../../components/AdminViews/Products/AddProduct';
import AddEditClosingPeriod from '../Settings/ClosingPeriod/AddEditClosingPeriod';
import AddEditCustomer from '../../components/setttings/Customers/AddEditCustomer';
import CABannerList from '../../components/SuperAdminViews/CABanner/CABannerList';
import CABannerAdd from '../../components/SuperAdminViews/CABanner/CABannerAdd';
import OffersList from '../../components/setttings/Offers/OfferList';
import CustomerProfile from '../../components/setttings/Customers/CustomerProfile';
import EmployeesWHList from '../../components/setttings/EmployeesWorkingHours/EmployeesWHList';
import EditEmployee from '../../components/setttings/Employees/EditEmployee';
import AddOffer from '../../components/setttings/Offers/AddOffer';
import AddEditBooking from '../../components/AdminViews/Bookings/commonViewsBooking/AddEditBooking';
import ViewBooking from '../../components/AdminViews/Bookings/commonViewsBooking/ViewBooking';
import ViewVoucher from '../../components/AdminViews/Vouchers/ViewVoucher';
import InvoicessList from '../../components/AdminViews/Invoices/InvoicesList';

const style = document.getElementById('style-direction');

function App() {
  const { locale } = useIntl();
  if (locale === 'ar') {
    style.href = '/assets/css/main.rtl.min.css';
  } else {
    style.href = '/assets/css/main.min.css';
  }
  useEffect(() => {
    console.log(process.env.REACT_APP_ENV_NAME);
  }, []);
  return (
    <>
      <BookingProvider>
        <Suspense fallback="loading...">
          <Switch>
            <Route exact path={Routes.login} component={LoginForm} />
            <Route exact path={Routes.forgotPassword} component={ForgotPassword} />
            <PrivateRoute exact path={Routes.home}>
              {wrapped(<HomaPage />)}
            </PrivateRoute>
            <PrivateRoute exact path={Routes.reportsStatisctics}>
              {wrapped(<HomaPage />)}
            </PrivateRoute>
            <AdminRoute exact path={Routes.chairsList}>
              {wrapped(<ChairsList />)}
            </AdminRoute>
            <AdminRoute exact path={Routes.AddChairs}>
              {withoutWrap(<AddChairs />)}
            </AdminRoute>
            <AdminRoute path={Routes.spinformationwizard}>
              {withoutWrap(<SPInformationWizard />)}
            </AdminRoute>
            <AdminRoute exact path={Routes.photos}>
              {wrapped(<UpdatePhotos />)}
            </AdminRoute>
            <AdminRoute exact path={Routes.settinghome}>
              {wrapped(<HomeSetting />)}
            </AdminRoute>
            <AdminRoute exact path={Routes.addCustomer}>
              {wrapped(<AddEditCustomer />)}
            </AdminRoute>
            <AdminRoute exact path={Routes.editCustomer}>
              {wrapped(<AddEditCustomer />)}
            </AdminRoute>
            <AdminRoute exact path={Routes.customerProfile}>
              {wrapped(<CustomerProfile />)}
            </AdminRoute>
            <AdminRoute exact path={Routes.settingCustomers}>
              {wrapped(<CustomersList />)}
            </AdminRoute>
            <Redirect from="/settingCustomers" to="/settingCustomers/0" exact />

            <AdminRoute exact path={Routes.addOffer}>
              {wrapped(<AddOffer />)}
            </AdminRoute>
            <AdminRoute exact path={Routes.allOffers}>
              {wrapped(<OffersList />)}
            </AdminRoute>
            <Redirect from="/allOffers" to="/allOffers/0" />
            <AdminRoute exact path={Routes.addVoucher}>
              {wrapped(<AddVoucher />)}
            </AdminRoute>
            <PrivateRoute path="/sales">{wrapWithFullLayout(<Sales />)}</PrivateRoute>

            <AdminRoute path="/roles">{wrapWithFullLayout(<Roles />)}</AdminRoute>

            <AdminRoute exact path={Routes.viewVoucher}>
              {wrapped(<ViewVoucher />)}
            </AdminRoute>
            <AdminRoute exact path={Routes.voucherList}>
              {wrapped(<VoucherList />)}
            </AdminRoute>
            <Redirect from="/voucherList" to="/voucherList/0" />
            <AdminRoute exact path={Routes.addEmployee}>
              {wrapped(<AddEmployee />)}
            </AdminRoute>
            <AdminRoute exact path={Routes.editEmployee}>
              {wrapped(<EditEmployee />)}
            </AdminRoute>
            <AdminRoute exact path={Routes.settingEmployees}>
              {wrapped(<EmployeesList />)}
            </AdminRoute>
            <AdminRoute exact path={Routes.settingEmployeesWH}>
              {wrapped(<EmployeesWHList />)}
            </AdminRoute>
            <AdminRoute exact path={Routes.offersList}>
              {wrapped(<OffersList />)}
            </AdminRoute>
            <SuperAdminRoute exact path={Routes.promoCodes}>
              {wrapped(<PromoCodesList />)}
            </SuperAdminRoute>
            <SuperAdminRoute exact path={Routes.promoCodesAdd}>
              {wrapped(<AddPromoCodes />)}
            </SuperAdminRoute>
            <SuperAdminRoute exact path={Routes.settingsPromo}>
              {wrapped(<SPPromo />)}
            </SuperAdminRoute>
            {/* <AdminRoute exact path={Routes.mainPage}>
              {wrapped(<HomePage />)}
            </AdminRoute> */}
            {/* <AdminRoute exact path={Routes.productDetails}>
            {withoutWrap(<ProductDetails />)}
          </AdminRoute>
          <AdminRoute exact path={Routes.productEdit}>
            {withoutWrap(<ProductAdd />)}
          </AdminRoute>
          <AdminRoute exact path={Routes.productAdd}>
            {withoutWrap(<ProductAdd />)}
          </AdminRoute> */}
            <AdminRoute exact path={Routes.productedit}>
              {wrapped(<AddProduct />)}
            </AdminRoute>
            <AdminRoute exact path={Routes.productadd}>
              {wrapped(<AddProduct />)}
            </AdminRoute>
            <AdminRoute exact path={Routes.productList}>
              {wrapped(<ProductsList />)}
            </AdminRoute>
            <Redirect from="/productList" to="/productList/0" />
            <AdminRoute exact path={Routes.viewBooking}>
              {withoutWrap(<ViewBooking />)}
            </AdminRoute>
            <PrivateRoute path={Routes.dayBookingsCalendarViewMobile}>
              {withoutWrap(<BookingPosView />)}
            </PrivateRoute>
            <PrivateRoute path={Routes.bookingsCalendarViewIos}>
              {withoutWrap(<BookingSpView />)}
            </PrivateRoute>
            <AdminRoute exact path={Routes.dayBookingsCalendarView}>
              {wrapped(<Booking />, true)}
            </AdminRoute>

            <AdminRoute exact path={Routes.bookingFlow}>
              {withoutWrap(<AddEditBooking />)}
            </AdminRoute>
            <AdminRoute exact path={Routes.bookingEdit}>
              {withoutWrap(<AddEditBooking />)}
            </AdminRoute>
            <AdminRoute exact path={Routes.checkoutBooking}>
              {wrapped(<CheckoutView />)}
            </AdminRoute>

            <AdminRoute exact path={Routes.settingsSP}>
              {withoutWrap(<SettingsSp />)}
            </AdminRoute>
            <AdminRoute exact path={Routes.settingsSPChangePass}>
              {withoutWrap(<ChangePassword />)}
            </AdminRoute>
            <AdminRoute exact path={Routes.settingSectionCenter}>
              {withoutWrap(<SettingsWorkHome />)}
            </AdminRoute>
            <AdminRoute exact path={Routes.settingSectionImages}>
              {withoutWrap(<SettingsImage />)}
            </AdminRoute>
            <AdminRoute exact path={Routes.settingSectionFinance}>
              {withoutWrap(<SettingsFinance />)}
            </AdminRoute>
            <AdminRoute exact path={Routes.settingSectionStatus}>
              {withoutWrap(<SettingsStatusSections />)}
            </AdminRoute>
            <AdminRoute exact path={Routes.settingSectionChairs}>
              {withoutWrap(<SettingsChairsSections />)}
            </AdminRoute>
            {/* the new settings design */}
            <AdminRoute exact path={Routes.settings}>
              {wrapped(<SettingsNewDesgin />)}
            </AdminRoute>
            <AdminRoute exact path={Routes.settingAllBrsanches}>
              {wrapped(<BranchesAll />)}
            </AdminRoute>
            <AdminRoute exact path={Routes.settingAllBrsanchesAdd}>
              {wrapped(<AddNewBranch />)}
            </AdminRoute>
            <AdminRoute exact path={Routes.changeManager}>
              {wrapped(<BranchManager />)}
            </AdminRoute>
            <AdminRoute exact path={Routes.servicesDetails}>
              {withoutWrap(<ServiceDetails />)}
            </AdminRoute>
            {/* <AdminRoute exact path={Routes.servicesEdit}>
            {withoutWrap(<EditService />)}
          </AdminRoute> */}
            <AdminRoute exact path={Routes.servicesAdd}>
              {withoutWrap(<AddService />)}
            </AdminRoute>
            <AdminRoute exact path={Routes.servicesList}>
              {wrapped(<Services />)}
            </AdminRoute>
            <AdminRoute exact path={Routes.EditService}>
              {wrapped(<EditServiceNewBranches />)}
            </AdminRoute>
            <AdminRoute exact path={Routes.EditPackage}>
              {wrapped(<EditPackage />)}
            </AdminRoute>
            <AdminRoute exact path={Routes.AddPackage}>
              {wrapped(<AddNewPackage />)}
            </AdminRoute>
            <AdminRoute exact path={Routes.newCategory}>
              {wrapped(<AddNewCategory />)}
            </AdminRoute>
            <AdminRoute exact path={Routes.newService}>
              {wrapped(<AddNewService />)}
            </AdminRoute>
            <AdminRoute exact path={Routes.EditCategory}>
              {wrapped(<EditCategoryAdded />)}
            </AdminRoute>
            {/* <AdminRoute exact path={Routes.employeeAllDetails}>
            {wrapped(<EmployeesList />)}
          </AdminRoute>
          <AdminRoute exact path={Routes.employeeWorkingHours}>
            {wrapped(<EmployeesList />)}
          </AdminRoute>
          <AdminRoute exact path={Routes.closingPeriod}>
            {wrapped(<EmployeesList />)}
          </AdminRoute> */}

            {/* <AdminRoute exact path={Routes.voucherAdd}>
              {withoutWrap(<AddVoucher />)}
            </AdminRoute> */}

            {/* <AdminRoute exact path={Routes.customersList}>
              {wrapped(<CustomersList />)}
            </AdminRoute> */}
            <AdminRoute exact path={Routes.chairSettings}>
              {wrapped(<UpdateChairSettings />)}
            </AdminRoute>
            <AdminRoute exact path={Routes.employeesList}>
              {wrapped(<EmployeesList />)}
            </AdminRoute>
            <AdminRoute exact path={Routes.settingVerifySpFreeLance}>
              {wrapped(<VerifyFreelanceNumber />)}
            </AdminRoute>
            <AdminRoute exact path={Routes.settingUpdateBranchInfo}>
              {wrapped(<BranchInfoSettings />)}
            </AdminRoute>
            <AdminRoute exact path={Routes.settingUpdateBranchInfoDetails}>
              {wrapped(<BranchInfoEditDetails />)}
            </AdminRoute>
            <AdminRoute exact path={Routes.changeOwnerPhone}>
              {wrapped(<BrandOwnerChangePhone />)}
            </AdminRoute>
            <AdminRoute exact path={Routes.closingPeriodEdit}>
              {wrapped(<AddEditClosingPeriod />)}
            </AdminRoute>
            <AdminRoute exact path={Routes.closingPeriodAdd}>
              {wrapped(<AddEditClosingPeriod />)}
            </AdminRoute>
            <AdminRoute exact path={Routes.workingHours}>
              {wrapped(<WorkingHoursMain />)}
            </AdminRoute>
            <AdminRoute exact path={Routes.defaultWorkingHours}>
              {wrapped(<UpdateDefaultWorkingHours />)}
            </AdminRoute>
            <AdminRoute exact path={Routes.seasonalWorkingHours}>
              {wrapped(<SeasonalTime />)}
            </AdminRoute>
            <AdminRoute exact path={Routes.editSeasonalWorkingHours}>
              {wrapped(<EditSeasonalTime />)}
            </AdminRoute>
            <AdminRoute exact path={Routes.onlineBooking}>
              {wrapped(<UpdateOnlineBookingStatus />)}
            </AdminRoute>
            <AdminRoute exact path={Routes.financial}>
              {wrapped(<FinancialSettings />)}
            </AdminRoute>
            <SuperAdminRoute exact path={Routes.cancelledBookingDetails}>
              {wrapped(<CancelledBookingDetails />)}
            </SuperAdminRoute>
            <SuperAdminRoute exact path={Routes.cancelledBookingsList}>
              {wrapped(<CancelledBookingsList />)}
            </SuperAdminRoute>
            <SuperAdminRoute exact path={Routes.bookingDetails}>
              {wrapped(<BookingDetails />)}
            </SuperAdminRoute>
            <SuperAdminRoute exact path={Routes.announces}>
              {wrapped(<AnnounceList />)}
            </SuperAdminRoute>
            <SuperAdminRoute exact path={Routes.advertisers}>
              {wrapped(<AdvertiserList />)}
            </SuperAdminRoute>
            <SuperAdminRoute exact path={Routes.bookingsList}>
              {wrapped(<BookingsList />)}
            </SuperAdminRoute>
            <SuperAdminRoute exact path={Routes.citiesEdit}>
              {wrapped(<CitiesEdit />)}
            </SuperAdminRoute>
            <SuperAdminRoute exact path={Routes.citiesAddPolygon}>
              {wrapped(<CityPolygon />)}
            </SuperAdminRoute>
            <SuperAdminRoute exact path={Routes.cities}>
              {wrapped(<Cities />)}
            </SuperAdminRoute>
            <SuperAdminRoute exact path={Routes.businessCategory}>
              {wrapped(<BusinessCategory />)}
            </SuperAdminRoute>
            <SuperAdminRoute exact path={Routes.businessCategoryAdd}>
              {wrapped(<BusinessCategoryAdd />)}
            </SuperAdminRoute>
            <SuperAdminRoute exact path={Routes.businessCategoryEdit}>
              {wrapped(<BusinessCategoryEdit />)}
            </SuperAdminRoute>
            <SuperAdminRoute exact path={Routes.categoriesAdd}>
              {wrapped(<CategoriesAdd />)}
            </SuperAdminRoute>
            <SuperAdminRoute exact path={Routes.categoriesMove}>
              {wrapped(<CategoriesMove />)}
            </SuperAdminRoute>
            <SuperAdminRoute exact path={Routes.cabanners}>
              {wrapped(<CABannerList />)}
            </SuperAdminRoute>
            <SuperAdminRoute exact path={Routes.cabannersAdd}>
              {wrapped(<CABannerAdd />)}
            </SuperAdminRoute>
            <SuperAdminRoute exact path={Routes.categoriesEdit}>
              {wrapped(<CategoriesEdit />)}
            </SuperAdminRoute>
            <SuperAdminRoute exact path={Routes.categories}>
              {wrapped(<CategoriesList />)}
            </SuperAdminRoute>
            <SuperAdminRoute exact path={Routes.spDetails}>
              {wrapped(<SPDetails />)}
            </SuperAdminRoute>
            <SuperAdminRoute exact path={Routes.spsList}>
              {wrapped(<SPsList />)}
            </SuperAdminRoute>
            <SuperAdminRoute exact path={Routes.customerList}>
              {wrapped(<CustomerListIndex />)}
            </SuperAdminRoute>
            <SuperAdminRoute exact path={Routes.CustomerDetails}>
              {wrapped(<CustomerInfo />)}
            </SuperAdminRoute>
            <SuperAdminRoute exact path={Routes.WalletRechargeTransaction}>
              {wrapped(<WalletRechargeTransaction />)}
            </SuperAdminRoute>
            <SuperAdminRoute exact path={Routes.giftCard}>
              {wrapped(<GiftCardList />)}
            </SuperAdminRoute>
            <SuperAdminRoute exact path={Routes.FreelanceCertificates}>
              {wrapped(<FreelanceCertificates />)}
            </SuperAdminRoute>
            <SuperAdminRoute exact path={Routes.reportedReviews}>
              {wrapped(<ReportedReviewsList />)}
            </SuperAdminRoute>
            {/* <Route path="**" component={HomaPage} /> */}
            <Redirect from="*" to={Routes.home} />
          </Switch>
        </Suspense>
      </BookingProvider>
    </>
  );
}

export default App;
