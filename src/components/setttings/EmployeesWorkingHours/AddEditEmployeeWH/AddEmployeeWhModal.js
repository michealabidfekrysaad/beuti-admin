/* eslint-disable */

import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Col, Modal, Row } from 'react-bootstrap';
import { get } from 'lodash';

import {
  hoursMinutesDropDownDefaultTime,
  hoursMinutesDropDownArDefaultTime,
  disableOptionsDefaultTime,
} from 'constants/hours';
import { FormattedMessage } from 'react-intl';
import SelectInputMUI from 'Shared/inputs/SelectInputMUI';
import ClearIcon from '@material-ui/icons/Clear';
import DateFnsUtils from '@date-io/date-fns';
import arLocale from 'date-fns/locale/ar-SA';
import enLocale from 'date-fns/locale/en-US';
import { IconButton, InputAdornment } from '@material-ui/core';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import AddDeleteEmployeeShiftButton from './AddDeleteEmployeeShiftButton';
import moment from 'moment';
import { repeatList, endRepeatList } from '../Helper/AddWHFunction';
import { tofullISOString } from '../../../../functions/MomentHandlers';

export function AddEmployeeWHModal({
  openModal,
  errors,
  watch,
  register,
  setValue,
  handleSubmit,
  setOpenDeleteModal,
  resetValuesAndCloseModal,
  setOpenModal,
  addOrEdit,
  deleteEmployeeWHCallNoRepeat,
}) {
  const { messages, locale } = useIntl();
  const hoursDD =
    locale === 'ar' ? hoursMinutesDropDownArDefaultTime : hoursMinutesDropDownDefaultTime;

  return (
    <>
      <Modal
        onHide={() => resetValuesAndCloseModal()}
        show={openModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        className="bootstrap-modal-customizing employeewhmodal"
      >
        <form onSubmit={handleSubmit}>
          <Modal.Header className="pt-0">
            <Modal.Title className="title">
              <FormattedMessage
                id={
                  addOrEdit
                    ? 'setting.employee.wh.modal.editEmployee'
                    : 'setting.employee.wh.modal.addEmployee'
                }
                values={{ emp: watch('employee')?.name }}
              />
              <p className="subtitle">
                {messages['setting.employee.wh.modal.description']}
              </p>
              <p className="date">
                {watch('day')?.date &&
                  moment(watch('day')?.date)
                    .locale(locale)
                    .format('dddd, DD MMM YYYY')}
              </p>
            </Modal.Title>
          </Modal.Header>
          <Col xs={12}>
            <div>
              <Row>
                <Col xs="auto" className="flex-grow-1">
                  {watch('day').shifts.map((shift, i) => (
                    <Row className="employeewhmodal-shift ">
                      <Col xs="12" lg="6" className="flex-grow-1">
                        <SelectInputMUI
                          list={hoursDD.map(({ value, text, iseNextDay }) => ({
                            text,
                            value,
                            iseNextDay,
                            id: value,
                          }))}
                          useFormRef={register(`day.shifts[${i}].startTime`)}
                          watch={watch}
                          defaultValue={shift.startTime}
                          error={
                            get(errors, `day.shifts[${i}].startTime.message`) ||
                            (i === 1 && get(errors, `day.shifts.message`))
                          }
                          dontShowErrorMessage={!!get(errors, `day.shifts.message`)}
                          label={messages['setting.employee.wh.startshift']}
                        />
                      </Col>
                      <Col xs="12" lg="6" className="flex-grow-1">
                        <SelectInputMUI
                          list={hoursDD.map(({ value, text, iseNextDay }) => ({
                            text,
                            value,
                            iseNextDay,
                            id: value,
                          }))}
                          id="0"
                          useFormRef={register(`day.shifts[${i}].endTime`)}
                          watch={watch}
                          defaultValue={shift.endTime}
                          disabledOptions={(option) =>
                            disableOptionsDefaultTime(shift.startTime, option)
                          }
                          error={
                            get(errors, `day.shifts[${i}].endTime.message`) ||
                            (i === 1 && get(errors, `day.shifts.message`))
                          }
                          dontShowErrorMessage={!!get(errors, `day.shifts.message`)}
                          label={messages['setting.employee.wh.endshift']}
                        />
                      </Col>
                    </Row>
                  ))}
                  <p className="beuti-input__errormsg ">
                    {get(errors, `day.shifts.message`)}
                  </p>
                  <AddDeleteEmployeeShiftButton
                    shiftLength={watch('day')?.shifts?.length}
                    watch={watch}
                    setValue={setValue}
                    hoursDD={hoursDD}
                  />
                </Col>
              </Row>
            </div>
          </Col>
          <Col xs="12" className="mb-5">
            <Row>
              <Col
                xs="12"
                lg={!watch('day').employeeWorkDayRepeat ? '6' : '12'}
                className="flex-grow-1"
              >
                <SelectInputMUI
                  list={repeatList}
                  id="0"
                  useFormRef={register(`day.employeeWorkDayRepeat`)}
                  watch={watch}
                  defaultValue={watch('day')?.employeeWorkDayRepeat}
                  label={messages['setting.employee.wh.repeat']}
                />
              </Col>
              {!watch('day').employeeWorkDayRepeat &&
                watch('day').employeeWorkDayEndRepeat === 1 && (
                  <Col xs="6">
                    <MuiPickersUtilsProvider
                      utils={DateFnsUtils}
                      locale={locale === 'ar' ? arLocale : enLocale}
                    >
                      <div className="beuti-input date-end">
                        <label
                          htmlFor="test"
                          className={`beuti-input__label ${errors?.day?.repeatEndDate
                            ?.message && 'text-danger'}`}
                        >
                          {messages['setting.employee.wh.specificdate']}
                        </label>
                        <DatePicker
                          className="beuti-input__field "
                          value={watch('day')?.repeatEndDate}
                          variant="inline"
                          format="dd MMMM yyyy"
                          minDate={watch('day')?.date}
                          onChange={(date) =>
                            setValue('day.repeatEndDate', tofullISOString(date), {
                              shouldValidate: true,
                            })
                          }
                          shouldDisableDate={(date) =>
                            date.getDay() !== watch('day')?.day
                          }
                          autoOk="true"
                          error={errors?.day?.repeatEndDate?.message}
                          helperText={errors?.day?.repeatEndDate?.message}
                          maxDate={new Date().setMonth(new Date().getMonth() + 6)}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment
                                position="end"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setValue('day.employeeWorkDayEndRepeat', 0);
                                }}
                              >
                                <IconButton>
                                  <ClearIcon />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </div>
                    </MuiPickersUtilsProvider>
                  </Col>
                )}
              {!watch('day').employeeWorkDayRepeat &&
                !watch('day').employeeWorkDayEndRepeat && (
                  <Col xs="12" lg="6" className="flex-grow-1">
                    <SelectInputMUI
                      list={endRepeatList}
                      id="0"
                      useFormRef={register(`day.employeeWorkDayEndRepeat`)}
                      watch={watch}
                      defaultValue={0}
                      label={messages['setting.employee.wh.endRepeat']}
                    />
                  </Col>
                )}
            </Row>
          </Col>

          <Modal.Footer
            className={`pt-3 ${
              addOrEdit ? 'justify-content-between' : 'justify-content-end'
            }`}
          >
            {addOrEdit ? (
              <button
                type="button"
                className="px-4 btn-danger"
                onClick={() => {
                  if (watch('day').employeeWorkDayRepeat) {
                    return deleteEmployeeWHCallNoRepeat(true);
                  }
                  setOpenDeleteModal(true);
                  return setOpenModal(false);
                }}
              >
                {messages['common.delete']}
              </button>
            ) : (
              ''
            )}

            <div>
              <button
                type="button"
                className="px-4 cancel mx-2"
                onClick={() => resetValuesAndCloseModal()}
              >
                {messages['common.cancel']}
              </button>
              <button type="submit" className="px-4 confirm">
                {messages['common.save']}
              </button>
            </div>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}

AddEmployeeWHModal.propTypes = {
  openModal: PropTypes.bool,
  setOpenModal: PropTypes.func,
  addOrEdit: PropTypes.number,
  setOpenDeleteModal: PropTypes.func,
  addCity: PropTypes.func,
  cityPayload: PropTypes.object,
  setCityPayload: PropTypes.func,
  isUpdating: PropTypes.bool,
  setIsUpdating: PropTypes.func,
  loading: PropTypes.bool,
  supportedCities: PropTypes.array,
};
