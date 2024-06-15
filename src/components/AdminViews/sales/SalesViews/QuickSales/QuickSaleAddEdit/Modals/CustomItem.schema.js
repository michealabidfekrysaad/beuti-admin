/* eslint-disable object-shorthand */

import React from 'react';

import { FormattedMessage } from 'react-intl';
import * as yup from 'yup';

const enArDigitsSomeSpecial = /^(?!\s+$).[أ-ي a-zA-Z0-9.,-_/`&%\-:/ ]*$/;

export const CustomItemschema = yup.object().shape({
  name: yup.string().test('nameTest', function(val) {
    if (val && !enArDigitsSomeSpecial.test(val)) {
      return this.createError({
        message: <FormattedMessage id="sales.custom.item.name.required" />,
        path: 'name',
      });
    }
    if (val && val.length < 2) {
      return this.createError({
        message: <FormattedMessage id="sales.custom.item.name.validation.min" />,
        path: 'name',
      });
    }
    if (val && val.length > 30) {
      return this.createError({
        message: <FormattedMessage id="sales.custom.item.name.validation.max" />,
        path: 'name',
      });
    }

    return true;
  }),
  price: yup
    .string()
    .matches(/^[0-9.]*$/, {
      message: <FormattedMessage id="checkout.price.pay.number" />,
    })
    .test('len', <FormattedMessage id="products.price.max" />, (val) => {
      if (val === undefined) {
        return true;
      }
      return val <= 10000;
    })
    .required(<FormattedMessage id="checkout.price.pay.required" />),
});
