/* eslint-disable  */

import React, { useContext } from 'react';
import { CallAPI } from 'utils/API/APIConfig';
import { BookingContext } from 'providers/BookingProvider';
import { useIntl, FormattedMessage } from 'react-intl';
import { getCurrentServiceByOptionId } from '../../Helper/AddEditHelper';
import moment from 'moment';

const checkDateIsSame = (firstDate, secondDate) =>
  firstDate && !moment(firstDate).isSame(moment(secondDate));

const BookingDisclaimers = ({
  currentServicePath,
  watch,
  allEmployees,
  allCategories,
}) => {
  const { booking } = useContext(BookingContext);
  const { messages } = useIntl();
  const checkIfNextDayTimeOrNot = (time) => {
    const hours = +time?.split(':')[0];
    const minutes = +time?.split(':')[1];
    const seconds = `${+time?.split(':')[2]}0`;
    const hoursExceedThanThirty = hours > 30 ? hours - 24 : false;
    const newHoursNextDay = hours - 24 < 10 ? `0${hours - 24}` : hours;
    return hours < 24
      ? time
      : `01:${hoursExceedThanThirty ? hoursExceedThanThirty : newHoursNextDay}:${
          minutes < 10 ? `0${minutes}` : minutes
        }:${seconds}`;
  };
  const { data, isFetching } = CallAPI({
    name: [
      'checkDisclimers',
      watch(currentServicePath).employeeId,
      watch(currentServicePath)?.startTime,
      watch(currentServicePath)?.selectId,
      watch(currentServicePath)?.durationInMinutes,
      booking.isHomeBooking,
      booking.bookingDate,
    ],
    url: 'booking/ValidateBookingServiceDisclaimers',
    method: 'post',
    enabled:
      !!watch(currentServicePath)?.selectId && !!watch(currentServicePath)?.employeeId,
    refetchOnWindowFocus: false,
    body: {
      bookingId: null,
      isHomeBooking: booking.isHomeBooking,
      bookingDate: booking.bookingDate,
      bookedServices: [
        {
          itemId: watch(currentServicePath)?.selectId,
          serviceOptionId: watch(currentServicePath)?.serviceOptionId,
          serviceId: watch(currentServicePath)?.serviceId,
          durationInMinutes: watch(currentServicePath)?.durationInMinutes,
          employeeId: watch(currentServicePath)?.employeeId,
          startTime: checkIfNextDayTimeOrNot(watch(currentServicePath)?.startTime),
          startDate: watch(currentServicePath)?.startDate || booking.bookingDate,
        },
      ],
    },
    select: (res) => {
      const {
        isEmployeeBusy,
        isEmployeeNotProvideService,
        isEmployeeNotWorkingDuringTime,
        isServiceInAnotherDate,
        isServiceNotProvidedInLocation,
      } = res?.data?.data.bookedServiceDisclaimer[0];
      const { isBusy } = res?.data?.data.homeBlockTimeDisclaimer[0];
      return isEmployeeBusy ||
        isEmployeeNotProvideService ||
        isEmployeeNotWorkingDuringTime ||
        isServiceInAnotherDate ||
        isServiceNotProvidedInLocation
        ? {
            isEmployeeBusy: isBusy || isEmployeeBusy,
            isEmployeeNotProvideService,
            isEmployeeNotWorkingDuringTime,
            isServiceInAnotherDate:
              isServiceInAnotherDate || !watch(currentServicePath).isSameDate,
            isServiceNotProvidedInLocation,
          }
        : false;
    },
  });
  return (
    <>
      {(!!data ||
        checkDateIsSame(watch(currentServicePath)?.startDate, booking?.bookingDate)) &&
        !isFetching && (
          <section className="booking-view__note mt-3">
            <div className="booking-view__note-description">
              {messages['booking.warning.title']}
            </div>

            {data?.isEmployeeBusy && (
              <li className="booking-view__note-description mb-0">
                <FormattedMessage
                  id="booking.warning.busy"
                  values={{
                    employee: allEmployees?.find(
                      (emp) => emp.id === watch(currentServicePath).employeeId,
                    )?.name,
                  }}
                />
              </li>
            )}
            {data?.isEmployeeNotProvideService && (
              <li className="booking-view__note-description">
                <FormattedMessage
                  id="booking.warning.notprovide"
                  values={{
                    employee: allEmployees?.find(
                      (emp) => emp.id === watch(currentServicePath).employeeId,
                    )?.name,
                  }}
                />
              </li>
            )}
            {data?.isEmployeeNotWorkingDuringTime && (
              <li className="booking-view__note-description">
                <FormattedMessage
                  id="booking.warning.notworkingtime"
                  values={{
                    employee: allEmployees?.find(
                      (emp) => emp.id === watch(currentServicePath).employeeId,
                    )?.name,
                  }}
                />
              </li>
            )}
            {checkDateIsSame(
              watch(currentServicePath)?.startDate,
              booking?.bookingDate,
            ) &&
              data?.isServiceInAnotherDate && (
                <li className="booking-view__note-description mb-0">
                  <FormattedMessage
                    id="booking.warning.date"
                    values={{
                      service: watch(currentServicePath)?.serviceName,
                      date: moment(watch(currentServicePath)?.startDate).format(
                        'DD MMMM yyyy',
                      ),
                    }}
                  />
                </li>
              )}
            {data?.isServiceNotProvidedInLocation && (
              <li className="booking-view__note-description">
                <FormattedMessage
                  id="booking.warning.notprovidelocation"
                  values={{
                    service: getCurrentServiceByOptionId({
                      id: watch(currentServicePath)?.selectId,
                      allCategories: allCategories,
                    })?.displayName,
                    location: booking.isHomeBooking
                      ? messages['setting.employee.input.home']
                      : messages['setting.employee.input.Salon'],
                  }}
                />
              </li>
            )}
          </section>
        )}
    </>
  );
};

export default BookingDisclaimers;
