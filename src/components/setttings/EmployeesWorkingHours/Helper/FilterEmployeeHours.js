/* -------------------------------------------------------------------------- */
/*      to handle the empty array come from emp before make working time      */
/* -------------------------------------------------------------------------- */
export const filterEmpHours = (empWorkingTimes) => {
  const mirrorDefaultTime = [
    {
      id: Math.floor(Math.random() * 10000),
      day: 0,
      startTime: null,
      endtime: null,
      isActive: false,
    },
    {
      id: Math.floor(Math.random() * 10000),
      day: 1,
      startTime: null,
      endtime: null,
      isActive: false,
    },
    {
      id: Math.floor(Math.random() * 10000),
      day: 2,
      startTime: null,
      endtime: null,
      isActive: false,
    },
    {
      id: Math.floor(Math.random() * 10000),
      day: 3,
      startTime: null,
      endtime: null,
      isActive: false,
    },
    {
      id: Math.floor(Math.random() * 10000),
      day: 4,
      startTime: null,
      endtime: null,
      isActive: false,
    },
    {
      id: Math.floor(Math.random() * 10000),
      day: 5,
      startTime: null,
      endtime: null,
      isActive: false,
    },
    {
      id: Math.floor(Math.random() * 10000),
      day: 6,
      startTime: null,
      endtime: null,
      isActive: false,
    },
  ];
  if (+empWorkingTimes.length === 7) return empWorkingTimes;
  return mirrorDefaultTime.map((item1) =>
    Object.assign(
      item1,
      empWorkingTimes.find((item2) => item2 && item1.day === item2.day),
    ),
  );
};
