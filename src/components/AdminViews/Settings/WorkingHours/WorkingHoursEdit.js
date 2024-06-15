/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import Form from 'react-bootstrap/Form';
import {
  Checkbox,
  FormGroup,
  FormControlLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import useAPI, { get, post } from 'hooks/useAPI';
import { dayIndexEquivalent } from 'functions/timeFunctions';
import { LoadingProfile } from 'components/shared/Shimmer';
import { hoursMinutesDropDown, hoursMinutesDropDownAr } from 'constants/hours';
const useStyles = makeStyles((theme) => ({
  root: {
    width: '85%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));
export default function WorkingHoursEdit({ setIsEdit, callApi }) {
  const classes = useStyles();
  const [daySelection, setDaySelection] = useState([]);
  const [nonWrokingDay, setNonWrokingDay] = useState([]);
  const [availableTime, setAvailableTime] = useState([]);
  const [submit, setSubmit] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const { messages, locale } = useIntl();
  const hoursDD = locale === 'ar' ? hoursMinutesDropDownAr : hoursMinutesDropDown;

  const { response: workingHours, isLoading, setRecall: callWorkingHours } = useAPI(
    get,
    'ServiceProvider/WorkingTime',
  );
  const { response: addWorkingTime, setRecall: performAddTime } = useAPI(
    post,
    'ServiceProvider/addWorkingTime',
    daySelection,
  );

  useEffect(() => {
    if (addWorkingTime) {
      if (addWorkingTime && addWorkingTime.data) {
        setSuccess(true);
        setTimeout(() => {
          setIsEdit('main');
          setSuccess(false);
        }, 2000);
      }
      if (addWorkingTime && addWorkingTime.error) {
        setError(addWorkingTime.error.message);
        setTimeout(() => {
          setError('');
        }, 3000);
      }
    }
  }, [addWorkingTime]);

  useEffect(() => {
    if (submit) {
      performAddTime(true);
    }
  }, [submit]);

  useEffect(() => {
    callWorkingHours(callApi);
  }, [callApi]);

  useEffect(() => {
    if (workingHours && workingHours.data) {
      const workingDaysArray = workingHours.data.list.map((a) => a.day);
      const nonWrokingDays = [0, 1, 2, 3, 4, 5, 6].filter(
        (day) => !workingDaysArray.includes(day),
      );
      setNonWrokingDay(nonWrokingDays);
    }
  }, [workingHours]);

  function selectDay(dayId) {
    if (daySelection.find((d) => d.day === dayId)) {
      setDaySelection(daySelection.filter((d) => d.day !== dayId));
    } else {
      setDaySelection([
        ...daySelection,
        { startTime: '09:00:00', endTime: '21:00:00', day: dayId },
      ]);
    }
  }

  useEffect(() => {
    if (daySelection) {
      setAvailableTime(
        daySelection.map((a) => {
          const current = hoursDD.find((b) => b.value === a.startTime);
          return {
            day: a.day,
            availableTime: hoursDD.filter((c) => c.key > current.key),
          };
        }),
      );
    }
  }, [daySelection]);

  const handleFromChange = (e, value, i) => {
    const day = daySelection.find((d) => d.day === i);
    day.startTime = value;
    const allOtherDays = daySelection.filter((d) => d.day !== i);
    const combineEditAndOthers = [...allOtherDays, day];
    setDaySelection(combineEditAndOthers);
  };

  const handleToChange = (e, value, i) => {
    const day = daySelection.find((d) => d.day === i);
    day.endTime = value;
    const allOtherDays = daySelection.filter((d) => d.day !== i);
    const combineEditAndOthers = [...allOtherDays, day];
    setDaySelection(combineEditAndOthers);
  };

  return (
    <>
      <h2 className="title">{messages['admin.settings.workingTimeEdit.header']}</h2>
      {success && (
        <div className={classes.root}>
          <Alert severity="success">
            {`${messages['admin.settings.workingTime.workingTimeAddedSuccessfully']}`}
          </Alert>
        </div>
      )}
      {error && (
        <div className={classes.root}>
          <Alert severity="warning">{error}</Alert>
        </div>
      )}
      {isLoading ? (
        <LoadingProfile fluid type="profile" />
      ) : nonWrokingDay.length > 0 ? (
        <div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center"></TableCell>
                {['common.from', 'common.to'].map((title) => (
                  <TableCell key={title} align="center">
                    {messages[title]}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {nonWrokingDay.map((dayIndex) => (
                <TableRow key={dayIndex}>
                  <TableCell style={{ padding: '5px' }}>
                    <FormControl component="fieldset">
                      <FormGroup aria-label="position" row>
                        <FormControlLabel
                          style={{ pointerEvents: 'none' }}
                          control={
                            <Checkbox
                              onClick={() => selectDay(dayIndex)}
                              style={{ pointerEvents: 'auto' }}
                              color="primary"
                            />
                          }
                          label={dayIndexEquivalent(dayIndex, locale)}
                        />
                      </FormGroup>
                    </FormControl>
                  </TableCell>
                  <TableCell align="center" style={{ padding: '5px' }}>
                    <Form.Group controlId="exampleForm-ControlSelect1">
                      <Form.Control
                        as="select"
                        disabled={!daySelection.find((d) => d.day === dayIndex)}
                        value={
                          (daySelection.find((d) => d.day === dayIndex) &&
                            daySelection.find((d) => d.day === dayIndex).startTime) ||
                          ' '
                        }
                        onChange={(e) => handleFromChange(e, e.target.value, dayIndex)}
                      >
                        {hoursDD.map((hour) => (
                          <option
                            className="font-spacing"
                            key={hour.key}
                            value={hour.value}
                          >
                            {hour.text}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </TableCell>
                  <TableCell align="center" style={{ padding: '5px' }}>
                    <Form.Group controlId="exampleForm-ControlSelect2">
                      <Form.Control
                        as="select"
                        disabled={!daySelection.find((d) => d.day === dayIndex)}
                        value={
                          (daySelection.find((d) => d.day === dayIndex) &&
                            daySelection.find((d) => d.day === dayIndex).endTime) ||
                          '01:00:00 '
                        }
                        onChange={(e) => handleToChange(e, e.target.value, dayIndex)}
                      >
                        {(availableTime.find((c) => c.day === dayIndex) &&
                          availableTime
                            .find((c) => c.day === dayIndex)
                            .availableTime.map((hour) => (
                              <option
                                className="font-spacing"
                                key={hour.key}
                                value={hour.value}
                              >
                                {hour.text}
                              </option>
                            ))) || <option value="00:00">00:00</option>}
                      </Form.Control>
                    </Form.Group>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="noWrokDays">
          {messages['admin.settings.workingTime.allDaysAdded']}
        </div>
      )}

      <div className="alignBtn">
        <button
          type="button"
          className="btn btn-primary m-2"
          disabled={daySelection.length === 0}
          onClick={() => setSubmit(true)}
        >
          {messages['common.save']}
        </button>
        <button
          type="button"
          className="btn btn-primary m-2"
          onClick={() => setIsEdit('main')}
        >
          {messages['common.cancel']}
        </button>
      </div>
    </>
  );
}

WorkingHoursEdit.propTypes = {
  setIsEdit: PropTypes.func,
  callApi: PropTypes.string,
};
