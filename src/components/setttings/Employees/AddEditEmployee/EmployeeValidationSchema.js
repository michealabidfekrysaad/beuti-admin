/* eslint-disable object-shorthand */

import React from 'react';

import * as yup from 'yup';
import { FormattedMessage } from 'react-intl';
export const AddEditEmployeeSchema = yup
  .object({
    employee: yup.object().shape({
      id: yup.string(),
      nameAr: yup
        .string()
        .min(2, <FormattedMessage id="rw.emoloyees.name.ar.error.min" />)
        .max(30, <FormattedMessage id="rw.emoloyees.name.ar.error.max" />)
        .matches(/^(?!\s+$).*/, {
          message: <FormattedMessage id="rw.emoloyees.name.ar.error.required" />,
        })
        .required(<FormattedMessage id="rw.emoloyees.name.ar.error.required" />),
      nameEn: yup
        .string()
        .min(2, <FormattedMessage id="rw.emoloyees.name.en.error.min" />)
        .max(30, <FormattedMessage id="rw.emoloyees.name.en.error.max" />)
        .matches(/^(?!\s+$).*/, {
          message: <FormattedMessage id="rw.emoloyees.name.en.error.required" />,
        })
        .required(<FormattedMessage id="rw.emoloyees.name.en.error.required" />),
      workingLocation: yup
        .number()
        .oneOf([1, 2, 3])
        .required(<FormattedMessage id="rw.emoloyees.location.required" />),

      mobileNumber: yup
        .string()
        .test('phoneTest', function(val) {
          if (val && val.length !== 8) {
            return this.createError({
              message: (
                <FormattedMessage id="register.phonenumber.error.required.saudia" />
              ),
              path: 'employee.mobileNumber',
            });
          }
          return true;
        })
        .matches(/^[0-9]*$/, {
          message: <FormattedMessage id="register.phonenumber.error.required.saudia" />,
        })
        .nullable(),

      email: yup
        .string()
        .email(<FormattedMessage id="rw.generaldetails.email.valid" />)
        .nullable(),
      isCasher: yup.boolean(),

      casherPin: yup
        .string()
        .when('isCasher', {
          is: true,
          then: yup
            .string()
            .matches(/^[0-9]*$/, {
              message: <FormattedMessage id="setting.employee.pin.validation" />,
            })
            .length(4, <FormattedMessage id="setting.employee.pin.validation" />)
            .required(<FormattedMessage id="setting.employee.pin.validation" />),
        })
        .nullable(),
      branches: yup
        .array()
        .of(
          yup.object().shape({
            isSelected: yup.boolean(),
            id: yup.string().required(),
          }),
        )
        .test({
          name: 'one-true',
          message: <FormattedMessage id="workingHours.branches.required" />,
          test: (val) => !val.every((ele) => !ele.isSelected),
        }),
      staffTItleAr: yup
        .string()
        .test('staffTItleAr', function(val) {
          if (val && val.length < 2) {
            return this.createError({
              message: <FormattedMessage id="rw.emoloyees.title.ar.error.min" />,
              path: 'employee.staffTItleAr',
            });
          }
          return true;
        })
        .max(30, <FormattedMessage id="rw.emoloyees.title.ar.error.max" />)
        .nullable(),
      staffTItleEn: yup
        .string()
        .test('staffTItleEn', function(val) {
          if (val && val.length < 2) {
            return this.createError({
              message: <FormattedMessage id="rw.emoloyees.title.en.error.min" />,
              path: 'employee.staffTItleEn',
            });
          }
          return true;
        })
        .max(30, <FormattedMessage id="rw.emoloyees.title.en.error.max" />)
        .nullable(),
      notes: yup
        .string()
        .test('notes', function(val) {
          if (val && val.length < 2) {
            return this.createError({
              message: <FormattedMessage id="setting.customer.notes.error.min" />,
              path: 'employee.notes',
            });
          }
          return true;
        })
        .max(500, <FormattedMessage id="setting.customer.notes.error.max" />)
        .nullable(),
      servicesCommission: yup
        .string()
        .matches(/^[0-9]*$/, {
          message: <FormattedMessage id="admin.setttings.vat.error" />,
        })
        .min(1, <FormattedMessage id="admin.setttings.vat.error" />)
        .max(2, <FormattedMessage id="admin.setttings.vat.error" />),
      productsCommission: yup
        .string()
        .matches(/^[0-9]*$/, {
          message: <FormattedMessage id="admin.setttings.vat.error" />,
        })
        .min(1, <FormattedMessage id="admin.setttings.vat.error" />)
        .max(2, <FormattedMessage id="admin.setttings.vat.error" />),
      offersCommission: yup
        .string()
        .matches(/^[0-9]*$/, {
          message: <FormattedMessage id="admin.setttings.vat.error" />,
        })
        .min(1, <FormattedMessage id="admin.setttings.vat.error" />)
        .max(2, <FormattedMessage id="admin.setttings.vat.error" />),
      startWorkingDate: yup
        .date()
        .max(
          yup.ref('endWorkingDate'),
          <FormattedMessage id="closing.period.date.error.start" />,
        )
        .nullable(),
      endWorkingDate: yup
        .date()
        .min(
          yup.ref('startWorkingDate'),
          <FormattedMessage id="closing.period.date.error.end" />,
        )
        .nullable(),
    }),
  })
  .required();
