/* eslint-disable  */

import { convertTimeToNum } from 'constants/hours';
import moment from 'moment';
export const getCurrentServiceByOptionId = ({ id, allCategories }) => {
  if (id && allCategories) {
    const allServ = JSON.parse(JSON.stringify(allCategories))
      ?.map((servi) => servi?.categoryServices)
      .flat();
    return allServ?.find((serv) => serv?.selectId === id);
  }
  return 0;
};

export const handleStartTimeAndStartDate = (time, date) => {
  const currentDate = moment(date);
  const addMinutsToDate = moment(date).add(convertTimeToNum(time), 'm');
  const timeSpliting = time.split(':');
  timeSpliting.splice(0, 1, `0${(timeSpliting[0] - 24).toString()}`);
  if (addMinutsToDate.diff(currentDate, 'days')) {
    return {
      startTime: timeSpliting.join(':'),
      startDate: addMinutsToDate.format('YYYY-MM-DD'),
    };
  }
  return {
    startTime: time,
    startDate: date,
  };
};

export const firstAvailableEmployee = ({
  allEmployees,
  availableEmployees,
  selectedCalendar,
}) => {
  if (!!availableEmployees?.length) {
    const firstEmployeeAvailable = allEmployees?.find(
      (emp) => emp.id === availableEmployees[0],
    );
    if (selectedCalendar) return { employeeId: selectedCalendar };
    if (firstEmployeeAvailable) {
      return {
        employee: firstEmployeeAvailable,
        employeeId: firstEmployeeAvailable?.id,
        employeeName: firstEmployeeAvailable?.name,
      };
    }
    return {
      employee: allEmployees[0],
      employeeId: allEmployees[0].id,
      employeeName: allEmployees[0].name,
    };
  }
  return {
    employee: allEmployees[0],
    employeeId: allEmployees[0].id,
    employeeName: allEmployees[0].name,
  };
};

export const getTimeDurationInOldService = (array) => {
  if (array.length === 0) {
    return 0;
  }
  return array.pop().durationInMinutes + getTimeDurationInOldService(array);
};
