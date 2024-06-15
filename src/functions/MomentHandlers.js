import moment from 'moment';

export const tofullISOString = (date) =>
  moment(date).format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
export const toADayFormat = (date) => moment(date).format('YYYY-MM-DD');
