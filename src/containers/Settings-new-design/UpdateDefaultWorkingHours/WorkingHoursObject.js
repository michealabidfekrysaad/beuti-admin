/* eslint-disable prefer-template */
import { dayIndexEquivalent } from '../../../functions/timeFunctions';
export const mainHoursObject = (locale) => [
  {
    id: 0,
    name: dayIndexEquivalent(0, locale),
    isSelected: false,
    shifts: [],
  },
  {
    id: 1,
    name: dayIndexEquivalent(1, locale),
    isSelected: false,
    shifts: [],
  },
  {
    id: 2,
    name: dayIndexEquivalent(2, locale),
    isSelected: false,
    shifts: [],
  },
  {
    id: 3,
    name: dayIndexEquivalent(3, locale),
    isSelected: false,
    shifts: [],
  },
  {
    id: 4,
    name: dayIndexEquivalent(4, locale),
    isSelected: false,
    shifts: [],
  },
  {
    id: 5,
    name: dayIndexEquivalent(5, locale),
    isSelected: false,
    shifts: [],
  },
  {
    id: 6,
    name: dayIndexEquivalent(6, locale),
    isSelected: false,
    shifts: [],
  },
];
export const defaultHoursObject = (locale) => [
  {
    id: 0,
    name: dayIndexEquivalent(0, locale),
    isSelected: true,
    shifts: [
      { startTime: '09:00:00', endTime: '12:00:00', id: 0 },
      { startTime: '16:00:00', endTime: '22:00:00', id: 1 },
    ],
  },
  {
    id: 1,
    name: dayIndexEquivalent(1, locale),
    isSelected: true,
    shifts: [{ startTime: '12:00:00', endTime: '20:00:00', id: 0 }],
  },
  {
    id: 2,
    name: dayIndexEquivalent(2, locale),
    isSelected: true,
    shifts: [{ startTime: '12:00:00', endTime: '20:00:00', id: 0 }],
  },
  {
    id: 3,
    name: dayIndexEquivalent(3, locale),
    isSelected: true,
    shifts: [{ startTime: '12:00:00', endTime: '20:00:00', id: 0 }],
  },
  {
    id: 4,
    name: dayIndexEquivalent(4, locale),
    isSelected: true,
    shifts: [{ startTime: '12:00:00', endTime: '20:00:00', id: 0 }],
  },
  {
    id: 5,
    name: dayIndexEquivalent(5, locale),
    isSelected: false,
    shifts: [],
  },
  {
    id: 6,
    name: dayIndexEquivalent(6, locale),
    isSelected: true,

    shifts: [{ startTime: '12:00:00', endTime: '20:00:00', id: 0 }],
  },
];

export const defaultHoursObjectWithOneShift = (locale) => [
  {
    id: 0,
    name: dayIndexEquivalent(0, locale),
    isSelected: true,
    shifts: [{ startTime: '12:00:00', endTime: '20:00:00', id: 0 }],
  },
  {
    id: 1,
    name: dayIndexEquivalent(1, locale),
    isSelected: true,
    shifts: [{ startTime: '12:00:00', endTime: '20:00:00', id: 0 }],
  },
  {
    id: 2,
    name: dayIndexEquivalent(2, locale),
    isSelected: true,
    shifts: [{ startTime: '12:00:00', endTime: '20:00:00', id: 0 }],
  },
  {
    id: 3,
    name: dayIndexEquivalent(3, locale),
    isSelected: true,
    shifts: [{ startTime: '12:00:00', endTime: '20:00:00', id: 0 }],
  },
  {
    id: 4,
    name: dayIndexEquivalent(4, locale),
    isSelected: true,
    shifts: [{ startTime: '12:00:00', endTime: '20:00:00', id: 0 }],
  },
  {
    id: 5,
    name: dayIndexEquivalent(5, locale),
    isSelected: true,
    shifts: [{ startTime: '12:00:00', endTime: '20:00:00', id: 0 }],
  },
  {
    id: 6,
    name: dayIndexEquivalent(6, locale),
    isSelected: true,

    shifts: [{ startTime: '12:00:00', endTime: '20:00:00', id: 0 }],
  },
];

