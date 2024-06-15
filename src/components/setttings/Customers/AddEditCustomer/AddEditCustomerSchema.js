/* eslint-disable object-shorthand */

import React from 'react';

import * as yup from 'yup';

import { FormattedMessage } from 'react-intl';
const noSpacesNoSpeicalChars = /^(?!\s+$).[أ-ي a-zA-Z0-9.\-:/ ]*$/;
export const AddEditCustomerSchema = yup.object().shape({
  name: yup.string().test('nameTest', function(val) {
    if (val && !noSpacesNoSpeicalChars.test(val)) {
      return this.createError({
        message: <FormattedMessage id="setting.customer.name.required" />,
        path: 'name',
      });
    }
    if (val.length === 0 && this.parent.phone.length === 0) {
      return this.createError({
        message: <FormattedMessage id="setting.customer.name.required" />,
        path: 'name',
      });
    }
    if (val && val.length < 2) {
      return this.createError({
        message: <FormattedMessage id="setting.customer.name.error.min" />,
        path: 'name',
      });
    }
    if (val && val.length > 30) {
      return this.createError({
        message: <FormattedMessage id="setting.customer.name.error.max" />,
        path: 'name',
      });
    }

    return true;
  }),
  email: yup.string().email(<FormattedMessage id="rw.generaldetails.email.valid" />),
  phone: yup
    .string()
    .test('phoneTest', function(val) {
      if (val.length === 0 && this.parent.name.length === 0) {
        return this.createError({
          message: <FormattedMessage id="register.phonenumber.error.required" />,
          path: 'phone',
        });
      }
      if (val && val.length !== 8) {
        return this.createError({
          message: <FormattedMessage id="register.phonenumber.error.required.saudia" />,
          path: 'phone',
        });
      }
      return true;
    })
    .matches(/^[0-9]*$/, {
      message: <FormattedMessage id="register.phonenumber.error.required.saudia" />,
    }),

  notes: yup
    .string()
    .max(500, <FormattedMessage id="setting.customer.notes.error.max" />),
});
