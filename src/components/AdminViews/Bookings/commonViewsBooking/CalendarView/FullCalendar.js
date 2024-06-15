/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable indent */

import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import SVG from 'react-inlinesvg';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
// above package for resource in day view
import interactionPlugin from '@fullcalendar/interaction';
// above package for dragging with editable="true"
import { Tooltip } from '@material-ui/core';
import moment from 'moment';

import PropTypes from 'prop-types';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import salon from '../../../../../assets/img/dashboard/salons.svg';
import home from '../../../../../assets/img/dashboard/homes.svg';
import TooltipCalendarContent from '../FullCalendar/TooltipCalendarContent';
import { ConfirmMoveService } from './ConfirmMoveService';

const FullCalendarPremium = ({
  bookingDate,
  resourcesEmployee,
  mapDayBooking,
  locale,
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
  stopScrollToTimeNow,
}) => {
  const { messages } = useIntl();
  const [tempPayloadMoveService, setTempPayloadMoveService] = useState(false);
  const [openConfirmMove, setOpenConfirmMove] = useState(false);
  const history = useHistory();

  function CovertTime(date) {
    const timeString12hr = new Date(`1970-01-01T${date}Z`).toLocaleTimeString(
      {},
      { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' },
    );
    return timeString12hr;
  }

  function renderInnerContent(innerProps) {
    return (
      <div className="fc-event-main-frame">
        <div className="fc-event-title-container">
          <div className="fc-event-title fc-sticky">
            <div className="duration">
              <div>
                {`${CovertTime(
                  innerProps?.event?.startStr?.split('T')[1]?.split('+')[0],
                )} - ${CovertTime(
                  innerProps?.event?.endStr?.split('T')[1]?.split('+')[0] ||
                    innerProps.event.extendedProps.bookingData.serviceEnd?.split('T')[1],
                )}`}
              </div>
              <SVG
                src={toAbsoluteUrl(
                  `${innerProps.event.extendedProps.bookingData?.isHome ? home : salon}`,
                )}
              />
            </div>
            {/* <div className="client">{innerProps.event.title || <div>&nbsp;</div>}</div> */}
            {innerProps.timeText && (
              <div className="fc-event-time">
                {innerProps.event.extendedProps?.bookingData?.serviceName || 'no name'}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                   trigger when event change its time slot                  */
  /* -------------------------------------------------------------------------- */
  const handleEventChangePlace = (arg) => {
    let newEmpId = null;
    const {
      event: {
        _def: {
          extendedProps: {
            bookingData: { statusId, bookingServiceId, isHome },
          },
        },
      },
    } = arg;
    const {
      event: {
        _def: {
          extendedProps: {
            empData: { employeeId },
          },
        },
      },
    } = arg;
    if (arg?.newResource) {
      const {
        newResource: {
          _resource: { id },
        },
      } = arg;
      newEmpId = id;
    }
    const {
      event: {
        _def: { sourceId },
      },
    } = arg;
    const {
      event: {
        _instance: {
          range: { start: newStartDateTime, end: newEndDateTime },
        },
      },
    } = arg;
    // the old booking-details
    const {
      oldEvent: {
        _instance: {
          range: { start: oldStartDateTime, end: oldEndDateTime },
        },
      },
    } = arg;
    if ((statusId === 1 || statusId === 4) && !isHome) {
      if (
        moment(oldStartDateTime)
          .utcOffset('-0000')
          ?.isSame(moment(newStartDateTime).utcOffset('-0000'), 'day')
      ) {
        setUpdatedServicePayload({
          bookingServiceId,
          startDateTime: moment(newStartDateTime)
            .utcOffset('-0000')
            .toISOString(),
          employeeId: newEmpId || employeeId,
        });
      } else {
        setTempPayloadMoveService({
          bookingServiceId,
          startDateTime: moment(newStartDateTime)
            .utcOffset('-0000')
            .toISOString(),
          employeeId: newEmpId || employeeId,
        });
        setOpenConfirmMove(true);
      }
      setObjectRevertMove(arg);
    } else {
      arg.revert();
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                       trigger  when event is resized                       */
  /* -------------------------------------------------------------------------- */
  const handleEventResize = (arg) => {
    const {
      event: {
        _def: {
          extendedProps: {
            bookingData: { statusId, bookingServiceId, isHome },
          },
        },
      },
    } = arg;
    const {
      event: {
        _def: {
          extendedProps: {
            empData: { employeeId },
          },
        },
      },
    } = arg;
    const {
      event: {
        _def: { sourceId },
      },
    } = arg;
    const {
      event: {
        _instance: {
          range: { start: newStartDateTime, end: newEndDateTime },
        },
      },
    } = arg;
    // the old booking-details
    const {
      oldEvent: {
        _instance: {
          range: { start: oldStartDateTime, end: oldEndDateTime },
        },
      },
    } = arg;
    if ((statusId === 1 || statusId === 4) && !isHome) {
      setObjectRevertMove(arg);
      setResizedServicePayload({
        bookingServiceId,
        endDateTime: moment(newEndDateTime)
          .utcOffset('-0000')
          .toISOString(),
      });
    } else {
      arg.revert();
    }
  };

  const handleEventClick = (info) => {
    const {
      event: {
        _def: {
          extendedProps: {
            bookingData: { statusId },
          },
        },
      },
    } = info;
    if (+statusId !== 7) {
      history.push(`/booking/view/${info?.event?.extendedProps?.bookingData?.bookingId}`);
    }
  };
  return (
    <>
      <div className="flex-grow-1 px-0  col-auto booking-calender">
        <FullCalendar
          // height="auto"
          //   comment for scrolling
          schedulerLicenseKey="0458928213-fcs-1617625979"
          plugins={[interactionPlugin, resourceTimeGridPlugin, dayGridPlugin]}
          initialView={calendarView}
          views={{
            timeGridFourDay: {
              type: 'timeGrid',
              duration: { days: 3 },
            },
          }}
          columnHeader={false}
          columnHeaderFormat={[
            { weekday: 'long', month: 'numeric', day: 'numeric', omitCommas: true },
          ]}
          //   comment for scrolling
          dayHeaderContent={(args) =>
            moment(args.date)
              .locale(locale)
              .format('DD dddd')
          }
          dragScroll={true}
          slotEventOverlap={false}
          initialDate={bookingDate.start}
          slotDuration="00:15"
          headerToolbar={false}
          resources={
            allEmpData?.length > 0 || workingEmpIsSelected
              ? allEmpData?.map((t1) => ({
                  id: t1?.id,
                  title: t1?.name,
                  name: t1.name,
                  image: t1?.image,
                  businessHours: t1?.businessHours,
                  extendedProps: { employeeId: t1?.id, employeeName: t1?.name },
                  ...resourcesEmployee.find((t2) => t2.id === t1),
                }))
              : dataForEmp?.map((t1) => ({
                  id: t1?.id,
                  title: t1?.name,
                  name: t1.name,
                  image: t1?.image,
                  businessHours: t1?.businessHours,
                  extendedProps: { employeeId: t1?.id, employeeName: t1?.name },
                  ...resourcesEmployee.find((t2) => t2.id === t1),
                }))
          }
          events={mapDayBooking}
          locale={locale === 'ar' ? 'ar' : 'en'}
          editable={true}
          eventResourceEditable="true"
          eventOverlap={false}
          //   when move event stop auto referesh
          eventDragStart={() => {
            setStopAutoRefetch(true);
          }}
          eventDragStop={() => {
            setStopAutoRefetch(false);
          }}
          //   when resize event stop auto referesh
          eventResizeStart={() => {
            setStopAutoRefetch(true);
          }}
          eventResizeStop={() => {
            setStopAutoRefetch(false);
          }}
          eventDrop={(arg) => {
            handleEventChangePlace(arg);
          }}
          eventResize={(info) => {
            handleEventResize(info);
          }}
          eventClick={(info) => {
            handleEventClick(info);
          }}
          dateClick={(info) => {
            history.push({
              pathname: '/booking/bookingFlow',
              search: `?time=${info?.dateStr?.split('T')[1]?.slice(0, 8) ||
                '00:00:00'}&startDate=${
                moment().diff(info?.dayEl?.dataset?.date, 'days') <= 0
                  ? info?.dayEl?.dataset?.date
                  : info?.dayEl?.dataset?.date
              }&empId=${info?.resource?._resource?.id || 0}`,
            });
          }}
          //   hide resource column if no resource found
          //   filterResourcesWithEvents={true}
          resourceLabelContent={(data) => {
            if (data?.resource?.title) {
              return (
                <section className="resource-section">
                  <div className="resource-section_image">
                    {data?.resource?.extendedProps?.image ? (
                      <img
                        className="resource-section_image-src"
                        alt={data?.resource?.extendedProps?.employeeName}
                        src={data?.resource?.extendedProps?.image}
                      />
                    ) : (
                      <div className="resource-section_image-div--img">
                        {data?.resource?.extendedProps?.employeeName
                          ?.charAt(0)
                          .toUpperCase()}{' '}
                      </div>
                    )}
                  </div>
                  <div className="resource-section_data">
                    <div className="resource-section_data-name">
                      {data?.resource?.extendedProps?.employeeName}
                    </div>
                    <div className="resource-section_data-title">
                      {data?.resource?.extendedProps?.empTitle}
                    </div>
                  </div>
                </section>
              );
            }
            return <></>;
          }}
          eventContent={(data) => (
            <Tooltip
              classes={{ tooltip: 'calender-tooltip' }}
              title={
                <TooltipCalendarContent
                  data={data.event.extendedProps?.bookingData}
                  empData={data.event.extendedProps?.empData}
                />
              }
              arrow
            >
              {renderInnerContent(data)}
            </Tooltip>
          )}
          slotLabelInterval="01:00"
          allDaySlot={false}
          direction={locale === 'ar' ? 'rtl' : 'ltr'}
          nowIndicator
          now={
            !stopScrollToTimeNow
              ? moment().toISOString()
              : moment()
                  .utcOffset(0)
                  .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
                  ?.format()
          }
          nowIndicatorClassNames="custom-indicator"
          nowIndicatorContent={moment().format('h:mm')}
          businessHours={businessHours}
          scrollTimeReset={stopScrollToTimeNow}
          render={stopScrollToTimeNow}
          scrollTime={
            !stopScrollToTimeNow
              ? moment(
                  moment()
                    ?.subtract(1, 'hours')
                    ?.format('hh:mm A'),
                  ['h:mm A'],
                ).format('HH:mm:ss')
              : stopScrollToTimeNow
          }
          //   slotMinTime="06:00:00"
        />
      </div>
      <ConfirmMoveService
        setPayload={setUpdatedServicePayload}
        title="calendar.move.service.title"
        message="calendar.move.service.message"
        Id={tempPayloadMoveService}
        setOpenModal={setOpenConfirmMove}
        openModal={openConfirmMove}
        confirmtext="calendar.move.service.update"
        objectRevertMove={objectRevertMove}
        setStopAutoRefetch={setStopAutoRefetch}
      />
    </>
  );
};
FullCalendarPremium.propTypes = {
  bookingDate: PropTypes.object,
  resourcesEmployee: PropTypes.array,
  mapDayBooking: PropTypes.array,
  locale: PropTypes.string,
  setUpdatedServicePayload: PropTypes.func,
  setObjectRevertMove: PropTypes.func,
  businessHours: PropTypes.array,
  setResizedServicePayload: PropTypes.func,
  objectRevertMove: PropTypes.object,
  calendarView: PropTypes.string,
  setStopAutoRefetch: PropTypes.func,
  allEmpData: PropTypes.array,
  dataForEmp: PropTypes.array,
  workingEmpIsSelected: PropTypes.bool,
  stopScrollToTimeNow: PropTypes.bool,
};
export default FullCalendarPremium;
