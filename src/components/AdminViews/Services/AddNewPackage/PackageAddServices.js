/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useIntl, FormattedMessage } from 'react-intl';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import chair from 'images/chair.png';
import home from 'images/home.png';

import SearchInput from 'components/shared/searchInput';

const PackageAddServices = ({
  show,
  setShow,
  list,
  register,
  setValue,
  getValues,
  watch,
}) => {
  const { messages } = useIntl();
  const [allServices, setAllServices] = useState(list || []);
  const arrayOfOptions = watch('servicesOptions')
    ?.flat()
    ?.map((el) => el?.services)
    ?.flat()
    ?.map((el) => el?.options)
    ?.flat()
    ?.filter((el) => el?.serviceOptionID);

  const calculateTotalCount = () => {
    let sum = 0;
    arrayOfOptions?.forEach((element) => {
      sum += element.count;
    });
    return sum;
  };

  useEffect(() => {
    if (show) {
      localStorage.setItem(
        'servicesForPackage',
        JSON.stringify(getValues('servicesOptions') || []),
      );
    }
    if (list) setAllServices(list);
  }, [show]);

  const closeTheModalWithoutSave = () => {
    setValue(
      'servicesOptions',
      JSON.parse(localStorage.getItem('servicesForPackage') || []),
    );
    setSearchValue(null);
    localStorage.removeItem('servicesForPackage');
    setShow(false);
  };
  const [searchValue, setSearchValue] = useState(null);

  useEffect(() => {
    if (!searchValue) {
      setAllServices(list);
    } else {
      const searchBy = searchValue.toLowerCase().trim();
      setAllServices(
        list.filter(
          (ser) =>
            (ser?.description && ser?.description.toLowerCase().includes(searchBy)) ||
            (ser?.nameAr && ser?.nameAr.toLowerCase().includes(searchBy)) ||
            (ser?.nameEn && ser?.nameEn.toLowerCase().includes(searchBy)) ||
            (ser?.name && ser?.name.toLowerCase().includes(searchBy)),
        ),
      );
    }
  }, [searchValue]);

  const checkAllOptionsUnderService = (catIndex, serIndex, optionsArray) => {
    optionsArray.forEach((element, index) =>
      setValue(`servicesOptions[${catIndex}].services[${serIndex}].options[${index}]`, {
        serviceOptionID: element.priceOptionID.toString(),
        count:
          watch('servicesOptions')[catIndex].services[serIndex].options[index].count || 1,
      }),
    );
  };
  const removeAllOptionsUnderService = (catIndex, serIndex, optionsArray) => {
    optionsArray.forEach((element, index) =>
      setValue(`servicesOptions[${catIndex}].services[${serIndex}].options[${index}]`, {
        serviceOptionID: false,
        count: 0,
      }),
    );
  };

  const checkServicesAndOptionsUnderCategory = (catIndex, services) => {
    setValue(
      `servicesOptions[${catIndex}].categoryID`,
      services[catIndex]?.id.toString(),
    );
    services[catIndex].categoryServiceDto.forEach((element, index) =>
      setValue(
        `servicesOptions[${catIndex}].services[${index}].id`,
        element?.id.toString(),
      ),
    );
    services[catIndex].categoryServiceDto.forEach((element, index) =>
      element.options.map((el, optIndex) =>
        setValue(`servicesOptions[${catIndex}].services[${index}].options[${optIndex}]`, {
          serviceOptionID: el.priceOptionID.toString(),
          count:
            watch('servicesOptions')[catIndex].services[index].options[optIndex].count ||
            1,
        }),
      ),
    );
  };

  const removeServicesAndOptionsUnderCategory = (catIndex, services) => {
    setValue(`servicesOptions[${catIndex}].categoryID`, false);
    services[catIndex].categoryServiceDto.forEach((element, index) =>
      setValue(`servicesOptions[${catIndex}].services[${index}].id`, false),
    );
    services[catIndex].categoryServiceDto.forEach((element, index) =>
      element.options.map((el, optIndex) =>
        setValue(`servicesOptions[${catIndex}].services[${index}].options[${optIndex}]`, {
          serviceOptionID: false,
          count: 0,
        }),
      ),
    );
  };

  useEffect(() => {
    if (watch) {
      const subscription = watch((value, { name, type }) => {
        // enter here when select, deselect option of service to put id of service
        // added show to fix max call stack error
        if (name?.includes('serviceOptionID') && show) {
          const placeOfOption = name.replace('.serviceOptionID', '');
          if (!getValues(name)) {
            setValue(placeOfOption, {
              serviceOptionID: false,
              count: 0,
            });
          } else {
            setValue(placeOfOption, {
              serviceOptionID: getValues(name)?.toString(),
              count: 1,
            });
          }
        }
      });
      return () => subscription.unsubscribe();
    }
    return null;
  }, [watch]);

  const checkSomeOptionsChecked = (catIndex, serIndex, serID, allOptionsLength) => {
    if (
      +getValues(`servicesOptions[${catIndex}].services[${serIndex}].id`) === +serID &&
      +getValues(`servicesOptions[${catIndex}].services[${serIndex}].options`).filter(
        (el) => el.serviceOptionID,
      ).length < +allOptionsLength &&
      +getValues(`servicesOptions[${catIndex}].services[${serIndex}].options`).filter(
        (el) => el.serviceOptionID,
      ).length > 0
    ) {
      return true;
    }
    return false;
  };

  const checkAllOptionsChecked = (catIndex, serIndex, serID, allOptionsLength) => {
    if (
      getValues(`servicesOptions[${catIndex}].services[${serIndex}].options`) &&
      getValues(`servicesOptions[${catIndex}].services[${serIndex}].options`).filter(
        (el) => el?.serviceOptionID,
      ).length === +allOptionsLength
    ) {
      return true;
    }
    return false;
  };

  const someServicesChecked = (catIndex, arrayOfServicesLength) => {
    if (
      getValues(`servicesOptions[${catIndex}].services`) &&
      +getValues(`servicesOptions[${catIndex}].services`).filter((el) => el?.id).length <
        +arrayOfServicesLength &&
      +getValues(`servicesOptions[${catIndex}].services`).filter((el) => el?.id).length >
        0
    ) {
      return true;
    }
    return false;
  };
  const allServicesChecked = (catIndex, arrayOfServicesLength) => {
    if (
      getValues(`servicesOptions[${catIndex}].services`) &&
      getValues(`servicesOptions[${catIndex}].services`).filter((el) => el?.id).length ===
        +arrayOfServicesLength
    ) {
      return true;
    }
    return false;
  };

  const checkAllServicesSelectAll = (serviceFromAPI) => {
    serviceFromAPI.map((element, index) =>
      setValue(`servicesOptions[${index}].categoryID`, element?.id?.toString()),
    );
    serviceFromAPI
      .flat()
      .map((el, i) =>
        el.categoryServiceDto.map((single, indexing) =>
          setValue(
            `servicesOptions[${i}].services[${indexing}].id`,
            single?.id?.toString(),
          ),
        ),
      );
    serviceFromAPI.flat().map((el, indexCat) =>
      el.categoryServiceDto.map((single, indxSer) =>
        single.options.map((opt, indxOpt) =>
          setValue(
            `servicesOptions[${indexCat}].services[${indxSer}].options[${indxOpt}]`,
            {
              serviceOptionID: opt?.priceOptionID?.toString(),
              count:
                watch('servicesOptions')[indexCat].services[indxSer].options[indxOpt]
                  .count || 1,
            },
          ),
        ),
      ),
    );
  };
  const removeAllServicesSelectAll = (serviceFromAPI) => {
    serviceFromAPI.map((element, index) =>
      setValue(`servicesOptions[${index}].categoryID`, false),
    );
    serviceFromAPI
      .flat()
      .map((el, i) =>
        el.categoryServiceDto.map((single, indexing) =>
          setValue(`servicesOptions[${i}].services[${indexing}].id`, false),
        ),
      );
    serviceFromAPI.flat().map((el, indexCat) =>
      el.categoryServiceDto.map((single, indxSer) =>
        single.options.map((opt, indxOpt) =>
          setValue(
            `servicesOptions[${indexCat}].services[${indxSer}].options[${indxOpt}]`,
            {
              serviceOptionID: false,
              count: 0,
            },
          ),
        ),
      ),
    );
  };
  const allOptionsChecked = (serFromApi) => {
    const lengthSerFromApi = serFromApi
      ?.flat()
      ?.map((el) => el.categoryServiceDto)
      ?.flat()
      ?.map((el) => el?.options)
      ?.flat()?.length;
    const lengthSerChecked = watch('servicesOptions')
      ?.flat()
      ?.map((el) => el.services)
      ?.flat()
      ?.map((el) => el?.options)
      ?.flat()
      .filter((el) => el?.serviceOptionID)?.length;
    if (lengthSerChecked === lengthSerFromApi) {
      return true;
    }
    return false;
  };
  const someOptionsChecked = (serFromApi) => {
    const lengthSerFromApi = serFromApi
      ?.flat()
      ?.map((el) => el.categoryServiceDto)
      ?.flat()
      ?.map((el) => el?.options)
      ?.flat()?.length;
    const lengthSerChecked = watch('servicesOptions')
      ?.flat()
      ?.map((el) => el.services)
      ?.flat()
      ?.map((el) => el?.options)
      ?.flat()
      .filter((el) => el?.serviceOptionID)?.length;
    if (lengthSerChecked < lengthSerFromApi && lengthSerChecked > 0) {
      return true;
    }
    return false;
  };
  return (
    <Modal
      onHide={() => {
        closeTheModalWithoutSave();
      }}
      show={show}
      className="registermodal-wrapper"
    >
      <Modal.Body className="categoryModal">
        <div className="categoryModal-title mt-4">{messages['services.modal.title']}</div>
        <div className="categoryModal-subtitle">
          {messages['services.modal.sub.title']}
        </div>
        {!searchValue && (
          <Col className="mb-3">
            <div className="select-all">
              <FormControlLabel
                onClick={(event) => {
                  event.stopPropagation();
                  if (event?.target?.checked?.toString() === 'true') {
                    checkAllServicesSelectAll(allServices);
                  }
                  if (event?.target?.checked?.toString() === 'false') {
                    removeAllServicesSelectAll(allServices);
                  }
                }}
                onFocus={(event) => event.stopPropagation()}
                control={
                  <Checkbox
                    color="primary"
                    indeterminate={someOptionsChecked(allServices)}
                    checked={allOptionsChecked(allServices)}
                  />
                }
                label={messages['common.all.services']}
                value={messages['common.all.services']}
                className="packSer_summary-header"
              />
              <span className="packSer_summary-count">
                <span>
                  {watch('servicesOptions')
                    ?.flat()
                    ?.map((el) => el.services)
                    ?.flat()
                    ?.map((el) => el?.options)
                    ?.flat()
                    .filter((el) => el?.serviceOptionID)?.length || 0}{' '}
                  /
                </span>{' '}
                {
                  list
                    ?.flat()
                    ?.map((el) => el.categoryServiceDto)
                    .flat()
                    ?.map((el) => el?.options)
                    .flat()?.length
                }
              </span>
            </div>
          </Col>
        )}
        <section className="scroll-pack-service">
          {allServices &&
            allServices.map((cat, catIndex) => (
              <Col className="mb-3">
                <Accordion className="packSer">
                  <AccordionSummary
                    expandIcon={<i className="flaticon2-down"></i>}
                    aria-controls="additional-actions1-content"
                    id="additional-actions1-header"
                    className="packSer_summary"
                  >
                    <FormControlLabel
                      onClick={(event) => {
                        event.stopPropagation();
                        if (event?.target?.checked?.toString() === 'true') {
                          checkServicesAndOptionsUnderCategory(
                            list.findIndex((object) => object.id === cat?.id),
                            list,
                          );
                        }
                        if (event?.target?.checked?.toString() === 'false') {
                          removeServicesAndOptionsUnderCategory(
                            list.findIndex((object) => object.id === cat?.id),
                            list,
                          );
                        }
                      }}
                      onFocus={(event) => event.stopPropagation()}
                      control={
                        <Checkbox
                          color="primary"
                          indeterminate={someServicesChecked(
                            list?.findIndex((object) => object.id === cat?.id),
                            cat?.categoryServiceDto?.length,
                          )}
                          checked={allServicesChecked(
                            list?.findIndex((object) => object.id === cat?.id),
                            cat?.categoryServiceDto?.length,
                          )}
                        />
                      }
                      label={cat?.name}
                      value={cat?.id}
                      className="packSer_summary-header"
                      {...register(`servicesOptions[${catIndex}].categoryID`)}
                    />
                    <span className="packSer_summary-count">
                      <span>
                        {(getValues(
                          `servicesOptions[${list?.findIndex(
                            (object) => object.id === cat?.id,
                          )}].services`,
                        ) &&
                          getValues(
                            `servicesOptions[${list?.findIndex(
                              (object) => object.id === cat?.id,
                            )}].services`,
                          )
                            .filter((el) => el?.options)
                            .map((el) => el?.options)
                            .flat()
                            .filter((el) => el?.serviceOptionID).length) ||
                          0}{' '}
                        /
                      </span>{' '}
                      {cat?.categoryServiceDto?.map((el) => el?.options)?.flat()?.length}
                    </span>
                  </AccordionSummary>
                  <AccordionDetails className="packSer_details">
                    <Row className="packSer_details-main-row">
                      {/* services checkboxes */}
                      {cat &&
                        cat.categoryServiceDto &&
                        cat.categoryServiceDto.map((service, serIndex) => (
                          <Col xs={12} className="packSer_details-main-row_col">
                            <Row>
                              <Col xs={12}>
                                <FormControlLabel
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    if (event?.target?.checked?.toString() === 'true') {
                                      checkAllOptionsUnderService(
                                        list?.findIndex(
                                          (object) => object.id === cat?.id,
                                        ),
                                        serIndex,
                                        service?.options,
                                      );
                                    }
                                    if (event?.target?.checked?.toString() === 'false') {
                                      removeAllOptionsUnderService(
                                        list?.findIndex(
                                          (object) => object.id === cat?.id,
                                        ),
                                        serIndex,
                                        service?.options,
                                      );
                                    }
                                  }}
                                  onFocus={(event) => event.stopPropagation()}
                                  control={
                                    <Checkbox
                                      color="primary"
                                      indeterminate={checkSomeOptionsChecked(
                                        list?.findIndex(
                                          (object) => object.id === cat?.id,
                                        ),
                                        serIndex,
                                        service?.id,
                                        service?.options?.length,
                                      )}
                                      checked={checkAllOptionsChecked(
                                        list?.findIndex(
                                          (object) => object.id === cat?.id,
                                        ),
                                        serIndex,
                                        service?.id,
                                        service?.options?.length,
                                      )}
                                    />
                                  }
                                  label={service?.name}
                                  value={service?.id}
                                  {...register(
                                    `servicesOptions[${catIndex}].services[${serIndex}].id`,
                                  )}
                                />{' '}
                                <span className="mx-2">
                                  {+getValues('packageLocation') === 1 && (
                                    <img
                                      src={home}
                                      alt={home}
                                      className="packSer_details-iconLocation"
                                    />
                                  )}
                                  {+getValues('packageLocation') === 2 && (
                                    <img
                                      src={chair}
                                      alt={chair}
                                      className="packSer_details-iconLocation"
                                    />
                                  )}
                                  {+getValues('packageLocation') === 3 && (
                                    <>
                                      <img
                                        src={chair}
                                        alt={chair}
                                        className="packSer_details-iconLocation"
                                      />
                                      <img
                                        src={home}
                                        alt={home}
                                        className="packSer_details-iconLocation"
                                      />
                                    </>
                                  )}
                                </span>
                                {/* enter here if  the service has only 1 price option */}
                                {service?.options?.length <= 1 &&
                                  service.options &&
                                  service.options.map((serOption, optionIndex) => (
                                    <span className="mx-1">
                                      <FormControlLabel
                                        onClick={(event) => {
                                          event.stopPropagation();
                                          if (
                                            event.target.checked?.toString() === 'true'
                                          ) {
                                            setValue(
                                              `servicesOptions[${list?.findIndex(
                                                (object) => object.id === cat?.id,
                                              )}].services[${serIndex}].id`,
                                              service?.id.toString(),
                                            );
                                            setValue(
                                              `servicesOptions[${list?.findIndex(
                                                (object) => object.id === cat?.id,
                                              )}].services[${serIndex}].options[${optionIndex}].count`,
                                              1,
                                            );
                                          }
                                          if (
                                            event.target.checked?.toString() === 'false'
                                          ) {
                                            if (+service?.options?.length === 1) {
                                              //   enter here if service has only one option when uncheck option
                                              setValue(
                                                `servicesOptions[${list?.findIndex(
                                                  (object) => object.id === cat?.id,
                                                )}].services[${serIndex}].id`,
                                                false,
                                              );
                                              setValue(
                                                `servicesOptions[${list?.findIndex(
                                                  (object) => object.id === cat?.id,
                                                )}].services[${serIndex}].options[${optionIndex}].count`,
                                                false,
                                              );
                                            } else {
                                              setValue(
                                                `servicesOptions[${list?.findIndex(
                                                  (object) => object.id === cat?.id,
                                                )}].services[${serIndex}].options[${optionIndex}].count`,
                                                false,
                                              );
                                            }
                                            if (
                                              getValues(
                                                `servicesOptions[${list?.findIndex(
                                                  (object) => object.id === cat?.id,
                                                )}].services[${serIndex}].options`,
                                              ).filter((el) => el?.serviceOptionID)
                                                .length === 1
                                            ) {
                                              setValue(
                                                `servicesOptions[${list?.findIndex(
                                                  (object) => object.id === cat?.id,
                                                )}].services[${serIndex}].id`,
                                                false,
                                              );
                                            }
                                          }
                                        }}
                                        onFocus={(event) => event.stopPropagation()}
                                        control={
                                          <Checkbox
                                            color="primary"
                                            className="d-none"
                                            {...register(
                                              `servicesOptions[${catIndex}].services[${serIndex}].options[${optionIndex}].serviceOptionID`,
                                            )}
                                            checked={
                                              +serOption?.priceOptionID ===
                                              +getValues(
                                                `servicesOptions[${list?.findIndex(
                                                  (object) => object.id === cat?.id,
                                                )}].services[${serIndex}].options[${optionIndex}].serviceOptionID`,
                                              )
                                            }
                                          />
                                        }
                                        label=""
                                        value={serOption?.priceOptionID}
                                        {...register(
                                          `servicesOptions[${catIndex}].services[${serIndex}].options[${optionIndex}].serviceOptionID`,
                                        )}
                                      />
                                      {/* buttons to increase deacrease services number */}
                                      {+getValues(
                                        `servicesOptions[${list?.findIndex(
                                          (object) => object.id === cat?.id,
                                        )}].services[${serIndex}].options[${optionIndex}].count`,
                                      ) > 0 && (
                                        <div className="packSer_details-parentCount">
                                          <div className="packSer_details-parentCount_child">
                                            <button
                                              className="packSer_details-parentCount_child-btns"
                                              type="button"
                                              disabled={
                                                +getValues(
                                                  `servicesOptions[${list?.findIndex(
                                                    (object) => object.id === cat?.id,
                                                  )}].services[${serIndex}].options[${optionIndex}].count`,
                                                ) === 9
                                              }
                                              onClick={() => {
                                                setValue(
                                                  `servicesOptions[${list?.findIndex(
                                                    (object) => object.id === cat?.id,
                                                  )}].services[${serIndex}].options[${optionIndex}].count`,
                                                  +getValues(
                                                    `servicesOptions[${list?.findIndex(
                                                      (object) => object.id === cat?.id,
                                                    )}].services[${serIndex}].options[${optionIndex}].count`,
                                                  ) + 1,
                                                );
                                              }}
                                            >
                                              <i className="flaticon2-plus"></i>
                                            </button>
                                            {getValues(
                                              `servicesOptions[${list?.findIndex(
                                                (object) => object.id === cat?.id,
                                              )}].services[${serIndex}].options[${optionIndex}].count`,
                                            )}
                                            <button
                                              className="packSer_details-parentCount_child-btns"
                                              type="button"
                                              disabled={
                                                +getValues(
                                                  `servicesOptions[${list?.findIndex(
                                                    (object) => object.id === cat?.id,
                                                  )}].services[${serIndex}].options[${optionIndex}].count`,
                                                ) === 1
                                              }
                                              onClick={() => {
                                                setValue(
                                                  `servicesOptions[${list?.findIndex(
                                                    (object) => object.id === cat?.id,
                                                  )}].services[${serIndex}].options[${optionIndex}].count`,
                                                  +getValues(
                                                    `servicesOptions[${list?.findIndex(
                                                      (object) => object.id === cat?.id,
                                                    )}].services[${serIndex}].options[${optionIndex}].count`,
                                                  ) - 1,
                                                );
                                              }}
                                            >
                                              <i className="flaticon2-line"></i>
                                            </button>
                                          </div>
                                        </div>
                                      )}
                                    </span>
                                  ))}
                              </Col>
                              {/* options checkboxes */}
                              {/* enter here if  the service has more than 1 price option */}
                              {service &&
                                service?.options?.length > 1 &&
                                service.options &&
                                service.options.map((serOption, optionIndex) => (
                                  <Col xs={12} className="mx-5 my-2">
                                    <FormControlLabel
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        if (event.target.checked?.toString() === 'true') {
                                          setValue(
                                            `servicesOptions[${list?.findIndex(
                                              (object) => object.id === cat?.id,
                                            )}].services[${serIndex}].id`,
                                            service?.id.toString(),
                                          );
                                          setValue(
                                            `servicesOptions[${list?.findIndex(
                                              (object) => object.id === cat?.id,
                                            )}].services[${serIndex}].options[${optionIndex}].count`,
                                            1,
                                          );
                                        }
                                        if (
                                          event.target.checked?.toString() === 'false'
                                        ) {
                                          if (+service?.options?.length === 1) {
                                            //   enter here if service has only one option when uncheck option
                                            setValue(
                                              `servicesOptions[${list?.findIndex(
                                                (object) => object.id === cat?.id,
                                              )}].services[${serIndex}].id`,
                                              false,
                                            );
                                            setValue(
                                              `servicesOptions[${list?.findIndex(
                                                (object) => object.id === cat?.id,
                                              )}].services[${serIndex}].options[${optionIndex}].count`,
                                              false,
                                            );
                                          } else {
                                            setValue(
                                              `servicesOptions[${list?.findIndex(
                                                (object) => object.id === cat?.id,
                                              )}].services[${serIndex}].options[${optionIndex}].count`,
                                              false,
                                            );
                                          }
                                          if (
                                            getValues(
                                              `servicesOptions[${list?.findIndex(
                                                (object) => object.id === cat?.id,
                                              )}].services[${serIndex}].options`,
                                            ).filter((el) => el?.serviceOptionID)
                                              .length === 1
                                          ) {
                                            setValue(
                                              `servicesOptions[${list?.findIndex(
                                                (object) => object.id === cat?.id,
                                              )}].services[${serIndex}].id`,
                                              false,
                                            );
                                          }
                                        }
                                      }}
                                      onFocus={(event) => event.stopPropagation()}
                                      control={
                                        <Checkbox
                                          color="primary"
                                          {...register(
                                            `servicesOptions[${catIndex}].services[${serIndex}].options[${optionIndex}].serviceOptionID`,
                                          )}
                                          checked={
                                            +serOption?.priceOptionID ===
                                            +getValues(
                                              `servicesOptions[${list?.findIndex(
                                                (object) => object.id === cat?.id,
                                              )}].services[${serIndex}].options[${optionIndex}].serviceOptionID`,
                                            )
                                          }
                                        />
                                      }
                                      label={serOption?.name || serOption?.priceOptionID}
                                      value={serOption?.priceOptionID}
                                      {...register(
                                        `servicesOptions[${catIndex}].services[${serIndex}].options[${optionIndex}].serviceOptionID`,
                                      )}
                                    />
                                    {/* buttons to increase deacrease services number */}
                                    {+getValues(
                                      `servicesOptions[${list?.findIndex(
                                        (object) => object.id === cat?.id,
                                      )}].services[${serIndex}].options[${optionIndex}].count`,
                                    ) > 0 && (
                                      <div className="packSer_details-parentCount">
                                        <div className="packSer_details-parentCount_child">
                                          <button
                                            className="packSer_details-parentCount_child-btns"
                                            type="button"
                                            disabled={
                                              +getValues(
                                                `servicesOptions[${list?.findIndex(
                                                  (object) => object.id === cat?.id,
                                                )}].services[${serIndex}].options[${optionIndex}].count`,
                                              ) === 9
                                            }
                                            onClick={() => {
                                              setValue(
                                                `servicesOptions[${list?.findIndex(
                                                  (object) => object.id === cat?.id,
                                                )}].services[${serIndex}].options[${optionIndex}].count`,
                                                +getValues(
                                                  `servicesOptions[${list?.findIndex(
                                                    (object) => object.id === cat?.id,
                                                  )}].services[${serIndex}].options[${optionIndex}].count`,
                                                ) + 1,
                                              );
                                            }}
                                          >
                                            <i className="flaticon2-plus"></i>
                                          </button>
                                          {getValues(
                                            `servicesOptions[${list?.findIndex(
                                              (object) => object.id === cat?.id,
                                            )}].services[${serIndex}].options[${optionIndex}].count`,
                                          )}
                                          <button
                                            className="packSer_details-parentCount_child-btns"
                                            type="button"
                                            disabled={
                                              +getValues(
                                                `servicesOptions[${list?.findIndex(
                                                  (object) => object.id === cat?.id,
                                                )}].services[${serIndex}].options[${optionIndex}].count`,
                                              ) === 1
                                            }
                                            onClick={() => {
                                              setValue(
                                                `servicesOptions[${list?.findIndex(
                                                  (object) => object.id === cat?.id,
                                                )}].services[${serIndex}].options[${optionIndex}].count`,
                                                +getValues(
                                                  `servicesOptions[${list?.findIndex(
                                                    (object) => object.id === cat?.id,
                                                  )}].services[${serIndex}].options[${optionIndex}].count`,
                                                ) - 1,
                                              );
                                            }}
                                          >
                                            <i className="flaticon2-line"></i>
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </Col>
                                ))}
                            </Row>
                          </Col>
                        ))}
                    </Row>
                  </AccordionDetails>
                </Accordion>
              </Col>
            ))}
        </section>

        <Row className="businessModal-footer mx-auto">
          <Button
            type="button"
            className="btn btn-grey"
            onClick={() => {
              closeTheModalWithoutSave();
            }}
          >
            {messages[`common.cancel`]}
          </Button>
          <Button
            type="submit"
            onClick={() => {
              localStorage.removeItem('servicesForPackage');
              setShow(false);
              setSearchValue(null);
            }}
          >
            {!arrayOfOptions?.length ? (
              <FormattedMessage id="service.select.modal.first" />
            ) : (
              <FormattedMessage
                id="service.select.modal.num.between"
                values={{
                  num: calculateTotalCount(),
                }}
              />
            )}
          </Button>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

PackageAddServices.propTypes = {
  show: PropTypes.bool,
  list: PropTypes.array,
  setShow: PropTypes.func,
  register: PropTypes.func,
  //   BranchFromAccordion: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  watch: PropTypes.func,
  setValue: PropTypes.func,
  getValues: PropTypes.func,
};
export default PackageAddServices;
