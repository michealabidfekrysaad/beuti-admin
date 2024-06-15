/* eslint-disable radix */
/* eslint-disable no-extend-native */

export const salesViews = {
  quickSale: 'sales.quicksale',
  confirmedBooking: 'sales.confirmedbooking',
  products: 'sales.products',
  services: 'sales.services',
};

export const salesItemIds = {
  quickSale: 'QUICK_SALE',
  confirmedBooking: 'CONFIRM_BOOKING',
  products: 'PRODUCTS',
  services: 'SERVICES',
  packages: 'PACKAGES',
  customItem: 'CUSTOM_ITEM',
  fees: 'FEES',
};

export const RemoveChecker = {
  cancel: 'CANCEL_ACTION',
  removed: 'REMOVED_ITEM_ACTION',
};

Number.prototype.truncNumNotRound = function() {
  return parseInt(this * 100) / 100.0;
};

export const selectedTimeOptions = ({ messages }) => {
  const selectedtimeOptions = [
    {
      key: 0,
      id: 0,
      searchDuration: 1,
      isFutureDate: true,
      text: messages['sales.confirmed.booking.today'],
    },
    {
      key: 1,
      id: 1,
      searchDuration: 1,
      isFutureDate: false,
      text: messages['sales.confirmed.booking.yesterday'],
    },
    {
      key: 2,
      id: 2,
      searchDuration: 2,
      isFutureDate: false,
      text: messages['sales.confirmed.booking.last.seven.days'],
    },
    {
      key: 3,
      id: 3,
      searchDuration: 3,
      isFutureDate: false,
      text: messages['sales.confirmed.booking.last.month'],
    },
    {
      key: 4,
      id: 4,
      searchDuration: 1,
      isFutureDate: true,
      text: messages['sales.confirmed.booking.tommorrow'],
    },
    {
      key: 5,
      id: 5,
      searchDuration: 2,
      isFutureDate: true,
      text: messages['sales.confirmed.booking.next.seven.days'],
    },
    {
      key: 6,
      id: 6,
      searchDuration: 3,
      isFutureDate: true,
      text: messages['sales.confirmed.booking.next.month'],
    },
  ];

  return selectedtimeOptions;
};
