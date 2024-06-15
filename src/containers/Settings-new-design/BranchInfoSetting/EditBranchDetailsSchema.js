/* eslint-disable no-restricted-globals */
import React from 'react';
import * as yup from 'yup';
import { useIntl, FormattedMessage } from 'react-intl';

export const EditBranchDetailsSchema = () => {
  const { messages } = useIntl();

  return yup.object().shape({
    branchNameAr: yup
      .string()
      .required(
        <FormattedMessage
          id="branches.error.required"
          values={{ nameReuired: `${messages['branches.add.new.branch.name.ar']}` }}
        />,
      )
      .min(3, messages['branches.error.min.length.ar'])
      .max(40, messages['branches.error.max.length.ar'])
      .matches(/^[^-\s].+$/, {
        message: `${messages['branches.no.spaces.start.ar']}`,
      }),
    branchNameEn: yup
      .string()
      .required(
        <FormattedMessage
          id="branches.error.required"
          values={{ nameReuired: `${messages['branches.add.new.branch.name.en']}` }}
        />,
      )
      .min(3, messages['branches.error.min.length.en'])
      .max(40, messages['branches.error.max.length.en'])
      .matches(/^[^-\s].+$/, {
        message: `${messages['branches.no.spaces.start.en']}`,
      }),
    communicationNum: yup
      .string()
      .test({
        name: 'onlyNumbers',
        message: messages['branch.communication.num'],
        test: (val) => {
          if (/^[0-9+]*$/.test(val)) {
            return true;
          }
          return false;
        },
      })
      .test({
        name: 'minLength',
        message: messages['branch.communication.num.min'],
        test: (val) => {
          if (val?.length && val?.length < 7) {
            return false;
          }
          return true;
        },
      })
      .test({
        name: 'maxLength',
        message: messages['branch.communication.num.max'],
        test: (val) => {
          if (val?.length && val?.length > 16) {
            return false;
          }
          return true;
        },
      })
      .notRequired(),
    address: yup.string().required(messages['rw.generaldetails.address.required']),
    cityId: yup.string().required(messages['rw.generaldetails.city.required']),
    descriptionAr: yup
      .string()
      .max(500, messages['bracnh.edit.business.description.ar.max']),
    descriptionEn: yup
      .string()
      .max(500, messages['bracnh.edit.business.description.en.max']),
  });
};
