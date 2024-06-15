/* eslint-disable object-shorthand */

import React from 'react';

import * as yup from 'yup';

import { FormattedMessage, useIntl } from 'react-intl';

export const AddEditClosingPeriodSchema = yup.object().shape({
  reasonAr: yup
    .string()
    .required(<FormattedMessage id="closing.period.reason.ar.error.required" />)
    .min(3, <FormattedMessage id="closing.period.reason.ar.error.min" />)
    .max(150, <FormattedMessage id="closing.period.reason.ar.error.max" />)
    .matches(/^(?!\s+$).*/, {
      message: <FormattedMessage id="closing.period.reason.ar.error.required" />,
    }),
  reasonEn: yup
    .string()
    .required(<FormattedMessage id="closing.period.reason.en.error.required" />)
    .min(3, <FormattedMessage id="closing.period.reason.en.error.min" />)
    .max(150, <FormattedMessage id="closing.period.reason.en.error.max" />)
    .matches(/^(?!\s+$).*/, {
      message: <FormattedMessage id="closing.period.reason.en.error.required" />,
    }),
  branches: yup
    .array()
    .test({
      name: 'arrayOfBranches',
      message: <FormattedMessage id="workingHours.branches.required" />,
      test: (val) => {
        if (val.length > 0 || val === 'string') {
          return true;
        }
        return false;
      },
    })
    .required(<FormattedMessage id="workingHours.branches.required" />),
  startDate: yup
    .date()
    .max(yup.ref('endDate'), <FormattedMessage id="closing.period.date.error.start" />),
  endDate: yup
    .date()
    .min(yup.ref('startDate'), <FormattedMessage id="closing.period.date.error.end" />),
});
