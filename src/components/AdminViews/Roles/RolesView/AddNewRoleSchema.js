/* eslint-disable object-shorthand */

import React from 'react';

import * as yup from 'yup';

import { FormattedMessage } from 'react-intl';

export const AddNewRoleSchema = yup.object().shape({
  nameAr: yup
    .string()
    .max(20, <FormattedMessage id="roles.add.new.role.arabic" />)
    .required(<FormattedMessage id="roles.add.new.role.required.english" />),
  nameEn: yup
    .string()
    .max(20, <FormattedMessage id="roles.add.new.role.english" />)
    .required(<FormattedMessage id="roles.add.new.role.required.arabic" />),
});
