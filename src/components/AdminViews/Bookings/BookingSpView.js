/* eslint-disable no-nested-ternary */
/* eslint-disable indent */
import React, { useContext, useEffect, useState } from 'react';
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
import { useHistory, useLocation } from 'react-router-dom';
import { CallAPI } from '../../../utils/API/APIConfig';
import ListView from './commonViewsBooking/ListView/ListView';
import CalendarViewSp from './commonViewsBooking/CalendarView/CalendarViewSp';
import BookingHeaderSp from './BookingHeader/BookingHeaderSp';

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const BookingSpView = () => {
  moment.locale('en');
  const query = useQuery();
  const { messages } = useIntl();
  const history = useHistory();
  const { selectedDate, setSelectedDate } = useContext(BookingDateContext);
  const [showCalendar, setShowCalendar] = useState(true);
  const [allEmp, setAllEmp] = useState([]);
  const [services, setServices] = useState([]);
  const [resourcesEmployee, setResourcesEmployee] = useState([]);
  const [allEmpData, setAllEmpData] = useState([]);
  const [workingEmp, setWorkingEmp] = useState([]);
  const [dataForEmp, setDataForEmp] = useState([]);
  const [updatedServicePayload, setUpdatedServicePayload] = useState(null);
  const [resizedServicePayload, setResizedServicePayload] = useState(null);
  const [objectRevertMove, setObjectRevertMove] = useState(null);
  const [businessHours, setBusinessHours] = useState([]);
  const [stopAutoRefetch, setStopAutoRefetch] = useState(false);
  const [stopScrollToTimeNow, setStopScrollToTimeNow] = useState(false);
  const [firstDataGetForApi, setFirstDataGetForApi] = useState(false);
  const [calendarView, setCalendarView] = useState(query.get('initialView'));
  const [workingEmpIsSelected, setWorkingEmpIsSelected] = useState(
    !firstDataGetForApi ? JSON.parse(query.get('workingEmpSelection')) : false,
  );
  const [allEmpIsSelected, setAllEmpIsSelected] = useState(
    !firstDataGetForApi ? JSON.parse(query.get('allEmpSelection')) : false,
  );
  const [selectedEmps, setSelectedEmps] = useState(
    !firstDataGetForApi
      ? query.get('selectedEmpIds')?.includes(null)
        ? []
        : JSON.parse(query.get('selectedEmpIds'))
      : [],
  );
  const [selectedStatus, setSelectedStatus] = useState(
    !firstDataGetForApi ? JSON.parse(query.get('status')) : [1, 2, 3, 6, 4, 7],
  );
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
  const addDatesAndCalendarViewToUrlQuery = (
    startDate,
    endDate,
    calendyView,
    status,
    selectedEmpIds,
    allEmpSelection,
    workingEmpSelection,
    firstCallForApi,
  ) => {
    history.push({
      pathname: history?.pathname,
      search: `?mobileView=true&&startDate=${
        firstCallForApi ? startDate : query.get('startDate')
      }&&endDate=${firstCallForApi ? endDate : query.get('endDate')}&&initialView=${
        firstCallForApi ? calendyView : query.get('initialView')
      }&&status=${
        firstCallForApi ? JSON.stringify(status) : query.get('status')
      }&&selectedEmpIds=${
        firstCallForApi ? JSON.stringify(selectedEmpIds) : query.get('selectedEmpIds')
      }&&allEmpSelection=${
        firstCallForApi ? JSON.stringify(allEmpSelection) : query.get('allEmpSelection')
      }&&workingEmpSelection=${
        firstCallForApi
          ? JSON.stringify(workingEmpSelection)
          : query.get('workingEmpSelection')
      }&&locale=${query.get('locale')}&&selectedBranches=${query.get(
        'selectedBranches',
      )}&&auth=${query.get('auth')}`,
    });
  };

  const {
    data: allServicesData,
    refetch: getDayBookings,
    isFetching: gettingDayBookings,
  } = CallAPI({
    name: [
      'getBookingsSP',
      selectedDate?.start,
      selectedDate?.end,
      selectedStatus,
      selectedEmps,
    ],
    url: BOOKING_GET_CALENDAR_SERVICES,
    baseURL: `${process.env.REACT_APP_SP_URL}/api/v1`,
    method: 'post',
    enabled: true,
    refetchOnWindowFocus: false,
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
      setFirstDataGetForApi(true);
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
    name: ['getAllEmpForDDSp', selectedDate.start, selectedDate.end],
    url: 'EmployeeWorkDay/Get',
    enabled: true,
    baseURL: `${process.env.REACT_APP_SP_URL}/api/v1`,
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
    name: ['updateServiceSp', updatedServicePayload],
    url: UPDATE_BOOKING_SERVICE_SLOT,
    baseURL: `${process.env.REACT_APP_SP_URL}/api/v1`,
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
    name: ['resizeServiceSp', !!resizedServicePayload],
    url: UPDATE_BOOKING_SERVICE_DURATION,
    baseURL: `${process.env.REACT_APP_SP_URL}/api/v1`,
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
      'bookingListCallSp',
      selectedDate?.start,
      selectedDate?.end,
      selectedStatus,
      selectedEmps,
    ],
    url: BOOKING_SERVICES_LIST,
    refetchOnWindowFocus: false,
    baseURL: `${process.env.REACT_APP_SP_URL}/api/v1`,
    method: 'post',
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
    name: ['workingHoursForSalonSp', selectedDate?.start, selectedDate?.end],
    url: SP_WORKING_DAYS,
    baseURL: `${process.env.REACT_APP_SP_URL}/api/v1`,
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
      addDatesAndCalendarViewToUrlQuery(
        moment(selectedDate.start)
          .startOf('week')
          .format('YYYY-MM-DD'),
        moment(selectedDate.start)
          .endOf('week')
          .format('YYYY-MM-DD'),
        'timeGridWeek',
        selectedStatus,
        selectedEmps,
        allEmpIsSelected,
        workingEmpIsSelected,
        firstDataGetForApi,
      );
      setSelectedDate({
        start: !firstDataGetForApi
          ? query.get('startDate')
          : moment(selectedDate.start)
              .startOf('week')
              .format('YYYY-MM-DD'),
        end: !firstDataGetForApi
          ? query.get('endDate')
          : moment(selectedDate.start)
              .endOf('week')
              .format('YYYY-MM-DD'),
      });
    }
    if (calendarView === 'dayGridMonth') {
      addDatesAndCalendarViewToUrlQuery(
        moment(selectedDate.start)
          .startOf('month')
          .format('YYYY-MM-DD'),
        moment(selectedDate.start)
          .endOf('month')
          .format('YYYY-MM-DD'),
        'dayGridMonth',
        selectedStatus,
        selectedEmps,
        allEmpIsSelected,
        workingEmpIsSelected,
        firstDataGetForApi,
      );
      setSelectedDate({
        start: !firstDataGetForApi
          ? query.get('startDate')
          : moment(selectedDate.start)
              .startOf('month')
              .format('YYYY-MM-DD'),
        end: !firstDataGetForApi
          ? query.get('endDate')
          : moment(selectedDate.start)
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
          start: !firstDataGetForApi
            ? query.get('startDate')
            : lastSelectedDate.format('YYYY-MM-DD'),
          end: !firstDataGetForApi
            ? query.get('endDate')
            : lastSelectedDate.format('YYYY-MM-DD'),
        });
        addDatesAndCalendarViewToUrlQuery(
          moment(lastSelectedDate).format('YYYY-MM-DD'),
          moment(lastSelectedDate).format('YYYY-MM-DD'),
          'resourceTimeGridDay',
          firstDataGetForApi,
        );
      } else {
        addDatesAndCalendarViewToUrlQuery(
          moment(selectedDate.start).format('YYYY-MM-DD'),
          moment(selectedDate.start).format('YYYY-MM-DD'),
          'resourceTimeGridDay',
          firstDataGetForApi,
        );
        setSelectedDate({
          start: !firstDataGetForApi
            ? query.get('startDate')
            : moment(selectedDate.start).format('YYYY-MM-DD'),
          end: !firstDataGetForApi
            ? query.get('endDate')
            : moment(selectedDate.start).format('YYYY-MM-DD'),
        });
      }
    }
    if (calendarView === 'timeGridFourDay') {
      addDatesAndCalendarViewToUrlQuery(
        moment(selectedDate.start).format('YYYY-MM-DD'),
        moment(selectedDate.start)
          .add(2, 'days')
          .format('YYYY-MM-DD'),
        'timeGridFourDay',
        selectedStatus,
        selectedEmps,
        allEmpIsSelected,
        workingEmpIsSelected,
        firstDataGetForApi,
      );
      setSelectedDate({
        start: !firstDataGetForApi
          ? query.get('startDate')
          : moment(selectedDate.start).format('YYYY-MM-DD'),
        end: !firstDataGetForApi
          ? query.get('endDate')
          : moment(selectedDate.start)
              .add(2, 'days')
              .format('YYYY-MM-DD'),
      });
    }
  }, [calendarView]);

  const prevPickerBtnClicked = () => {
    if (calendarView === 'timeGridWeek') {
      addDatesAndCalendarViewToUrlQuery(
        moment(selectedDate.start)
          .subtract(7, 'days')
          .format('YYYY-MM-DD'),
        moment(selectedDate.end)
          .subtract(7, 'days')
          .format('YYYY-MM-DD'),
        'timeGridWeek',
        selectedStatus,
        selectedEmps,
        allEmpIsSelected,
        workingEmpIsSelected,
        firstDataGetForApi,
      );
      setSelectedDate({
        start: moment(selectedDate.start)
          .subtract(7, 'days')
          .format('YYYY-MM-DD'),
        end: moment(selectedDate.end)
          .subtract(7, 'days')
          .format('YYYY-MM-DD'),
      });
    }
    if (calendarView === 'resourceTimeGridDay') {
      addDatesAndCalendarViewToUrlQuery(
        moment(selectedDate.start)
          .subtract(1, 'days')
          .format('YYYY-MM-DD'),
        moment(selectedDate.start)
          .subtract(1, 'days')
          .format('YYYY-MM-DD'),
        'resourceTimeGridDay',
        selectedStatus,
        selectedEmps,
        allEmpIsSelected,
        workingEmpIsSelected,
        firstDataGetForApi,
      );
      setSelectedDate({
        start: moment(selectedDate.start)
          .subtract(1, 'days')
          .format('YYYY-MM-DD'),
        end: moment(selectedDate.start)
          .subtract(1, 'days')
          .format('YYYY-MM-DD'),
      });
    }
    if (calendarView === 'timeGridFourDay') {
      addDatesAndCalendarViewToUrlQuery(
        moment(selectedDate.start)
          .subtract(3, 'days')
          .format('YYYY-MM-DD'),
        moment(selectedDate.end)
          .subtract(3, 'days')
          .format('YYYY-MM-DD'),
        'timeGridFourDay',
        selectedStatus,
        selectedEmps,
        allEmpIsSelected,
        workingEmpIsSelected,
        firstDataGetForApi,
      );
      setSelectedDate({
        start: moment(selectedDate.start)
          .subtract(3, 'days')
          .format('YYYY-MM-DD'),
        end: moment(selectedDate.end)
          .subtract(3, 'days')
          .format('YYYY-MM-DD'),
      });
    }
  };
  const nextPickerBtnClicked = () => {
    if (calendarView === 'timeGridWeek') {
      addDatesAndCalendarViewToUrlQuery(
        moment(selectedDate.start)
          .add(7, 'days')
          .format('YYYY-MM-DD'),
        moment(selectedDate.end)
          .add(7, 'days')
          .format('YYYY-MM-DD'),
        'timeGridWeek',
        selectedStatus,
        selectedEmps,
        allEmpIsSelected,
        workingEmpIsSelected,
        firstDataGetForApi,
      );
      setSelectedDate({
        start: moment(selectedDate.start)
          .add(7, 'days')
          .format('YYYY-MM-DD'),
        end: moment(selectedDate.end)
          .add(7, 'days')
          .format('YYYY-MM-DD'),
      });
    }
    if (calendarView === 'resourceTimeGridDay') {
      addDatesAndCalendarViewToUrlQuery(
        moment(selectedDate.start)
          .add(1, 'days')
          .format('YYYY-MM-DD'),
        moment(selectedDate.start)
          .add(1, 'days')
          .format('YYYY-MM-DD'),
        'resourceTimeGridDay',
        selectedStatus,
        selectedEmps,
        allEmpIsSelected,
        workingEmpIsSelected,
        firstDataGetForApi,
      );
      setSelectedDate({
        start: moment(selectedDate.start)
          .add(1, 'days')
          .format('YYYY-MM-DD'),
        end: moment(selectedDate.start)
          .add(1, 'days')
          .format('YYYY-MM-DD'),
      });
    }
    if (calendarView === 'timeGridFourDay') {
      addDatesAndCalendarViewToUrlQuery(
        moment(selectedDate.start)
          .add(3, 'days')
          .format('YYYY-MM-DD'),
        moment(selectedDate.end)
          .add(3, 'days')
          .format('YYYY-MM-DD'),
        'timeGridFourDay',
        selectedStatus,
        selectedEmps,
        allEmpIsSelected,
        workingEmpIsSelected,
        firstDataGetForApi,
      );
      setSelectedDate({
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
    // when dateis changed put it in the query  params
    if (selectedDate?.start) {
      if (calendarView === 'timeGridWeek') {
        addDatesAndCalendarViewToUrlQuery(
          moment(selectedDate.start)
            .startOf('week')
            .format('YYYY-MM-DD'),
          moment(selectedDate.start)
            .endOf('week')
            .format('YYYY-MM-DD'),
          'timeGridWeek',
          selectedStatus,
          selectedEmps,
          allEmpIsSelected,
          workingEmpIsSelected,
          firstDataGetForApi,
        );
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
          addDatesAndCalendarViewToUrlQuery(
            moment(lastSelectedDate).format('YYYY-MM-DD'),
            moment(lastSelectedDate).format('YYYY-MM-DD'),
            'resourceTimeGridDay',
            selectedStatus,
            selectedEmps,
            allEmpIsSelected,
            workingEmpIsSelected,
            firstDataGetForApi,
          );
        } else {
          addDatesAndCalendarViewToUrlQuery(
            moment(selectedDate.start).format('YYYY-MM-DD'),
            moment(selectedDate.start).format('YYYY-MM-DD'),
            'resourceTimeGridDay',
            selectedStatus,
            selectedEmps,
            allEmpIsSelected,
            workingEmpIsSelected,
            firstDataGetForApi,
          );
        }
      }
      if (calendarView === 'timeGridFourDay') {
        addDatesAndCalendarViewToUrlQuery(
          moment(selectedDate.start).format('YYYY-MM-DD'),
          moment(selectedDate.start)
            .add(2, 'days')
            .format('YYYY-MM-DD'),
          'timeGridFourDay',
          selectedStatus,
          selectedEmps,
          allEmpIsSelected,
          workingEmpIsSelected,
          firstDataGetForApi,
        );
      }
    }
  }, [selectedDate]);

  //   when status,emp changed put  it  in query params
  useEffect(() => {
    if (selectedStatus) {
      addDatesAndCalendarViewToUrlQuery(
        moment(selectedDate.start).format('YYYY-MM-DD'),
        moment(selectedDate.end).format('YYYY-MM-DD'),
        calendarView,
        selectedStatus,
        selectedEmps,
        allEmpIsSelected,
        workingEmpIsSelected,
        firstDataGetForApi,
      );
    }
  }, [selectedStatus, workingEmpIsSelected, allEmpIsSelected, selectedEmps]);

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

  const correctNowTime = () => {
    const coeff = 1000 * 60 * 5;
    const date = new Date();
    const rounded = new Date(Math.round(date.getTime() / coeff) * coeff);
    return moment(rounded).format('HH:mm:ss');
  };

  return (
    <>
      <div className="overlay-rotate">
        <div className="overlay-rotate__phone"></div>
        <div className="overlay-rotate__message">Please rotate your device!</div>
      </div>
      <section className="mobile-view-pad-sp">
        <Row className="booking-headers booking-headers--sp">
          <BookingHeaderSp
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
        <div className="floated-controls">
          <button
            type="button"
            className="booking-headers_second--part_toggle--btn"
            onClick={() => setShowCalendar(!showCalendar)}
          >
            <p className="booking-headers_second--part_toggle--btn_text">
              {showCalendar ? (
                <>
                  <i className="flaticon2-list-1 mx-2 icon-md"></i>
                </>
              ) : (
                <>
                  <i className="flaticon2-calendar-1 mx-2 icon-md"></i>
                </>
              )}
            </p>
          </button>
          <button
            type="button"
            className="floated-controls__add"
            onClick={() => {
              history.push({
                pathname: '/booking/bookingFlow',
                search: `?time=${correctNowTime()}&startDate=${moment().format(
                  'YYYY-MM-DD',
                )}`,
              });
            }}
          >
            <i className="flaticon2-plus"></i>
          </button>
        </div>
        <div className="booking-body booking-body--pos">
          {showCalendar ? (
            <CalendarViewSp
              selectedDate={selectedDate}
              newServices={services}
              getDayBookings={getDayBookings}
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
    </>
  );
};

export default BookingSpView;

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
