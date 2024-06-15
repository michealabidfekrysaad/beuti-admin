import React from 'react';
import { FormattedMessage } from 'react-intl';
import * as yup from 'yup';
const enArDigitsSomeSpecial = /^(?!\s+$).[أ-ي a-zA-Z0-9.,-_/`&%\-:/ ]*$/;

export const CustomItemschema = (
  discountBySar,
  activeDiscount,
  maxPrice,
  EditedItemClicked,
  messages,
) =>
  yup.object().shape({
    name: yup.string().test('nameTest', function(val) {
      if (val && !enArDigitsSomeSpecial.test(val)) {
        return this.createError({
          message: messages['sales.custom.item.name.required'],
          path: 'name',
        });
      }
      if (val && val.length < 2) {
        return this.createError({
          message: messages['sales.custom.item.name.validation.min'],
          path: 'name',
        });
      }
      if (val && val.length > 30) {
        return this.createError({
          message: messages['sales.custom.item.name.validation.max'],
          path: 'name',
        });
      }

      return true;
    }),
    price: yup
      .string()
      .matches(/^[0-9.]*$/, {
        message: messages['checkout.price.pay.number'],
      })
      .test({
        name: 'len',
        message: messages['products.price.max'],
        test: (val) => {
          if (val === undefined) {
            return true;
          }
          return val <= 10000;
        },
      })
      .required(messages['checkout.price.pay.required']),
    priceWithVat: yup.number(),
    discountPercentage:
      !discountBySar &&
      activeDiscount &&
      yup
        .string()
        .matches(/^[0-9./]*$/, {
          message: messages['sales.custom.item.discount.percentage.required'],
        })
        .test('len', messages['sales.custom.item.discount.percentage.max'], (val) => {
          if (val === undefined) {
            return true;
          }
          return val <= 100;
        })
        .required(messages['sales.custom.item.discount.percentage.min']),
    discountSar:
      discountBySar &&
      activeDiscount &&
      yup
        .string()
        .matches(/^[0-9./]*$/, {
          message: `${messages['sales.custom.item.discount.sar.required']} ${maxPrice} ${messages['common.currency']}`,
        })
        .test(
          'len',
          `${messages['sales.custom.item.discount.sar.required']} ${maxPrice} ${messages['common.currency']}`,
          (val) => {
            if (val === undefined) {
              return true;
            }
            return val <= maxPrice;
          },
        )
        .required(
          `${messages['sales.custom.item.discount.sar.required']} ${maxPrice} ${messages['common.currency']}`,
        ),
    finalPrice: yup.number(),
    quantity:
      EditedItemClicked?.item &&
      yup
        .string()
        .test('len', messages['products.quantity.min'], (val) => {
          if (!val) {
            return true;
          }
          return +val >= 1;
        })
        .test('len', messages['products.quantity.max'], (val) => {
          if (val === undefined) {
            return true;
          }
          return +val <= 1000000;
        })
        .required(messages['checkout.edit.booking.quantity.required']),
    freequantity:
      EditedItemClicked?.item &&
      yup
        ?.string()
        .matches(/^[0-9.]*$/, {
          message: messages['sales.edit.product.shema.free.must.be.num'],
        })
        .test('freeQuanitiyLessThantotal', function(val) {
          if (
            val?.length &&
            this.parent.quantity.length &&
            +val > +this.parent.quantity
          ) {
            return this.createError({
              message: <FormattedMessage id="sales.edit.product.free.quantity" />,
              path: 'freequantity',
            });
          }
          return true;
        }),
  });
