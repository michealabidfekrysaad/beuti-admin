/* eslint-disable  react/prop-types */
import React, { useState, useEffect } from 'react';
import { Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import useAPI, { get, deleting } from 'hooks/useAPI';
import { hoursMinutesDropDown, hoursMinutesDropDownAr } from 'constants/hours';
import { Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import { dayIndexEquivalent } from 'functions/timeFunctions';
import { WorkingHoursDeleteModal } from 'components/AdminViews/Settings/WorkingHours/WorkingHoursDeleteModal';
import SeasonalTimeModal from './SeasonalTimeModal';

export default function SalonTime({ setChecked, checked, setFlexActive }) {
  const { messages, locale } = useIntl();
  const [workingTime, setWorkingTime] = useState([]);
  const [error, setError] = useState(false);
  const [deleteDay, setDeleteDay] = useState(100);
  const [deleteError, setDeleteError] = useState('');
  const [success, setSuccess] = useState(false);
  const [openSeason, setOpenSeason] = useState(false);

  const hoursDD = locale === 'ar' ? hoursMinutesDropDownAr : hoursMinutesDropDown;

  const activeOrNot = (e) => {
    setChecked(!checked);
    setFlexActive(e.target.value);
  };

  const {
    response: workingHours,
    loading: workingHoursLoader,
    setRecall: callWorkingHours,
  } = useAPI(get, 'ServiceProvider/WorkingTime');

  const { response: deleteDays, setRecall: callDelete } = useAPI(
    deleting,
    `ServiceProvider/deleteWorkingTime?day=${deleteDay}`,
  );

  //   useEffect(() => {
  //     if (+deleteDay >= 0 && +deleteDay < 100) {
  //       callDelete(true);
  //     }
  //   }, [deleteDay]);

  useEffect(() => {
    if (deleteDays?.data) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 2000);
      setDeleteDay(100);
      callWorkingHours(true);
    }
    if (deleteDays?.error) {
      setDeleteError(deleteDays?.error?.message);
      setDeleteDay(100);
      setTimeout(() => {
        setDeleteError('');
      }, 3000);
    }
  }, [deleteDays]);

  useEffect(() => {
    callWorkingHours(true);
  }, []);

  useEffect(() => {
    if (workingHours?.data) {
      setWorkingTime(workingHours?.data?.list?.sort((a, b) => a.day - b.day));
    }
    if (workingHours?.error) {
      setError(workingHours?.error?.message);
    }
  }, [workingHours]);

  return (
    <>
      <Col xs={4} lg={2}>
        <p className="container-box__controllers--header">
          {messages['admin.settings.flex.time']}
        </p>
      </Col>
      <Col xs={8} lg={10}>
        <div>
          <p className="d-inline pl-3 pr-3">
            <input
              type="radio"
              id="active"
              value="Active"
              name="radio-group"
              onChange={(e) => activeOrNot(e)}
              checked={!checked}
            />
            <label htmlFor="active">{messages['common.Active']}</label>
          </p>
          <p className="d-inline pl-3 pr-3">
            <input
              type="radio"
              id="notActive"
              value="notActive"
              name="radio-group"
              checked={checked}
              onChange={(e) => activeOrNot(e)}
            />
            <label htmlFor="notActive">{messages['common.InActive']}</label>
          </p>
        </div>
      </Col>
      <Col className="input-box__controllers mt-2 mb-2" xs={6}>
        <label htmlFor="flexTimeDuration" className="input-box__controllers__label w-75">
          {messages['admin.settings.flex.time.duration']}
        </label>
        <select
          id="flexTimeDuration"
          className="w-50 input-box__controllers-select"
          //   onChange={(event) => {
          //     setChangeMyCity(event.target.value);
          //   }}
          //   value={changeMyCity}
        >
          <option
            value={null}
            // selected
            // disabled
            defaultValue
          >
            {messages['admin.settings.flex.time.duration']}
          </option>
          {/* {allCitiesAPI?.data?.list?.map((ser) => (
            <option
              className="font-size container-box__controllers-select__options"
              key={ser.id}
              value={ser.id}
            >
              {ser.name}
            </option>
          ))} */}
        </select>
      </Col>
      <Col xs={12}>
        <p className="container-box__controllers--header">
          {messages['admin.homePage.workingTime']}
        </p>
      </Col>

      <Col xs={10}>
        <div className="table-responsive">
          <Table>
            <TableBody>
              {workingTime.length > 0 ? (
                workingTime.map((day) => (
                  <TableRow key={day.day} className="work-salon-time">
                    <TableCell className="work-salon-time__cell font-weight-bold">
                      {dayIndexEquivalent(day.day, locale)}
                    </TableCell>
                    <TableCell className="work-salon-time__cell">
                      <div className="work-salon-time__cell--data">
                        <input
                          className="form-check-input custom-color work-salon-time__cell--data__chechbox"
                          type="checkbox"
                          checked={deleteDay !== day.day && day?.startTime}
                          onChange={() => setDeleteDay(day.day)}
                          id="salonTimeAdded"
                        />
                      </div>
                    </TableCell>
                    <TableCell align="center" className="work-salon-time__cell">
                      <div className="work-salon-time__cell--data">
                        <span className="work-salon-time__cell--data__from-to">
                          {messages['common.from']}
                        </span>
                        <select
                          id="startTimeSalon"
                          className="w-75 input-box__controllers-select"
                          //   onChange={(event) => {
                          //     setChangeMyCity(event.target.value);
                          //   }}
                          value={day.startTime}
                        >
                          {hoursDD?.map((hour) => (
                            <option
                              className="font-size container-box__controllers-select__options"
                              key={hour.key}
                              value={hour.value}
                            >
                              {hour.text}
                            </option>
                          ))}
                        </select>
                        {/* {formatTime(day.startTime, locale)} */}
                      </div>
                    </TableCell>
                    <TableCell align="center" className="work-salon-time__cell">
                      <div className="work-salon-time__cell--data">
                        <span className="work-salon-time__cell--data__from-to">
                          {messages['common.to']}
                        </span>
                        <select
                          id="endTimeSalon"
                          className="w-75 input-box__controllers-select"
                          //   onChange={(event) => {
                          //     setChangeMyCity(event.target.value);
                          //   }}
                          value={day.endTime}
                        >
                          {hoursDD?.map((hour) => (
                            <option
                              className="font-size container-box__controllers-select__options"
                              key={hour.key}
                              value={hour.value}
                            >
                              {hour.text}
                            </option>
                          ))}
                        </select>
                        {/* {formatTime(day.endTime, locale)} */}
                      </div>
                    </TableCell>
                    <TableCell className="work-salon-time__cell">
                      {/* <Tooltip
                        arrow
                        TransitionComponent={Fade}
                        title={`${messages['common.edit']}`}
                      >
                        <button
                          type="button"
                          className="icon-wrapper-btn btn-icon-primary mx-2"
                          onClick={() => {
                            setSelectedDay(day);
                            setView('edit');
                          }}
                        >
                          <i className="flaticon2-pen text-primary"></i>
                        </button>
                      </Tooltip> */}
                      <WorkingHoursDeleteModal
                        setDeletePayload={setDeleteDay}
                        id={day.day}
                        setDeleteError={setDeleteError}
                        setSuccess={setSuccess}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4}>{messages['common.noData']}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Col>

      <Col xs={12} className="mt-2 pt-2">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setOpenSeason(true)}
        >
          {messages[`admin.settings.time.season`]}
        </button>
      </Col>
      <SeasonalTimeModal
        setOpenSeason={setOpenSeason}
        openSeason={openSeason}
        workingTime={workingTime}
      />
    </>
  );
}
