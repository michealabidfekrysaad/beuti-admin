import { Routes } from 'constants/Routes';

const superAdminScope = 'sidebar.sadmin';
const adminScope = 'sidebar.admin';
export const superAdminMenuItems = [
  {
    message: `${superAdminScope}.serviceProviders`,
    icon: '/assets/icons/Communication/Group.svg',
    link: '/service-providers/view/1',
  },
  {
    message: `${superAdminScope}.customerList`,
    icon: '/assets/icons/Text/Align-justify.svg',
    link: Routes.customerList,
  },
  {
    message: `${superAdminScope}.WalletRechargetransactions`,
    icon: '/assets/icons/Shopping/Wallet.svg',
    link: '/wallet-recharge/view/1',
  },
  {
    message: `${superAdminScope}.FreelanceCertificates`,
    icon: '/assets/icons/Files/Selected-file.svg',
    link: Routes.FreelanceCertificates,
  },
  {
    message: `${superAdminScope}.businessCategory`,
    icon: '/assets/icons/Code/Git2.svg',
    link: Routes.businessCategory,
  },
  {
    message: `${superAdminScope}.categories`,
    icon: '/assets/icons/Code/Git1.svg',
    link: Routes.categories,
  },
  {
    message: `routes.cabanners`,
    icon: '/assets/icons/General/Star.svg',
    link: Routes.cabanners,
  },
  {
    message: `${superAdminScope}.giftCard`,
    icon: '/assets/icons/Shopping/Gift.svg',
    link: Routes.giftCard,
  },
  {
    message: `${superAdminScope}.cities`,
    icon: '/assets/icons/Home/Globe.svg',
    link: Routes.cities,
  },
  {
    message: `${superAdminScope}.ReportedReviews`,
    icon: '/assets/icons/Home/Book-open.svg',
    link: Routes.reportedReviews,
  },
  {
    message: `${superAdminScope}.bookings`,
    icon: '/assets/icons/Shopping/Ticket.svg',
    link: Routes.bookingsList,
  },

  {
    message: `${superAdminScope}.cancelledBookings`,
    icon: '/assets/icons/Navigation/Close.svg',
    link: Routes.cancelledBookingsList,
  },
  {
    message: `${superAdminScope}.promoCodes`,
    icon: '/assets/icons/Shopping/Barcode.svg',
    link: Routes.promoCodes,
  },
  {
    message: `${superAdminScope}.advertisers`,
    icon: '/assets/icons/Text/Align-auto.svg',
    link: Routes.advertisers,
  },
  {
    message: `${superAdminScope}.announces`,
    icon: '/assets/icons/General/Notifications1.svg',
    link: Routes.announces,
  },
];

export const adminMenuItems = [
  {
    message: `sAdmin.spDetails.services.table.bookings`,
    icon: '/assets/icons/beuti/booking.svg',
    link: Routes.dayBookingsCalendarView,
  },
  {
    message: 'admin.reports.sales',
    icon: '/assets/icons/beuti/sale.svg',
    link: '/sales',
  },
  {
    message: 'routes.settingCustomers',
    icon: '/assets/icons/beuti/customers.svg',
    link: '/settingCustomers',
  },
  {
    message: `sAdmin.spDetails.services.table.services`,
    icon: '/assets/icons/beuti/services.svg',
    link: Routes.servicesList,
  },
  {
    message: `offersList`,
    icon: '/assets/icons/beuti/offers.svg',
    link: '/allOffers',
  },

  {
    message: 'products.sidebar',
    icon: '/assets/icons/beuti/products.svg',
    link: '/productList',
  },
  {
    message: 'voucher.title',
    icon: '/assets/icons/beuti/vouchers.svg',
    link: '/voucherList',
  },

  //   {
  //     message: `${adminScope}.homePage`,
  //     icon: '/assets/icons/beuti/reports.svg',
  //     link: Routes.mainPage,
  //   },

  // {
  //   message: `kpis.chairs`,
  //   icon: '/assets/icons/Home/Chair1.svg',
  //   link: Routes.chairsList,
  // },
  // {
  //   message: `kpis.statistics`,
  //   icon: '/assets/icons/Shopping/Chart-line1.svg',
  //   link: Routes.home,
  // },
  {
    message: `${adminScope}.spSettings`,
    icon: '/assets/icons/beuti/settingIcon.svg',
    link: Routes.settings,
    className: 'circle',
  },
  {
    message: `common.success`,
    icon: '/assets/icons/beuti/customers.svg',
    link: '/roles',
  },
];
