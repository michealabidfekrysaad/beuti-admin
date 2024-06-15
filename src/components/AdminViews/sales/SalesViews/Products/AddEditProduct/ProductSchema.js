/* eslint-disable object-shorthand */

import React from 'react';

import * as yup from 'yup';
import { FormattedMessage } from 'react-intl';
export const AddProductSchema = yup
  .object()
  .shape({
    id: yup.string(),
    nameAR: yup
      .string()
      .test('nameENTest', function(val) {
        if (val.length === 0 && this.parent.nameEN.length === 0) {
          return this.createError({
            message: <FormattedMessage id="products.name.ar.error.required" />,
            path: 'nameAR',
          });
        }
        if (val && val.length < 2) {
          return this.createError({
            message: <FormattedMessage id="products.name.ar.error.min" />,
            path: 'nameAR',
          });
        }
        if (val && val.length > 40) {
          return this.createError({
            message: <FormattedMessage id="products.name.ar.error.max" />,
            path: 'nameAR',
          });
        }
        return true;
      })
      .matches(/^(?!\s+$).*/, {
        message: <FormattedMessage id="products.name.ar.error.required" />,
      }),
    nameEN: yup
      .string()
      .test('nameENTest', function(val) {
        if (val.length === 0 && this.parent.nameAR.length === 0) {
          return this.createError({
            message: <FormattedMessage id="products.name.en.error.required" />,
            path: 'nameEN',
          });
        }
        if (val && val.length < 2) {
          return this.createError({
            message: <FormattedMessage id="products.name.en.error.min" />,
            path: 'nameEN',
          });
        }
        if (val && val.length > 40) {
          return this.createError({
            message: <FormattedMessage id="products.name.en.error.max" />,
            path: 'nameEN',
          });
        }
        return true;
      })
      .matches(/^(?!\s+$).*/, {
        message: <FormattedMessage id="products.name.ar.error.required" />,
      }),
    price: yup
      .string()
      .matches(/^[0-9.]*$/, {
        message: <FormattedMessage id="products.price.numbers" />,
      })
      .test('len', <FormattedMessage id="products.price.max" />, (val) => {
        if (val === undefined) {
          return true;
        }
        return val <= 10000;
      })
      .required(<FormattedMessage id="products.price.required" />),
    parcode: yup
      .string()
      .test('barCode Length', function(val) {
        if (val === undefined) {
          return true;
        }
        if (val && val.length < 6) {
          return this.createError({
            message: <FormattedMessage id="products.barcode.min" />,
            path: 'parcode',
          });
        }
        if (val && val.length > 25) {
          return this.createError({
            message: <FormattedMessage id="products.barcode.max" />,
            path: 'parcode',
          });
        }
        return true;
      })
      .matches(/^[0-9]*$/, {
        message: <FormattedMessage id="products.barcode.numbers" />,
      }),
    description: yup
      .string()
      .max(500, <FormattedMessage id="products.description.max" />),
    lowStockAlert: yup
      .string()
      .matches(/^[0-9]*$/, {
        message: <FormattedMessage id="products.lowStockAlert.min" />,
      })
      .test('len', <FormattedMessage id="products.lowStockAlert.max" />, (val) => {
        if (val === undefined) {
          return true;
        }
        return val <= 500000;
      }),
    quantity: yup
      .string()
      .matches(/^[0-9]*$/, {
        message: <FormattedMessage id="products.quantity.min" />,
      })
      .test('len', <FormattedMessage id="products.quantity.max" />, (val) => {
        if (val === undefined) {
          return true;
        }
        return val <= 1000000;
      }),
    Branches: yup
      .array()
      .of(
        yup.object().shape({
          isSelected: yup.boolean(),
          id: yup.string().required(),
          quantity: yup.string().when('isSelected', {
            is: true,
            then: yup
              .string()
              .matches(/^[0-9]*$/, {
                message: <FormattedMessage id="products.quantity.min" />,
              })
              .test('len', <FormattedMessage id="products.quantity.max" />, (val) => {
                if (val === undefined) {
                  return true;
                }
                return val <= 1000000;
              }),
          }),
        }),
      )
      .test({
        name: 'one-true',
        message: <FormattedMessage id="workingHours.branches.required" />,
        test: (val) => !val.every((ele) => !ele.isSelected),
      }),
  })
  .required();

export const EditProductSchema = yup
  .object()
  .shape({
    id: yup.string(),
    nameAR: yup
      .string()
      .test('nameENTest', function(val) {
        if (val.length === 0 && this.parent.nameEN.length === 0) {
          return this.createError({
            message: <FormattedMessage id="products.name.ar.error.required" />,
            path: 'nameAR',
          });
        }
        if (val && val.length < 2) {
          return this.createError({
            message: <FormattedMessage id="products.name.ar.error.min" />,
            path: 'nameAR',
          });
        }
        if (val && val.length > 40) {
          return this.createError({
            message: <FormattedMessage id="products.name.ar.error.max" />,
            path: 'nameAR',
          });
        }
        return true;
      })
      .matches(/^(?!\s+$).*/, {
        message: <FormattedMessage id="products.name.ar.error.required" />,
      }),
    nameEN: yup
      .string()
      .test('nameENTest', function(val) {
        if (val.length === 0 && this.parent.nameAR.length === 0) {
          return this.createError({
            message: <FormattedMessage id="products.name.en.error.required" />,
            path: 'nameEN',
          });
        }
        if (val && val.length < 2) {
          return this.createError({
            message: <FormattedMessage id="products.name.en.error.min" />,
            path: 'nameEN',
          });
        }
        if (val && val.length > 40) {
          return this.createError({
            message: <FormattedMessage id="products.name.en.error.max" />,
            path: 'nameEN',
          });
        }
        return true;
      })
      .matches(/^(?!\s+$).*/, {
        message: <FormattedMessage id="products.name.ar.error.required" />,
      }),
    price: yup
      .string()
      .matches(/^[0-9.]*$/, {
        message: <FormattedMessage id="products.price.numbers" />,
      })
      .test('len', <FormattedMessage id="products.price.max" />, (val) => {
        if (val === undefined) {
          return true;
        }
        return val <= 10000;
      })
      .required(<FormattedMessage id="products.price.required" />),
    parcode: yup
      .string()
      .test('barCode Length', function(val) {
        if (val === undefined) {
          return true;
        }
        if (val && val.length < 6) {
          return this.createError({
            message: <FormattedMessage id="products.barcode.min" />,
            path: 'parcode',
          });
        }
        if (val && val.length > 25) {
          return this.createError({
            message: <FormattedMessage id="products.barcode.max" />,
            path: 'parcode',
          });
        }
        return true;
      })
      .matches(/^[0-9]*$/, {
        message: <FormattedMessage id="products.barcode.numbers" />,
      }),
    description: yup
      .string()
      .max(500, <FormattedMessage id="products.description.max" />),
    lowStockAlert: yup
      .string()
      .matches(/^[0-9]*$/, {
        message: <FormattedMessage id="products.lowStockAlert.min" />,
      })
      .test('len', <FormattedMessage id="products.lowStockAlert.max" />, (val) => {
        if (val === undefined) {
          return true;
        }
        return val <= 500000;
      }),
    quantity: yup
      .string()
      .matches(/^[0-9]*$/, {
        message: <FormattedMessage id="products.quantity.min" />,
      })
      .test('len', <FormattedMessage id="products.quantity.max" />, (val) => {
        if (val === undefined) {
          return true;
        }
        return val <= 1000000;
      }),
  })
  .required();
