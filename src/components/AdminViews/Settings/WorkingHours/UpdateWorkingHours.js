/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { hoursMinutesDropDown, hoursMinutesDropDownAr } from 'constants/hours';
import useAPI, { put, get } from 'hooks/useAPI';
import moment from 'moment';
import { Card, Button, Row, Col } from 'react-bootstrap';
import Alert from '@material-ui/lab/Alert';
import {
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import { dayIndexEquivalent } from '../../../../functions/timeFunctions';
import { ConfirmationModal } from '../../../shared/ConfirmationModal';

export default function UpdateWorkingHours({ selectedDay, setSelectedDay, setView }) {
  moment.locale('en');
  const { messages, locale } = useIntl();
  const [startTime, setStartTime] = useState(selectedDay?.startTime);

  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const [endTime, setEndTime] = useState(selectedDay?.endTime);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const {
    response: editWorkingTime,
    isLoading,
    setRecall: editWorkingHoursCall,
  } = useAPI(put, 'ServiceProvider/UpdateWorkingTime', {
    ...selectedDay,
    startTime,
    endTime,
  });

  useEffect(() => {
    if (editWorkingTime?.data) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setView('main');
        setSelectedDay('');
      }, 3000);
    }
    if (editWorkingTime?.error) {
      setError(editWorkingTime.error?.message);
    }
  }, [editWorkingTime]);
  /* -------------------------------------------------------------------------- */
  /*               Check If there is empoloyess in the editing day              */
  /* -------------------------------------------------------------------------- */
  const {
    response: checkWorkingDateRes,
    isLoading: checkWorkingDateLoader,
    setRecall: checkWorkingDateRecall,
  } = useAPI(
    get,
    `ServiceProvider/IsAnySPEmployeeWorkingTimenNotWithinPeriod?start=${startTime}&end=${endTime}&day=${+selectedDay?.day}`,
  );
  useEffect(() => {
    if (checkWorkingDateRes?.data) {
      if (checkWorkingDateRes?.data?.success) {
        return setOpenConfirmationModal(true);
      }
      return editWorkingHoursCall(true);
    }
    return null;
  }, [checkWorkingDateRes]);
  const hoursDD = locale === 'ar' ? hoursMinutesDropDownAr : hoursMinutesDropDown;

  function disableToOptions(from, to) {
    if (from && to) return from.split(':').join('') >= to.split(':').join('');
    return null;
  }
  return (
    <>
      <Card className="mb-5">
        <Card.Header>
          <div className="title"> {messages['admin.settings.workingTime.edit']}</div>
          <Button
            variant="outline-danger"
            className="px-4"
            onClick={() => setView('main')}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} color="secondary" />
            ) : (
              messages['common.back']
            )}
          </Button>
        </Card.Header>
        <Card.Body>
          {success && (
            <Alert className="align-items-center" severity="success">
              {messages['admin.settings.workingTime.workingTimeEditedSuccessfully']}
            </Alert>
          )}
          {error && (
            <Alert className="align-items-center" severity="error">
              {error}
            </Alert>
          )}
          <Row className="mt-5 align-items-center">
            <Col xs={2}>
              <p className="mb-4">{dayIndexEquivalent(selectedDay.day, locale)}</p>
            </Col>
            <Col xs={5}>
              <FormControl fullWidth className="mb-4">
                <InputLabel id="hourlabel">
                  {messages['common.from']} {messages['common.atHour']}
                </InputLabel>
                <Select
                  labelId="hourlabel"
                  className="mb-3"
                  value={startTime}
                  onChange={(e) => {
                    setError(null);
                    setStartTime(e.target.value);
                  }}
                >
                  {hoursDD.map((hour) => (
                    <MenuItem key={hour.key} value={hour.value}>
                      {hour.text}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Col>
            <Col xs={5}>
              <FormControl
                fullWidth
                className="mb-4"
                error={endTime < startTime || endTime === startTime}
              >
                <InputLabel id="hourlabel">
                  {messages['common.to']} {messages['common.atHour']}
                </InputLabel>
                <Select
                  labelId="hourlabel"
                  className="mb-3"
                  disabled={!startTime}
                  value={endTime}
                  onChange={(e) => {
                    setError(null);
                    setEndTime(e.target.value);
                  }}
                >
                  {hoursDD.map((hour) => (
                    <MenuItem
                      key={hour.key}
                      value={hour.value}
                      disabled={disableToOptions(startTime, hour.value)}
                    >
                      {hour.text}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Col>
          </Row>
          <FormControl component="fieldset" fullWidth className="mt-5">
            <Button
              disabled={
                !startTime ||
                !endTime ||
                endTime < startTime ||
                endTime === startTime ||
                success
              }
              onClick={() => checkWorkingDateRecall(true)}
            >
              {isLoading ? (
                <CircularProgress size={24} color="secondary" />
              ) : (
                messages['common.save']
              )}
            </Button>
          </FormControl>
        </Card.Body>
      </Card>

      {/* day + 1 because the days start from 0 so 0 is falsy */}
      <ConfirmationModal
        setPayload={editWorkingHoursCall}
        Id={selectedDay.day + 1}
        openModal={openConfirmationModal}
        setOpenModal={setOpenConfirmationModal}
        message="admin.settings.workingTime.confirmation"
      />
    </>
  );
}
