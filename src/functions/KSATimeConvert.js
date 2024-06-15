import moment from 'moment';

export const KSATimeConverter = (date) =>
  `${moment(date).format('YYYY-MM-DDTHH:mm:ss')}+03:00`;
