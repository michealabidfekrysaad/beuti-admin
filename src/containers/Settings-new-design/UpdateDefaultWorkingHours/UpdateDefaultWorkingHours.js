/* eslint-disable prefer-template */
/* eslint-disable react/jsx-props-no-spreading */

import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import {
  hoursMinutesDropDownDefaultTime,
  hoursMinutesDropDownArDefaultTime,
  disableOptionsDefaultTime,
} from 'constants/hours';
import { useForm } from 'react-hook-form';
import { get } from 'lodash';
import { CallAPI } from 'utils/API/APIConfig';
import { yupResolver } from '@hookform/resolvers/yup';
import { useHistory } from 'react-router-dom';
import { Routes } from 'constants/Routes';
import BeutiButton from 'Shared/inputs/BeutiButton';
import {
  WORKING_GET_DAYS,
  WORKING_UPDATE_DAYS,
  WORKING_HAS_UPCOMING_BOOKING,
} from 'utils/API/EndPoints/WorkingTime';
import { SP_GET_USER_BRANCHES } from 'utils/API/EndPoints/BranchManager';
import { ConfirmationModal } from 'components/shared/ConfirmationModal';
import { WorkingHoursSchema } from './WorkingHoursSchema';
import SelectInputMUI from '../../../Shared/inputs/SelectInputMUI';
import CopyAllWorkingHours from './CopyAllWorkingHours';
import AddDeleteShift from './AddDeleteShift';
import NoShifts from './Noshifts';
import {
  mainHoursObject,
  copyAllHoursObject,
  defaultShift,
  handleDefaultAndBindingDays,
} from './WorkingHoursObject';
import DayCheckbox from './DayCheckbox';

