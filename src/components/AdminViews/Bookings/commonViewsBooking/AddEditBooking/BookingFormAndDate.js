/* eslint-disable  */

import React, { useContext, useState } from 'react';
import { useIntl } from 'react-intl';
import { Col } from 'react-bootstrap';
import Stepper from '@material-ui/core/Stepper';
import { BookingContext } from 'providers/BookingProvider';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { convertTimeToNum, createTimesIds } from 'constants/hours';
import BookingForm from './BookingFormAndDate/BookingForm';
import BookingDate from './BookingFormAndDate/BookingDate';
import BeutiTextArea from '../../../../../Shared/inputs/BeutiTextArea';
import AddLocation from './BookingFormAndDate/AddLocation';
import { Row } from 'react-bootstrap';
import { ConfirmationModal } from '../../../../shared/ConfirmationModal';
import {
  getCurrentServiceByOptionId,
  firstAvailableEmployee,
  getTimeDurationInOldService,
} from '../Helper/AddEditHelper';

export default function BookingFormAndDate({
  register,
  setValue,
  watch,
  errors,
  openAddLocation,
  setOpenAddLocation,
  clearErrors,
  bookingId,
  allEmployees = [],
  allCategories = [],
  setTempFees = () => {},
  setFeesSelected = () => {},
  tempFees = 0,
  cateLoading,
}) {
  const [splitPackageModal, setSplitPackageModal] = useState({
    open: false,
    packageData: '',
  });
  const { booking } = useContext(BookingContext);
  const { messages } = useIntl();

  // Split Package
  const handleSplitPackage = ({ packageData }) => {
    handleDeleteServicePackage({ packageData, isUpdating: true });
    handleSelectService(
      packageData.id,
      packageData.currentService,
      packageData.nextService,
      packageData.packageIndex,
    );
  };

  const handleSelectService = (
    id,
    currentService,
    nextService,
    serviceIndex,
    packageIndex,
  ) => {
    // Change Service in Package
    if (packageIndex !== undefined) {
      return setSplitPackageModal({
        open: true,
        packageData: { id, currentService, nextService, serviceIndex, packageIndex },
        type: 'edit',
      });
    }
    const selectedService = getCurrentServiceByOptionId({
      id: id,
      allCategories,
    });

    if (selectedService.isPackage) {
      const serviceWithTime = {
        ...selectedService,
        packageServices: selectedService.packageServices.map((service, i) => {
          return {
            ...service,
            ...firstAvailableEmployee({
              availableEmployees: service.employeeIds,
              allEmployees,
              selectedCalendar: watch(`bookedServices[${serviceIndex}]`).employeeId,
            }),
            startTime:
              i === 0
                ? currentService?.startTime
                : createTimesIds(
                    getTimeDurationInOldService(
                      JSON.parse(JSON.stringify(selectedService.packageServices)).splice(
                        0,
                        i,
                      ),
                    ) + convertTimeToNum(currentService.startTime),
                  ),
          };
        }),
      };
      setValue(`bookedServices[${serviceIndex}]`, {
        ...watch(`bookedServices[${serviceIndex}]`),
        ...serviceWithTime,
      });
    }
    //  Handle Select Single Service
    if (!selectedService.isPackage) {
      const newServiceObject = {
        ...selectedService,
        bookingServiceId: selectedService?.bookingServiceId || 0,
        serviceName: selectedService?.displayName,
        ...firstAvailableEmployee({
          availableEmployees: selectedService?.employeeIds,
          allEmployees,
          selectedCalendar: watch(`bookedServices[${serviceIndex}]`).employeeId,
        }),
      };
      setValue(`bookedServices[${serviceIndex}]`, {
        ...watch(`bookedServices[${serviceIndex}]`),
        ...newServiceObject,
      });
    }
    if (!nextService) {
      setValue('bookedServices', [
        ...watch('bookedServices'),
        {
          startTime: createTimesIds(
            convertTimeToNum(currentService.startTime) +
              selectedService.durationInMinutes +
              (selectedService.blockTimeInMinutes - selectedService.bufferTimeInMinutes),
          ),
        },
      ]);
    }
  };
  /* -------------------------------------------------------------------------- */
  /*                         Delete Service And Package                         */
  /* -------------------------------------------------------------------------- */
  const handleDeleteService = (serviceIndex, packageIndex) => {
    if (packageIndex !== undefined) {
      return setSplitPackageModal({
        open: true,
        packageData: { packageIndex, serviceIndex },
        type: 'delete',
      });
    }
    const bookedService = watch('bookedServices');
    bookedService.splice(serviceIndex, 1);
    setValue('bookedServices', bookedService);
  };

  const handleDeleteServicePackage = ({ packageData, isUpdating }) => {
    const restOfPackageServices = JSON.parse(
      JSON.stringify(
        watch(`bookedServices[${packageData.packageIndex}].packageServices`),
      ),
    );
    restOfPackageServices.splice(packageData.serviceIndex, 1);
    const deletePackageFromServices = watch('bookedServices');

    isUpdating
      ? deletePackageFromServices.splice(
          packageData.packageIndex + 1,
          0,
          ...restOfPackageServices,
        )
      : deletePackageFromServices.splice(
          packageData.packageIndex,
          1,
          ...restOfPackageServices,
        );
  };
  return (
    <>
      <Col xs="12">
        <BookingDate />
      </Col>
      <Col xs="1">
        <Stepper orientation="vertical">
          {watch('bookedServices').map((item, index) => (
            <Step key={index}>
              <StepLabel>{index}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Col>
      <Col xs="11" className="flex-grow-1">
        {watch('bookedServices').map((item, index) => (
          <>
            {item?.isPackage ? (
              <div className="packagebox" key={index}>
                <Row className="align-items-center justify-content-between">
                  <Col xs="auto" className="packagebox-title">
                    {item.displayName}
                  </Col>
                  <Col xs="auto">
                    <button
                      type="button"
                      className="packagebox-remove"
                      onClick={() => handleDeleteService(`${index}`)}
                    >
                      {messages['booking.remove.package']}
                    </button>
                  </Col>
                </Row>
                {item.packageServices.map((servi, i) => {
                  return (
                    <BookingForm
                      key={i}
                      service={servi}
                      allEmployees={allEmployees}
                      allCategories={
                        allCategories && JSON.parse(JSON.stringify(allCategories))
                      }
                      register={register}
                      index={i}
                      watch={watch}
                      errors={errors}
                      setValue={setValue}
                      packageIndex={index}
                      currentServicePath={`bookedServices[${index}].packageServices[${i}]`}
                      nextServicePath={`bookedServices[${index}].packageServices[${i +
                        1}]`}
                      handleSelectService={handleSelectService}
                      handleDeleteService={handleDeleteService}
                      clearErrors={clearErrors}
                      cateLoading={cateLoading}
                    />
                  );
                })}
              </div>
            ) : (
              <BookingForm
                key={index}
                service={item}
                allEmployees={allEmployees}
                allCategories={allCategories && JSON.parse(JSON.stringify(allCategories))}
                register={register}
                index={index}
                watch={watch}
                errors={errors}
                currentServicePath={`bookedServices[${index}]`}
                nextServicePath={`bookedServices[${index + 1}]`}
                handleSelectService={handleSelectService}
                clearErrors={clearErrors}
                handleDeleteService={handleDeleteService}
                setValue={setValue}
                cateLoading={cateLoading}
              />
            )}
          </>
        ))}

        {!!booking.isHomeBooking && (
          <AddLocation
            openAddLocation={openAddLocation}
            setOpenAddLocation={setOpenAddLocation}
            setTempFees={setTempFees}
            setFeesSelected={setFeesSelected}
            tempFees={tempFees}
          />
        )}
        <BeutiTextArea
          type="text"
          label={messages['booking.flow.service.notes']}
          useFormRef={register('notes')}
          error={errors?.notes?.message}
        />

        <ConfirmationModal
          setPayload={
            splitPackageModal.type === 'edit'
              ? handleSplitPackage
              : handleDeleteServicePackage
          }
          openModal={splitPackageModal.open}
          setOpenModal={(value) =>
            setSplitPackageModal({
              packageData: splitPackageModal.packageData,
              open: value,
            })
          }
          Id={splitPackageModal}
          confirmtext="common.yes"
          title="booking.split.title"
          message="booking.split.description"
        />
      </Col>
    </>
  );
}
