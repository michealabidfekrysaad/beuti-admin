/* eslint-disable object-shorthand */
/* eslint-disable func-names */
import * as yup from 'yup';
import { useIntl } from 'react-intl';

const SchemaEditNewService = (singleBranId) => {
  const { messages } = useIntl();
  return yup.object().shape({
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
    serLocation: yup
      .string()
      .nullable()
      .required(messages['wizard.add.new.service.location.required']),
    descrAr: yup
      .string()
      .max(500, messages['newService.description.ar.max'])
      .test('len', messages['newService.description.ar.min'], (val) => {
        if (val?.length && (val?.length < 2 || val.trim().length === 0)) {
          return false;
        }
        return true;
      }),
    descrEn: yup
      .string()
      .max(500, messages['newService.description.en.max'])
      .test('len', messages['newService.description.en.min'], (val) => {
        if (val?.length && (val?.length < 2 || val.trim().length === 0)) {
          return false;
        }
        return true;
      }),
    requireAr: yup
      .string()
      .max(500, messages['newService.require.ar.max'])
      .test('len', messages['newService.require.ar.min'], (val) => {
        if (val?.length && (val?.length < 2 || val.trim().length === 0)) {
          return false;
        }
        return true;
      }),
    requireEn: yup
      .string()
      .max(500, messages['newService.require.en.max'])
      .test('len', messages['newService.require.en.min'], (val) => {
        if (val?.length && (val?.length < 2 || val.trim().length === 0)) {
          return false;
        }
        return true;
      }),
    branchesCheckboxes: yup
      .array()
      .of(
        yup.object().shape({
          branchID: yup
            .mixed()
            .required('categoryIsRequired')
            .default(false),
          categoryID: yup.mixed().test({
            name: 'checkForCategory',
            message: messages['newService.category.required'],
            test: function(val) {
              if (this.parent.branchID && !val) {
                return false;
              }
              return true;
            },
          }),
          employees: yup
            .mixed()
            .nullable()
            .test({
              name: 'checkForEmployee',
              message: messages['newService.employee.required'],
              test: function(val) {
                if (!val || val.length === 0) {
                  return false;
                }
                return true;
              },
            })
            .default([]),
        }),
      )
      .test({
        name: 'one-true',
        message: messages['workingHours.branches.required'],
        test: (val) => {
          if (singleBranId) {
            return true;
          }
          return !val.every((ele) => !ele.branchID);
        },
      }),
    pricing: yup.array().of(
      yup.object().shape({
        duration: yup
          .string()
          .typeError(messages['wizard.add.new.service.category.duration.required'])
          .required(messages['wizard.add.new.service.category.duration.required']),
        priceType: yup
          .string()
          .typeError(messages['newService.price.type.required'])
          .required(messages['newService.price.type.required']),
        price: yup.number().when('priceType', (priceType) => {
          if (
            (typeof +priceType === 'number' && +priceType !== 1) ||
            priceType?.toString()?.includes('1Default')
          ) {
            return yup
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
              .required(messages['wizard.add.new.service.category.price.required'])
              .typeError(messages['wizard.add.new.service.category.price.required'])
              .min(0, messages['wizard.add.new.service.price.min'])
              .max(50000, messages['wizard.add.new.service.category.price.max']);
          }
          return yup.mixed().notRequired();
        }),
        priceWithVat: yup.number(),
        pricingNameAr: yup.string().max(25, messages['newService.price.name.en.max']),
        pricingNameEn: yup.string().max(25, messages['newService.price.name.en.max']),
        employeePriceOptions: yup.array().of(
          yup.object().shape({
            branchId: yup.string(),
            emp: yup.array().of(
              yup.object().shape({
                duration: yup
                  .string()
                  .typeError(
                    messages['wizard.add.new.service.category.duration.required'],
                  ),

                priceType: yup
                  .string()
                  .typeError(messages['newService.price.type.required']),
                price: yup.number().when('priceType', (priceType) => {
                  if (+priceType !== 1) {
                    return yup
                      .string()
                      .test({
                        name: 'no numbers',
                        message: messages['wizard.add.new.service.category.price.valid'],
                        test: (value) => {
                          if (value) {
                            return /^[0-9.]*$/.test(value);
                          }
                          return true;
                        },
                      })
                      .test({
                        name: 'decimal Error',
                        message:
                          messages['wizard.add.new.service.category.float.required'],
                        test: (value) => {
                          if (value?.toString()?.indexOf('-') === -1) {
                            return (
                              /^[0-9]*(\.[0-9]{0,2})?$/.test(value) &&
                              value?.toString()?.indexOf('-') === -1
                            );
                          }
                          return true;
                        },
                      })
                      .test(
                        'len',
                        messages['wizard.add.new.service.category.price.max'],
                        (val) => {
                          if (val?.toString()?.indexOf('-') === -1) {
                            if (val === undefined) {
                              return true;
                            }
                            return val <= 50000;
                          }
                          return true;
                        },
                      )
                      .test(
                        'len',
                        messages['wizard.add.new.service.price.min'],
                        (val) => {
                          if (val?.length && +val < 0) {
                            return false;
                          }
                          return true;
                        },
                      );
                  }
                  return yup.mixed().notRequired();
                }),
                empPriceWithVat: yup.number(),
                isDefaultPrice: yup.boolean(),
                isDefaultPriceType: yup.boolean(),
                isDefaultDuration: yup.boolean(),
              }),
            ),
            duration: yup
              .string()
              .typeError(messages['wizard.add.new.service.category.duration.required']),
            priceType: yup.string().typeError(messages['newService.price.type.required']),
            price: yup.number().when('priceType', (priceType) => {
              if (+priceType !== 1) {
                return yup
                  .string()
                  .test({
                    name: 'decimal Error',
                    message: messages['wizard.add.new.service.category.float.required'],
                    test: (value) => {
                      if (value?.toString()?.indexOf('-') === -1) {
                        return (
                          /^[0-9]*(\.[0-9]{0,2})?$/.test(value) &&
                          value?.toString()?.indexOf('-') === -1
                        );
                      }
                      return true;
                    },
                  })
                  .test(
                    'len',
                    messages['wizard.add.new.service.category.price.max'],
                    (val) => {
                      if (val?.toString()?.indexOf('-') === -1) {
                        if (val === undefined) {
                          return true;
                        }
                        return val <= 50000;
                      }
                      return true;
                    },
                  )
                  .test('len', messages['wizard.add.new.service.price.min'], (val) => {
                    if (val?.length && +val < 0) {
                      return false;
                    }
                    return true;
                  });
              }
              return yup.mixed().notRequired();
            }),
            empPriceWithVat: yup.number(),
            isDefaultPrice: yup.boolean(),
            isDefaultPriceType: yup.boolean(),
            isDefaultDuration: yup.boolean(),
          }),
        ),
      }),
    ),
  });
};

export default SchemaEditNewService;
