/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import EmployeeAndStatusFilter from './components/EmployeeAndStatusFilter';
import DateFilter from './components/DateFilter';
import ChangeViewsAndAdd from './components/ChangeViewsAndAdd';
import { FilterModal } from './FilterModal';

export default function BookingHeaderSp({
  getDayBookings,
  calendarView,
  setShowCalendar,
  showCalendar,
  setSelectedDate,
  selectedDate,
  setCalendarView,
  selectedStatus,
  setSelectedStatus,
  allEmp,
  selectedEmps,
  setSelectedEmps,
  setAllEmpData,
  allEmpData,
  prevPickerBtnClicked,
  nextPickerBtnClicked,
  workingEmp,
  setWorkingEmpIsSelected,
  workingEmpIsSelected,
  setAllEmpIsSelected,
  allEmpIsSelected,
}) {
  const { messages } = useIntl();
  const [openFilters, setOpenFilters] = useState(false);

  const calendarViewsChoose = [
    {
      key: 0,
      id: 'resourceTimeGridDay',
      text: messages['calendar.one.day.view'],
    },
    {
      key: 1,
      id: 'timeGridFourDay',
      text: messages['calendar.three.day.view'],
    },
    {
      key: 2,
      id: 'timeGridWeek',
      text: messages['calendar.week.view'],
    },
  ];

  const bookingStatusChoose = [
    {
      key: 0,
      id: 1,
      value: 1,
      label: messages['calendar.status.Confirmed'],
    },
    {
      key: 1,
      id: 3,
      valu: 3,
      label: messages['calendar.status.Completed'],
    },
    {
      key: 2,
      id: 4,
      valu: 4,
      label: messages['calendar.status.Pending'],
    },
    {
      key: 3,
      id: 2,
      valu: 2,
      label: messages['calendar.status.Canceled'],
    },
    {
      key: 4,
      id: 6,
      valu: 6,
      label: messages['calendar.status.NoShow'],
    },
    {
      key: 5,
      id: 7,
      valu: 7,
      label: messages['calendar.status.reserveCustomer'],
    },
  ];

  return (
    <>
      <Col xs="auto" className="booking-headers_start">
        <button
          type="button"
          onClick={() => {
            setOpenFilters(true);
          }}
          className="filters"
        >
          <SVG src={toAbsoluteUrl('/filters.svg')} />
          {messages['setting.customer.profile.filters']}
        </button>
      </Col>
      <Col xs="auto" className="booking-headers_middle">
        <DateFilter
          calendarView={calendarView}
          setSelectedDate={setSelectedDate}
          selectedDate={selectedDate}
          getDayBookings={getDayBookings}
          prevPickerBtnClicked={prevPickerBtnClicked}
          nextPickerBtnClicked={nextPickerBtnClicked}
        />
      </Col>
      <FilterModal
        setOpenFilters={setOpenFilters}
        openFilters={openFilters}
        calendarViewsChoose={calendarViewsChoose}
        calendarView={calendarView}
        setCalendarView={setCalendarView}
        allEmp={allEmp}
        setSelectedEmps={setSelectedEmps}
        setAllEmpData={setAllEmpData}
        allEmpData={allEmpData}
        selectedEmps={selectedEmps}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        bookingStatusChoose={bookingStatusChoose}
        workingEmp={workingEmp}
        setWorkingEmpIsSelected={setWorkingEmpIsSelected}
        workingEmpIsSelected={workingEmpIsSelected}
        setAllEmpIsSelected={setAllEmpIsSelected}
        allEmpIsSelected={allEmpIsSelected}
      />
    </>
  );
}
