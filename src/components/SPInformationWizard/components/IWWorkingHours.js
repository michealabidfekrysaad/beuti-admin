/* eslint-disable react/jsx-props-no-spreading */

import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Col, Row } from 'react-bootstrap';
import {
  hoursMinutesDropDown,
  hoursMinutesDropDownAr,
  disableToOptions,
} from 'constants/hours';
import { useForm } from 'react-hook-form';
import { get } from 'lodash';
import { CallAPI } from 'utils/API/APIConfig';
import { yupResolver } from '@hookform/resolvers/yup';
import { useHistory } from 'react-router-dom';
import { Routes } from 'constants/Routes';
import { schemaStepTwo } from '../schema/IWSchemas';
import SelectInputMUI from '../../../Shared/inputs/SelectInputMUI';
import CopyAllWorkingHours from './IWWorkingHours/CopyAllWorkingHours';
import AddDeleteShift from './IWWorkingHours/AddDeleteShift';
import NoShifts from './IWWorkingHours/NoShifts';
import {
  mainHoursObject,
  copyAllHoursObject,
  defaultShift,
  handleDefaultAndBindingDays,
} from './IWWorkingHours/WorkingHoursObjects';
import DayCheckbox from './IWWorkingHours/DayCheckbox';
import {
  SP_GET_WIZARD_WORKING_TIME_EP,
  SP_ADD_WIZARD_WORKING_TIME_EP,
} from '../../../utils/API/EndPoints/ServiceProviderEP';

const IWWorkingHours = () => {
  const { messages, locale } = useIntl();
  const [showCopyAll, setShowCopyAll] = useState(true);
  const [selectedDay, setSelectedDay] = useState({
    shifts: defaultShift,
  });
  const hoursDD = locale === 'ar' ? hoursMinutesDropDownAr : hoursMinutesDropDown;
  const history = useHistory();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(schemaStepTwo),
    defaultValues: {
      days: mainHoursObject(locale),
    },
  });
  CallAPI({
    name: 'get working hours',
    url: SP_GET_WIZARD_WORKING_TIME_EP,
    onSuccess: (data) =>
      setValue('days', handleDefaultAndBindingDays(data.data?.data, locale)),
    enabled: true,
    refetchOnWindowFocus: false,
    retry: 0,
  });
  const { refetch } = CallAPI({
    name: 'add working hours',
    url: SP_ADD_WIZARD_WORKING_TIME_EP,
    method: 'post',
    onSuccess: (data) => {
      if (data.data.isSuccess) {
        history.push(Routes.spinformationwizardStepThree);
      }
    },
    body: {
      workingDays: watch()
        .days.filter((day) => day.isSelected)
        .map((data) => ({ ...data, day: data.id })),
    },
  });

  useEffect(() => {
    if (watch) {
      const subscription = watch((input, { name }) => {
        if (get(input, name.substring(0, 7)).isSelected) {
          setSelectedDay(get(input, name.substring(0, 7)));
          setShowCopyAll(true);
        } else {
          setSelectedDay({
            shifts: defaultShift,
          });
        }
      });
      return () => subscription.unsubscribe();
    }
    return null;
  }, [watch]);

  return (
    <form onSubmit={handleSubmit(refetch)}>
      <Row className="informationwizard">
        <Col xs={12} className="informationwizard__title">
          {messages['rw.bussinessHours.title']}
        </Col>
        <Col xs={12} className="informationwizard__subtitle">
          {messages['rw.bussinessHours.subtitle']}
        </Col>
        <Col xs={12} className="informationwizard__box">
          {watch().days.map((day, index) => (
            <div key={day.id}>
              <Row className="informationwizard__box-day">
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
                  />
                </Col>
                <Col xs="auto" className="flex-grow-1">
                  {day.isSelected &&
                    day.shifts.map((shift, i) => (
                      <Row className="informationwizard__box-day--shift">
                        <Col xs="12" lg="4" className="flex-grow-1">
                          <SelectInputMUI
                            list={hoursDD.map(({ value, text }) => ({
                              text,
                              id: value,
                            }))}
                            useFormRef={register(`days[${index}].shifts[${i}].startTime`)}
                            watch={watch}
                            defaultValue={shift.startTime}
                            error={
                              get(
                                errors,
                                `days[${index}].shifts[${i}].startTime.message`,
                              ) || get(errors, `days[${index}].shifts.message`)
                            }
                          />
                        </Col>
                        <Col xs="auto flex-grow-1 text-center">
                          {messages['common.to']}
                        </Col>
                        <Col xs="12" lg="4" className="flex-grow-1">
                          <SelectInputMUI
                            list={hoursDD.map(({ value, text }) => ({
                              text,
                              id: value,
                            }))}
                            id="0"
                            useFormRef={register(`days[${index}].shifts[${i}].endTime`)}
                            watch={watch}
                            defaultValue={shift.endTime}
                            disabledOptions={(option) =>
                              disableToOptions(shift.startTime, option)
                            }
                            error={
                              get(
                                errors,
                                `days[${index}].shifts[${i}].endTime.message`,
                              ) || get(errors, `days[${index}].shifts.message`)
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
                  {!day.isSelected && <NoShifts />}
                </Col>
                {day.id === selectedDay?.id && showCopyAll && (
                  <CopyAllWorkingHours
                    handleCopy={() =>
                      setValue('days', copyAllHoursObject(day.shifts, watch().days))
                    }
                    handleClose={() => setShowCopyAll(false)}
                  />
                )}
              </Row>
            </div>
          ))}
          <Row className="justify-content-center">
            <Col xs="auto">
              {true && <p className="text-danger">{errors?.days?.message}</p>}
            </Col>
          </Row>
        </Col>
        <Col className="text-center my-5" xs="12">
          <button
            type="button"
            onClick={() => history.push(Routes.spinformationwizardStepOne)}
            className="informationwizard__previous"
          >
            {messages['common.previous']}
          </button>
          <button type="submit" className="informationwizard__submit">
            {messages['common.next']}
          </button>
        </Col>
      </Row>
    </form>
  );
};

export default IWWorkingHours;
