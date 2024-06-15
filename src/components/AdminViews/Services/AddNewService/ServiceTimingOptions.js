/* eslint-disable indent */
/* eslint-disable prefer-template */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/button-has-type */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import SelectInputMUI from 'Shared/inputs/SelectInputMUI';
import CloseIcon from '@material-ui/icons/Close';
import { Tooltip } from '@material-ui/core';
import { ModalProcessTimeExceed } from './ModalProcessTimeExceed';

export default function ServiceTimingOptions({
  durationService,
  register,
  watch,
  processingTimes,
  setProcessingTimes,
  errorBufferTime,
  setErrorBufferTime,
  setValue,
  intersectionError,
  setIntersectionError,
  setLowestSerDurMin,
  lowestSerDurMin,
  servID,
}) {
  /* -------------------------------------------------------------------------- */
  /*                 when change the lowest duration for service                */
  /* -------------------------------------------------------------------------- */
  const [openModalExceedProcess, setOpenModalExceedProcess] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentdata, setCurrentdata] = useState(0);
  const [errorIntersecctionOccur, setErrorIntersectionOccur] = useState([]);
  useEffect(() => {
    if (watch()) {
      if (+watch('serLocation')) {
        const lowestDurPriceMain =
          watch('pricing')?.map(
            (el) => +el?.duration.split(':')[0] * 60 + +el?.duration.split(':')[1],
          ).length > 0 &&
          watch('pricing')
            ?.map((el) => +el?.duration.split(':')[0] * 60 + +el?.duration.split(':')[1])
            ?.reduce((a, b) => Math.min(a, b));
        let lowestDurBranchMain = 10000;
        let lowestDurEmpMain = 10000;
        // if the user add duration to specific branch if single or multiple
        if (
          watch('pricing')
            ?.map((el) =>
              el?.employeePriceOptions?.map((ele) => {
                if (!ele?.duration?.includes('Default') && ele?.duration) {
                  return ele?.duration.split(':')[0] * 60 + +ele?.duration.split(':')[1];
                }
                return +el?.duration.split(':')[0] * 60 + +el?.duration.split(':')[1];
              }),
            )
            .flat().length > 0
        ) {
          lowestDurBranchMain = watch('pricing')
            ?.map((el) =>
              el?.employeePriceOptions?.map((ele) => {
                if (!ele?.duration?.includes('Default') && ele?.duration) {
                  return ele?.duration.split(':')[0] * 60 + +ele?.duration.split(':')[1];
                }
                return +el?.duration.split(':')[0] * 60 + +el?.duration.split(':')[1];
              }),
            )
            .flat()
            ?.reduce((a, b) => Math.min(a, b));
        }
        if (
          watch('pricing')
            ?.map((price) =>
              price?.employeePriceOptions
                ?.map((branchOpt) =>
                  branchOpt?.emp?.map((empOpt) => {
                    if (!empOpt?.duration?.includes('Default') && empOpt?.duration) {
                      return (
                        +empOpt?.duration?.split(':')[0] * 60 +
                        +empOpt?.duration?.split(':')[1]
                      );
                    }
                    return servID
                      ? +price?.duration?.split(':')[0] * 60 +
                          +price?.duration?.split(':')[1]
                      : +branchOpt?.duration?.split(':')[0] * 60 +
                          +branchOpt?.duration?.split(':')[1];
                  }),
                )
                .flat(),
            )
            ?.flat()
            ?.filter((el) => el !== undefined)?.length > 0
        ) {
          lowestDurEmpMain = watch('pricing')
            ?.map((price) =>
              price?.employeePriceOptions
                ?.map((branchOpt) =>
                  branchOpt?.emp?.map((empOpt) => {
                    if (!empOpt?.duration?.includes('Default') && empOpt?.duration) {
                      return (
                        +empOpt?.duration?.split(':')[0] * 60 +
                        +empOpt?.duration?.split(':')[1]
                      );
                    }
                    return servID
                      ? +price?.duration?.split(':')[0] * 60 +
                          +price?.duration?.split(':')[1]
                      : +branchOpt?.duration?.split(':')[0] * 60 +
                          +branchOpt?.duration?.split(':')[1];
                  }),
                )
                .flat(),
            )
            ?.flat()
            ?.filter((el) => el !== undefined)
            ?.reduce((a, b) => Math.min(a, b));
        }
        if (
          Math.min(+lowestDurPriceMain, +lowestDurBranchMain, +lowestDurEmpMain) !==
          +lowestSerDurMin
        ) {
          setLowestSerDurMin(
            Math.min(+lowestDurPriceMain, +lowestDurBranchMain, +lowestDurEmpMain),
          );
          setProcessingTimes([{ duration: '', start: '' }]);
          setValue('BufferTime', '00:00:00');
        }
      } else {
        setProcessingTimes([{ duration: '', start: '' }]);
        setValue('BufferTime', '00:00:00');
      }
    }
  }, [watch()]);

  const { locale, messages } = useIntl();
  const zeroTimeArray = [
    { key: -1, text: `0 ${messages['common.minutes']}`, id: '00:00:00' },
    ...durationService,
  ];
  const bufferTimes = [
    { key: -1, text: `${messages['newService.no.buffer.time']}`, id: '00:00:00' },
    ...durationService,
  ];
  const blockTimes = [
    { key: -1, text: `${messages['newService.no.block.time']}`, id: '00:00:00' },
    ...durationService,
  ];
  const processTimes = [
    { key: -1, text: `${messages['newService.no.process.time']}`, id: '00:00:00' },
    ...durationService,
  ];

  const processingTimeChange = (index, event) => {
    const data = [...processingTimes];
    data[index][event.target.name] = event.target.value;
    if (event.target.name !== 'start') {
      // to set the start from from  0 if first one
      const processTimeForOne =
        index > 0
          ? convertTimeToNum(processingTimes[index - 1]?.duration) +
            convertTimeToNum(processingTimes[index - 1]?.start) +
            5
          : convertTimeToNum(processingTimes[index - 1]?.duration) +
            convertTimeToNum(processingTimes[index - 1]?.start);
      const hours =
        Math.floor(processTimeForOne / 60) < 10
          ? `0${Math.floor(processTimeForOne / 60)}`
          : `${Math.floor(processTimeForOne / 60)}`;
      const minutes =
        processTimeForOne % 60 < 10
          ? `0${processTimeForOne % 60}`
          : `${processTimeForOne % 60}`;
      //  if the duration + startTime greater than service time it is return duration
      // to the no processing time
      if (
        convertTimeToNum(event.target.value) +
          convertTimeToNum(`${hours}:${minutes}:00`) >
        lowestSerDurMin
      ) {
        setCurrentIndex(index);
        setCurrentdata(data);
        setOpenModalExceedProcess(true);
      } else {
        data[index].start = `${hours}:${minutes}:00`;
      }
    }
    setProcessingTimes(data);
  };

  const addProcessingField = () => {
    const newfield = { duration: '', start: '' };
    setProcessingTimes([...processingTimes, newfield]);
  };

  const removeProcessingField = (index) => {
    const data = [...processingTimes];
    data.splice(index, 1);
    setProcessingTimes(data);
  };

  const calculateProcessingSlot = (processingTime) => {
    if (!openModalExceedProcess) {
      const duration = processingTime.duration.split(':');
      const start = processingTime.start.split(':');
      const endTime = duration.map((num, i) => +num + +start[i]);
      if (endTime[1] >= 60) {
        endTime[0] += 1;
        endTime[1] -= 60;
      }
      const serviceTime = lowestSerDurMin * 60;

      const width =
        (processingTime.duration
          .split(':')
          .map((el) => +el)
          .reduce((a, b) => a * 60 + b, 0) /
          serviceTime) *
        100;

      const position =
        (processingTime.start
          .split(':')
          .map((el) => +el)
          .reduce((a, b) => a * 60 + b, 0) /
          serviceTime) *
        100;

      const slot = { start, endTime, width, position };
      return slot;
    }
    return { start: ['00', '00', '00'], endTime: [0, 0, 0], width: 100, position: 0 };
  };

  const convertTimeToNum = (time) => {
    if (time) {
      const timeArr = time.split(':');
      const num = +timeArr[0] * 60 + +timeArr[1];
      return num;
    }
    return 0;
  };
  /* -------------------------------------------------------------------------- */
  /*               appear add time for process if service has time              */
  /* -------------------------------------------------------------------------- */
  const checkHasTimeToBeProcessing = () =>
    processingTimes
      ?.map((el) => +el?.duration?.split(':')[0] * 60 + +el?.duration?.split(':')[1] || 0)
      .reduce((el, el2) => el + el2) < lowestSerDurMin;

  /* -------------------------------------------------------------------------- */
  /*                    show error of buffer + processingTime                   */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (
      convertTimeToNum(watch('BufferTime')) +
        processingTimes
          ?.map(
            (el) => +el?.duration?.split(':')[0] * 60 + +el?.duration?.split(':')[1] || 0,
          )
          .reduce((el, el2) => el + el2) >=
        lowestSerDurMin &&
      lowestSerDurMin > 0 &&
      !openModalExceedProcess
    ) {
      setErrorBufferTime(messages['newService.processing.buffer.error']);
    } else {
      setErrorBufferTime(false);
    }
  }, [
    watch('BufferTime'),
    processingTimes
      ?.map((el) => +el?.duration?.split(':')[0] * 60 + +el?.duration?.split(':')[1] || 0)
      .reduce((el, el2) => el + el2),
  ]);

  useEffect(() => {
    if (processingTimes?.length) {
      const arrayTriple = processingTimes?.map((el) => ({
        ...el,
        duration: +convertTimeToNum(el?.duration),
        start: +convertTimeToNum(el?.start),
        end: +convertTimeToNum(el?.duration) + convertTimeToNum(el?.start),
      }));
      setErrorIntersectionOccur([]);
      arrayTriple?.forEach((ele, index) => {
        arrayTriple.some((el, idx) => {
          //   if (el?.end >= ele?.start && el?.start <= ele?.end &&  index !== idx && ele?.start > 0 )
          //   second condition happen for two processTime has no space between (5 mins)
          if (
            (ele?.start < el?.end && ele?.end > el?.end && index !== idx) ||
            (el?.end >= ele?.start &&
              el?.start <= ele?.end &&
              index !== idx &&
              ele?.start > 0)
          ) {
            setErrorIntersectionOccur((current) => [...current, true]);
            setIntersectionError(messages['newService.processing.intersect.error']);
            return false;
          }
          return null;
        });
      });
    }
  }, [processingTimes]);

  useEffect(() => {
    if (errorIntersecctionOccur?.length > 0) {
      if (errorIntersecctionOccur.includes(true)) {
        setIntersectionError(messages['newService.processing.intersect.error']);
      }
      if (errorIntersecctionOccur.every((element) => element === false)) {
        setIntersectionError(false);
        setErrorIntersectionOccur([]);
      }
    } else {
      setIntersectionError(false);
    }
  }, [errorIntersecctionOccur]);

  return (
    <section className="service-timing-wrapper mb-4 pb-4">
      <Row className="mb-4">
        <Col xs={12} className="informationwizard__title-process">
          {messages['newService.timing.options.title']}
        </Col>
        <Col xs={12} className="informationwizard__subtitle">
          {messages['newService.timing.options.subtitle']}
        </Col>
      </Row>
      {/* ============ processing time section ============== */}
      <Row className="service-timing-wrapper_card no-gutters p-3 mb-3">
        <Col
          md={6}
          className={`${locale === 'ar' ? 'border-left p-3' : 'border-right p-3'}`}
        >
          <Row className="mb-3">
            <Col xs={12} className="informationwizard__title-process">
              {messages['newService.processing.time.title']}
            </Col>
            <Col xs={12} className="informationwizard__subtitle-process">
              {messages['newService.processing.time.subtitle']}
            </Col>
          </Row>
          {processingTimes?.length > 0 &&
            processingTimes.map((processingTime, index) => (
              <Row key={index}>
                <Col xs={12} md={5} className="mb-1">
                  <SelectInputMUI
                    label={messages['newService.duration']}
                    list={processTimes}
                    value={
                      processingTime?.duration?.length
                        ? processingTime?.duration
                        : '00:00:00'
                    }
                    onChange={(e) => processingTimeChange(index, e)}
                    name="duration"
                    disabledOptions={(option) =>
                      lowestSerDurMin <= convertTimeToNum(option)
                    }
                  />
                </Col>
                {processingTime?.duration && processingTime?.duration !== '00:00:00' && (
                  <>
                    <Col xs={12} md={5} className="mb-1">
                      <SelectInputMUI
                        label={messages['newService.start.from']}
                        list={zeroTimeArray}
                        value={processingTime?.start}
                        onChange={(e) => processingTimeChange(index, e)}
                        name="start"
                        disabledOptions={(option) =>
                          convertTimeToNum(processingTimes[index - 1]?.duration) +
                            convertTimeToNum(processingTimes[index - 1]?.start) >
                            convertTimeToNum(option) ||
                          (index > 0 &&
                            convertTimeToNum(processingTimes[index - 1]?.duration) +
                              convertTimeToNum(processingTimes[index - 1]?.start) +
                              5 >
                              convertTimeToNum(option)) ||
                          lowestSerDurMin -
                            convertTimeToNum(processingTimes[index]?.duration) <
                            convertTimeToNum(option) ||
                          lowestSerDurMin <= convertTimeToNum(option)
                        }
                      />
                    </Col>
                    <Col className="d-flex align-items-center pt">
                      {processingTimes?.length > 1 && (
                        <button
                          className="btn"
                          type="button"
                          onClick={() => removeProcessingField(index)}
                        >
                          <CloseIcon />
                        </button>
                      )}
                    </Col>
                  </>
                )}
              </Row>
            ))}
          {processingTimes[processingTimes?.length - 1]?.start &&
            processingTimes[processingTimes?.length - 1]?.duration !== '00:00:00' && (
              <Row>
                {checkHasTimeToBeProcessing() && (
                  <button
                    onClick={addProcessingField}
                    type="button"
                    className="pricingModal-anotherPricing"
                    disabled={intersectionError || errorBufferTime}
                  >
                    <i className="flaticon-plus"></i>
                    <span className="mx-3">{messages['newService.add.time']}</span>
                  </button>
                )}
              </Row>
            )}
        </Col>

        <Col md={6} className="p-3">
          <>
            <p className="informationwizard__title-process mb-1">
              {messages['newService.processing.example.title']}
            </p>
            <p className="informationwizard__subtitle-process mb-3">
              {messages['newService.processing.example.subtitle']}
            </p>
            <Row className="mx-auto">
              <Col md={2}>
                <p className="informationwizard__subtitle mb-0 font-size">
                  {messages['newService.service.start']}
                </p>
              </Col>
              <Col md={8}>
                <ul className="service-timing-wrapper_card_example">
                  {processingTimes.map((processingTime) => {
                    const slot = calculateProcessingSlot(processingTime);
                    return (
                      <Tooltip
                        placement="top"
                        title={
                          <div className="d-flex justify-content-between">
                            <div className=" px-1 text-center">
                              <p className="pb-1">{messages['common.start']}</p>
                              <p className="service-timing-wrapper_card_example_start-time">
                                {`${slot.start[0] + messages['time.hours.short']} ${slot
                                  .start[1] + messages['time.minutes.short']}`}
                              </p>
                            </div>
                            <div className=" px-1 text-center">
                              <p className="pb-1">{messages['common.end']}</p>
                              {processingTime?.start && (
                                <p className="service-timing-wrapper_card_example_end-time">{`${slot.endTime[0]}${messages['time.hours.short']} ${slot.endTime[1]}${messages['time.minutes.short']}`}</p>
                              )}
                            </div>
                          </div>
                        }
                      >
                        <li
                          className="d-flex justify-content-center"
                          style={{
                            width: `${slot?.width}%`,
                            ...(locale === 'ar'
                              ? { right: `${slot?.position}%` }
                              : { left: `${slot?.position}%` }),
                          }}
                        >
                          <small className="">
                            {`${
                              +(processingTime?.duration?.split(':'))[0] > 0
                                ? +(processingTime?.duration?.split(':'))[0] + 'H'
                                : ''
                            } ${
                              +(processingTime?.duration?.split(':'))[1] > 1
                                ? +(processingTime?.duration?.split(':'))[1] + 'M'
                                : ''
                            }`}
                          </small>
                        </li>
                      </Tooltip>
                    );
                  })}
                </ul>
              </Col>

              <Col md={2}>
                <p className="informationwizard__subtitle-process mb-0 font-size">
                  {messages['newService.service.end']}
                </p>
              </Col>
            </Row>
            <Row className="d-flex justify-content-center mb-4">
              <span className="mx-2">
                <span className="service-timing-wrapper_card_example_bullet service"></span>
                <span className="service-timing-wrapper_card_example_text">
                  {messages['newService.service.time']}
                </span>
              </span>
              <span className="mx-2">
                <span className="service-timing-wrapper_card_example_bullet processing"></span>
                <span className="service-timing-wrapper_card_example_text">
                  {messages['newService.processing.time.title']}
                </span>
              </span>
            </Row>
            <p className="service-timing-wrapper_card_example_note">
              {messages['newService.processing.time.note']}
            </p>
          </>
        </Col>
      </Row>
      {intersectionError && (
        <Row className="mb-4">
          <Col xs={12} className="buffer-error pt-2">
            {intersectionError}
          </Col>
        </Row>
      )}
      {/* =============== buffer & blocked time section ============ */}
      <Row>
        <Col md={6} xs={12}>
          <Row className="service-timing-wrapper_card container no-gutters p-3">
            <Col xs={12} className="informationwizard__title-process">
              {messages['newService.buffer.time.title']}
            </Col>
            <Col xs={12} className="informationwizard__subtitle-process mb-3 min-height">
              {messages['newService.buffer.time.subtitle']}
            </Col>
            <Col xs={12} className="mb-2">
              <SelectInputMUI
                useFormRef={register(`BufferTime`)}
                watch={watch}
                label={messages['newService.duration']}
                list={bufferTimes}
                defaultValue={`${watch('BufferTime') || '00:00:00'}`}
                disabledOptions={(option) => lowestSerDurMin <= convertTimeToNum(option)}
              />
            </Col>
          </Row>
        </Col>
        <Col md={6} xs={12}>
          <Row className="service-timing-wrapper_card container no-gutters p-3">
            <Col xs={12} className="informationwizard__title-process">
              {messages['newService.blocked.time.title']}
            </Col>
            <Col xs={12} className="informationwizard__subtitle-process mb-3 min-height">
              {messages['newService.blocked.time.subtitle']}
            </Col>
            <Col xs={12} className="mb-2">
              <SelectInputMUI
                useFormRef={register(`BlockedTime`)}
                watch={watch}
                label={messages['newService.duration']}
                list={blockTimes}
                defaultValue={`${watch('BlockedTime') || '00:00:00'}`}
              />
            </Col>
          </Row>
        </Col>
        <ModalProcessTimeExceed
          setOpenModalExceedProcess={setOpenModalExceedProcess}
          openModalExceedProcess={openModalExceedProcess}
          currentdata={currentdata}
          currentIndex={currentIndex}
          setProcessingTimes={setProcessingTimes}
          processingTimes={processingTimes}
        />
      </Row>
      {errorBufferTime && (
        <Row className="mb-4">
          <Col xs={12} className="buffer-error pt-2">
            {errorBufferTime}
          </Col>
        </Row>
      )}
    </section>
  );
}
