/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable indent */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { get } from 'lodash';
import BeutiInput from 'Shared/inputs/BeutiInput';
import SelectInputMUI from 'Shared/inputs/SelectInputMUI';
import empAvatar from 'images/emp-avatar.png';
import { Modal, Row, Col } from 'react-bootstrap';

export default function AdvancedPricingOptionsEdit({
  advancedPriceModal,
  setAdvancedPriceModal,
  register,
  watch,
  errors,
  durationService,
  dropDownOption,
  getValues,
  vatFromBE,
  indexOfPricing,
  setValue,
  allBranches,
  allEmpForAllBranches,
}) {
  const [oldPricingOptions, setOldPricingOptions] = useState({});
  const { messages } = useIntl();
  const [changePrice, setChangePrice] = useState(false);
  const [indexOfPriceWithVat, setIndexForPriceWithVat] = useState(null);
  const [changePriceType, setChangePriceType] = useState(false);
  const [indexForPriceType, setIndexForPriceType] = useState(null);
  const [changePriceEmp, setChangePriceEmp] = useState(false);
  const [indexOfPriceWithVatEmp, setIndexForPriceWithVatEmp] = useState(null);
  const [changePriceTypeEmp, setChangePriceTypeEmp] = useState(false);
  const [indexForPriceTypeEmp, setIndexForPriceTypeEmp] = useState(null);
  const specialDuration = [
    {
      key: -1,
      text: `${durationService.find(
        (el) => el?.id === getValues(`pricing[${indexOfPricing}].duration`),
      ) &&
        durationService.find(
          (el) => el?.id === getValues(`pricing[${indexOfPricing}].duration`),
        ).text}  ${messages['advance.default']}`,
      id: `${getValues(`pricing[${indexOfPricing}].duration`)}Default`,
    },
    ...durationService,
  ];
  const specialDropDownOption = [
    {
      index: -1,
      key: -1,
      id: `${getValues(`pricing[${indexOfPricing}].priceType`)}Default`,
      text: `${dropDownOption.find(
        (el) => el?.id === getValues(`pricing[${indexOfPricing}].priceType`),
      ) &&
        dropDownOption.find(
          (el) => el?.id === getValues(`pricing[${indexOfPricing}].priceType`),
        ).text}  ${messages['advance.default']}`,
    },
    ...dropDownOption,
  ];
  const backPricingOptionToOriginal = () => {
    const oldPricingDataArray = watch('pricing').map((el, index) => {
      if (index === indexOfPricing) {
        return { ...el, ...oldPricingOptions };
      }
      return el;
    });
    setValue('pricing', oldPricingDataArray);
  };
  const selectedBranchesData = watch()?.branchesCheckboxes?.filter((el) => el?.branchID);
  allBranches?.filter((allBran) =>
    selectedBranchesData?.map((el) => el?.branchID === allBran?.branchID),
  );

  const selectedBranchesInfo = allBranches?.filter((allBran) => {
    const foundOrNot = selectedBranchesData?.find(
      (el) => +el?.branchID === +allBran?.branchId,
    );
    return foundOrNot;
  });
  const branchesDD = selectedBranchesInfo.map((data, index) => ({
    ...data,
    key: index,
    text: data?.name,
    value: data?.branchId,
    id: data?.branchId,
  }));
  const [idBranchSelectDD, setIdBranchSelectDD] = useState(branchesDD[0]?.id);

  //   all the called employees from API calling
  const empWithBranchThatSelected = watch('branchesCheckboxes')?.filter(
    (el) => el?.branchID,
  );
  const branchesWithEmpSelectedMainPage = empWithBranchThatSelected?.map(
    (singleData) => ({
      ...singleData,
      branchID: singleData?.branchID?.toString(),
      categoryID: singleData?.categoryID,
      employees:
        singleData?.employees &&
        singleData?.employees?.map((emp) =>
          allEmpForAllBranches?.find((el) => +emp === +el?.id),
        ),
      //   isDefaultDuration: true,
      //   isDefaultPrice: true,
      //   isDefaultPriceType: true,
    }),
  );
  //   branchesWithEmpSelectedMainPage has data if branch is checked

  const getNameOfSelectedBranch = (branchId) =>
    allBranches?.find((el) => +el?.branchId === +branchId)?.name;

  const getAddressOfSelectedBranch = (branchId) =>
    allBranches?.find((el) => +el?.branchId === +branchId)?.address;

  const getImageOfSelectedBranch = (branchId) =>
    allBranches?.find((el) => +el?.branchId === +branchId)?.image;

  const showDefaultsOrChoosenByUser = (
    indexOfPrice,
    indexOfEmp,
    optName,
    empIndex = false,
    empInputs = '',
  ) => {
    const mainPriceOptName = `${getValues(
      `pricing[${indexOfPricing}].${optName}`,
    )}Default`;
    const empOptName = getValues(
      `pricing[${indexOfPrice}].employeePriceOptions[${indexOfEmp}].emp[${empIndex}].${optName}`,
    );
    const branchOptName = getValues(
      `pricing[${indexOfPrice}].employeePriceOptions[${indexOfEmp}].${optName}`,
    );
    if (!branchOptName && !empInputs?.length) {
      return mainPriceOptName;
    }
    if (branchOptName && !empInputs?.length) {
      return branchOptName;
    }
    if (!empOptName && empInputs?.length) {
      return mainPriceOptName;
    }
    if (empOptName && empInputs?.length) {
      return empOptName;
    }
    return '';
  };
  useEffect(() => {
    if (advancedPriceModal) {
      setOldPricingOptions(
        JSON.parse(JSON.stringify(getValues('pricing')[indexOfPricing])),
      );
    }
  }, [advancedPriceModal]);

  useEffect(() => {
    if (watch) {
      const subscription = watch((value, { name, type }) => {
        // get data for when change price in branch
        if (name?.includes('employeePriceOptions') && !name?.includes('emp[')) {
          setChangePrice(
            get(
              value,
              `pricing[${+name.match(/\d+/g)[0]}].employeePriceOptions[${+name.match(
                /\d+/g,
              )[1]}].price`,
            ),
          );
          setIndexForPriceWithVat(name.match(/\d+/g));
        }
        // get data for when change pricetype in branch
        if (
          name?.includes('priceType') &&
          name?.includes('employeePriceOptions') &&
          !name?.includes('emp[')
        ) {
          setChangePriceType(
            get(
              value,
              `pricing[${+name.match(/\d+/g)[0]}].employeePriceOptions[${+name.match(
                /\d+/g,
              )[1]}].priceType`,
            ),
          );
          setChangePrice(
            get(
              value,
              `pricing[${+name.match(/\d+/g)[0]}].employeePriceOptions[${+name.match(
                /\d+/g,
              )[1]}].price`,
            ),
          );
          setIndexForPriceType(name.match(/\d+/g));
        }
      });
      return () => subscription.unsubscribe();
    }
    return null;
  }, [watch]);
  //   change the priceWithVat when change price of specific branch
  useEffect(() => {
    if (indexOfPriceWithVat && +changePrice >= 0) {
      setValue(
        `pricing[${indexOfPriceWithVat[0]}].employeePriceOptions[${indexOfPriceWithVat[1]}].priceWithVat`,
        (+changePrice + +changePrice * vatFromBE).toFixed(2),
      );
    }
    if (indexOfPriceWithVat && !changePrice?.length) {
      setValue(
        `pricing[${indexOfPriceWithVat[0]}].employeePriceOptions[${indexOfPriceWithVat[1]}].priceWithVat`,
        '',
      );
    }
  }, [changePrice]);

  //   change the priceWithVatwithoutVat and  when change priceType of specific branch
  useEffect(() => {
    if (+changePriceType === 1 || changePriceType?.toString().includes('1Default')) {
      setValue(
        `pricing[${indexForPriceType[0]}].employeePriceOptions[${indexForPriceType[1]}].price`,
        '',
        { shouldValidate: true },
      );
      setValue(
        `pricing[${indexForPriceType[0]}].employeePriceOptions[${indexForPriceType[1]}].priceWithVat`,
        (+changePrice + +changePrice * vatFromBE).toFixed(2),
      );
    }
  }, [changePriceType]);

  useEffect(() => {
    if (watch) {
      const subscription = watch((value, { name, type }) => {
        // get data for when change price in employee
        if (name?.includes('employeePriceOptions') && name?.includes('emp[')) {
          setChangePriceEmp(
            get(
              value,
              `pricing[${+name.match(/\d+/g)[0]}].employeePriceOptions[${+name.match(
                /\d+/g,
              )[1]}].emp[${+name.match(/\d+/g)[2]}].price`,
            ),
          );
          setIndexForPriceWithVatEmp(name.match(/\d+/g));
        }
        // get data for when change pricetype in employee
        if (
          name?.includes('priceType') &&
          name?.includes('employeePriceOptions') &&
          name?.includes('emp[')
        ) {
          setChangePriceTypeEmp(
            get(
              value,
              `pricing[${+name.match(/\d+/g)[0]}].employeePriceOptions[${+name.match(
                /\d+/g,
              )[1]}].emp[${+name.match(/\d+/g)[2]}].priceType`,
            ),
          );
          setChangePriceEmp(
            get(
              value,
              `pricing[${+name.match(/\d+/g)[0]}].employeePriceOptions[${+name.match(
                /\d+/g,
              )[1]}].emp[${+name.match(/\d+/g)[2]}].price`,
            ),
          );
          setIndexForPriceTypeEmp(name.match(/\d+/g));
        }
      });
      return () => subscription.unsubscribe();
    }
    return null;
  }, [watch]);

  //   change the priceWithVat when change price of specific employee
  useEffect(() => {
    if (indexOfPriceWithVatEmp && +changePriceEmp >= 0) {
      setValue(
        `pricing[${indexOfPriceWithVatEmp[0]}].employeePriceOptions[${indexOfPriceWithVatEmp[1]}].emp[${indexOfPriceWithVatEmp[2]}].priceWithVat`,
        (+changePriceEmp + +changePriceEmp * vatFromBE).toFixed(2),
      );
    }
    if (indexOfPriceWithVatEmp && !changePriceEmp?.length) {
      setValue(
        `pricing[${indexOfPriceWithVatEmp[0]}].employeePriceOptions[${indexOfPriceWithVatEmp[1]}].emp[${indexOfPriceWithVatEmp[2]}].priceWithVat`,
        '',
      );
    }
  }, [changePriceEmp]);

  //   change the priceWithVatwithoutVat and  when change priceType of specific employee
  useEffect(() => {
    if (+changePriceTypeEmp === 1 || changePriceType?.toString().includes('1Default')) {
      setValue(
        `pricing[${indexForPriceTypeEmp[0]}].employeePriceOptions[${indexForPriceTypeEmp[1]}].emp[${indexForPriceTypeEmp[2]}].price`,
        '',
        { shouldValidate: true },
      );
      setValue(
        `pricing[${indexForPriceTypeEmp[0]}].employeePriceOptions[${indexForPriceTypeEmp[1]}].emp[${indexForPriceTypeEmp[2]}].priceWithVat`,
        '',
      );
    }
  }, [changePriceTypeEmp]);
  return (
    <>
      <Modal
        onHide={() => {
          setAdvancedPriceModal(true);
        }}
        show={advancedPriceModal}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        className="bootstrap-modal-customizing advPriceModal"
      >
        <Modal.Header className="advPriceModal-header">
          <Modal.Title className="advPriceModal-header_title">
            {messages['advance.price.options.modal.header']}
          </Modal.Title>
        </Modal.Header>

        <div className="advPriceModal-body">
          <Row className="advPriceModal-body_row">
            <Col xs={12} className="advPriceModal-body_row-header">
              {messages['advance.price.options.num']} {indexOfPricing + 1}
            </Col>
            <Col xs={12} md={6} lg={3} className="mb-2  advPriceModal-body_row-input">
              <SelectInputMUI
                useFormRef={register(`pricing[${indexOfPricing}].duration`)}
                watch={watch}
                error={
                  errors?.pricing && errors?.pricing[indexOfPricing]?.duration?.message
                }
                label={messages['newService.duration']}
                list={durationService}
                defaultValue={getValues(`pricing[${indexOfPricing}].duration`)}
              />
            </Col>
            <Col xs={12} md={6} lg={3} className="mb-2 advPriceModal-body_row-input">
              <SelectInputMUI
                useFormRef={register(`pricing[${indexOfPricing}].priceType`)}
                watch={watch}
                error={
                  errors?.pricing && errors?.pricing[indexOfPricing]?.priceType?.message
                }
                label={messages['newService.price.type']}
                list={dropDownOption}
                defaultValue={getValues(`pricing[${indexOfPricing}].priceType`)}
              />
            </Col>
            <Col xs={12} md={6} lg={3} className="mb-2 advPriceModal-body_row-input">
              {getValues(`pricing[${indexOfPricing}].priceType`) !== 1 && (
                <BeutiInput
                  label={`${messages['newService.price.without.vat']} ${
                    getValues(`pricing[${indexOfPricing}].priceType`) === 3
                      ? messages['common.from']
                      : ' '
                  }`}
                  info={messages['common.currency']}
                  useFormRef={register(`pricing[${indexOfPricing}].price`)}
                  error={
                    errors?.pricing && errors?.pricing[indexOfPricing]?.price?.message
                  }
                />
              )}
            </Col>
            <Col xs={12} md={6} lg={3} className="mb-2 advPriceModal-body_row-input">
              {vatFromBE > 0 &&
                getValues(`pricing[${indexOfPricing}].priceType`) !== 1 && (
                  <BeutiInput
                    label={messages['newService.price.with.vat']}
                    useFormRef={register(`pricing[${indexOfPricing}].priceWithVat`)}
                    info={messages['common.currency']}
                    disabled
                    error={
                      errors?.pricing &&
                      errors?.pricing[indexOfPricing]?.priceWithVat?.message
                    }
                  />
                )}
            </Col>
            <Col xs={12} md={6} lg={3} className="mb-2 advPriceModal-body_row-input">
              <BeutiInput
                label={messages['newService.price.name']}
                useFormRef={register(`pricing[${indexOfPricing}].pricingNameAr`)}
                error={
                  errors?.pricing &&
                  errors?.pricing[indexOfPricing]?.pricingNameAr?.message
                }
                placeholder={messages['newService.price.name.place.holder.ar']}
              />
            </Col>
            <Col xs={12} md={6} lg={3} className="mb-2 advPriceModal-body_row-input">
              <BeutiInput
                label={messages['newService.price.name.en']}
                useFormRef={register(`pricing[${indexOfPricing}].pricingNameEn`)}
                error={
                  errors?.pricing &&
                  errors?.pricing[indexOfPricing]?.pricingNameEn?.message
                }
                placeholder={messages['newService.price.name.place.holder.en']}
              />
            </Col>
            <Col xs={12} className="advPriceModal-body_row-note">
              {messages['advance.price.options.note']}
            </Col>
          </Row>
          <hr className="w-100" />
          <Row className="advPriceModal-body_row">
            <Col xs={12} className="advPriceModal-body_row-header pt-3">
              {messages[`${'advance.price.options.emp.header'}`]}
            </Col>
          </Row>
          <Row className="advPriceModal-body_row">
            <Col xs={12}>
              <Row className="advPriceModal-body_row-blueSection">
                {/* branch image with  its inputs */}
                {allBranches?.length > 1 &&
                  (branchesWithEmpSelectedMainPage?.length > 0 ? (
                    branchesWithEmpSelectedMainPage.map((el, index) => (
                      <Col
                        xs={12}
                        className={`d-${
                          +el?.branchID === +idBranchSelectDD ? '' : 'none'
                        }`}
                      >
                        <Row>
                          <Col xs={12} className="advPriceModal-body_row-header pb-1">
                            {messages['advance.price.per.emp']}
                          </Col>
                          {el.employees?.length > 0 ? (
                            el.employees.map((emp, empIn) => (
                              <section
                                className="advPriceModal-body_row-empSec"
                                key={emp.id + el?.branchID.toString() + empIn}
                              >
                                <Col xs={4}>
                                  <section className="branches--details__empData">
                                    <img
                                      width="60"
                                      height="60"
                                      className="rounded-circle"
                                      src={emp.image || empAvatar}
                                      alt={emp.name}
                                    />
                                    <div>
                                      <p className="branches--details__empData-title">
                                        {emp.name}
                                      </p>
                                      <p className="branches--details__empData-subtitle">
                                        {emp?.title}
                                      </p>
                                    </div>
                                  </section>
                                </Col>
                                <Col xs={2}>
                                  <SelectInputMUI
                                    useFormRef={register(
                                      `pricing[${indexOfPricing}].employeePriceOptions[${index}].emp[${empIn}].duration`,
                                    )}
                                    watch={watch}
                                    error={
                                      errors?.pricing &&
                                      errors?.pricing[indexOfPricing] &&
                                      errors?.pricing[indexOfPricing]
                                        ?.employeePriceOptions &&
                                      errors?.pricing[indexOfPricing]
                                        ?.employeePriceOptions[index] &&
                                      errors?.pricing[indexOfPricing]
                                        ?.employeePriceOptions[index].emp &&
                                      errors?.pricing[indexOfPricing]
                                        ?.employeePriceOptions[index].emp[empIn] &&
                                      errors?.pricing[indexOfPricing]
                                        ?.employeePriceOptions[index].emp[empIn]?.duration
                                        ?.message
                                    }
                                    label={messages['newService.duration']}
                                    list={specialDuration}
                                    defaultValue={showDefaultsOrChoosenByUser(
                                      indexOfPricing,
                                      index,
                                      'duration',
                                      empIn,
                                      'empInputs',
                                    )}
                                    className={`${showDefaultsOrChoosenByUser(
                                      indexOfPricing,
                                      index,
                                      'duration',
                                      empIn,
                                      'empInputs',
                                    ).length > 9 && 'greyColorForDefaults'}`}
                                  />
                                </Col>
                                <Col xs={2}>
                                  <SelectInputMUI
                                    useFormRef={register(
                                      `pricing[${indexOfPricing}].employeePriceOptions[${index}].emp[${empIn}].priceType`,
                                    )}
                                    watch={watch}
                                    error={
                                      errors?.pricing &&
                                      errors?.pricing[indexOfPricing] &&
                                      errors?.pricing[indexOfPricing]
                                        ?.employeePriceOptions &&
                                      errors?.pricing[indexOfPricing]
                                        ?.employeePriceOptions[index] &&
                                      errors?.pricing[indexOfPricing]
                                        ?.employeePriceOptions[index].emp &&
                                      errors?.pricing[indexOfPricing]
                                        ?.employeePriceOptions[index]?.emp[empIn] &&
                                      errors?.pricing[indexOfPricing]
                                        ?.employeePriceOptions[index]?.emp[empIn]
                                        ?.priceType?.message
                                    }
                                    label={messages['newService.price.type']}
                                    list={specialDropDownOption}
                                    defaultValue={showDefaultsOrChoosenByUser(
                                      indexOfPricing,
                                      index,
                                      'priceType',
                                      empIn,
                                      'empInputs',
                                    )}
                                    className={`${showDefaultsOrChoosenByUser(
                                      indexOfPricing,
                                      index,
                                      'priceType',
                                      empIn,
                                      'empInputs',
                                    ).length > 1 && 'greyColorForDefaults'}`}
                                  />
                                </Col>
                                <Col xs={2}>
                                  {+getValues(
                                    `pricing[${indexOfPricing}].employeePriceOptions[${index}].emp[${empIn}].priceType`,
                                  ) !== 1 &&
                                    getValues(
                                      `pricing[${indexOfPricing}].employeePriceOptions[${index}].emp[${empIn}].priceType`,
                                    ) &&
                                    !getValues(
                                      `pricing[${indexOfPricing}].employeePriceOptions[${index}].emp[${empIn}].priceType`,
                                    )
                                      .toString()
                                      .includes('1Default') && (
                                      <BeutiInput
                                        label={`${
                                          messages['newService.price.without.vat']
                                        } ${
                                          getValues(
                                            `pricing[${indexOfPricing}].employeePriceOptions[${index}].emp[${empIn}].priceType`,
                                          ) === 3
                                            ? messages['common.from']
                                            : ' '
                                        }`}
                                        info={messages['common.currency']}
                                        useFormRef={register(
                                          `pricing[${indexOfPricing}].employeePriceOptions[${index}].emp[${empIn}].price`,
                                        )}
                                        error={
                                          errors?.pricing &&
                                          errors?.pricing[indexOfPricing] &&
                                          errors?.pricing[indexOfPricing]
                                            ?.employeePriceOptions &&
                                          errors?.pricing[indexOfPricing]
                                            ?.employeePriceOptions[index] &&
                                          errors?.pricing[indexOfPricing]
                                            ?.employeePriceOptions[index].emp &&
                                          errors?.pricing[indexOfPricing]
                                            ?.employeePriceOptions[index]?.emp[empIn] &&
                                          errors?.pricing[indexOfPricing]
                                            ?.employeePriceOptions[index]?.emp[empIn]
                                            ?.price?.message
                                        }
                                        placeholder={getValues(
                                          `pricing[${indexOfPricing}].price`,
                                        )}
                                      />
                                    )}
                                </Col>
                                <Col xs={2}>
                                  {vatFromBE > 0 &&
                                    +getValues(
                                      `pricing[${indexOfPricing}].employeePriceOptions[${index}].emp[${empIn}].priceType`,
                                    ) !== 1 &&
                                    getValues(
                                      `pricing[${indexOfPricing}].employeePriceOptions[${index}].emp[${empIn}].priceType`,
                                    ) &&
                                    !getValues(
                                      `pricing[${indexOfPricing}].employeePriceOptions[${index}].emp[${empIn}].priceType`,
                                    )
                                      .toString()
                                      .includes('1Default') && (
                                      <BeutiInput
                                        label={messages['newService.price.with.vat']}
                                        useFormRef={register(
                                          `pricing[${indexOfPricing}].employeePriceOptions[${index}].emp[${empIn}].priceWithVat`,
                                        )}
                                        info={messages['common.currency']}
                                        //   disabled
                                        readOnly
                                        error={
                                          errors?.pricing &&
                                          errors?.pricing[indexOfPricing] &&
                                          errors?.pricing[indexOfPricing]
                                            ?.employeePriceOptions &&
                                          errors?.pricing[indexOfPricing]
                                            ?.employeePriceOptions[index] &&
                                          errors?.pricing[indexOfPricing]
                                            ?.employeePriceOptions[index].emp &&
                                          errors?.pricing[indexOfPricing]
                                            ?.employeePriceOptions[index]?.emp[empIn] &&
                                          errors?.pricing[indexOfPricing]
                                            ?.employeePriceOptions[index]?.emp[empIn]
                                            ?.priceWithVat?.message
                                        }
                                        placeholder={getValues(
                                          `pricing[${indexOfPricing}].priceWithVat`,
                                        )}
                                      />
                                    )}
                                </Col>
                              </section>
                            ))
                          ) : (
                            <Col xs={12} className="grey-hint">
                              {messages['advance.add.emp.to.branch']}
                            </Col>
                          )}
                        </Row>
                      </Col>
                    ))
                  ) : (
                    <Col className="grey-hint ">
                      {messages['advance.select.branch.first']}
                    </Col>
                  ))}
                {allBranches?.length <= 1 &&
                  (branchesWithEmpSelectedMainPage?.length > 0 &&
                  branchesWithEmpSelectedMainPage[0]?.employees &&
                  branchesWithEmpSelectedMainPage[0]?.employees?.length ? (
                    branchesWithEmpSelectedMainPage.map(
                      (el, index) =>
                        el.employees &&
                        el.employees.map((emp, empIn) => (
                          <section
                            className="advPriceModal-body_row-empSec"
                            key={emp.id + el?.branchID.toString() + empIn}
                          >
                            <Col xs={4}>
                              <section className="branches--details__empData">
                                <img
                                  width="60"
                                  height="60"
                                  className="rounded-circle"
                                  src={emp.image || empAvatar}
                                  alt={emp.name}
                                />
                                <div>
                                  <p className="branches--details__empData-title">
                                    {emp.name}
                                  </p>
                                  {/* <p className="branches--details__empData-subtitle">
									hiwWork
								  </p> */}
                                </div>
                              </section>
                            </Col>
                            <Col xs={2}>
                              <SelectInputMUI
                                useFormRef={register(
                                  `pricing[${indexOfPricing}].employeePriceOptions[${index}].emp[${empIn}].duration`,
                                )}
                                watch={watch}
                                error={
                                  errors?.pricing &&
                                  errors?.pricing[indexOfPricing] &&
                                  errors?.pricing[indexOfPricing]?.employeePriceOptions &&
                                  errors?.pricing[indexOfPricing]?.employeePriceOptions[
                                    index
                                  ] &&
                                  errors?.pricing[indexOfPricing]?.employeePriceOptions[
                                    index
                                  ].emp &&
                                  errors?.pricing[indexOfPricing]?.employeePriceOptions[
                                    index
                                  ].emp[empIn] &&
                                  errors?.pricing[indexOfPricing]?.employeePriceOptions[
                                    index
                                  ].emp[empIn]?.duration?.message
                                }
                                label={messages['newService.duration']}
                                list={specialDuration}
                                defaultValue={showDefaultsOrChoosenByUser(
                                  indexOfPricing,
                                  index,
                                  'duration',
                                  empIn,
                                  'empInputs',
                                )}
                                className={`${showDefaultsOrChoosenByUser(
                                  indexOfPricing,
                                  index,
                                  'duration',
                                  empIn,
                                  'empInputs',
                                ).length > 9 && 'greyColorForDefaults'}`}
                              />
                            </Col>
                            <Col xs={2}>
                              <SelectInputMUI
                                useFormRef={register(
                                  `pricing[${indexOfPricing}].employeePriceOptions[${index}].emp[${empIn}].priceType`,
                                )}
                                watch={watch}
                                error={
                                  errors?.pricing &&
                                  errors?.pricing[indexOfPricing] &&
                                  errors?.pricing[indexOfPricing]?.employeePriceOptions &&
                                  errors?.pricing[indexOfPricing]?.employeePriceOptions[
                                    index
                                  ] &&
                                  errors?.pricing[indexOfPricing]?.employeePriceOptions[
                                    index
                                  ].emp &&
                                  errors?.pricing[indexOfPricing]?.employeePriceOptions[
                                    index
                                  ]?.emp[empIn] &&
                                  errors?.pricing[indexOfPricing]?.employeePriceOptions[
                                    index
                                  ]?.emp[empIn]?.priceType?.message
                                }
                                label={messages['newService.price.type']}
                                list={specialDropDownOption}
                                defaultValue={showDefaultsOrChoosenByUser(
                                  indexOfPricing,
                                  index,
                                  'priceType',
                                  empIn,
                                  'empInputs',
                                )}
                                className={`${showDefaultsOrChoosenByUser(
                                  indexOfPricing,
                                  index,
                                  'priceType',
                                  empIn,
                                  'empInputs',
                                ).length > 1 && 'greyColorForDefaults'}`}
                              />
                            </Col>
                            <Col xs={2}>
                              {getValues(
                                `pricing[${indexOfPricing}].employeePriceOptions[${index}].emp[${empIn}].priceType`,
                              ) !== 1 &&
                                getValues(
                                  `pricing[${indexOfPricing}].employeePriceOptions[${index}].emp[${empIn}].priceType`,
                                ) &&
                                !getValues(
                                  `pricing[${indexOfPricing}].employeePriceOptions[${index}].emp[${empIn}].priceType`,
                                )
                                  .toString()
                                  .includes('1Default') &&
                                +getValues(
                                  `pricing[${indexOfPricing}].employeePriceOptions[${index}].emp[${empIn}].priceType`,
                                ) !== 1 && (
                                  <BeutiInput
                                    label={`${messages['newService.price.without.vat']} ${
                                      getValues(
                                        `pricing[${indexOfPricing}].employeePriceOptions[${index}].emp[${empIn}].priceType`,
                                      ) === 3
                                        ? messages['common.from']
                                        : ' '
                                    }`}
                                    info={messages['common.currency']}
                                    useFormRef={register(
                                      `pricing[${indexOfPricing}].employeePriceOptions[${index}].emp[${empIn}].price`,
                                    )}
                                    error={
                                      errors?.pricing &&
                                      errors?.pricing[indexOfPricing] &&
                                      errors?.pricing[indexOfPricing]
                                        ?.employeePriceOptions &&
                                      errors?.pricing[indexOfPricing]
                                        ?.employeePriceOptions[index] &&
                                      errors?.pricing[indexOfPricing]
                                        ?.employeePriceOptions[index].emp &&
                                      errors?.pricing[indexOfPricing]
                                        ?.employeePriceOptions[index]?.emp[empIn] &&
                                      errors?.pricing[indexOfPricing]
                                        ?.employeePriceOptions[index]?.emp[empIn]?.price
                                        ?.message
                                    }
                                    placeholder={getValues(
                                      `pricing[${indexOfPricing}].price`,
                                    )}
                                  />
                                )}
                            </Col>
                            <Col xs={2}>
                              {vatFromBE > 0 &&
                                getValues(
                                  `pricing[${indexOfPricing}].employeePriceOptions[${index}].emp[${empIn}].priceType`,
                                ) !== 1 &&
                                getValues(
                                  `pricing[${indexOfPricing}].employeePriceOptions[${index}].emp[${empIn}].priceType`,
                                ) &&
                                !getValues(
                                  `pricing[${indexOfPricing}].employeePriceOptions[${index}].emp[${empIn}].priceType`,
                                )
                                  .toString()
                                  .includes('1Default') && (
                                  <BeutiInput
                                    label={messages['newService.price.with.vat']}
                                    useFormRef={register(
                                      `pricing[${indexOfPricing}].employeePriceOptions[${index}].emp[${empIn}].priceWithVat`,
                                    )}
                                    info={messages['common.currency']}
                                    //   disabled
                                    readOnly
                                    error={
                                      errors?.pricing &&
                                      errors?.pricing[indexOfPricing] &&
                                      errors?.pricing[indexOfPricing]
                                        ?.employeePriceOptions &&
                                      errors?.pricing[indexOfPricing]
                                        ?.employeePriceOptions[index] &&
                                      errors?.pricing[indexOfPricing]
                                        ?.employeePriceOptions[index].emp &&
                                      errors?.pricing[indexOfPricing]
                                        ?.employeePriceOptions[index]?.emp[empIn] &&
                                      errors?.pricing[indexOfPricing]
                                        ?.employeePriceOptions[index]?.emp[empIn]
                                        ?.priceWithVat?.message
                                    }
                                    placeholder={getValues(
                                      `pricing[${indexOfPricing}].priceWithVat`,
                                    )}
                                  />
                                )}
                            </Col>
                          </section>
                        )),
                    )
                  ) : (
                    <Col className="grey-hint ">
                      {messages['advance.select.employee.single.branch']}
                    </Col>
                  ))}
              </Row>
            </Col>
          </Row>
        </div>

        <div className="advPriceModal-footer">
          <button
            type="button"
            className="px-4 cancel"
            onClick={() => {
              setAdvancedPriceModal(false);
              backPricingOptionToOriginal();
            }}
            disabled={
              errors?.pricing?.map((el) => el?.price)[indexOfPricing] ||
              (errors?.pricing && errors?.pricing[indexOfPricing])
            }
          >
            {messages['common.cancel']}
          </button>
          <button
            type="button"
            onClick={() => {
              setAdvancedPriceModal(false);
            }}
            className="px-4 confirm"
            disabled={
              errors?.pricing?.map((el) => el?.price)[indexOfPricing] ||
              (errors?.pricing && errors?.pricing[indexOfPricing])
            }
          >
            {messages['common.add']}
          </button>
        </div>
      </Modal>
    </>
  );
}

AdvancedPricingOptionsEdit.propTypes = {
  advancedPriceModal: PropTypes.bool,
  setAdvancedPriceModal: PropTypes.func,
  register: PropTypes.func,
  watch: PropTypes.func,
  errors: PropTypes.object,
  durationService: PropTypes.array,
  dropDownOption: PropTypes.array,
  getValues: PropTypes.func,
  vatFromBE: PropTypes.number,
  indexOfPricing: PropTypes.number,
  setValue: PropTypes.func,
  allBranches: PropTypes.array,
  allEmpForAllBranches: PropTypes.array,
};
