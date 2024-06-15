import { dayIndexEquivalent } from '../../../../functions/timeFunctions';
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

export const copyAllHoursObject = (shifts, current) =>
  current.map((day) =>
    day.isSelected ? { ...day, shifts: JSON.parse(JSON.stringify(shifts)) } : day,
  );

export const defaultShift = [{ startTime: '12:00:00', endTime: '20:00:00', id: 0 }];

export const handleDefaultAndBindingDays = (arrayofDays, locale) => {
  if (!arrayofDays.length) {
    return defaultHoursObject(locale);
  }

  return mainHoursObject(locale).map((day) => ({
    ...day,
    ...arrayofDays.find((newDay) => day.id === newDay.day),
    isSelected: !!arrayofDays.find((newDay) => day.id === newDay.day),
  }));
};
