import React from 'react';

import * as yup from 'yup';
import { FormattedMessage } from 'react-intl';

export const schema = yup
  .object({
    NewPassword: yup
      .string()
      .min(6, <FormattedMessage id="admin.settings.ChangePass.password.err.old.min" />)
      .max(64, <FormattedMessage id="admin.settings.ChangePass.password.err.old.max" />)
      .required(<FormattedMessage id="login.password.error" />),
    ConfirmPassword: yup
      .string()
      .oneOf(
        [yup.ref('NewPassword')],
        <FormattedMessage id="components.login.confirmpassword.error" />,
      )
      .required(<FormattedMessage id="components.login.confirmpassword.error" />),
  })
  .required();
