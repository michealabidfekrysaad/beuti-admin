import * as yup from 'yup';
import { useIntl } from 'react-intl';

export const ChangePasswordSchema = () => {
  const { messages } = useIntl();
  const adminSettingsChangePass = 'admin.settings.ChangePass';

  return yup.object().shape({
    oldPass: yup
      .string()
      .required(`${messages[`${adminSettingsChangePass}.password.err.required`]}`)
      .min(6, `${messages[`${adminSettingsChangePass}.password.err.old.min`]}`)
      .max(64, `${messages[`${adminSettingsChangePass}.password.err.old.max`]}`),
    newPass: yup
      .string()
      .required(`${messages[`${adminSettingsChangePass}.password.err.required`]}`)
      .min(6, `${messages[`${adminSettingsChangePass}.new.password.err.min`]}`)
      .max(64, `${messages[`${adminSettingsChangePass}.new.password.err.max`]}`),
    confirmNewPass: yup
      .string()
      .required(`${messages[`${adminSettingsChangePass}.password.confirm.err.required`]}`)
      .oneOf(
        [yup.ref('newPass')],
        `${messages[`${adminSettingsChangePass}.confirm.new.password.err`]}`,
      ),
  });
};
