import React from 'react';
import * as yup from 'yup';
import { useIntl, FormattedMessage } from 'react-intl';

export const SchemaManager = (existOrNew) => {
  const { messages } = useIntl();

  return yup.object().shape({
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
    //   .matches(/^[ A-Za-z,.\-/]*$/, 'need localized message regex'), need confirm from userstory
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
