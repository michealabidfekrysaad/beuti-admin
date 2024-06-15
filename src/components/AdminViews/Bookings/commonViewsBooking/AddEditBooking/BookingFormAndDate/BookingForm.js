/* eslint-disable  */

import React, { useMemo } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useIntl, FormattedMessage } from 'react-intl';
import {
  createTimeDuration,
  hoursMinutesDropDownArDefaultTime,
  hoursMinutesDropDownDefaultTime,
} from 'constants/hours';
import PropTypes from 'prop-types';
import { Select, MenuItem } from '@material-ui/core';
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import { get } from 'lodash';

import SelectInputMUI from '../../../../../../Shared/inputs/SelectInputMUI';
import { convertMinsToHours } from '../../../../../../utils/Helpers/TimeHelper';
import { getCurrentServiceByOptionId } from '../../Helper/AddEditHelper';
import BookingDisclaimers from './BookingDisclaimers';
import SearchInList from '../../../../../../Shared/inputs/SearchInList/SearchInList';
const getAllowedEmployees = (employyesIds, AllEmployees) => {
  if (employyesIds && AllEmployees) {
    const AllowedEmployee = AllEmployees.map((generalEmp) =>
      employyesIds.find((id) => generalEmp.id === id)
        ? { ...generalEmp, allowed: true }
        : { ...generalEmp, allowed: false },
    );
    return AllowedEmployee;
  }
};

const BookingForm = ({
  service,
  index,
  allEmployees,
  allCategories,
  register,
  watch,
  errors,
  handleSelectService,
  handleDeleteService,
  currentServicePath,
  nextServicePath,
  setValue,
  packageIndex,
  clearErrors,
  cateLoading,
}) => {
  const { messages, locale } = useIntl();
  const durationList = useMemo(() =>
    createTimeDuration({ messages, minDuration: 5, startFrom: 0 }),
  );
  const hoursDD = useMemo(() =>
    locale === 'ar' ? hoursMinutesDropDownArDefaultTime : hoursMinutesDropDownDefaultTime,
  );

  return (
    <div
      className={`${
        watch(currentServicePath)?.selectId
          ? 'add-booking-details-sec'
          : 'add-booking-details-sec unselect'
      }`}
    >
      {((watch('bookedServices').length > 2 &&
        watch('bookedServices').length - 1 !== index) ||
        packageIndex !== undefined) && (
        <button
          className="delete"
          type="button"
          onClick={(e) => handleDeleteService(index, packageIndex)}
        >
          <SVG src={toAbsoluteUrl('/closered.svg')} />
        </button>
      )}
      <Row>
        <Col md="8">
          <SearchInList
            list={allCategories}
            loading={cateLoading}
            value={
              getCurrentServiceByOptionId({
                id: watch(currentServicePath)?.selectId,
                allCategories: allCategories,
              })?.displayName
            }
            valueId={watch(currentServicePath)?.selectId}
            handleSelect={(id) => {
              handleSelectService(
                id,
                watch(currentServicePath),
                watch(nextServicePath),
                index,
                packageIndex,
              );
            }}
          />
        </Col>

        <Col xs="12" md="4">
          <SelectInputMUI
            list={hoursDD.map(({ value, text, iseNextDay }) => ({
              text,
              iseNextDay,
              id: value,
            }))}
            id="0"
            useFormRef={register(`${currentServicePath}.startTime`)}
            defaultValue={watch(`${currentServicePath}.startTime`)}
            watch={watch}
            error={get(errors, `${currentServicePath}.startTime.message`)}
            label={messages['booking.flow.time.start.appoitment']}
          />
        </Col>
      </Row>

      <Row>
        {service?.selectId && (
          <Col md="8" className="pt-4">
            <div className="beutiselect">
              <label
                htmlFor="selectservice"
                className={`beutiselect-label ${
                  !!get(errors, `${currentServicePath}.employeeId.message`)
                    ? `beuti-input__label-error`
                    : ''
                } `}
              >
                {messages['booking.flow.emp.name']}{' '}
              </label>

              <Select
                labelId="selectservice"
                value={watch(currentServicePath).employeeId}
                className={`beutiselect-dropdown ${
                  !!get(errors, `${currentServicePath}.employeeId.message`)
                    ? 'error-border '
                    : ' '
                }`}
                onChange={(e) => {
                  setValue(`${currentServicePath}.employeeId`, e.target.value);
                  setValue(
                    `${currentServicePath}.employeeName`,
                    allEmployees?.find((emp) => emp.id === e?.target?.value)?.name,
                  );
                  setValue(
                    `${currentServicePath}.employee`,
                    allEmployees?.find((emp) => emp.id === e?.target?.value),
                  );
                  clearErrors(`${currentServicePath}.employeeId.message`);
                }}
                renderValue={(e) =>
                  allEmployees?.find(
                    (emp) => emp.id === watch(currentServicePath).employeeId,
                  )?.name
                }
              >
                {getAllowedEmployees(
                  watch(currentServicePath)?.employeeIds,
                  allEmployees,
                )?.map((employee) => (
                  <MenuItem
                    value={employee.id}
                    key={employee.id}
                    className="bookingdropdown-group__item"
                  >
                    <div>
                      {!employee.allowed && (
                        <SVG src={toAbsoluteUrl('/notallowed.svg')} />
                      )}
                      <span> {employee.name}</span>
                    </div>
                  </MenuItem>
                ))}
              </Select>
              {!!get(errors, `${currentServicePath}.employeeId.message`) && (
                <p className="beuti-input__errormsg">
                  {get(errors, `${currentServicePath}.employeeId.message`)}
                </p>
              )}
            </div>
            <BookingDisclaimers
              watch={watch}
              currentServicePath={currentServicePath}
              allEmployees={allEmployees}
              allCategories={allCategories}
            />
          </Col>
        )}

        {service?.selectId && (
          <Col md="4" className="pt-4">
            <SelectInputMUI
              list={durationList?.map(({ timeInMin, text }) => ({
                text,
                id: timeInMin,
              }))}
              useFormRef={register(`${currentServicePath}.durationInMinutes`)}
              defaultValue={watch(`${currentServicePath}.durationInMinutes`) || 0}
              watch={watch}
              label={messages['booking.flow.service.time']}
              error={get(errors, `${currentServicePath}.durationInMinutes.message`)}
            />
          </Col>
        )}
      </Row>
    </div>
  );
};

BookingForm.propTypes = {
  service: PropTypes.object,
  allEmployees: PropTypes.array,
  allCategories: PropTypes.array,
  register: PropTypes.func,
  watch: PropTypes.func,
  setValue: PropTypes.func,
  index: PropTypes.number,
  clearErrors: PropTypes.func,
  cateLoading: PropTypes.bool,
};
export default BookingForm;
