/* eslint-disable react/prop-types */
import React from 'react';
import { useIntl } from 'react-intl';
import FullCalendarSp from './FullCalendarSp';

export default function CalendarViewSp({
  selectedDate,
  resourcesEmployee,
  newServices,
  getDayBookings,
  fetchWorkingEmp,
  gettingDayBookings,
  setUpdatedServicePayload,
  setObjectRevertMove,
  businessHours,
  setResizedServicePayload,
  objectRevertMove,
  calendarView,
  setStopAutoRefetch,
  allEmpData,
  dataForEmp,
  workingEmpIsSelected,
  setStopScrollToTimeNow,
  stopScrollToTimeNow,
}) {
  const { messages, locale } = useIntl();

  return (
    <div>
      {!gettingDayBookings && !fetchWorkingEmp ? (
        <FullCalendarSp
          bookingDate={selectedDate}
          resourcesEmployee={resourcesEmployee}
          mapDayBooking={newServices}
          locale={locale}
          getDayBookings={getDayBookings}
          setUpdatedServicePayload={setUpdatedServicePayload}
          setObjectRevertMove={setObjectRevertMove}
          businessHours={businessHours}
          setResizedServicePayload={setResizedServicePayload}
          objectRevertMove={objectRevertMove}
          calendarView={calendarView}
          setStopAutoRefetch={setStopAutoRefetch}
          allEmpData={allEmpData}
          dataForEmp={dataForEmp}
          workingEmpIsSelected={workingEmpIsSelected}
          setStopScrollToTimeNow={setStopScrollToTimeNow}
          stopScrollToTimeNow={stopScrollToTimeNow}
        />
      ) : (
        <div className="lds-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      )}
    </div>
  );
}