const UpdateDefaultWorkingHours = () => {
  const { messages, locale } = useIntl();
  const [showCopyAll, setShowCopyAll] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [payload, setPayload] = useState(null);
  const [Id, setID] = useState(null);
  const [allBranches, setAllBranches] = useState([]);
  const [copyAllClicked, setCopyAllClicked] = useState(false);
  const [checkedCheckboxes, setCheckedCheckboxes] = useState([]);
  const [selectedDay, setSelectedDay] = useState({
    shifts: defaultShift,
  });
  const hoursDD =
    locale === 'ar' ? hoursMinutesDropDownArDefaultTime : hoursMinutesDropDownDefaultTime;
  const history = useHistory();

  const handleCheckboxChange = (data) => {
    const isChecked = checkedCheckboxes?.some(
      (checkedCheckbox) => checkedCheckbox.value === data.value,
    );
    if (isChecked) {
      setCheckedCheckboxes(
        checkedCheckboxes?.filter(
          (checkedCheckbox) => checkedCheckbox?.value !== data?.value,
        ),
      );
    } else {
      setCheckedCheckboxes(checkedCheckboxes?.concat(data));
    }
  };

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
    resolver: yupResolver(WorkingHoursSchema),
    defaultValues: {
      days: mainHoursObject(locale),
    },
  });

  /* -------------------------------------------------------------------------- */
  /*                  get all  branches for user to checkboxes                  */
  /* -------------------------------------------------------------------------- */
  const { isFetching: fetchingBranches, isFetchedAfterMount } = CallAPI({
    name: 'getBranchesForUser',
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
    },
    select: (res) => res?.data?.data,
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });

  /* -------------------------------------------------------------------------- */
  /*                     getAll saved default working hours                     */
  /* -------------------------------------------------------------------------- */
  const { isFetching } = CallAPI({
    name: 'getDefaultWorkingHours',
    url: WORKING_GET_DAYS,
    onSuccess: (data) => {
      setValue('days', handleDefaultAndBindingDays(data.data?.data, locale));
    },
    enabled: true,
    refetchOnWindowFocus: false,
    retry: 0,
  });

  /* -------------------------------------------------------------------------- */
  /*                  check if there is upcomingBooking or not                  */
  /* -------------------------------------------------------------------------- */
  const { isFetching: fetchUpcomingBooking, refetch: callHasUpcomingBooking } = CallAPI({
    name: 'hasUpcomingBooking',
    url: WORKING_HAS_UPCOMING_BOOKING,
    method: 'post',
    onSuccess: (res) => {
      if (res?.data) {
        if (res?.data?.data?.data) {
          setOpenModal(true);
          setID('deleteORNot');
        } else {
          refetch();
        }
      }
    },
    refetchOnWindowFocus: false,
    retry: 0,
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
            return { ...single };
          });
          if (nextDay) {
            return { ...data, day: data.id, shifts: nextDay };
          }
          return { ...data, day: data.id };
        }),
      branchIds: getValues('checkbox'),
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error?.message);
    },
  });

  /* -------------------------------------------------------------------------- */
  /*              update working hours after check upcomingBooking              */
  /* -------------------------------------------------------------------------- */
  const { refetch, isFetching: fethcingUpdating } = CallAPI({
    name: 'updateDefaultWorkingHours',
    url: WORKING_UPDATE_DAYS,
    retry: false,
    method: 'post',
    onSuccess: (data) => {
      if (data.data.isSuccess) {
        setPayload(null);
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
      branchIds: getValues('checkbox'),
    },
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });

  useEffect(() => {
    if (watch) {
      const subscription = watch((input, { name }) => {
        if (get(input, name.substring(0, 7))?.isSelected) {
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

  useEffect(() => {
    if (payload) {
      refetch();
    }
  }, [payload]);

  /* -------------------------------------------------------------------------- */
  /*               logic for check of errors before copy all hours              */
  /* -------------------------------------------------------------------------- */
  const clickSubmitBeforeCopy = (shift, e) => {
    setCopyAllClicked(shift);
  };
  const onSubmit = (data, e) => {
    if (!copyAllClicked) callHasUpcomingBooking();
    if (copyAllClicked) {
      setValue('days', copyAllHoursObject(watch().days, locale, copyAllClicked));
      setCopyAllClicked(false);
    }
  };
  const onError = (err) => {
    setCopyAllClicked(false);
  };
  useEffect(() => {
    if (copyAllClicked) {
      handleSubmit(onSubmit, onError)();
    }
  }, [copyAllClicked]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="px-5 position-relative ">
      {allBranches.length > 1 && (
        <>
          <Row className="informationwizard py-2">
            <Col xs={12} className="informationwizard__title">
              {messages['workingHours.branches.title']}
            </Col>
            <Col xs={12} className="informationwizard__subtitle">
              {messages['workingHours.branches.subtitle']}
            </Col>
            {allBranches?.map((branch, index) => (
              <Col key={branch?.branchId} lg={4} sm={6} className="py-4">
                <Row>
                  <Col xs={1}>
                    <input
                      value={branch?.value}
                      className="informationwizard__checkbox custom-color"
                      type="checkbox"
                      {...register('checkbox')}
                      id={branch?.branchId}
                    />
                  </Col>
                  <Col xs={10}>
                    <label htmlFor={branch.branchId} className="labelBranch">
                      {branch.name}
                    </label>
                    <p className="informationwizard__branchAddress">
                      {branch.address || messages['branches.display.branches.address']}
                    </p>
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
        <Col xs={12} className="informationwizard__title">
          {messages['workingHours.title']}
        </Col>
        <Col xs={12} className="informationwizard__subtitle">
          {messages['workingHours.subtitle']}
        </Col>
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
                      !isFetching &&
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
                    {!day.isSelected && !isFetching && <NoShifts />}
                    <p className="intersectionErrorMessage">
                      {get(errors, `days[${index}].shifts.message`)}
                    </p>
                  </Col>
                </Row>
              </div>
              {day.id === selectedDay?.id && showCopyAll && !errors?.days && (
                <CopyAllWorkingHours
                  handleCopy={() => clickSubmitBeforeCopy(day.shifts)}
                  handleClose={() => setShowCopyAll(false)}
                />
              )}
            </>
          ))}
          <Row className="justify-content-center">
            <Col xs="auto">
              {true && (
                <p
                  className="beuti-input__errormsg mb-4"
                  style={{ position: 'relative' }}
                >
                  {errors?.days?.message}
                </p>
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
          <button
            type="submit"
            className="beutibutton action"
            disabled={fetchUpcomingBooking || fethcingUpdating}
          >
            {messages['common.save']}
          </button>
        </section>
      )}
      <ConfirmationModal
        setPayload={setPayload}
        Id={Id}
        openModal={openModal}
        setOpenModal={setOpenModal}
        message="workingHours.has.booking.old.time"
        title="workingHours.has.booking.old.time.header"
      />
      {(fethcingUpdating || fetchingBranches || isFetching) && (
        <div className="loading fakeSpinner"></div>
      )}
    </form>
  );
};

export default UpdateDefaultWorkingHours;
