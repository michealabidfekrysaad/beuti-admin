/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable prefer-template */

import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import moment from 'moment';
import { Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import noBranchImg from 'images/noBranchImg.png';
import {
  hoursMinutesDropDownDefaultTime,
  hoursMinutesDropDownArDefaultTime,
  disableOptionsDefaultTime,
} from 'constants/hours';
import { useForm } from 'react-hook-form';
import DatePickerLocale from 'components/shared/DatePickerLocale';
import { get } from 'lodash';
import { CallAPI } from 'utils/API/APIConfig';
import { yupResolver } from '@hookform/resolvers/yup';
import { useHistory } from 'react-router-dom';
import { SEASONAL_WORK_HOURS_UPDATE } from 'utils/API/EndPoints/WorkingTime';
import { SP_GET_USER_BRANCHES } from 'utils/API/EndPoints/BranchManager';
import { SeasonalHoursSchema } from './SeasonalHoursSchema';
import SelectInputMUI from '../../../Shared/inputs/SelectInputMUI';
import CopyAllWorkingHours from '../UpdateDefaultWorkingHours/CopyAllWorkingHours';
import AddDeleteShift from '../UpdateDefaultWorkingHours/AddDeleteShift';
import NoShifts from '../UpdateDefaultWorkingHours/Noshifts';
import BeutiInput from '../../../Shared/inputs/BeutiInput';
import {
  mainHoursObject,
  copyAllHoursObject,
  defaultShift,
  handleDefaultAndBindingDaysWithOneShift,
} from '../UpdateDefaultWorkingHours/WorkingHoursObject';
import DayCheckbox from '../UpdateDefaultWorkingHours/DayCheckbox';

export default function SeasonalTime() {
  const { messages, locale } = useIntl();
  moment.locale('en');
  const [allBranches, setAllBranches] = useState([]);
  const [durationDate, setDurationDate] = useState({
    from: moment().format(),
    to: moment().format(),
  });

  const [selectedDay, setSelectedDay] = useState({
    shifts: defaultShift,
  });
  const [showCopyAll, setShowCopyAll] = useState(true);

  const [errorDate, setErrorDate] = useState(false);
  const hoursDD =
    locale === 'ar' ? hoursMinutesDropDownArDefaultTime : hoursMinutesDropDownDefaultTime;
  const history = useHistory();
  const schemaValidations = SeasonalHoursSchema();
  /* -------------------------------------------------------------------------- */
  /*             set the branches from the DD that saved in  storage            */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (localStorage.getItem('selectedBranches')) {
      setValue(
        'checkbox',
        JSON.parse(localStorage.getItem('selectedBranches')).map((single) =>
          single.toString(),
        ),
        { shouldValidate: true },
      );
    }
  }, [localStorage.getItem('selectedBranches')]);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(schemaValidations),
    defaultValues: {
      days: mainHoursObject(locale),
    },
  });

  const { isFetching: fetchingBranches, isFetchedAfterMount } = CallAPI({
    name: 'allBracnhesForseason',
    url: SP_GET_USER_BRANCHES,
    refetchOnWindowFocus: false,
    enabled: true,
    onSuccess: (res) => {
      if (res?.list?.length > 1) {
        setAllBranches(
          res?.list
            .map((branch) => ({
              value: branch.id,
              branchId: branch.id,
              name: branch.name,
              address: branch.address,
              image: branch?.bannerImage,
              selected:
                branch.id === JSON.parse(localStorage.getItem('selectedBranches'))[0],
            }))
            .sort((a, b) => {
              if (a?.selected && !b?.selected) return -1;
              if (!a?.selected && b?.selected) return 1;
              return 0;
            }),
        );
      } else {
        setAllBranches([]);
      }
      setValue('days', handleDefaultAndBindingDaysWithOneShift([], locale));
    },
    select: (res) => res?.data?.data,
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });
  /* -------------------------------------------------------------------------- */
  /*              update working hours after check upcomingBooking              */
  /* -------------------------------------------------------------------------- */
  const { refetch } = CallAPI({
    name: 'updateSeasonalHours',
    url: SEASONAL_WORK_HOURS_UPDATE,
    retry: false,
    method: 'post',
    onSuccess: (data) => {
      if (data?.data?.data.success) {
        toast.success(messages['common.success']);
        history.goBack();
      }
    },
    body: {
      workingDays: watch()
        .days.filter((day) => day.isSelected)
        .map((data) => {
          const nextDay = data?.shifts.map((single) => {
            if (
              single?.startTime?.split(':')[0] >= 24 ||
              single?.endTime?.split(':')[0] >= 24
            ) {
              if (single?.startTime?.split(':')[0] >= 24) {
                const newStartTime = [
                  single?.startTime?.split(':')[0] - 24,
                  single?.startTime?.split(':')[1],
                  single?.startTime?.split(':')[2],
                ];
                const newEndTime = [
                  single?.endTime?.split(':')[0] - 24,
                  single?.endTime?.split(':')[1],
                  single?.endTime?.split(':')[2],
                ];
                return {
                  ...single,
                  startTime: '0' + newStartTime.join(':'),
                  endTime: '0' + newEndTime.join(':'),
                  isNextDay: true,
                };
              }

              const newEndTime = [
                single?.endTime?.split(':')[0] - 24,
                single?.endTime?.split(':')[1],
                single?.endTime?.split(':')[2],
              ];
              return {
                ...single,
                endTime: '0' + newEndTime.join(':'),
                isNextDay: true,
              };
            }
            return { ...single, isNextDay: false };
          });
          if (nextDay) {
            return { ...data, day: data.id, shifts: nextDay };
          }
          return { ...data, day: data.id };
        }),
      branchIds: watch('checkbox'),
      startDate: durationDate?.from,
      endDate: durationDate?.to,
      nameAr: watch('seasonAr'),
      nameEn: watch('seasonEn'),
    },
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });
  useEffect(() => {
    if (watch) {
      const subscription = watch((input, { name }) => {
        if (get(input, name?.substring(0, 7))?.isSelected) {
          setSelectedDay(get(input, name.substring(0, 7)));
          setShowCopyAll(true);
        } else {
          setSelectedDay({
            shifts: defaultShift,
          });
        }
        clearErrors('days');
      });
      return () => subscription.unsubscribe();
    }
    return null;
  }, [watch]);

  //   to make validation on change date
  useEffect(() => {
    if (durationDate?.to && durationDate?.from) {
      if (durationDate?.from > durationDate?.to) {
        setErrorDate('datePicker.error.before.start');
      } else {
        setErrorDate(false);
      }
    }
  }, [durationDate]);

  const sendDataafterNoDateError = () => {
    if (!errorDate) refetch();
  };
  return (
    <form onSubmit={handleSubmit(() => sendDataafterNoDateError())} className="px-5">
      <Row className="informationwizard py-2">
        <Col xs={12} className="informationwizard__title">
          {messages['workingHours.add.season.title']}
        </Col>
        <Col xs={12} className="informationwizard__subtitle">
          {messages['workingHours.add.season.subtitle']}
        </Col>
        <Col md={12} lg={6} className="mb-1 mt-4">
          <BeutiInput
            type="text"
            label={messages['workingHours.season.name.ar']}
            useFormRef={register('seasonAr')}
            error={errors.seasonAr?.message}
            className="w-75"
          />
        </Col>
        <Col md={12} lg={6} className="mb-1 mt-4">
          <BeutiInput
            type="text"
            label={messages['workingHours.season.name.en']}
            useFormRef={register('seasonEn')}
            error={errors.seasonEn?.message}
            className="w-75"
          />
        </Col>
        <Col xs={12} className=" mb-2">
          <div className="datePickerseasonalTime">
            <DatePickerLocale
              duration={durationDate}
              setDuration={setDurationDate}
              noshrinkLabel
              showErrorBorderandMessage={errorDate}
              startDateLabel="seasonHours.from.date"
              endDateLabel="seasonHours.to.date"
              defaultFormat="dd MMMM yyyy"
            />
          </div>
        </Col>
      </Row>
      <hr className="w-100" />
      {allBranches?.length > 1 && (
        <>
          <Row className="informationwizard py-2">
            <Col xs={12} className="informationwizard__title">
              {messages['workingHours.branches.title']}
            </Col>
            <Col xs={12} className="informationwizard__subtitle">
              {messages['workingHours.seasonalWorkingHours.subtitle']}
            </Col>
            {allBranches?.map((branch) => (
              <Col key={branch?.branchId} lg={4} sm={6} className="py-4">
                <Row>
                  <Col xs={1}>
                    <input
                      value={branch?.value}
                      className="informationwizard__checkbox custom-color mt-3"
                      type="checkbox"
                      {...register('checkbox')}
                      id={branch?.branchId}
                    />
                  </Col>
                  <Col xs={10} className="branchesHolder">
                    <label
                      htmlFor={branch.branchId}
                      className="informationwizard__branchName d-flex"
                    >
                      {branch?.bannerImage ? (
                        <img
                          width="50"
                          height="50"
                          className="mx-2"
                          src={branch.bannerImage}
                          alt={branch.name}
                        />
                      ) : (
                        <img
                          width="50"
                          height="50"
                          className="mx-2"
                          src={noBranchImg}
                          alt={branch.name}
                        />
                      )}
                      <div>
                        <span className="branchName">{branch.name}</span>
                        <p className="address">
                          {branch.address ||
                            messages['branches.display.branches.address']}
                        </p>
                      </div>
                    </label>
                  </Col>
                </Row>
              </Col>
            ))}
            {errors.checkbox?.message && (
              <Col xs="12">
                <p className="beuti-input__errormsg" style={{ bottom: '-10px' }}>
                  {errors.checkbox?.message}
                </p>
              </Col>
            )}
          </Row>
          <hr className="w-100" />
        </>
      )}
      <Row className="informationwizard pt-3">
        {isFetchedAfterMount && (
          <>
            <Col xs={12} className="informationwizard__title">
              {messages['seasonHours.title']}
            </Col>
            <Col xs={12} className="informationwizard__subtitle">
              {messages['seasonHours.subtitle']}
            </Col>
          </>
        )}
        <Col xs={12} className="informationwizard__allDays">
          {watch().days.map((day, index) => (
            <>
              <div key={day.id}>
                <Row className="informationwizard__allDays-day">
                  <Col xs="auto">
                    <DayCheckbox
                      useFormRef={register(`days[${index}].isSelected`)}
                      dayPath={`days[${index}]`}
                      setValue={setValue}
                      text={day.name}
                      watch={watch}
                      currentDay={day}
                      selectedDay={selectedDay}
                      setSelectedDay={setSelectedDay}
                      fetchingBranches={fetchingBranches}
                    />
                  </Col>
                  <Col xs="auto" className="flex-grow-1">
                    {day.isSelected &&
                      !fetchingBranches &&
                      day.shifts.map((shift, i) => (
                        <Row className="informationwizard__allDays-day--shift">
                          <Col xs="12" lg="4" className="flex-grow-1">
                            <SelectInputMUI
                              list={hoursDD.map(({ value, text, iseNextDay }) => ({
                                text,
                                value,
                                iseNextDay,
                                id: value,
                              }))}
                              useFormRef={register(
                                `days[${index}].shifts[${i}].startTime`,
                              )}
                              watch={watch}
                              defaultValue={shift.startTime}
                              error={
                                get(
                                  errors,
                                  `days[${index}].shifts[${i}].startTime.message`,
                                ) ||
                                (i === 1 && get(errors, `days[${index}].shifts.message`))
                              }
                              dontShowErrorMessage={
                                !!get(errors, `days[${index}].shifts.message`)
                              }
                            />
                          </Col>
                          <Col xs="auto flex-grow-1 text-center">
                            {messages['common.to']}
                          </Col>
                          <Col xs="12" lg="4" className="flex-grow-1">
                            <SelectInputMUI
                              list={hoursDD.map(({ value, text, iseNextDay }) => ({
                                text,
                                value,
                                iseNextDay,
                                id: value,
                              }))}
                              id="0"
                              useFormRef={register(`days[${index}].shifts[${i}].endTime`)}
                              watch={watch}
                              defaultValue={shift.endTime}
                              disabledOptions={(option) =>
                                disableOptionsDefaultTime(shift.startTime, option)
                              }
                              error={
                                get(
                                  errors,
                                  `days[${index}].shifts[${i}].endTime.message`,
                                ) ||
                                (i === 1 && get(errors, `days[${index}].shifts.message`))
                              }
                              dontShowErrorMessage={
                                !!get(errors, `days[${index}].shifts.message`)
                              }
                            />
                            {/* <p className="informationwizard__allDays-day--nextDay">
                              {shift.endTime.split(':')[0] >= 24 &&
                                messages['workingHours.next.day']}
                            </p> */}
                          </Col>
                          <AddDeleteShift
                            shiftLength={day.shifts.length}
                            currentShift={shift}
                            dayPath={`days[${index}]`}
                            watch={watch}
                            setValue={setValue}
                            hoursDD={hoursDD}
                          />
                        </Row>
                      ))}
                    {!day.isSelected && !fetchingBranches && <NoShifts />}
                    <p className="intersectionErrorMessage">
                      {get(errors, `days[${index}].shifts.message`)}
                    </p>
                  </Col>
                </Row>
              </div>

              {day.id === selectedDay?.id && showCopyAll && (
                <CopyAllWorkingHours
                  handleCopy={() =>
                    setValue('days', copyAllHoursObject(watch().days, locale, day.shifts))
                  }
                  handleClose={() => setShowCopyAll(false)}
                />
              )}
            </>
          ))}
          <Row className="justify-content-center">
            <Col xs="auto">
              {true && (
                <>
                  <p className="beuti-input__errormsg" style={{ position: 'relative' }}>
                    {errors?.days?.message}
                  </p>
                </>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
      {isFetchedAfterMount && (
        <section className="settings__submit">
          <button
            className="beutibuttonempty mx-2 action"
            type="button"
            onClick={() => history.goBack()}
          >
            {messages['common.cancel']}
          </button>
          <button type="submit" className="beutibutton action">
            {messages['common.save']}
          </button>
        </section>
      )}
      {(fetchingBranches || fetchingBranches) && (
        <div className="loading fakeSpinner"></div>
      )}
    </form>
  );
}