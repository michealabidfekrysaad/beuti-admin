/* eslint-disable object-shorthand */

import React from 'react';

import * as yup from 'yup';
import { FormattedMessage } from 'react-intl';
import { getDDTimeByValue } from '../../../constants/hours';

export const schemaStepOne = yup
  .object({
    address: yup
      .string()
      .required(<FormattedMessage id="rw.generaldetails.address.required" />),
    cityId: yup
      .string()
      .required(<FormattedMessage id="rw.generaldetails.city.required" />),
    email: yup.string().email(<FormattedMessage id="rw.generaldetails.email.valid" />),
    descriptionAr: yup
      .string()
      .max(500, <FormattedMessage id="rw.generaldetails.bio.arabic.length.max" />),
    descriptionEn: yup
      .string()
      .max(500, <FormattedMessage id="rw.generaldetails.bio.english.length.max" />),
  })
  .required();

export const schemaStepTwo = yup
  .object({
    days: yup
      .array()
      .of(
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
                  startTime: yup.string().required(),
                  endTime: yup
                    .string()
                    .test({
                      name: 'checkBiggerThan',
                      message: (
                        <FormattedMessage id="rw.bussinessHours.validation.endtime.less" />
                      ),
                      test: function(val) {
                        if (
                          getDDTimeByValue(this.parent.startTime).key >=
                          getDDTimeByValue(val).key
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
                message: (
                  <FormattedMessage id="rw.bussinessHours.validation.intersection" />
                ),
                test: (val) => {
                  if ((val[0], val[1])) {
                    const startTimeShiftOneKey = getDDTimeByValue(val[0].startTime).key;
                    const endTimeShiftOneKey = getDDTimeByValue(val[0].endTime).key;
                    const startTimeShiftTwoKey = getDDTimeByValue(val[1].startTime).key;
                    const endTimeShiftTwoKey = getDDTimeByValue(val[1].endTime).key;
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
      )
      .test({
        name: 'one-true',
        message: <FormattedMessage id="rw.bussinessHours.validation.required" />,
        test: (val) => !val.every((ele) => !ele.isSelected),
      })
      .required(),
  })
  .required();

export const schemaStepThree = yup
  .object({
    employee: yup.object().shape({
      id: yup.string(),
      nameEn: yup
        .string()
        .min(2, <FormattedMessage id="rw.emoloyees.name.en.error.min" />)
        .max(30, <FormattedMessage id="rw.emoloyees.name.en.error.max" />)
        .matches(/^(?!\s+$).*/, {
          message: <FormattedMessage id="rw.emoloyees.name.en.error.required" />,
        })
        .required(<FormattedMessage id="rw.emoloyees.name.en.error.required" />),
      nameAr: yup
        .string()
        .min(2, <FormattedMessage id="rw.emoloyees.name.ar.error.min" />)
        .max(30, <FormattedMessage id="rw.emoloyees.name.ar.error.max" />)
        .matches(/^(?!\s+$).*/, {
          message: <FormattedMessage id="rw.emoloyees.name.ar.error.required" />,
        })
        .required(<FormattedMessage id="rw.emoloyees.name.ar.error.required" />),
      workingLocation: yup
        .number()
        .oneOf([1, 2, 3])
        .required(<FormattedMessage id="rw.emoloyees.location.required" />),
    }),
  })
  .required();
