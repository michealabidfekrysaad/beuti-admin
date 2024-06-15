/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from '@material-ui/core';
import useAPI, { get, deleting } from 'hooks/useAPI';
import { dayIndexEquivalent, formatTime } from 'functions/timeFunctions';
import { LoadingProfile } from 'components/shared/Shimmer';
import { WorkingHoursDeleteModal } from 'components/AdminViews/Settings/WorkingHours/WorkingHoursDeleteModal';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '85%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function ViewWorkingHours({ callApi, setView, setSelectedDay }) {
  const classes = useStyles();
  const [workingTime, setWorkingTime] = useState([]);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [deleteDay, setDeleteDay] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const {
    response: workingHours,
    loading: workingHoursLoader,
    setRecall: callWorkingHours,
  } = useAPI(get, 'ServiceProvider/WorkingTime');
  const { response: deleteDays, setRecall: callDelete } = useAPI(
    deleting,
    `ServiceProvider/deleteWorkingTime?day=${deleteDay}`,
  );

  useEffect(() => {
    callWorkingHours(callApi);
  }, [callApi]);

  useEffect(() => {
    if (deleteDays?.data) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 2000);
      setDeleteDay(null);
      callWorkingHours(true);
    }
    if (deleteDays?.error) {
      setDeleteError(deleteDays?.error?.message);
      setDeleteDay(null);
      setTimeout(() => {
        setDeleteError('');
      }, 3000);
    }
  }, [deleteDays]);

  useEffect(() => {
    if (deleteDay !== null) {
      callDelete(true);
    }
  }, [deleteDay]);

  useEffect(() => {
    if (workingHours?.data) {
      setWorkingTime(workingHours?.data?.list?.sort((a, b) => a.day - b.day));
    }
    if (workingHours?.error) {
      setError(workingHours?.error?.message);
    }
  }, [workingHours]);

  const { messages, locale } = useIntl();
  return (
    <>
      {/* <h2 className="title mb-2">{messages['admin.settings.workingTime.header']}</h2> */}
      {success && (
        <div className={classes.root}>
          <Alert severity="success">
            {messages['admin.settings.workingDelete.success']}{' '}
          </Alert>
        </div>
      )}
      {deleteError && (
        <div className={classes.root}>
          <Alert severity="warning">{deleteError}</Alert>
        </div>
      )}
      {workingHoursLoader ? (
        error ? (
          <div className={classes.root}>
            <Alert severity="warning">{error}</Alert>
          </div>
        ) : (
          <LoadingProfile type="profile" />
        )
      ) : (
        <div className="table-responsive">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                {['common.from', 'common.to', 'common.actions'].map((title) => (
                  <TableCell key={messages[title]} align="center">
                    {messages[title]}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {workingTime.length > 0 ? (
                workingTime.map((day) => (
                  <TableRow key={day.day}>
                    <TableCell>{dayIndexEquivalent(day.day, locale)}</TableCell>
                    <TableCell align="center">
                      {formatTime(day.startTime, locale)}
                    </TableCell>
                    <TableCell align="center">
                      {formatTime(day.endTime, locale)}
                    </TableCell>
                    <TableCell align="center" className="d-flex justify-content-center">
                      <Tooltip
                        arrow
                        TransitionComponent={Fade}
                        title={`${messages['common.edit']}`}
                      >
                        <button
                          type="button"
                          className="icon-wrapper-btn btn-icon-primary mx-2"
                          onClick={() => {
                            setSelectedDay(day);
                            setView('edit');
                          }}
                        >
                          <i className="flaticon2-pen text-primary"></i>
                        </button>
                      </Tooltip>
                      <WorkingHoursDeleteModal
                        setDeletePayload={setDeleteDay}
                        id={day.day}
                        setDeleteError={setDeleteError}
                        setSuccess={setSuccess}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell align="center" colSpan={4}>
                    {messages['common.noData']}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
