import * as yup from 'yup';
import { useIntl } from 'react-intl';

export const AddNewCategorySchema = (EditCategory) => {
  const { messages } = useIntl();

  return yup.object().shape(
    {
      categoriesEn: yup
        .string()
        .required(messages['wizard.add.new.category.name.en.required'])
        .min(3, messages['wizard.add.new.category.name.en.min'])
        .max(40, messages['wizard.add.new.category.name.en.max'])
        .matches(/.*\S.*/, {
          message: `${messages['wizard.add.new.category.name.en.required']}`,
        }),
      categoriesAr: yup
        .string()
        .required(messages['wizard.add.new.category.name.ar.required'])
        .min(3, messages['wizard.add.new.category.name.ar.min'])
        .max(40, messages['wizard.add.new.category.name.ar.max'])
        .matches(/.*\S.*/, {
          message: `${messages['wizard.add.new.category.name.ar.required']}`,
        }),
      checkbox:
        !EditCategory &&
        yup
          .array()
          .test({
            name: 'arrayOfBranches',
            message: messages['workingHours.branches.required'],
            test: (val) => {
              if (val.length > 0 || val === 'string') {
                return true;
              }
              return false;
            },
          })
          .required(messages['workingHours.branches.required']),
      categoryDescAr: yup
        .string()
        .nullable()
        .notRequired()
        .when('categoryDescAr', {
          is: (value) => value?.length,
          then: (rule) => rule.min(3, messages['wizard.add.new.category.desc.ar.min']),
        })
        .when('categoryDescAr', {
          is: (value) => value?.length,
          then: (rule) => rule.max(200, messages['wizard.add.new.category.desc.ar.max']),
        }),
      categoryDescEn: yup
        .string()
        .nullable()
        .notRequired()
        .when('categoryDescEn', {
          is: (value) => value?.length,
          then: (rule) => rule.min(3, messages['wizard.add.new.category.desc.en.min']),
        })
        .when('categoryDescEn', {
          is: (value) => value?.length,
          then: (rule) => rule.max(200, messages['wizard.add.new.category.desc.en.max']),
        }),
    },
    [
      // Add Cyclic deps here because when require itself it is required to put it
      ['categoryDescAr', 'categoryDescAr'],
      ['categoryDescEn', 'categoryDescEn'],
    ],
  );
};