// apply all working hours to enabled days only
export const copyAllHoursObject = (days, locale, shifts) => [
  {
    id: 0,
    name: dayIndexEquivalent(0, locale),
    isSelected: days[0]?.isSelected && true,
    shifts: days[0]?.isSelected ? JSON.parse(JSON.stringify(shifts)) : [],
  },
  {
    id: 1,
    name: dayIndexEquivalent(1, locale),
    isSelected: days[1]?.isSelected && true,
    shifts: days[1]?.isSelected ? JSON.parse(JSON.stringify(shifts)) : [],
  },
  {
    id: 2,
    name: dayIndexEquivalent(2, locale),
    isSelected: days[2]?.isSelected && true,
    shifts: days[2]?.isSelected ? JSON.parse(JSON.stringify(shifts)) : [],
  },
  {
    id: 3,
    name: dayIndexEquivalent(3, locale),
    isSelected: days[3]?.isSelected && true,
    shifts: days[3]?.isSelected ? JSON.parse(JSON.stringify(shifts)) : [],
  },
  {
    id: 4,
    name: dayIndexEquivalent(4, locale),
    isSelected: days[4]?.isSelected && true,
    shifts: days[4]?.isSelected ? JSON.parse(JSON.stringify(shifts)) : [],
  },
  {
    id: 5,
    name: dayIndexEquivalent(5, locale),
    isSelected: days[5]?.isSelected && true,
    shifts: days[5]?.isSelected ? JSON.parse(JSON.stringify(shifts)) : [],
  },
  {
    id: 6,
    name: dayIndexEquivalent(6, locale),
    isSelected: days[6]?.isSelected && true,
    shifts: days[6]?.isSelected ? JSON.parse(JSON.stringify(shifts)) : [],
  },
];

export const defaultShift = [{ startTime: '12:00:00', endTime: '20:00:00', id: 0 }];

export const handleDefaultAndBindingDays = (arrayofDays, locale) => {
  if (!arrayofDays.length) {
    return defaultHoursObject(locale);
  }

  return mainHoursObject(locale).map((day) => {
    let newShiftsArray = [];
    if (arrayofDays.find((newDay) => day.id === newDay.day)?.shifts) {
      if (arrayofDays.find((newDay) => day.id === newDay.day)?.shifts?.map) {
        newShiftsArray = arrayofDays
          .find((newDay) => day.id === newDay.day)
          ?.shifts?.map((singleShift) => {
            if (singleShift?.isNextDay) {
              const newEndTime = [
                +singleShift?.endTime?.split(':')[0] + 24,
                singleShift?.endTime?.split(':')[1],
                singleShift?.endTime?.split(':')[2],
              ];
              return { ...singleShift, endTime: newEndTime.join(':') };
            }
            return { ...singleShift };
          });
      }
    }
    return {
      ...day,
      ...arrayofDays.find((newDay) => day.id === newDay.day),
      shifts: newShiftsArray,
      isSelected: !!arrayofDays.find((newDay) => day.id === newDay.day),
    };
  });
};

export const handleDefaultAndBindingDaysWithOneShift = (arrayofDays, locale) => {
  if (!arrayofDays.length) {
    return defaultHoursObjectWithOneShift(locale);
  }

  return mainHoursObject(locale).map((day) => {
    let newShiftsArray = [];
    if (arrayofDays.find((newDay) => day.id === newDay.day)?.shifts) {
      if (arrayofDays.find((newDay) => day.id === newDay.day)?.shifts?.map) {
        newShiftsArray = arrayofDays
          .find((newDay) => day.id === newDay.day)
          ?.shifts?.map((singleShift) => {
            if (singleShift?.isNextDay) {
              const newEndTime = [
                +singleShift?.endTime?.split(':')[0] + 24,
                singleShift?.endTime?.split(':')[1],
                singleShift?.endTime?.split(':')[2],
              ];
              return { ...singleShift, endTime: newEndTime.join(':') };
            }
            return { ...singleShift };
          });
      }
    }
    return {
      ...day,
      ...arrayofDays.find((newDay) => day.id === newDay.day),
      shifts: newShiftsArray,
      isSelected: !!arrayofDays.find((newDay) => day.id === newDay.day),
    };
  });
};
