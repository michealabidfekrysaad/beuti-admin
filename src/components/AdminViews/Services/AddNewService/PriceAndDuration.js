/* eslint-disable react/no-array-index-key */
/* eslint-disable prefer-template */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { get } from 'lodash';
import { useIntl } from 'react-intl';
import BeutiInput from 'Shared/inputs/BeutiInput';
import SelectInputMUI from 'Shared/inputs/SelectInputMUI';
import AdvancedPricingOptions from './AdvancedPricingOptions';

export default function PriceAndDuration({
  durationService,
  register,
  watch,
  errors,
  priceObject,
  setValue,
  getValues,
  vatFromBE,
  allBranches,
  allEmpForAllBranches,
}) {
  const { messages } = useIntl();
  const [changePrice, setChangePrice] = useState(false);
  const [indexOfPriceWithVat, setIndexForPriceWithVat] = useState(null);
  const [changePriceType, setChangePriceType] = useState(false);
  const [indexForPriceType, setIndexForPriceType] = useState(null);
  const [changeDurationPrice, setChangeDurationPrice] = useState(null);
  const [indexDurationPrice, setIndexDurationPrice] = useState(null);
  const [changePriceTypePrice, setChangePriceTypePrice] = useState(null);
  const [indexPriceTypePrice, setIndexPriceTypePrice] = useState(null);
  const [changeDurationBranch, setChangeDurationBranch] = useState(null);
  const [changeTypePriceBranch, setChangeTypePriceBranch] = useState(null);
  const [indexDurationBranch, setIndexDurationBranch] = useState(null);
  const [indexPriceTypeBranch, setIndexPriceTypeBranch] = useState(null);
  const [dropDownOption, setDropDownOption] = useState([
    {
      index: 0,
      key: 1,
      id: 1,
      text: messages['spAdmin.service.add.option.free'],
    },
    {
      index: 1,
      key: 2,
      id: 2,
      text: messages['spAdmin.service.add.option.fixed'],
    },
    {
      index: 2,
      key: 3,
      id: 3,
      text: messages['spAdmin.service.add.option.fromTo'],
    },
  ]);
  const [advancedPriceModal, setAdvancedPriceModal] = useState(false);
  const [indexOfPricing, setIndexOfPricing] = useState(null);

  const addAnotherPaymentOption = () => {
    setValue('pricing', [
      ...watch('pricing'),
      {
        ...priceObject,
        priceWithVat: (priceObject.price + priceObject?.price * vatFromBE).toFixed(2),
      },
    ]);
  };

  const deletePAymentOption = (index) => {
    const newArrayAfterDelete = watch('pricing').splice(index, 1);
    setValue('pricing', watch('pricing'));
  };

  useEffect(() => {
    if (+changePriceType === 1) {
      setValue(`pricing${indexForPriceType}.price`, 0, { shouldValidate: true });
      setValue(`pricing${indexForPriceType}.priceWithVat`, '00.00');
    }
  }, [changePriceType]);

  //   change the priceWithVat when change price  of service
  useEffect(() => {
    if (indexOfPriceWithVat && changePrice >= 0) {
      setValue(
        `pricing${indexOfPriceWithVat}.priceWithVat`,
        (changePrice + changePrice * vatFromBE).toFixed(2),
      );
    }
  }, [changePrice]);

  useEffect(() => {
    if (watch) {
      const subscription = watch((value, { name, type }) => {
        if (name?.includes('pricing')) {
          setChangePrice(+get(value, `pricing[${+name.match(/\d+/)}]`).price);
          setIndexForPriceWithVat(`[${+name.match(/\d+/)}]`);
        }
        if (name?.includes('priceType')) {
          setChangePriceType(get(value, `pricing[${+name.match(/\d+/)}]`).priceType);
          setChangePrice(+get(value, `pricing[${+name.match(/\d+/)}]`).price);
          setIndexForPriceType(`[${+name.match(/\d+/)}]`);
        }
      });
      return () => subscription.unsubscribe();
    }
    return null;
  }, [watch]);
  // used when change the duration for price to affect branch and employee with same data
  // used when change the priceType for price to affect branch and employee with same data
  useEffect(() => {
    if (watch) {
      const subscription = watch((value, { name, type }) => {
        if (name?.includes('pricing') && name?.includes('duration')) {
          setChangeDurationPrice(get(value, `pricing[${+name.match(/\d+/)}]`).duration);
          setIndexDurationPrice(+name.match(/\d+/));
        }
        if (name?.includes('pricing') && name?.includes('priceType')) {
          setChangePriceTypePrice(get(value, `pricing[${+name.match(/\d+/)}]`).priceType);
          setIndexPriceTypePrice(+name.match(/\d+/));
        }
      });
      return () => subscription.unsubscribe();
    }
    return null;
  }, [watch]);

  //   used  when change duration or pricetype for branch
  useEffect(() => {
    if (watch) {
      const subscription = watch((value, { name, type }) => {
        if (
          name?.includes('pricing') &&
          name?.includes('employeePriceOptions') &&
          !name?.includes('emp[') &&
          name?.includes('duration')
        ) {
          setChangeDurationBranch(
            get(
              value,
              `pricing[${+name.match(/\d+/g)[0]}].employeePriceOptions[${+name.match(
                /\d+/g,
              )[1]}]`,
            ).duration,
          );
          setIndexDurationBranch(+name.match(/\d+/g)[0]);
        }
        if (
          name?.includes('pricing') &&
          name?.includes('employeePriceOptions') &&
          !name?.includes('emp[') &&
          name?.includes('priceType')
        ) {
          setChangeTypePriceBranch(
            get(
              value,
              `pricing[${+name.match(/\d+/g)[0]}].employeePriceOptions[${+name.match(
                /\d+/g,
              )[1]}]`,
            ).priceType,
          );
          setIndexPriceTypeBranch(+name.match(/\d+/g)[0]);
        }
      });
      return () => subscription.unsubscribe();
    }
    return null;
  }, [watch]);

  // used when change the duration for price to affect branch and employee with same data
  useEffect(() => {
    if (changeDurationPrice) {
      if (watch('pricing')[indexDurationPrice].employeePriceOptions?.length) {
        watch('pricing')[indexDurationPrice].employeePriceOptions.forEach((el, index) => {
          if (
            getValues(
              `pricing[${indexDurationPrice}].employeePriceOptions[${index}].duration`,
            ) &&
            getValues(
              `pricing[${indexDurationPrice}].employeePriceOptions[${index}].duration`,
            ).includes('Default')
          ) {
            setValue(
              `pricing[${indexDurationPrice}].employeePriceOptions[${index}].duration`,
              `${changeDurationPrice}Default`,
            );
          }
        });
      }
    }
  }, [changeDurationPrice]);

  // used when change the priceType for price to affect branch and employee with same data
  useEffect(() => {
    if (changePriceTypePrice) {
      if (watch('pricing')[indexPriceTypePrice].employeePriceOptions?.length) {
        watch('pricing')[indexPriceTypePrice].employeePriceOptions.forEach(
          (el, index) => {
            if (
              getValues(
                `pricing[${indexPriceTypePrice}].employeePriceOptions[${index}].priceType`,
              ) &&
              getValues(
                `pricing[${indexPriceTypePrice}].employeePriceOptions[${index}].priceType`,
              )
                .toString()
                .includes('Default')
            ) {
              setValue(
                `pricing[${indexPriceTypePrice}].employeePriceOptions[${index}].priceType`,
                `${changePriceTypePrice}Default`,
              );
            }
          },
        );
      }
    }
  }, [changePriceTypePrice]);

  // used when change the duration for branch to affect employee with same data
  useEffect(() => {
    if (changeDurationBranch) {
      if (watch('pricing')[indexDurationBranch].employeePriceOptions?.length) {
        watch('pricing')[indexDurationBranch].employeePriceOptions.forEach(
          (el, index) => {
            if (el?.emp?.length) {
              el.emp.forEach((price, indx) => {
                if (
                  getValues(
                    `pricing[${indexDurationBranch}].employeePriceOptions[${index}].duration`,
                  ) &&
                  !getValues(
                    `pricing[${indexDurationBranch}].employeePriceOptions[${index}].duration`,
                  ).includes('Default') &&
                  getValues(
                    `pricing[${indexDurationBranch}].employeePriceOptions[${index}].emp.[${indx}].duration`,
                  ) &&
                  getValues(
                    `pricing[${indexDurationBranch}].employeePriceOptions[${index}].emp.[${indx}].duration`,
                  ).includes('Default')
                ) {
                  setValue(
                    `pricing[${indexDurationBranch}].employeePriceOptions[${index}].emp.[${indx}].duration`,
                    `${changeDurationBranch}Default`,
                  );
                }

                if (
                  getValues(
                    `pricing[${indexDurationBranch}].employeePriceOptions[${index}].duration`,
                  ) &&
                  getValues(
                    `pricing[${indexDurationBranch}].employeePriceOptions[${index}].duration`,
                  ).includes('Default') &&
                  getValues(
                    `pricing[${indexDurationBranch}].employeePriceOptions[${index}].emp.[${indx}].duration`,
                  ) &&
                  getValues(
                    `pricing[${indexDurationBranch}].employeePriceOptions[${index}].emp.[${indx}].duration`,
                  ).includes('Default')
                ) {
                  setValue(
                    `pricing[${indexDurationBranch}].employeePriceOptions[${index}].emp.[${indx}].duration`,
                    `${changeDurationBranch}`,
                  );
                }
              });
            }
          },
        );
      }
    }
  }, [changeDurationBranch]);

  // used when change the pricetype for branch to affect employee with same data
  useEffect(() => {
    if (changeTypePriceBranch) {
      if (watch('pricing')[indexPriceTypeBranch].employeePriceOptions?.length) {
        watch('pricing')[indexPriceTypeBranch].employeePriceOptions.forEach(
          (el, index) => {
            if (el?.emp?.length) {
              el.emp.forEach((price, indx) => {
                if (
                  getValues(
                    `pricing[${indexPriceTypeBranch}].employeePriceOptions[${index}].priceType`,
                  ) &&
                  !getValues(
                    `pricing[${indexPriceTypeBranch}].employeePriceOptions[${index}].priceType`,
                  )
                    .toString()
                    .includes('Default') &&
                  getValues(
                    `pricing[${indexPriceTypeBranch}].employeePriceOptions[${index}].emp.[${indx}].priceType`,
                  ) &&
                  getValues(
                    `pricing[${indexPriceTypeBranch}].employeePriceOptions[${index}].emp.[${indx}].priceType`,
                  )
                    .toString()
                    .includes('Default')
                ) {
                  setValue(
                    `pricing[${indexPriceTypeBranch}].employeePriceOptions[${index}].emp.[${indx}].priceType`,
                    `${changeTypePriceBranch}Default`,
                  );
                }

                if (
                  getValues(
                    `pricing[${indexPriceTypeBranch}].employeePriceOptions[${index}].priceType`,
                  ) &&
                  getValues(
                    `pricing[${indexPriceTypeBranch}].employeePriceOptions[${index}].priceType`,
                  )
                    .toString()
                    .includes('Default') &&
                  getValues(
                    `pricing[${indexPriceTypeBranch}].employeePriceOptions[${index}].emp.[${indx}].priceType`,
                  ) &&
                  getValues(
                    `pricing[${indexPriceTypeBranch}].employeePriceOptions[${index}].emp.[${indx}].priceType`,
                  )
                    .toString()
                    .includes('Default')
                ) {
                  setValue(
                    `pricing[${indexPriceTypeBranch}].employeePriceOptions[${index}].emp.[${indx}].priceType`,
                    `${changeTypePriceBranch}`,
                  );
                }
              });
            }
          },
        );
      }
    }
  }, [changeTypePriceBranch]);

  return (
    <Row className="pt-2 pb-2 informationwizard pricingModal">
      <Col xs={12} className="informationwizard__title">
        {messages['newService.price.title']}
      </Col>
      <Col xs={12} className="informationwizard__subtitle">
        {messages['newService.price.subtitle']}
      </Col>

      <Col xs={12} className="mx-3 mt-4">
        {watch().pricing &&
          watch().pricing.map((el, index) => (
            <Row key={el?.duration + 'key' + index} className="priceOptions">
              <Col className="priceOptions-header" xs={12}>
                {messages['newService.price']}&nbsp;
                {index + 1}
                {watch().pricing.length !== 1 && (
                  <button
                    className="priceOptions-header_delete"
                    onClick={() => deletePAymentOption(index)}
                    type="button"
                  >
                    <i className="flaticon-delete primary-color"></i>
                  </button>
                )}
              </Col>
              <Col xs={12} md={6} lg={3} className="mb-2">
                <SelectInputMUI
                  useFormRef={register(`pricing[${index}].duration`)}
                  watch={watch}
                  error={errors?.pricing && errors?.pricing[index]?.duration?.message}
                  label={messages['newService.duration']}
                  list={durationService}
                  defaultValue={el?.duration}
                />
              </Col>
              <Col xs={12} md={6} lg={3} className="mb-2">
                <SelectInputMUI
                  useFormRef={register(`pricing[${index}].priceType`)}
                  watch={watch}
                  error={errors?.pricing && errors?.pricing[index]?.priceType?.message}
                  label={messages['newService.price.type']}
                  list={dropDownOption}
                  defaultValue={el?.priceType}
                />
              </Col>
              <Col xs={12} md={6} lg={3} className="mb-2">
                {getValues(`pricing[${index}].priceType`) !== 1 && (
                  <BeutiInput
                    label={`${messages['newService.price.without.vat']} ${
                      getValues(`pricing[${index}].priceType`) === 3
                        ? messages['common.from']
                        : ' '
                    }`}
                    info={messages['common.currency']}
                    useFormRef={register(`pricing[${index}].price`)}
                    error={errors?.pricing && errors?.pricing[index]?.price?.message}
                  />
                )}
              </Col>
              <Col xs={12} md={6} lg={3} className="mb-2">
                {vatFromBE > 0 && getValues(`pricing[${index}].priceType`) !== 1 && (
                  <BeutiInput
                    label={messages['newService.price.with.vat']}
                    useFormRef={register(`pricing[${index}].priceWithVat`)}
                    info={messages['common.currency']}
                    disabled
                    error={
                      errors?.pricing && errors?.pricing[index]?.priceWithVat?.message
                    }
                  />
                )}
              </Col>
              <Col xs={12} md={6} lg={3} className="mb-2">
                <BeutiInput
                  label={messages['newService.price.name']}
                  useFormRef={register(`pricing[${index}].pricingNameAr`)}
                  error={
                    errors?.pricing && errors?.pricing[index]?.pricingNameAr?.message
                  }
                  placeholder={messages['newService.price.name.place.holder.ar']}
                />
              </Col>
              <Col xs={12} md={6} lg={3} className="mb-2">
                <BeutiInput
                  label={messages['newService.price.name.en']}
                  useFormRef={register(`pricing[${index}].pricingNameEn`)}
                  error={
                    errors?.pricing && errors?.pricing[index]?.pricingNameEn?.message
                  }
                  placeholder={messages['newService.price.name.place.holder.en']}
                />
              </Col>
              <Col xs={12}>
                <button
                  type="button"
                  onClick={() => {
                    setIndexOfPricing(index);
                    setAdvancedPriceModal(true);
                  }}
                  className="priceOptions-advancedBtn"
                >
                  {messages['newService.advanced.pricing']}
                </button>
              </Col>
            </Row>
          ))}
      </Col>
      {/* {watch().pricing?.length !== 3 && ( */}
      <Col xs={12} className="mt-2">
        <button
          onClick={() => addAnotherPaymentOption()}
          id="addPriceOption"
          type="button"
          className="pricingModal-anotherPricing"
        >
          <i className="flaticon-plus"></i>
          <span className="mx-3">{messages['newService.another.price.option']}</span>
        </button>
      </Col>
      {/* )} */}
      <AdvancedPricingOptions
        register={register}
        watch={watch}
        errors={errors}
        durationService={durationService}
        dropDownOption={dropDownOption}
        getValues={getValues}
        advancedPriceModal={advancedPriceModal}
        setAdvancedPriceModal={setAdvancedPriceModal}
        vatFromBE={vatFromBE}
        indexOfPricing={indexOfPricing}
        setValue={setValue}
        allBranches={allBranches}
        allEmpForAllBranches={allEmpForAllBranches}
      />
    </Row>
  );
}
