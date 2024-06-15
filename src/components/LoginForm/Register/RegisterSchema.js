import React from 'react';

import * as yup from 'yup';
import { FormattedMessage } from 'react-intl';

export const schema = yup
  .object({
    nameAR: yup
      .string()
      .min(3, <FormattedMessage id="register.salonnameAr.error.min" />)
      .max(40, <FormattedMessage id="register.salonnameAr.error.max" />)
      .required(<FormattedMessage id="register.salonnameAr.error.required" />),
    nameEN: yup
      .string()
      .min(3, <FormattedMessage id="register.salonnameEn.error.min" />)
      .max(40, <FormattedMessage id="register.salonnameEn.error.max" />)
      .required(<FormattedMessage id="register.salonnameEn.error.required" />),
    mobileNumber: yup.string().when('coupon', {
      is: '',
      then: yup
        .string()
        .matches(/^05[0-9]*$/, {
          message: <FormattedMessage id="register.phonenumber.error.required.saudia" />,
        })
        .length(10, <FormattedMessage id="register.phonenumber.error.required.saudia" />)
        .required(<FormattedMessage id="register.phonenumber.error.required" />),
    }),
    password: yup
      .string()
      .min(6, <FormattedMessage id="register.password.error.min" />)
      .max(64, <FormattedMessage id="register.password.error.max" />)
      .required(<FormattedMessage id="register.password.error.required" />),
    coupon: yup
      .string()
      .max(50, <FormattedMessage id="register.password.error.coupon" />),
    terms: yup
      .boolean()
      .oneOf([true], <FormattedMessage id="register.terms.error.required" />),
  })
  .required();
