/* eslint-disable object-shorthand */

import React from 'react';

import * as yup from 'yup';
import { FormattedMessage } from 'react-intl';
import { noSpacesNoSpeicalChars, onlyNums, onlySpaces } from 'constants/regex';
export const addVoucherSchema = yup
  .object()
  .shape({
    code: yup
      .string()
      .min(2, <FormattedMessage id="voucher.name.error.min" />)
      .max(30, <FormattedMessage id="voucher.name.error.max" />)
      .test({
        name: 'fullSpacesString',
        message: <FormattedMessage id="voucher.name.error.required" />,
        test: (value) => !onlySpaces.test(value),
      })
      .required(<FormattedMessage id="voucher.name.error.required" />),
    value: yup
      .string()
      .matches(onlyNums, {
        message: <FormattedMessage id="admin.setttings.minimumPrice.error" />,
      })
      .max(5, <FormattedMessage id="admin.setttings.minimumPrice.error" />)
      .required(<FormattedMessage id="admin.setttings.minimumPrice.error" />),
    startDate: yup
      .date()
      .max(yup.ref('endDate'), <FormattedMessage id="closing.period.date.error.start" />)
      .required(),
    endDate: yup
      .date()
      .test('endDate', function(val) {
        if (
          new Date(this.parent.startDate.setSeconds(0, 0)).getTime() >
          new Date(val.setSeconds(0, 0)).getTime()
        ) {
          return this.createError({
            message: <FormattedMessage id="closing.period.date.error.end" />,
            path: 'endDate',
          });
        }

        return true;
      })
      .required(),
  })
  .required();
