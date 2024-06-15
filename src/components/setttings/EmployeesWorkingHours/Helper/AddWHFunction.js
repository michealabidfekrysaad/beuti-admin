/* eslint-disable  */

import { FormattedMessage } from 'react-intl';

export const repeatList = [
  {
    text: <FormattedMessage id="setting.employee.wh.weakly" />,
    id: 0,
  },
  {
    text: <FormattedMessage id="setting.employee.wh.dontrepeat" />,
    id: 1,
  },
];
export const endRepeatList = [
  {
    text: <FormattedMessage id="setting.employee.wh.ongoing" />,
    id: 0,
  },
  {
    text: <FormattedMessage id="setting.employee.wh.specificdate" />,
    id: 1,
  },
];
export const currentAcion = {
  add: 0,
  edit: 1,
};
export const defaultDayObject = {
  employeeWorkDayEndRepeat: 0,
  employeeWorkDayRepeat: 0,
  shifts: [{ startTime: '09:00:00', endTime: '17:00:00', id: 0 }],
};
export const handleNextDayDates = (shifts) =>
  shifts?.map((single) => {
    if (single?.startTime?.split(':')[0] >= 24 || single?.endTime?.split(':')[0] >= 24) {
      if (single?.startTime?.split(':')[0] >= 24) {
        const newStartTime = [
          single?.startTime?.split(':')[0] - 24,
          single?.startTime?.split(':')[1],
          single?.startTime?.split(':')[2],
        ];
        const newEndTime = [
          single?.endTime?.split(':')[0] - 24,
          single?.endTime?.split(':')[1],
          single?.endTime?.split(':')[2],
        ];
        return {
          ...single,
          startTime: '0' + newStartTime.join(':'),
          endTime: '0' + newEndTime.join(':'),
          isNextDay: true,
        };
      }

      const newEndTime = [
        single?.endTime?.split(':')[0] - 24,
        single?.endTime?.split(':')[1],
        single?.endTime?.split(':')[2],
      ];
      return {
        ...single,
        endTime: '0' + newEndTime.join(':'),
        isNextDay: true,
      };
    }
    return { ...single, isNextDay: false };
  });
export const handleNextDayDatesIncoming = (arrayofDays, locale) => {
  return arrayofDays.map((day) => ({
    ...day,
    shifts: day.shifts.map((shift) => {
      if (shift.isNextDay) {
        const newEndTime = [
          +shift?.endTime?.split(':')[0] + 24,
          shift?.endTime?.split(':')[1],
          shift?.endTime?.split(':')[2],
        ];
        return { ...shift, endTime: newEndTime.join(':') };
      }

      return { ...shift };
    }),
  }));
};

export const convertSingleNextDayDate = (date) => {
  if (date?.split(':')[0] >= 24) {
    const modifitedDate = [
      +date?.split(':')[0] - 24,
      date?.split(':')[1],
      date?.split(':')[2],
    ];
    return modifitedDate.join(':');
  }
  return date;
};
