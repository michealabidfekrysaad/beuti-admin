/* eslint-disable object-shorthand */

import React from 'react';

import * as yup from 'yup';
import { FormattedMessage } from 'react-intl';

export const AddBookingSchema = yup
  .object({
    notes: yup.string().max(500, <FormattedMessage id="booking.notes.max" />),
    bookedServices: yup
      .array()
      .of(
        yup.object().shape({
          startTime: yup.string().required(),
          employeeId: yup.string().test({
            name: 'required',
            message: <FormattedMessage id="booking.employee.isrequired" />,
            test: function(e) {
              if (this.parent.selectId && !e && !this.parent.isPackage) {
                return false;
              }

              return true;
            },
          }),
          packageServices: yup
            .array()
            .of(
              yup.object().shape({
                startTime: yup.string().required(),
                employeeId: yup.string().test({
                  name: 'required',
                  message: <FormattedMessage id="booking.employee.isrequired" />,
                  test: function(e) {
                    if (this.parent.selectId && !e) {
                      return false;
                    }

                    return true;
                  },
                }),
              }),
            )
            .nullable(),
        }),
      )
      .test({
        name: 'one-true',
        message: <FormattedMessage id="rw.bussinessHours.validation.required" />,
        test: (val) => !val.every((ele) => !ele.selectId),
      })
      .required(),
  })
  .required();
