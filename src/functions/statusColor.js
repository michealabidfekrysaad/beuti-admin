export function statusColorForWord(status) {
  let color = '';
  if (status === 1 || status === 'مؤكد' || status === 'Confirmed') {
    color = '#4dc41f';
  }
  if (status === 2 || status === 'ملغي' || status === 'Cancelled') {
    color = '#464e5f';
  }
  if (status === 3 || status === 'مغلق' || status === 'Closed') {
    color = '#a12b94';
  }
  if (status === 4 || status === 'معلق' || status === 'Pending') {
    color = '#ffa800';
  }
  if (status === 'PaymentCancelled' || status === 5) {
    color = '#464e5f';
  }
  if (status === 'NoShow' || status === 6) {
    color = '#d11f3d';
  }
  if (status === 'ReservedForCustomer' || status === 7) {
    color = '#bbd3f5';
  }
  return color;
}

export function statusColorBackgroundForWord(status) {
  let background = '';
  if (status === 1 || status === 'مؤكد' || status === 'Confirmed') {
    background = '#CDF0D5';
  }
  if (status === 2 || status === 'ملغي' || status === 'Cancelled') {
    background = '#D2D2D3';
  }
  if (status === 3 || status === 'مغلق' || status === 'Closed') {
    background = '#F5E6F4';
  }
  if (status === 4 || status === 'معلق' || status === 'Pending') {
    background = '#FEEDCD';
  }
  if (status === 'PaymentCancelled' || status === 5) {
    background = '#D2D2D3';
  }
  if (status === 'NoShow' || status === 6) {
    background = '#FCDFE4';
  }
  if (status === 'ReservedForCustomer' || status === 7) {
    background = '#bbd3f561';
  }
  return background;
}

export function statusNumbers(status, locale) {
  const en = {
    Confirmed: 1,
    Cancelled: 2,
    Closed: 3,
    Pending: 4,
    'payment cancelled': 5,
  };
  const ar = {
    مؤكد: 1,
    ملغي: 2,
    مغلق: 3,
    معلق: 4,
    'payment cancelled': 5,
  };

  return locale === 'ar' ? ar[status] : en[status];
}

export function eventStatus(status) {
  let color = '';
  if (status === 'مؤكد' || status === 'Confirmed' || status === 1) {
    color = ['event-box', 'event-box__confirmed'];
  }
  if (status === 'ملغي' || status === 'Cancelled' || status === 2) {
    color = ['event-box', 'event-box__cancelled'];
  }
  if (status === 'مغلق' || status === 'Closed' || status === 3) {
    color = ['event-box', 'event-box__closed'];
  }
  if (status === 'معلق' || status === 'Pending' || status === 4) {
    color = ['event-box', 'event-box__pending'];
  }
  if (status === 'PaymentCancelled' || status === 5) {
    color = ['event-box', 'event-box__payCancelled'];
  }
  if (status === 'NoShow' || status === 6) {
    color = ['event-box', 'event-box__noShow'];
  }
  if (status === 'ReservedForCustomer' || status === 7) {
    color = ['event-box', 'event-box__reservedCustomer'];
  }
  return color;
}

export function eventStatusClassServiceList(status) {
  let color = '';
  if (status === 'مؤكد' || status === 'Confirmed' || status === 1) {
    color = '__confirmed';
  }
  if (status === 'ملغي' || status === 'Cancelled' || status === 2) {
    color = '__cancelled';
  }
  if (status === 'مغلق' || status === 'Closed' || status === 3) {
    color = '__closed';
  }
  if (status === 'معلق' || status === 'Pending' || status === 4) {
    color = '__pending';
  }
  if (status === 'PaymentCancelled' || status === 5) {
    color = '__payCancelled';
  }
  if (status === 'NoShow' || status === 6) {
    color = '__noShow';
  }
  if (status === 'ReservedForCustomer' || status === 7) {
    color = '__reservedCustomer';
  }
  return color;
}
