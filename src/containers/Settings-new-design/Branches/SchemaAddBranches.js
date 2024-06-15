import React from 'react';
import * as yup from 'yup';
import { useIntl, FormattedMessage } from 'react-intl';

export const SchemaAddBranches = (existOrNew) => {
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
    phoneNum:
      existOrNew !== 'exist' &&
      yup
        .string()
        .required(
          <FormattedMessage
            id="branches.error.required"
            values={{ nameReuired: `${messages['branches.add.new.manager.new.mobile']}` }}
          />,
        )
        .matches(/^(05)([0-9]{8})$/, `${messages['admin.customer.new.phone.validate']}`),
    managerNameAR:
      existOrNew !== 'exist' &&
      yup
        .string()
        .required(
          <FormattedMessage
            id="branches.error.required"
            values={{
              nameReuired: `${messages['branches.add.new.manager.new.name.ar']}`,
            }}
          />,
        )
        .min(2, messages['branche.manager.error.min.length.ar'])
        .max(30, messages['branche.manager.error.max.length.ar']),
    managerNameEN:
      existOrNew !== 'exist' &&
      yup
        .string()
        .required(
          <FormattedMessage
            id="branches.error.required"
            values={{
              nameReuired: `${messages['branches.add.new.manager.new.name.en']}`,
            }}
          />,
        )
        .min(2, messages['branche.manager.error.min.length.en'])
        .max(30, messages['branche.manager.error.max.length.en']),
  });
};
