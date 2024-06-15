/* eslint-disable object-shorthand */

import React from 'react';

import * as yup from 'yup';
import { FormattedMessage } from 'react-intl';
import { noSpacesNoSpeicalChars } from 'constants/regex';
export const AddOfferSchema = yup
  .object()
  .shape({
    nameAR: yup
      .string()
      .min(2, <FormattedMessage id="offers.name.ar.error.min" />)
      .max(30, <FormattedMessage id="offers.name.ar.error.max" />)
      .matches(noSpacesNoSpeicalChars, {
        message: <FormattedMessage id="offers.name.ar.error.required" />,
      })
      .required(<FormattedMessage id="offers.name.ar.error.required" />),
    nameEN: yup
      .string()
      .min(2, <FormattedMessage id="offers.name.en.error.min" />)
      .max(30, <FormattedMessage id="offers.name.en.error.max" />)
      .matches(noSpacesNoSpeicalChars, {
        message: <FormattedMessage id="offers.name.en.error.required" />,
      })
      .required(<FormattedMessage id="offers.name.en.error.required" />),
    percentage: yup
      .string()
      .matches(/^[1-9][0-9]?$/, {
        message: <FormattedMessage id="admin.setttings.vat.error" />,
      })
      .min(1, <FormattedMessage id="admin.setttings.vat.error" />)
      .max(2, <FormattedMessage id="admin.setttings.vat.error" />)
      .required(<FormattedMessage id="admin.setttings.vat.error" />),
    reservationStart: yup
      .date()
      .max(
        yup.ref('reservationEnd'),
        <FormattedMessage id="closing.period.date.error.start" />,
      )
      .required(),
    reservationEnd: yup
      .date()
      .test('reservationEnd', function(val) {
        if (
          new Date(this.parent.reservationStart.setSeconds(0, 0)).getTime() >
          new Date(val.setSeconds(0, 0)).getTime()
        ) {
          return this.createError({
            message: <FormattedMessage id="closing.period.date.error.end" />,
            path: 'reservationEnd',
          });
        }

        return true;
      })
      .required(),
    receivingService: yup.bool(),
    bookingStart: yup
      .date()
      .test('bookingStart', function(val) {
        if (
          this.parent.receivingService &&
          new Date(this.parent.bookingEnd.setSeconds(0, 0)).getTime() <
            new Date(val.setSeconds(0, 0)).getTime()
        ) {
          return this.createError({
            message: <FormattedMessage id="closing.period.date.error.start" />,
            path: 'bookingStart',
          });
        }
        if (
          this.parent.receivingService &&
          new Date(this.parent.reservationStart.setSeconds(0, 0)).getTime() >
            new Date(val.setSeconds(0, 0)).getTime()
        ) {
          return this.createError({
            message: <FormattedMessage id="offer.input.date.end.reservation.error" />,
            path: 'bookingStart',
          });
        }

        return true;
      })
      .required(),
    bookingEnd: yup
      .date()
      .test('bookingEnd', function(val) {
        if (
          this.parent.receivingService &&
          new Date(this.parent.bookingStart.setSeconds(0, 0)).getTime() >
            new Date(val.setSeconds(0, 0)).getTime()
        ) {
          return this.createError({
            message: <FormattedMessage id="closing.period.date.error.end" />,
            path: 'bookingEnd',
          });
        }
        if (
          this.parent.receivingService &&
          new Date(this.parent.reservationStart.setSeconds(0, 0)).getTime() >
            new Date(val.setSeconds(0, 0)).getTime()
        ) {
          return this.createError({
            message: <FormattedMessage id="offer.input.date.end.reservation.error" />,
            path: 'bookingEnd',
          });
        }
        // when end date of reservation  before end date  of receive service
        if (
          this.parent.receivingService &&
          new Date(this.parent.reservationEnd.setSeconds(0, 0)).getTime() >
            new Date(val.setSeconds(0, 0)).getTime()
        ) {
          return this.createError({
            message: <FormattedMessage id="closing.period.date.error.reservation.end" />,
            path: 'bookingEnd',
          });
        }

        return true;
      })
      .required(),
    servicesOptions: yup
      .mixed()
      .test({
        name: 'EmptyOrNot',
        message: <FormattedMessage id="offers.services.error.min" />,
        test: function(value) {
          if (
            value?.length === 0 ||
            value
              ?.flat()
              ?.map((el) => el.services)
              .flat()
              ?.map((el) => el?.options)
              .flat()
              .filter((el) => el?.serviceOptionID)?.length === 0
          )
            return false;
          return true;
        },
      })
      //   this test is not very important
      .test({
        name: 'lesThanOne',
        message: <FormattedMessage id="offers.services.error.min" />,
        test: (value) => {
          let sum = 0;
          value
            ?.flat()
            ?.map((el) => el.services)
            .flat()
            ?.map((el) => el?.options)
            ?.flat()
            ?.filter((el) => el?.count)
            ?.forEach((element) => {
              sum += element.count;
            });
          if (
            value
              ?.flat()
              ?.map((el) => el.services)
              .flat()
              ?.map((el) => el?.options)
              ?.flat()
              ?.filter((el) => el?.serviceOptionID)?.length < 1 &&
            sum < 1
          ) {
            return false;
          }
          if (sum < 1) {
            return false;
          }
          return true;
        },
      }),
  })
  .required();
