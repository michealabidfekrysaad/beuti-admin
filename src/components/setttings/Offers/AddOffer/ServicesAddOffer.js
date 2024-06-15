/* eslint-disable prefer-template */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl, FormattedMessage } from 'react-intl';
import { Table, TableBody, TableCell, TableRow } from '@material-ui/core';

export default function ServicesAddOffer({
  errors,
  serviceFetching,
  getServices,
  watch,
  serviceList,
  getValues,
  setValue,
  pricingOptions,
  clearErrors,
  catSerOptFetch,
  editPackage,
}) {
  const { messages } = useIntl();
  const packageSerOffer = useRef(null);
  useEffect(() => {
    if (errors?.servicesOptions && +Object.keys(errors).length === 1) {
      packageSerOffer?.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [errors]);

  const arrayOfOptions = watch('servicesOptions')
    ?.flat()
    ?.map((el) => el?.services)
    ?.flat()
    ?.map((el) => el?.options)
    ?.flat()
    ?.filter((el) => el?.serviceOptionID);

  const servicesName = (servicesSelected) => merge(servicesSelected, pricingOptions);
  const merge = (serSelected, allPricingOptions) =>
    serSelected?.map((el) => {
      const fo = allPricingOptions.find(
        (element) => +element?.serviceOptionID === +el?.serviceOptionID,
      );
      return {
        ...fo,
        count: el?.count,
        duration: fo?.duration,
        isDurationFrom: fo?.isDurationFrom,
      };
    });

  // return the name of option alone or with service
  const getOptionNameOrServiceName = (optionId) => {
    let serviceName = null;
    let optionName = null;
    serviceList
      ?.flat()
      ?.map((el) => el?.categoryServiceDto)
      ?.flat()
      ?.forEach((data) => {
        data?.options?.forEach((el) => {
          if (+el?.serviceOptionID === +optionId) {
            if (data?.options?.length <= 1) {
              serviceName = data.name;
            } else {
              serviceName = data.name;
              optionName = el.name;
            }
          }
        });
      });
    return !optionName ? serviceName : `${serviceName + ' - ' + optionName}`;
  };

  const returnHoures = (hours) => {
    if (hours) {
      if (+hours.charAt(0) === +0) {
        if (+hours.charAt(1) === +0) return null;
        return hours.charAt(hours?.length - 1);
      }
      return hours;
    }
    return null;
  };

  const returnMinutes = (minutes) => {
    if (minutes) {
      if (+minutes.charAt(0) === +0) {
        if (+minutes.charAt(1) === +0) return null;
        return minutes.charAt(minutes?.length - 1);
      }
      return minutes;
    }
    return null;
  };

  const calculateTotalPrice = (alloptions) => {
    let sum = 0;
    servicesName(alloptions)?.forEach((element) => {
      sum += element.count * element?.price;
    });
    return sum.toFixed(2);
  };

  //   calculate  total Duration for all services
  const calculateTotalDuration = (alloptions) => {
    let hours = 0;
    let minutes = 0;
    servicesName(alloptions)?.forEach((element) => {
      hours += +element.duration.split(':')[0];
      minutes += +element.duration.split(':')[1];
    });
    if (minutes >= 60) {
      hours += Math.floor(minutes / 60);
      minutes %= 60;
    }
    if (hours) {
      return (
        <>
          <FormattedMessage
            id="package.hours.total"
            values={{
              hour: hours,
            }}
          />{' '}
          {minutes > 0 && (
            <FormattedMessage
              id="package.minutes.total"
              values={{
                min: minutes,
              }}
            />
          )}
        </>
      );
    }
    return (
      <FormattedMessage
        id="package.minutes.total"
        values={{
          min: minutes,
        }}
      />
    );
  };

  const calculateTotalCount = () => {
    let sum = 0;
    arrayOfOptions?.forEach((element) => {
      sum += element.count;
    });
    return sum;
  };
  const removeService = (PriceOptId) => {
    setValue(
      'servicesOptions',
      watch('servicesOptions')?.map((el) => ({
        ...el,
        categoryID: el?.categoryID,
        services: el?.services?.map((ele) => ({
          ...ele,
          id: removeServiceIdOrNot(ele, PriceOptId),
          options: ele?.options?.map((element) => ({
            ...element,
            serviceOptionID:
              +element?.serviceOptionID === +PriceOptId
                ? false
                : element?.serviceOptionID,
            count: +element?.serviceOptionID === +PriceOptId ? 0 : element?.count,
          })),
        })),
      })),
    );
  };
  const removeServiceIdOrNot = (element, deletedID) => {
    const newArray = element?.options
      ?.filter((el) => +el?.serviceOptionID !== +deletedID)
      ?.filter((ele) => ele?.serviceOptionID);
    if (newArray?.length === 0) {
      return false;
    }
    return element?.id;
  };
  useEffect(() => {
    if (watch) {
      const subscription = watch((value, { name }) => {
        if (name?.includes('servicesOptions')) {
          if (
            getValues('servicesOptions')
              ?.flat()
              ?.map((el) => el.services)
              ?.flat()
              ?.map((el) => el?.options)
              ?.flat()
              ?.filter((el) => el?.serviceOptionID)?.length !== 0
          ) {
            clearErrors('servicesOptions');
          }
        }
      });
      return () => subscription.unsubscribe();
    }
    return null;
  }, [watch]);

  return (
    <Row>
      <Col xs={12} className="mb-2" ref={packageSerOffer}>
        <p
          className={`branchEdit__business ${
            errors?.servicesOptions ? 'labelCatError' : ''
          }`}
        >
          {messages[`package.select.services`]}
        </p>
        <button
          type="button"
          className={`beuti-dropdown-modal mt-3 ${
            errors?.servicesOptions ? 'categoryError' : ''
          }`}
          onClick={getServices}
          disabled={serviceFetching}
        >
          <span>
            {serviceFetching || catSerOptFetch ? (
              <div className="spinner-border spinner-border-sm mb-1" />
            ) : (
              arrayOfOptions?.length > 0 && (
                <FormattedMessage
                  id="service.select.modal"
                  values={{
                    num: calculateTotalCount(),
                  }}
                />
              )
            )}
          </span>
          <span className="primary-color  font-weight-bold">
            {messages[`common.${editPackage ? 'edit' : 'select'}`]}
          </span>
        </button>
        {(!watch('servicesOptions') || arrayOfOptions?.length <= 0) && (
          <span
            className={`package-cat-place-holder ${errors?.servicesOptions?.message &&
              'error-found-place-holders'}`}
            onClick={getServices}
          >
            {messages['package.services.place.holder']}
          </span>
        )}
        {servicesName(arrayOfOptions)?.length > 0 && (
          <>
            <div className="scrolling">
              <Table className="mt-2">
                <TableBody className="serBody">
                  {servicesName(arrayOfOptions)?.map((el) => (
                    <>
                      <TableRow className="serBody-row" key={el?.serviceOptionID}>
                        <TableCell className="serBody-row_countName">
                          {/* <p className="serBody-row_countName-count">
                            <span>{el?.count}</span>{' '}
                            <i className="flaticon2-cancel-music"></i>{' '}
                          </p> */}
                          <span className="serBody-row_countName-name px-0">
                            {getOptionNameOrServiceName(el?.serviceOptionID)}
                          </span>
                        </TableCell>
                        <TableCell className="serBody-row_duration">
                          {el?.isDurationFrom && messages['common.start.from']}
                          {returnHoures(el?.duration.split(':')[0]) && (
                            <FormattedMessage
                              id="service.duration.in.table.hour"
                              values={{
                                hour: returnHoures(el?.duration.split(':')[0]),
                              }}
                            />
                          )}{' '}
                          {returnMinutes(el?.duration.split(':')[1]) && (
                            <FormattedMessage
                              id="service.duration.in.table.min"
                              values={{
                                min: returnMinutes(el?.duration.split(':')[1]),
                              }}
                            />
                          )}
                        </TableCell>
                        <TableCell className="serBody-row_priceDelete">
                          <span className="serBody-row_priceDelete-price">
                            {(el?.count * el?.price).toFixed(2)}{' '}
                            {messages['common.currency']}
                          </span>{' '}
                          <button
                            type="button"
                            className="btn"
                            onClick={() => removeService(el?.serviceOptionID)}
                          >
                            <i className="flaticon2-cross" />
                          </button>
                        </TableCell>
                      </TableRow>
                      <hr />
                    </>
                  ))}
                </TableBody>
              </Table>
            </div>
            {servicesName(arrayOfOptions)?.length > 0 && (
              <p className="total">
                {messages['common.sum']} : {calculateTotalPrice(arrayOfOptions)}{' '}
                {messages['common.sar.full']}{' '}
                <span className="mx-2">({calculateTotalDuration(arrayOfOptions)})</span>
              </p>
            )}
          </>
        )}
        {errors?.servicesOptions && (
          <>
            <p className="branches-err-message" style={{ top: '82px' }}>
              {errors?.servicesOptions?.message}
            </p>
          </>
        )}
      </Col>
    </Row>
  );
}
