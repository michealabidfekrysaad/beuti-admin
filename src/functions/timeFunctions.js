/* eslint-disable consistent-return */

export function twelveHour(time) {
  if (Number(time) <= 12) {
    return `${time}`;
  }
  return `${time - 12}`;
}

export function suffix(time, locale) {
  return Number(time[0]) >= 12
    ? `${locale === 'ar' ? 'م' : 'PM'}`
    : `${locale === 'ar' ? 'ص' : 'AM'}`;
}

export function leadZero(num, size = 2) {
  let s = String(num);
  if (s.length < size) s += '0';
  return s;
}

export function leadZeroInverse(num, size = 2) {
  const s = String(num);
  if (s.length < size) {
    return `0${s}`;
  }
}

export function formatTime(time, lang) {
  if (time) {
    const displayTime = time
      .split(':')
      .map((el) => String(el))
      .filter((a, i) => i !== 2);

    const completeTime = `${twelveHour(displayTime[0])}:${leadZero(
      displayTime[1],
    )} ${suffix(displayTime, lang)}`;

    const zeroMinutesTime = `${
      twelveHour(displayTime[0]).length === 2
        ? twelveHour(displayTime[0])
        : ` ${twelveHour(displayTime[0])}`
    }:00 ${suffix(displayTime, lang)}`;
    return displayTime.length > 1 ? completeTime : zeroMinutesTime;
  }
  return '-';
}

/**
 *
 * @name formatTime
 * @export
 * @param {String} time
 * @param {String} lang
 * @param {Object} messages
 * @returns
 */
export function formatDuration(duration, lang, messages) {
  return `${duration.split(':')[0]}  ${messages['time.hours.short']} ${
    duration.split(':')[1]
  }  ${messages['time.minutes.short']}`;
}

export function dayEquivalent(day, locale) {
  let dayInAr = day;
  switch (day) {
    case 'Monday':
      dayInAr = 'الاثنين';
      break;
    case 'Tuesday':
      dayInAr = 'الثلاثاء';
      break;
    case 'Wednesday':
      dayInAr = 'الأربعاء';
      break;
    case 'Thursday':
      dayInAr = 'الخميس';
      break;
    case 'Friday':
      dayInAr = 'الجمعة';
      break;
    case 'Saturday':
      dayInAr = 'السبت';
      break;
    case 'Sunday':
      dayInAr = 'الأحد';
      break;
    default:
      dayInAr = 'يوم';
      break;
  }
  return locale === 'en' ? day : dayInAr;
}

export function formatDate(date, lang) {
  const dateDisplayOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return new Date(date).toLocaleDateString(
    lang === 'ar' ? 'ar-EG' : 'en-US',
    dateDisplayOptions,
  );
}

export function dayIndexEquivalent(day, locale) {
  let dayInAr = '';
  let dayInEn = '';
  switch (day) {
    case 0:
      dayInAr = 'الأحد';
      dayInEn = 'Sunday';
      break;
    case 1:
      dayInAr = 'الاثنين';
      dayInEn = 'Monday';
      break;
    case 2:
      dayInAr = 'الثلاثاء';
      dayInEn = 'Tuesday';
      break;
    case 3:
      dayInAr = 'الأربعاء';
      dayInEn = 'Wednesday';
      break;
    case 4:
      dayInAr = 'الخميس';
      dayInEn = 'Thursday';
      break;
    case 5:
      dayInAr = 'الجمعة';
      dayInEn = 'Friday';
      break;
    case 6:
      dayInAr = 'السبت';
      dayInEn = 'Saturday';
      break;
    default:
      dayInAr = 'يوم';
      dayInEn = 'Day';
      break;
  }
  return locale === 'en' ? dayInEn : dayInAr;
}
