/* eslint-disable */
import { Tab, Tabs } from '@material-ui/core';
import React, { useEffect, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { salesItemIds } from '../../Helper/ViewsEnum';

export default function ServicesData({
  setListenScroll,
  listenScroll,
  elementsRef,
  setValue,
  value,
  servicesTabs,
  allServices,
  fetchServices,
  setSalesData,
  salesData,
  serviceSearchFilter,
  setTempServiceForEmpData,
}) {
  // logic for return hours and minutes from or not
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

  const parentRe = useRef();
  const handleChange = (event, newValue) => {
    setListenScroll(false);
    parentRe?.current.scrollTo({
      top: elementsRef.current[newValue].current.offsetTop - 135,
      behavior: 'smooth',
    });
    setTimeout(() => {
      setListenScroll(true);
    }, 900);
    setValue(newValue);
  };

  const handleScroll = (e) => {
    if (listenScroll) {
      setValue(
        elementsRef.current.findIndex((ref, index) => {
          if (
            ref.current &&
            elementsRef.current?.filter((ref) => ref?.current)?.length !== index + 1
          ) {
            return (
              ref.current &&
              ref.current.offsetTop - 1000 <= parentRe?.current?.scrollTop &&
              elementsRef.current[index + 1]?.current?.offsetTop - 150 >=
                parentRe?.current?.scrollTop
            );
          }
          //   to catch the last tab only before check if it exist and make it active
          if (
            ref.current &&
            elementsRef.current?.filter((ref) => ref?.current)?.length >= index + 1
          ) {
            return true;
          }
          return false;
        }),
      );
    }
  };

  useEffect(() => {
    if (parentRe?.current) {
      setValue(0);
      parentRe?.current.scrollTo({
        top: 0 - 135,
        behavior: 'smooth',
      });
    }
  }, [serviceSearchFilter]);

  const addNewPackageOrIncreaseQuantity = (singlePackage) => {
    if (salesData?.itemsSelected?.findIndex((d) => d?.id === singlePackage?.id) === -1) {
      return setSalesData({
        ...salesData,
        itemsSelected: [
          ...salesData?.itemsSelected,
          {
            ...singlePackage,
            identify: salesItemIds?.packages,
            uniqueKey: singlePackage?.id + Math.floor(Math.random() * 10000),
            quantity: singlePackage?.quantity || 1,
          },
        ],
      });
    }
    setSalesData({
      ...salesData,
      itemsSelected: [
        ...salesData?.itemsSelected?.filter((d) => d?.id !== singlePackage?.id),
        {
          ...salesData?.itemsSelected?.find((d) => d?.id === singlePackage?.id),
          quantity:
            salesData?.itemsSelected?.find((d) => d?.id === singlePackage?.id)?.quantity +
            1,
        },
      ],
    });
  };
  return (
    <>
      {fetchServices && !allServices?.length ? (
        <div className="loading mt-5"></div>
      ) : (
        <>
          {allServices?.length > 0 && (
            <section className="serviceslider">
              <Tabs
                value={value === -1 ? 0 : value}
                onChange={(e, newValue) => handleChange(e, newValue)}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                aria-label="scrollable force tabs example"
                className="serviceslider-tabs"
              >
                {servicesTabs?.map((cate, index) => (
                  <Tab className="serviceslider-tabs__single" label={cate} key={index} />
                ))}
              </Tabs>
            </section>
          )}
          <section
            className="serviceslider-data"
            ref={parentRe}
            onScroll={(e) => handleScroll(e)}
          >
            {allServices?.map((ele, index) => (
              <div
                className="serviceslider-data__info"
                ref={elementsRef.current[index]}
                key={index}
              >
                <div className="serviceslider-data__info-cat--name">
                  {allServices[index]?.categoryName}
                </div>
                {ele?.serviceOptions?.map((singleSer) => (
                  <div
                    key={singleSer?.serviceID + Math.floor(Math.random() * 10000)}
                    onClick={() => {
                      // add service from parent due to API calling
                      setTempServiceForEmpData({
                        ...singleSer,
                        identify: salesItemIds?.services,
                        uniqueKey:
                          singleSer?.serviceID + Math.floor(Math.random() * 10000),
                        defaultPriceComeFromBE: singleSer?.price,
                      });
                    }}
                    className="serviceslider-data__info-service"
                  >
                    <div className="serviceslider-data__info-service__first">
                      <div className="serviceslider-data__info-service__first-name">
                        {singleSer?.name}
                      </div>
                      <div className="serviceslider-data__info-service__first-desc">
                        {singleSer?.isFromDuration && (
                          <FormattedMessage id="common.start.from" />
                        )}{' '}
                        {returnHoures(singleSer?.duration.split(':')[0]) && (
                          <FormattedMessage
                            id="sales.service.duration.in.table.hour"
                            values={{
                              hour: returnHoures(singleSer?.duration.split(':')[0]),
                            }}
                          />
                        )}{' '}
                        {returnMinutes(singleSer?.duration.split(':')[1]) && (
                          <FormattedMessage
                            id="sales.service.duration.in.table.min"
                            values={{
                              min: returnMinutes(singleSer?.duration.split(':')[1]),
                            }}
                          />
                        )}
                      </div>
                    </div>
                    <div className="serviceslider-data__info-service__last">
                      {singleSer?.isFromPrice && (
                        <FormattedMessage id="common.start.from" />
                      )}{' '}
                      {singleSer?.price} <FormattedMessage id="common.currency" />
                    </div>
                  </div>
                ))}
                {ele?.packages?.map((singlePackage) => (
                  <div
                    key={singlePackage?.id}
                    onClick={() => {
                      addNewPackageOrIncreaseQuantity(singlePackage);
                    }}
                    className="serviceslider-data__info-service"
                  >
                    <div className="serviceslider-data__info-service__first">
                      <div className="serviceslider-data__info-service__first-name">
                        {singlePackage?.name}
                      </div>
                      <div className="serviceslider-data__info-service__first-desc">
                        {/* show number if package only */}
                        <FormattedMessage
                          id="sales.services.inside.package.count"
                          values={{
                            num: singlePackage?.count,
                          }}
                        />
                        {singlePackage?.isFromDuration && (
                          <FormattedMessage id="common.start.from" />
                        )}{' '}
                        {returnHoures(singlePackage?.duration.split(':')[0]) && (
                          <FormattedMessage
                            id="sales.service.duration.in.table.hour"
                            values={{
                              hour: returnHoures(singlePackage?.duration.split(':')[0]),
                            }}
                          />
                        )}{' '}
                        {returnMinutes(singlePackage?.duration.split(':')[1]) && (
                          <FormattedMessage
                            id="sales.service.duration.in.table.min"
                            values={{
                              min: returnMinutes(singlePackage?.duration.split(':')[1]),
                            }}
                          />
                        )}
                      </div>
                    </div>
                    <div className="serviceslider-data__info-service__last">
                      {!singlePackage?.isFromPrice && (
                        <FormattedMessage id="common.start.from" />
                      )}{' '}
                      {singlePackage?.price}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </section>
        </>
      )}
      {!allServices?.length && serviceSearchFilter && !fetchServices && (
        <div className="no-data-found">
          <FormattedMessage id="sales.services.no.result" />
        </div>
      )}
    </>
  );
}
