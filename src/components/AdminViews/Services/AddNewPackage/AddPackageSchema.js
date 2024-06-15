/* eslint-disable object-shorthand */
/* eslint-disable func-names */
import * as yup from 'yup';
import { useIntl } from 'react-intl';

const AddPackageSchema = () => {
  const { messages } = useIntl();
  return yup.object().shape({
    packageAr: yup
      .string()
      .required(messages['package.ar.name.required'])
      .min(2, messages['package.ar.name.min'])
      .max(30, messages['package.ar.name.max'])
      .matches(/.*\S.*/, {
        message: `${messages['package.ar.name.required']}`,
      }),
    packageEn: yup
      .string()
      .required(messages['package.en.name.required'])
      .min(2, messages['package.en.name.min'])
      .max(30, messages['package.en.name.max'])
      .matches(/.*\S.*/, {
        message: `${messages['package.en.name.required']}`,
      }),
    categoryID: yup.mixed().test({
      name: 'checkForCategory',
      message: messages['newService.category.required'],
      test: function(val) {
        if (!val) {
          return false;
        }
        return true;
      },
    }),
    packageLocation: yup
      .string()
      .nullable()
      .required(messages['wizard.add.new.service.location.required']),
    servicesOptions: yup
      .mixed()
      .test({
        name: 'EmptyOrNot',
        message: messages['package.add.service.required'],
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
      .test({
        name: 'lesThanTwo',
        message: messages['package.service.sub.title'],
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
              ?.filter((el) => el?.serviceOptionID)?.length < 2 &&
            sum < 2
          ) {
            return false;
          }
          if (sum < 2) {
            return false;
          }
          return true;
        },
      }),
    price: yup
      .number()
      .test({
        name: 'decimal Error',
        message: messages['package.decimal.validations'],
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
      .required(messages['package.required.price'])
      .typeError(messages['package.required.price'])
      .min(0, messages['package.min.price'])
      .max(50000, messages['package.max.price']),
    priceWithVat: yup.number(),
    descriptionAr: yup
      .string()
      .max(500, messages['package.description.ar.max'])
      .test('len', messages['package.descr.ar.min'], (val) => {
        if (val?.length && (val?.length < 2 || val.trim().length === 0)) {
          return false;
        }
        return true;
      }),
    descriptionEn: yup
      .string()
      .max(500, messages['package.description.en.max'])
      .test('len', messages['package.descr.en.min'], (val) => {
        if (val?.length && (val?.length < 2 || val.trim().length === 0)) {
          return false;
        }
        return true;
      }),
    requirementsAr: yup
      .string()
      .max(500, messages['package.requirment.ar.max'])
      .test('len', messages['package.requirment.ar.min'], (val) => {
        if (val?.length && (val?.length < 2 || val.trim().length === 0)) {
          return false;
        }
        return true;
      }),
    requirementsEn: yup
      .string()
      .max(500, messages['package.requirment.en.max'])
      .test('len', messages['package.requirment.en.min'], (val) => {
        if (val?.length && (val?.length < 2 || val.trim().length === 0)) {
          return false;
        }
        return true;
      }),
  });
};

export default AddPackageSchema;
