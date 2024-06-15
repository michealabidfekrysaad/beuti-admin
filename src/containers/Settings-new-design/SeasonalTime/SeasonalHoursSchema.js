/* eslint-disable object-shorthand */

import React from 'react';

import * as yup from 'yup';

import { FormattedMessage, useIntl } from 'react-intl';
import { getDDTimeByValueDefaultTime } from '../../../constants/hours';

export const SeasonalHoursSchema = () => {
  const { messages } = useIntl();

  return yup.object().shape({
    days: yup.array().of(
      yup
        .object()
        .shape({
          id: yup.string(),
          name: yup.string().required(),
          shifts: yup
            .array()
            .of(
              yup.object().shape({
                id: yup.string().required(),
                isSelected: yup.boolean(),
                startTime: yup
                  .string()
                  .test({
                    name: 'startOfSecondShiftOnSameDay',
                    message: messages['workingHours.startTime.same.day'],
                    test: function(val) {
                      const midNightOfTheDay = getDDTimeByValueDefaultTime('23:55:00')
                        .key;
                      if (
                        getDDTimeByValueDefaultTime(this.parent.startTime).key >
                        midNightOfTheDay
                      ) {
                        return false;
                      }
                      return true;
                    },
                  })
                  .required(),
                endTime: yup
                  .string()
                  .test({
                    name: 'checkEndOfDayAndStartOfNextDay',
                    message: messages['workingHours.endTime.relative.next.day'],
                    test: function(val) {
                      let keyOfStartTimeNextDay = 0;
                      const midNightOfTheDay = getDDTimeByValueDefaultTime('23:55:00')
                        .key;
                      const EndTimeOfDayKey = getDDTimeByValueDefaultTime(val).key;
                      const idOfTheDayChangingOn = this?.from[1]?.value?.id;
                      const idOfNextDay =
                        idOfTheDayChangingOn !== 6 ? idOfTheDayChangingOn + 1 : 0;
                      const theNextEnabledDay = this?.from[2]?.value?.days.find(
                        (day) => +day?.id === idOfNextDay && day?.isSelected,
                      );
                      if (theNextEnabledDay)
                        keyOfStartTimeNextDay = getDDTimeByValueDefaultTime(
                          theNextEnabledDay?.shifts[0]?.startTime,
                        ).key;

                      if (
                        theNextEnabledDay &&
                        EndTimeOfDayKey > midNightOfTheDay &&
                        EndTimeOfDayKey - midNightOfTheDay > keyOfStartTimeNextDay
                      )
                        return false;
                      return true;
                    },
                  })
                  .test({
                    name: 'checkBiggerThan',
                    message: (
                      <FormattedMessage id="rw.bussinessHours.validation.endtime.less" />
                    ),
                    test: function(val) {
                      if (
                        getDDTimeByValueDefaultTime(this.parent.startTime).key >=
                        getDDTimeByValueDefaultTime(val).key
                      ) {
                        return false;
                      }
                      return true;
                    },
                  })
                  .required(),
              }),
            )
            .test({
              name: 'intersection',
              message: <FormattedMessage id="bussinessHours.validation.intersection" />,
              test: (val) => {
                if ((val[0], val[1])) {
                  const startTimeShiftOneKey = getDDTimeByValueDefaultTime(
                    val[0].startTime,
                  ).key;
                  const endTimeShiftOneKey = getDDTimeByValueDefaultTime(val[0].endTime)
                    .key;
                  const startTimeShiftTwoKey = getDDTimeByValueDefaultTime(
                    val[1].startTime,
                  ).key;
                  const endTimeShiftTwoKey = getDDTimeByValueDefaultTime(val[1].endTime)
                    .key;
                  if (
                    startTimeShiftOneKey <= startTimeShiftTwoKey &&
                    endTimeShiftOneKey >= startTimeShiftTwoKey
                  ) {
                    return false;
                  }
                  if (
                    startTimeShiftOneKey <= endTimeShiftTwoKey &&
                    endTimeShiftOneKey >= endTimeShiftTwoKey
                  ) {
                    return false;
                  }
                  if (
                    startTimeShiftTwoKey <= startTimeShiftOneKey &&
                    endTimeShiftTwoKey >= startTimeShiftOneKey
                  ) {
                    return false;
                  }
                  if (
                    startTimeShiftTwoKey <= endTimeShiftOneKey &&
                    endTimeShiftTwoKey >= endTimeShiftOneKey
                  ) {
                    return false;
                  }
                }
                return true;
              },
            })
            .required(),
        })
        .required(),
    ),
    seasonAr: yup
      .string()
      .required(messages['workingHours.season.name.ar.required'])
      .min(2, messages['workingHours.season.name.ar.min'])
      .max(50, messages['workingHours.season.name.ar.max']),
    seasonEn: yup
      .string()
      .required(messages['workingHours.season.name.en.required'])
      .min(2, messages['workingHours.season.name.en.min'])
      .max(50, messages['workingHours.season.name.en.max']),
    checkbox: yup
      .array()
      .test({
        name: 'arrayOfBranches',
        message: messages['workingHours.branches.required'],
        test: (val) => {
          if (val.length > 0 || val === 'string') {
            return true;
          }
          return false;
        },
      })
      .required(messages['workingHours.branches.required']),
  });
};
