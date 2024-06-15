import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from 'providers/UserProvider';
import { Row } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { BookingDateContext } from 'providers/BookingDateProvider';
import { eventStatus } from 'functions/statusColor';
import moment from 'moment';
import { toast } from 'react-toastify';
import {
  BOOKING_GET_CALENDAR_SERVICES,
  BOOKING_SERVICES_LIST,
  UPDATE_BOOKING_SERVICE_DURATION,
  UPDATE_BOOKING_SERVICE_SLOT,
  SP_WORKING_DAYS,
  EMP_WORKING_BY_DATE,
} from 'utils/API/EndPoints/CalendarEP';
import { EMP_GET_ODATA } from 'utils/API/EndPoints/EmployeeEP';
import { CallAPI } from '../../../utils/API/APIConfig';
import { AskCompleteInfoModal } from '../../LoginForm/AskCompleteInfoModal';
import ListView from './commonViewsBooking/ListView/ListView';
import CalendarView from './commonViewsBooking/CalendarView/CalendarView';
import BookingHeader from './BookingHeader/BookingHeader';

const Booking = () => {
  moment.locale('en');
  const { messages } = useIntl();
  const { User } = useContext(UserContext);
  const [openCompleteInfo, setOpenCompleteInfo] = useState(false);
  const { selectedDate, setSelectedDate } = useContext(BookingDateContext);
  const [calendarView, setCalendarView] = useState(
    localStorage.getItem('intialView')
      ? localStorage.getItem('intialView')
      : 'resourceTimeGridDay',
  );
  const [showCalendar, setShowCalendar] = useState(true);
  const [allEmp, setAllEmp] = useState([]);
  const [services, setServices] = useState([]);
  const [resourcesEmployee, setResourcesEmployee] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(
    localStorage.getItem('calendarStatus')
      ? JSON.parse(localStorage.getItem('calendarStatus'))
      : [1, 2, 3, 6, 4, 7],
  );
  const [selectedEmps, setSelectedEmps] = useState(
    localStorage.getItem('calendarEmp')
      ? JSON.parse(localStorage.getItem('calendarEmp'))
      : [],
  );
  const [allEmpData, setAllEmpData] = useState([]);
  const [workingEmp, setWorkingEmp] = useState([]);
  const [workingEmpIsSelected, setWorkingEmpIsSelected] = useState(
    localStorage.getItem('calendarWorkingEmpSelected')
      ? JSON.parse(localStorage.getItem('calendarWorkingEmpSelected'))
      : false,
  );
  const [allEmpIsSelected, setAllEmpIsSelected] = useState(
    localStorage.getItem('calendarAllEmpSelected')
      ? JSON.parse(localStorage.getItem('calendarAllEmpSelected'))
      : false,
  );
  const [dataForEmp, setDataForEmp] = useState([]);
  const [updatedServicePayload, setUpdatedServicePayload] = useState(null);
  const [resizedServicePayload, setResizedServicePayload] = useState(null);
  const [objectRevertMove, setObjectRevertMove] = useState(null);
  const [businessHours, setBusinessHours] = useState([]);
  const [stopAutoRefetch, setStopAutoRefetch] = useState(false);
  const [stopScrollToTimeNow, setStopScrollToTimeNow] = useState(false);
  const [callWorkHoursForSalon, setCallWorkHoursForSalon] = useState(false);

  const returnCorrectFormatEndTime = (endTime, nextDay) => {
    const splitTime = endTime?.split(':');
    if (+splitTime[0] === 0 && nextDay) {
      return `24:${splitTime[1]}:${splitTime[2]}`;
    }
    if (+splitTime[0] > 0 && nextDay) {
      return `${24 + +splitTime[0].replace(/^0+/, '')}:${splitTime[1]}:${splitTime[2]}`;
    }
    return endTime;
  };
  const {
    data: allServicesData,
    refetch: getDayBookings,
    isFetching: gettingDayBookings,
  } = CallAPI({
    name: [
      'getBookings',
      selectedDate?.start,
      selectedDate?.end,
      selectedStatus,
      selectedEmps,
    ],
    url: BOOKING_GET_CALENDAR_SERVICES,
    method: 'post',
    refetchOnWindowFocus: false,
    enabled: true,
    refetchInterval: !stopAutoRefetch ? 60000 : false,
    body: {
      startDate: selectedDate.start,
      endDate: selectedDate.end,
      employeeIds: selectedEmps?.length ? selectedEmps : null,
      bookingStatus: selectedStatus?.length ? selectedStatus : null,
    },
    onSuccess: (res) => {
      setTimeout(() => {
        setStopScrollToTimeNow(true);
      }, 500);
      setServices([]);
      setResourcesEmployee([]);
      res.calendarDays.forEach((allData) => {
        allData.calendarDayEmployees.forEach((servicesCommonData) => {
          servicesCommonData.bookedServices.forEach(
            (serData) =>
              // setup the services to calendar
              setServices((current) => [
                ...current,
                {
                  resourceId: servicesCommonData.employeeId,
                  id: serData.serviceId,
                  icon: 'cutlery',
                  title: `${serData.customerName}`,
                  start: `${allData.date.split('T')[0]}T${
                    serData.serviceStart.split('T')[1]
                  }`,
                  end: `${allData.date.split('T')[0]}T${
                    serData.serviceEnd.split('T')[1]
                  }`,
                  bookingData: serData,
                  empData: servicesCommonData,
                  overlap: true,
                  classNames: eventStatus(serData.statusId),
                  durationEditable:
                    (serData.statusId === 1 || serData.statusId === 4) &&
                    !serData?.isHome,
                  //   event can move or resize if status confirm or pending and salon only
                  constraint: {
                    resourceIds: [],
                    daysOfWeek:
                      (serData.statusId === 1 || serData.statusId === 4) &&
                      !serData?.isHome
                        ? null
                        : [],
                  },
                  resourceEditable: true,
                  // resourceEditable:
                  //   allData.bookingDate.split('T')[0] >= moment(new Date()).format('YYYY-MM-DD'),
                },
              ]),
            // setup the employees to calendar day view
            setResourcesEmployee((emp) => [
              ...emp,
              {
                title: servicesCommonData.employeeName,
                id: servicesCommonData.employeeId,
                image: servicesCommonData.image,
                // bookingDate: allData.date,
                extendedProps: servicesCommonData,
                businessHours: servicesCommonData?.employeeWorkDayShifts?.map((data) => ({
                  startTime: data?.shiftStart,
                  endTime: returnCorrectFormatEndTime(
                    data?.shiftEnd,
                    data?.shiftEndInNextDay,
                  ),
                  daysOfWeek: [moment(selectedDate?.start).day()],
                  shiftEndInNextDay: data?.shiftEndInNextDay,
                })),
              },
            ]),
          );
        });
      });
    },
    select: (res) => res?.data?.data,
    onError: (err) => {
      toast.error(err?.response?.data?.error?.message);
      setServices([]);
      setResourcesEmployee([]);
    },
  });
  /* -------------------------------------------------------------------------- */
  /*         get emp for select box  and show them in calendar resources        */
  /* -------------------------------------------------------------------------- */
  CallAPI({
    name: ['getAllEmpForDD', selectedDate.start, selectedDate.end],
    url: 'EmployeeWorkDay/Get',
    enabled: true,
    query: {
      startDate: selectedDate.start,
      endDate: selectedDate.end,
    },
    body: [],
    refetchOnWindowFocus: false,
    onSuccess: (res) => {
      if (res) {
        const allEmployees = JSON.parse(JSON.stringify(res)).map((d) => ({
          ...d,
          title: d?.name,
          text: d?.name,
          key: d?.employeeId,
          id: d?.employeeId,
          businessHours: d?.employeesWorkDays
            ?.map((empData) => {
              if (empData?.shifts?.length > 0) {
                return empData?.shifts?.map((shift) => ({
                  daysOfWeek: [empData?.day],
                  startTime: shift?.startTime,
                  endTime: returnCorrectFormatEndTime(shift?.endTime, shift?.isNextDay),
                }));
              }
              return {
                daysOfWeek: [],
              };
            })
            ?.flat(),
        }));
        setAllEmp(allEmployees);
        setAllEmpData(
          allEmployees
            ?.filter((emp) => selectedEmps.includes(emp?.employeeId))
            ?.map((emp) => ({
              id: emp?.employeeId,
              name: emp?.name,
              text: emp?.name,
              image: emp?.image,
              businessHours: emp?.employeesWorkDays
                ?.map((data) => {
                  if (data?.shifts?.length > 0) {
                    return data?.shifts?.map((shift) => ({
                      daysOfWeek: [data?.day],
                      startTime: shift?.startTime,
                      endTime: returnCorrectFormatEndTime(
                        shift?.endTime,
                        shift?.isNextDay,
                      ),
                    }));
                  }
                  return {
                    daysOfWeek: [],
                  };
                })
                ?.flat(),
            })),
        );
        setDataForEmp(
          allEmployees?.map((emp) => ({
            id: emp?.employeeId,
            name: emp?.name,
            image: emp?.image,
            businessHours: emp?.businessHours,
            title: emp?.name,
          })),
        );
        const workingEmpByDate = JSON.parse(JSON.stringify(res))
          .map((result) => ({
            ...result?.employeesWorkDays?.find(
              (day) =>
                (+moment(selectedDate?.start).day() <= +day?.day ||
                  +day?.day <= +moment(selectedDate?.end).day()) &&
                day?.shifts?.length > 0,
            ),
            emptitle: result?.empTitle,
            employeeId: result?.employeeId,
            image: result?.image,
            name: result?.name,
          }))
          ?.filter((finalResult) => finalResult?.shifts?.length)
          ?.map((bussiness) => ({
            ...bussiness,
            businessHours: bussiness?.shifts?.map((shift) => ({
              ...shift,
              daysOfWeek: [moment(selectedDate?.start).day()],
            })),
          }));
        if (
          workingEmpIsSelected &&
          workingEmp.every((elem) => selectedEmps.includes(elem?.employeeId))
        ) {
          setSelectedEmps([]);
          setAllEmpData([]);
          workingEmpByDate?.forEach((state) => {
            setSelectedEmps((current) => [...current, +state?.employeeId]);
          });
          workingEmpByDate?.forEach((state) => {
            setAllEmpData((current) => [
              ...current,
              {
                id: +state?.employeeId,
                title: state?.name,
                name: state?.name,
                image: state?.image,
                businessHours: state?.businessHours,
              },
            ]);
          });
        }
        setWorkingEmp(workingEmpByDate);
      }
    },
    select: (data) => data.data?.data,
  });

  /* -------------------------------------------------------------------------- */
  /*                             when update booking                            */
  /* -------------------------------------------------------------------------- */
  CallAPI({
    name: ['updateService', updatedServicePayload],
    url: UPDATE_BOOKING_SERVICE_SLOT,
    method: 'put',
    refetchOnWindowFocus: false,
    enabled: !!updatedServicePayload,
    query: {
      ...updatedServicePayload,
    },
    select: (data) => data?.data?.data?.success,
    onSuccess: (res) => {
      if (res) {
        setStopAutoRefetch(false);
        toast.success(messages['common.edited.success']);
        setObjectRevertMove(null);
        setUpdatedServicePayload(null);
      }
    },
    onError: (err) => {
      setStopAutoRefetch(false);
      toast.error(err?.response?.data?.error?.message);
      objectRevertMove.revert();
      setUpdatedServicePayload(null);
    },
  });

  /* -------------------------------------------------------------------------- */
  /*                            resizez service time                            */
  /* -------------------------------------------------------------------------- */
  CallAPI({
    name: ['resizeService', !!resizedServicePayload],
    url: UPDATE_BOOKING_SERVICE_DURATION,
    method: 'put',
    refetchOnWindowFocus: false,
    enabled: !!resizedServicePayload,
    query: {
      ...resizedServicePayload,
    },
    onSuccess: (res) => {
      if (res) {
        setStopAutoRefetch(false);
        toast.success(messages['common.edited.success']);
        setObjectRevertMove(null);
        setResizedServicePayload(null);
      }
    },
    select: (data) => data?.data?.data?.success,
    onError: (err) => {
      setStopAutoRefetch(false);
      toast.error(err?.response?.data?.error?.message);
      objectRevertMove.revert();
      setResizedServicePayload(null);
    },
  });

  /* -------------------------------------------------------------------------- */
  /*                       get the  booking services list                       */
  /* -------------------------------------------------------------------------- */
  const {
    refetch: refetchBookingList,
    data: BookingListRes,
    isFetching: fetchServiceList,
  } = CallAPI({
    name: [
      'bookingListCall',
      selectedDate?.start,
      selectedDate?.end,
      selectedStatus,
      selectedEmps,
    ],
    url: BOOKING_SERVICES_LIST,
    method: 'post',
    refetchOnWindowFocus: false,
    refetchInterval: !stopAutoRefetch ? 60000 : false,
    enabled: true,
    body: {
      startDate: selectedDate.start,
      endDate: selectedDate.end,
      employees: selectedEmps?.length ? selectedEmps : null,
      statues: selectedStatus?.length ? selectedStatus : null,
    },
    select: (data) => data.data?.data?.list,
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });

  /* -------------------------------------------------------------------------- */
  /*                       get working hours for the salon                      */
  /* -------------------------------------------------------------------------- */
  CallAPI({
    name: ['workingHoursForSalon', selectedDate?.start, selectedDate?.end],
    url: SP_WORKING_DAYS,
    method: 'get',
    refetchOnWindowFocus: false,
    enabled: callWorkHoursForSalon,
    query: {
      startDate: selectedDate.start,
      endDate: selectedDate.end,
    },
    onSuccess: (res) => {
      setBusinessHours([]);
      if (res) {
        res?.forEach((date) =>
          date?.dayShifts?.forEach((shift) =>
            setBusinessHours((current) => [
              ...current,
              {
                daysOfWeek: [date.dayOfWeek],
                startTime: shift?.startTime,
                endTime: returnCorrectFormatEndTime(shift?.endTime, shift?.isNextDay),
              },
            ]),
          ),
        );
      }
    },
    select: (data) => data.data?.data?.daysWorkHours,
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });

  //   when change the full calendar view
  useEffect(() => {
    if (showCalendar) {
      if (allEmp?.length) {
        // setAllEmpIsSelected(true);
        // setWorkingEmpIsSelected(false);
        // setSelectedEmps(allEmp?.map((emp) => emp?.id));
        setAllEmpData(
          allEmp?.map((emp) => ({
            id: emp?.id,
            title: emp?.name,
            name: emp?.name,
            image: emp?.image,
            businessHours: emp?.businessHours,
          })),
        );
      }
    }
    if (calendarView === 'timeGridWeek') {
      setSelectedDate({
        ...selectedDate,
        start: moment(selectedDate.start)
          .startOf('week')
          .format('YYYY-MM-DD'),
        end: moment(selectedDate.start)
          .endOf('week')
          .format('YYYY-MM-DD'),
      });
    }
    if (calendarView === 'dayGridMonth') {
      setSelectedDate({
        ...selectedDate,
        start: moment(selectedDate.start)
          .startOf('month')
          .format('YYYY-MM-DD'),
        end: moment(selectedDate.start)
          .endOf('month')
          .format('YYYY-MM-DD'),
      });
    }
    if (calendarView === 'resourceTimeGridDay') {
      const [lastSelectedDate, start, end] = [
        moment(selectedDate.lastSelectedDate),
        moment(selectedDate.start),
        moment(selectedDate.end),
      ];
      if (
        lastSelectedDate.isBetween(start, end) ||
        lastSelectedDate.isSame(start) ||
        lastSelectedDate.isSame(end)
      ) {
        setSelectedDate({
          ...selectedDate,
          start: lastSelectedDate.format('YYYY-MM-DD'),
          end: lastSelectedDate.format('YYYY-MM-DD'),
        });
      } else {
        setSelectedDate({
          ...selectedDate,
          start: start.format('YYYY-MM-DD'),
          end: start.format('YYYY-MM-DD'),
        });
      }
    }
    if (calendarView === 'timeGridFourDay') {
      setSelectedDate({
        ...selectedDate,
        start: moment(selectedDate.start).format('YYYY-MM-DD'),
        end: moment(selectedDate.start)
          .add(2, 'days')
          .format('YYYY-MM-DD'),
      });
    }
  }, [calendarView]);

  const prevPickerBtnClicked = (e) => {
    if (calendarView === 'timeGridWeek') {
      setSelectedDate({
        ...selectedDate,
        start: moment(selectedDate.start)
          .subtract(7, 'days')
          .format('YYYY-MM-DD'),
        end: moment(selectedDate.end)
          .subtract(7, 'days')
          .format('YYYY-MM-DD'),
      });
    }
    if (calendarView === 'resourceTimeGridDay') {
      setSelectedDate({
        lastSelectedDate: moment(selectedDate.start)
          .subtract(1, 'days')
          .format('YYYY-MM-DD'),
        start: moment(selectedDate.start)
          .subtract(1, 'days')
          .format('YYYY-MM-DD'),
        end: moment(selectedDate.start)
          .subtract(1, 'days')
          .format('YYYY-MM-DD'),
      });
    }
    if (calendarView === 'timeGridFourDay') {
      setSelectedDate({
        ...selectedDate,
        start: moment(selectedDate.start)
          .subtract(3, 'days')
          .format('YYYY-MM-DD'),
        end: moment(selectedDate.end)
          .subtract(3, 'days')
          .format('YYYY-MM-DD'),
      });
    }
  };

  const nextPickerBtnClicked = (e) => {
    if (calendarView === 'timeGridWeek') {
      setSelectedDate({
        ...selectedDate,
        start: moment(selectedDate.start)
          .add(7, 'days')
          .format('YYYY-MM-DD'),
        end: moment(selectedDate.end)
          .add(7, 'days')
          .format('YYYY-MM-DD'),
      });
    }
    if (calendarView === 'resourceTimeGridDay') {
      setSelectedDate({
        lastSelectedDate: moment(selectedDate.start)
          .add(1, 'days')
          .format('YYYY-MM-DD'),
        start: moment(selectedDate.start)
          .add(1, 'days')
          .format('YYYY-MM-DD'),
        end: moment(selectedDate.start)
          .add(1, 'days')
          .format('YYYY-MM-DD'),
      });
    }
    if (calendarView === 'timeGridFourDay') {
      setSelectedDate({
        ...selectedDate,
        start: moment(selectedDate.start)
          .add(3, 'days')
          .format('YYYY-MM-DD'),
        end: moment(selectedDate.end)
          .add(3, 'days')
          .format('YYYY-MM-DD'),
      });
    }
  };

  //   when change filter or view make scroll to time now works again
  useEffect(() => {
    if (selectedDate?.start || selectedStatus || selectedEmps || calendarView) {
      setStopScrollToTimeNow(false);
    }
  }, [selectedDate, selectedStatus, selectedEmps, calendarView]);

  useEffect(() => {
    if (selectedStatus) {
      localStorage?.setItem('calendarStatus', JSON.stringify(selectedStatus));
      localStorage?.setItem('calendarAllEmpSelected', JSON.stringify(allEmpIsSelected));
      localStorage?.setItem(
        'calendarWorkingEmpSelected',
        JSON.stringify(workingEmpIsSelected),
      );
    }
  }, [selectedStatus, workingEmpIsSelected, allEmpIsSelected]);

  useEffect(() => {
    if (selectedEmps) {
      localStorage?.setItem('calendarEmp', JSON.stringify(selectedEmps));
    }
  }, [selectedEmps]);
  // return scroll to now time to work due to refresh the calendar automatically
  useEffect(() => {
    if (gettingDayBookings) {
      setStopScrollToTimeNow(false);
    }
  }, [gettingDayBookings]);

  //   prevent call  the working days twice
  useEffect(() => {
    setCallWorkHoursForSalon(true);
  }, []);

  useEffect(() => {
    if (User && User?.userData) {
      if ('profileCompleted' in User?.userData && !User?.userData?.profileCompleted) {
        setOpenCompleteInfo(true);
      }
    }
  }, [User]);

  return (
    <>
      <section style={{ marginTop: '-15px' }}>
        <Row className="booking-headers">
          <BookingHeader
            getDayBookings={getDayBookings}
            calendarView={calendarView}
            setShowCalendar={setShowCalendar}
            showCalendar={showCalendar}
            setSelectedDate={setSelectedDate}
            selectedDate={selectedDate}
            setCalendarView={setCalendarView}
            setSelectedStatus={setSelectedStatus}
            selectedStatus={selectedStatus}
            allEmp={allEmp}
            selectedEmps={selectedEmps}
            setSelectedEmps={setSelectedEmps}
            setAllEmpData={setAllEmpData}
            allEmpData={allEmpData}
            prevPickerBtnClicked={prevPickerBtnClicked}
            nextPickerBtnClicked={nextPickerBtnClicked}
            workingEmp={workingEmp}
            setWorkingEmpIsSelected={setWorkingEmpIsSelected}
            workingEmpIsSelected={workingEmpIsSelected}
            setAllEmpIsSelected={setAllEmpIsSelected}
            allEmpIsSelected={allEmpIsSelected}
          />
        </Row>
        <div className="booking-body">
          {showCalendar ? (
            <CalendarView
              selectedDate={selectedDate}
              newServices={services}
              getDayBookings={getDayBookings}
              // fetchWorkingEmp={fetchWorkingEmp}
              resourcesEmployee={resourcesEmployee}
              gettingDayBookings={gettingDayBookings}
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
            <ListView
              BookingListRes={BookingListRes}
              fetchServiceList={fetchServiceList}
            />
          )}
        </div>
      </section>
      <AskCompleteInfoModal
        openModal={openCompleteInfo}
        setOpenModal={setOpenCompleteInfo}
      />
    </>
  );
};

export default Booking;

// Confirmed = 1,
// Closed = 3 = completed
// Cancelled = 2,
// Pending = 4,
// PaymentCancelled = 5,
// NoShow = 6,
// ReservedForCustomer = 7
// lw 3ayz kol el employees eb3t null
// lw 3ayz filter, eb3t array feha item wa7da aw aktr
// lw array b kol el employeeids zy blzbt el null
