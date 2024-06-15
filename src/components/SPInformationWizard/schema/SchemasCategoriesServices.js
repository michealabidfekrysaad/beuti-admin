import * as yup from 'yup';
import { useIntl } from 'react-intl';

export const SchemaCategories = () => {
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

export const SchemaAddNewService = () => {
  const { messages } = useIntl();
  return yup.object().shape({
    categories: yup
      .string()
      .required(messages['wizard.add.new.service.category.required']),
    serviceEn: yup
      .string()
      .required(messages['wizard.add.new.service.name.en.required'])
      .min(2, messages['wizard.add.new.service.name.en.min'])
      .max(30, messages['wizard.add.new.service.name.en.max']),
    serviceAr: yup
      .string()
      .required(messages['wizard.add.new.service.name.ar.required'])
      .min(2, messages['wizard.add.new.service.name.ar.min'])
      .max(30, messages['wizard.add.new.service.name.ar.max']),
    duration: yup
      .string()
      .typeError(messages['wizard.add.new.service.category.duration.required'])
      .required(messages['wizard.add.new.service.category.duration.required']),
    price: yup
      .number()
      .test({
        name: 'decimal Error',
        message: messages['wizard.add.new.service.category.float.required'],
        test: (value) => {
          if (value.toString().indexOf('-') === -1) {
            return (
              /^[0-9]*(\.[0-9]{0,2})?$/.test(value) &&
              value.toString().indexOf('-') === -1
            );
          }
          return true;
        },
      })
      .typeError(messages['wizard.add.new.service.category.price.required'])
      .required(messages['wizard.add.new.service.category.price.required'])
      .min(0, messages['wizard.add.new.service.category.price.min.zero'])
      .max(5000, messages['wizard.add.new.service.category.price.max']),
    serLocation: yup
      .string()
      .nullable()
      .required(messages['wizard.add.new.service.location.required']),
    checkbox: yup
      .mixed()
      .test({
        name: 'arrayOfEmpOrString',
        message: messages['wizard.add.new.service.emp.required'],
        test: (val) => {
          if (val.length > 0 || val === 'string') {
            return true;
          }
          return false;
        },
      })
      .required(messages['wizard.add.new.service.emp.required']),
  });
};
