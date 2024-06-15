import { Routes } from 'constants/Routes';

const generalConfig = [
  {
    image: '/settingicons/branches.svg',
    header: 'settings.branches.header',
    info: 'settings.branches.info',
    link: Routes.settingAllBrsanches,
    isBranchOwnerRequired: true,
  },
  {
    image: '/settingicons/relation.svg',
    header: 'settings.branch.information.header',
    info: 'settings.branch.information.info',
    link: Routes.settingUpdateBranchInfo,
    isBranchOwnerRequired: false,
  },
  {
    image: '/settingicons/home.svg',
    header: 'settings.home.services.header',
    info: 'settings.home.services.info',
    link: Routes.settinghome,
    isBranchOwnerRequired: false,
  },
  {
    image: '/settingicons/sheet2.svg',
    header: 'settings.online.booking.header',
    info: 'settings.online.booking.info',
    link: Routes.onlineBooking,
    isBranchOwnerRequired: false,
  },
  {
    image: '/settingicons/payment.svg',
    header: 'settings.financial.header',
    info: 'settings.financial.info',
    link: Routes.financial,
    isBranchOwnerRequired: false,
  },
  {
    image: '/settingicons/pyramids.svg',
    header: 'settings.photos.header',
    info: 'settings.photos.info',
    link: Routes.photos,
    isBranchOwnerRequired: false,
  },
  {
    image: '/settingicons/chair.svg',
    header: 'settings.chairs.header',
    info: 'settings.chairs.info',
    link: Routes.chairSettings,
    isBranchOwnerRequired: false,
  },
  {
    image: '/settingicons/starcheck.svg',
    header: 'settings.freeLance.header',
    info: 'settings.freeLance.info',
    onClick: (callbackfun) => callbackfun,
    isBranchOwnerRequired: false,
  },
];
const workingTimeConfig = [
  {
    image: '/settingicons/time.svg',
    header: 'settings.wokring.hours.header',
    info: 'settings.wokring.hours.info',
    link: Routes.workingHours,
    isBranchOwnerRequired: false,
  },
];
const servicesConfig = [
  {
    image: '/settingicons/sheet.svg',
    header: 'setting.tab.service.title',
    info: 'setting.tab.service.description',
    link: Routes.servicesList,
    isBranchOwnerRequired: false,
  },
];
const employeesConfig = [
  {
    image: '/settingicons/employees.svg',
    header: 'setting.employee.title',
    info: 'setting.employee.description',
    link: '/settings/settingEmployees/0',
    isBranchOwnerRequired: false,
  },
  {
    image: '/settingicons/time.svg',
    header: 'setting.employee.wh.title',
    info: 'setting.employee.wh.description',
    link: Routes.settingEmployeesWH,
    isBranchOwnerRequired: false,
  },
];
const voucherConfig = [
  {
    image: '/settingicons/voucher.svg',
    header: 'setting.tab.voucher.title',
    info: 'setting.tab.voucher.description',
    link: '/voucherList',
    isBranchOwnerRequired: false,
  },
  {
    image: '/settingicons/percntage.svg',
    header: 'setting.tab.offers.title',
    info: 'setting.tab.offers.description',
    link: '/allOffers',
    isBranchOwnerRequired: false,
  },
];
export const settingRoutes = [
  {
    title: 'settings.account.setup',
    description: 'settings.account.setup.info',
    hasHeader: true,
    width: 12,
    tabs: generalConfig,
  },
  {
    title: '',
    description: '',
    hasHeader: false,
    width: 6,
    tabs: workingTimeConfig,
  },
  {
    title: '',
    description: '',
    hasHeader: false,
    width: 6,
    tabs: servicesConfig,
  },
  {
    title: 'setting.employee.title',
    description: 'settings.account.setup.info',
    hasHeader: true,
    width: 6,
    tabs: employeesConfig,
  },
  {
    title: 'setting.voucher.discount.title',
    description: 'setting.voucher.discount.description',
    hasHeader: true,
    width: 6,
    tabs: voucherConfig,
  },
];
